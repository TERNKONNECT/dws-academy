import { create } from "zustand";
import type { EnrolledCourse, QuizAttempt } from "@/types";
import {
  authHeaders as sessionAuthHeaders,
  getPersistedUserId,
  getToken,
} from "@/lib/session";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

/** One row from GET /api/enrollments/my. */
interface ServerEnrollment {
  enrollmentId: string;
  enrolledAt: string;
  isCompleted: boolean;
  completedAt?: string;
  completedLessonIds?: string[];
  course?: { id: string };
  // Older responses used the Sequelize model name; tolerated while any client is
  // still running the previous build.
  Course?: { id: string };
  courseId?: string;
}

const authHeaders = () => ({
  "Content-Type": "application/json",
  ...sessionAuthHeaders(),
});

const storageKey = (userId: string) => `lms-enrollment-${userId}`;

const loadFromStorage = (userId: string): EnrolledCourse[] => {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (userId: string, courses: EnrolledCourse[]) => {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(courses));
  } catch {
    // Storage full or unavailable (private browsing). Progress still lives on the
    // server; the cache is only a first-paint optimisation.
  }
};

interface EnrollmentState {
  userId: string | null;
  enrolledCourses: EnrolledCourse[];
  initForUser: (userId: string) => void;
  refreshFromServer: () => Promise<void>;
  clearEnrollments: () => void;
  enroll: (courseId: string) => Promise<void>;
  isEnrolled: (courseId: string) => boolean;
  completeLesson: (courseId: string, lessonId: string) => Promise<void>;
  isLessonCompleted: (courseId: string, lessonId: string) => boolean;
  completeModule: (courseId: string, moduleId: string) => void;
  isModuleCompleted: (courseId: string, moduleId: string) => boolean;
  addQuizAttempt: (courseId: string, attempt: QuizAttempt) => void;
  getQuizAttempts: (courseId: string, quizId: string) => QuizAttempt[];
  completeCourse: (courseId: string) => void;
  getEnrolledCourse: (courseId: string) => EnrolledCourse | undefined;
  getCompletedLessonCount: (courseId: string) => number;
}

export const useEnrollmentStore = create<EnrollmentState>()((set, get) => ({
  userId: null,
  enrolledCourses: [],

  // Call this right after login/signup with the real user ID
  initForUser: (userId: string) => {
    const courses = loadFromStorage(userId);
    set({ userId, enrolledCourses: courses });
    get().refreshFromServer();
  },

  refreshFromServer: async () => {
    const uid = get().userId || getPersistedUserId();
    if (!uid || !getToken()) return;
    if (get().userId !== uid) {
      set({ userId: uid, enrolledCourses: loadFromStorage(uid) });
    }
    try {
      const res = await fetch(`${API_URL}/api/enrollments/my`, {
        headers: authHeaders(),
      });
      if (!res.ok) return;
      const data = await res.json();
      const serverCourses: EnrolledCourse[] = (data as ServerEnrollment[]).map((item) => ({
        courseId: item.course?.id ?? item.Course?.id ?? item.courseId,
        enrolledAt: item.enrolledAt,
        completedLessons: item.completedLessonIds ?? [],
        completedModules: [],
        quizAttempts: [],
        isCompleted: Boolean(item.isCompleted),
        completedAt: item.completedAt,
      }));
      const existing = get().enrolledCourses;
      const merged = serverCourses.map((serverCourse) => {
        const local = existing.find((c) => c.courseId === serverCourse.courseId);
        return {
          ...serverCourse,
          // Server progress wins. Only the purely client-side bookkeeping below
          // falls back to what we already had.
          completedModules: local?.completedModules ?? [],
          quizAttempts: local?.quizAttempts ?? [],
        };
      });
      set({ enrolledCourses: merged });
      saveToStorage(uid, merged);
    } catch {
      // Offline or the API is down. Keep whatever was cached rather than blanking
      // the learner's course list.
    }
  },

  // Call this on logout
  clearEnrollments: () => {
    const uid = get().userId;
    if (uid) {
      try {
        localStorage.removeItem(storageKey(uid));
      } catch {
        // Storage unavailable (private mode); in-memory clear below still applies.
      }
    }
    set({ userId: null, enrolledCourses: [] });
  },

  enroll: async (courseId) => {
    if (get().isEnrolled(courseId)) return;

    const res = await fetch(`${API_URL}/api/enrollments/${courseId}`, {
        method: "POST",
        headers: authHeaders(),
      });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "Failed to enroll");
    }

    const newCourse: EnrolledCourse = {
      courseId: data.courseId ?? courseId,
      enrolledAt: data.createdAt ?? new Date().toISOString(),
      completedLessons: [],
      completedModules: [],
      quizAttempts: [],
      isCompleted: Boolean(data.isCompleted),
      completedAt: data.completedAt,
    };

    const updated = [...get().enrolledCourses, newCourse];
    set({ enrolledCourses: updated });

    const uid = get().userId;
    if (uid) saveToStorage(uid, updated);
  },

  isEnrolled: (courseId) =>
    get().enrolledCourses.some((c) => c.courseId === courseId),

  completeLesson: async (courseId, lessonId) => {
    if (get().isLessonCompleted(courseId, lessonId)) return;
    const snapshot = get().enrolledCourses;

    let found = false;
    const updated = get().enrolledCourses.map((c) => {
      if (c.courseId === courseId) {
        found = true;
        return { ...c, completedLessons: [...c.completedLessons, lessonId] };
      }
      return c;
    });

    // If admin is previewing, they won't have an enrollment record yet
    if (!found) {
      updated.push({
        courseId,
        enrolledAt: new Date().toISOString(),
        completedLessons: [lessonId],
        completedModules: [],
        quizAttempts: [],
        isCompleted: false,
      });
    }

    set({ enrolledCourses: updated });

    const uid = get().userId;
    if (uid) saveToStorage(uid, updated);

    try {
      const res = await fetch(
        `${API_URL}/api/enrollments/${courseId}/lessons/${lessonId}/complete`,
        { method: "POST", headers: authHeaders() },
      );
      if (!res.ok) throw new Error("Could not save progress");
      // Re-read so the course-completion flag reflects the server's own rule
      // (all lessons done and every module quiz passed), not a local guess.
      await get().refreshFromServer();
    } catch (err) {
      set({ enrolledCourses: snapshot });
      if (uid) saveToStorage(uid, snapshot);
      throw err;
    }
  },

  isLessonCompleted: (courseId, lessonId) => {
    const course = get().enrolledCourses.find((c) => c.courseId === courseId);
    return course?.completedLessons.includes(lessonId) ?? false;
  },

  completeModule: (courseId, moduleId) => {
    if (get().isModuleCompleted(courseId, moduleId)) return;

    let found = false;
    const updated = get().enrolledCourses.map((c) => {
      if (c.courseId === courseId) {
        found = true;
        return { ...c, completedModules: [...c.completedModules, moduleId] };
      }
      return c;
    });

    if (!found) {
      updated.push({
        courseId,
        enrolledAt: new Date().toISOString(),
        completedLessons: [],
        completedModules: [moduleId],
        quizAttempts: [],
        isCompleted: false,
      });
    }

    set({ enrolledCourses: updated });
    const uid = get().userId;
    if (uid) saveToStorage(uid, updated);
  },

  isModuleCompleted: (courseId, moduleId) => {
    const course = get().enrolledCourses.find((c) => c.courseId === courseId);
    return course?.completedModules.includes(moduleId) ?? false;
  },

  addQuizAttempt: (courseId, attempt) => {
    const updated = get().enrolledCourses.map((c) =>
      c.courseId === courseId
        ? { ...c, quizAttempts: [...c.quizAttempts, attempt] }
        : c,
    );
    set({ enrolledCourses: updated });
    const uid = get().userId;
    if (uid) saveToStorage(uid, updated);
  },

  getQuizAttempts: (courseId, quizId) => {
    const course = get().enrolledCourses.find((c) => c.courseId === courseId);
    return course?.quizAttempts.filter((a) => a.quizId === quizId) ?? [];
  },

  completeCourse: (courseId) => {
    const updated = get().enrolledCourses.map((c) =>
      c.courseId === courseId
        ? { ...c, isCompleted: true, completedAt: new Date().toISOString() }
        : c,
    );
    set({ enrolledCourses: updated });
    const uid = get().userId;
    if (uid) saveToStorage(uid, updated);
  },

  getEnrolledCourse: (courseId) =>
    get().enrolledCourses.find((c) => c.courseId === courseId),

  getCompletedLessonCount: (courseId) => {
    const course = get().enrolledCourses.find((c) => c.courseId === courseId);
    return course?.completedLessons.length ?? 0;
  },
}));

import type { Course, Quiz, Module, Lesson } from "@/types";
import { authHeaders, handleUnauthorized } from "@/lib/session";

/**
 * Raw JSON off the API, before it is mapped into the app's own types. Indexed
 * rather than `any` so a typo in a field name is still caught at the map site.
 */
type BackendJson = Record<string, unknown>;

/** A review as GET /api/reviews/:courseId returns it. */
export interface CourseReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  User?: { id: string; name: string; avatar?: string };
}

export interface CourseReviews {
  avgRating: number;
  totalReviews: number;
  reviews: CourseReview[];
}

const str = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;
const num = (value: unknown, fallback = 0) =>
  typeof value === "number" ? value : Number(value ?? fallback) || fallback;
const arr = (value: unknown): BackendJson[] =>
  Array.isArray(value) ? (value as BackendJson[]) : [];
const obj = (value: unknown): BackendJson =>
  value && typeof value === "object" ? (value as BackendJson) : {};

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const _fetch = window.fetch;
const fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const res = await _fetch(input, init);
  if (res.status === 401) handleUnauthorized();
  return res;
};

// Map backend lesson → frontend Lesson
const mapLesson = (l: BackendJson, idx: number): Lesson => ({
  id: str(l.id),
  moduleId: str(l.moduleId),
  title: str(l.title),
  description: str(l.content),
  duration: str(l.duration, "5m"),
  videoUrl: str(l.videoUrl),
  order: num(l.order, idx),
  type: l.type === "video" ? "video" : "reading",
  locked: Boolean(l.locked),
  documentUrl: str(l.documentUrl),
  transcriptUrl: str(l.transcriptUrl),
});

// Map backend module → frontend Module
const mapModule = (m: BackendJson): Module => ({
  id: str(m.id),
  courseId: str(m.courseId),
  title: str(m.title),
  order: num(m.order),
  lessons: arr(m.lessons).map(mapLesson),
  quizId: str(obj(m.quiz).id) || undefined,
});

// Map backend course → frontend Course
const mapBackendCourse = (c: BackendJson): Course => {
  const instructor = obj(c.instructor);
  const level = str(c.difficulty, "Beginner") as Course["level"];

  return {
    id: str(c.id),
    title: str(c.title),
    shortDescription: str(c.description),
    description: str(c.description),
    thumbnail:
      str(c.thumbnail) ||
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
    introVideoUrl: str(c.introVideoUrl),
    instructor: {
      id: str(instructor.id) || str(c.createdBy, "instructor"),
      name: str(instructor.name, "School of Events Africa Instructor"),
      title: str(instructor.title),
      bio: str(instructor.bio),
      avatar:
        str(instructor.avatar) ||
        "https://api.dicebear.com/7.x/initials/svg?seed=TC",
      courseCount: 0,
      studentCount: 0,
    },
    category: str(c.difficulty, "General"),
    level,
    duration: "",
    rating: 0,
    reviewCount: 0,
    totalStudents: 0,
    whatYouLearn: Array.isArray(c.whatYouLearn)
      ? (c.whatYouLearn as unknown[]).map((item) => str(item))
      : [],
    modules: arr(c.modules).map(mapModule),
    reviews: [],
    isFeatured: c.status === "published",
    pricingType: c.pricingType === "paid" ? "paid" : "free",
    price: num(c.price),
    currency: str(c.currency, "NGN"),
    hasAccess: Boolean(c.hasAccess),
  };
};

const normalizeQuizQuestion = (question: BackendJson, i: number) => {
  const explicitOptions = Array.isArray(question.options)
    ? (question.options as unknown[])
    : [question.optionA, question.optionB, question.optionC, question.optionD];

  const correctAnswer =
    question.correctIndex ??
    question.correctAnswer ??
    (typeof question.answer === "number" ? question.answer : undefined);

  return {
    id: str(question._id) || str(question.id, `q-${i}`),
    question: str(question.text) || str(question.question),
    options: explicitOptions
      .filter((option) => option !== undefined && option !== null)
      .map((option) => str(option)),
    // Learner-facing quizzes no longer carry the answer key; the backend grades.
    correctAnswer: Number.isInteger(correctAnswer) ? (correctAnswer as number) : -1,
    explanation: str(question.explanation),
    type: question.type === "theory" ? ("theory" as const) : ("mcq" as const),
    sampleAnswer: str(question.sampleAnswer),
  };
};

// Map backend quiz → frontend Quiz
const mapQuiz = (q: BackendJson, courseId: string): Quiz => ({
  id: str(q.id),
  courseId: str(q.courseId) || courseId,
  moduleId: str(q.moduleId) || undefined,
  title: str(q.title),
  questions: arr(q.questions).map(normalizeQuizQuestion),
});

export const api = {
  // Real courses only. A failure is surfaced, not silently replaced with demo data.
  getCourses: async (): Promise<Course[]> => {
    const res = await fetch(`${API_URL}/api/courses`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Could not load courses");
    const data = await res.json();
    return data.map(mapBackendCourse);
  },

  getCourseById: async (id: string): Promise<Course | undefined> => {
    // GET /api/courses/:id returns the full structure, gated server-side.
    const res = await fetch(`${API_URL}/api/courses/${id}`, {
      headers: authHeaders(),
    });
    if (!res.ok) return undefined;
    return mapBackendCourse(await res.json());
  },

  // Add these to the existing api object

  submitReview: async (
    courseId: string,
    rating: number,
    comment: string,
  ): Promise<void> => {
    const res = await fetch(`${API_URL}/api/reviews/${courseId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ rating, comment }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Failed to submit review");
  },

  getCourseReviews: async (courseId: string): Promise<CourseReviews> => {
    try {
      const res = await fetch(`${API_URL}/api/reviews/${courseId}`);
      if (!res.ok) return { avgRating: 0, totalReviews: 0, reviews: [] };
      return res.json();
    } catch {
      return { avgRating: 0, totalReviews: 0, reviews: [] };
    }
  },

  initializePayment: async (courseId: string) => {
    const res = await fetch(`${API_URL}/api/payments/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ courseId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Failed to start payment");
    return data as {
      reference: string;
      authorizationUrl: string;
      amount: number;
      currency: string;
    };
  },

  verifyPayment: async (reference: string) => {
    const res = await fetch(`${API_URL}/api/payments/verify/${reference}`, {
      headers: authHeaders(),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw Object.assign(
        new Error(data.error || "Payment was not successful"),
        { courseId: data.courseId, courseTitle: data.courseTitle },
      );
    }
    return data as {
      status: string;
      courseId: string;
      courseTitle?: string;
      error?: string;
    };
  },

  getInstructorProfile: async (adminId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/profile/${adminId}`);
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },

  searchCourses: async (
    query: string,
    category?: string,
  ): Promise<Course[]> => {
    const all = await api.getCourses();
    let filtered = all;
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q) ||
          c.instructor.name.toLowerCase().includes(q),
      );
    }
    if (category) {
      filtered = filtered.filter((c) => c.category === category);
    }
    return filtered;
  },

  getFeaturedCourses: async (): Promise<Course[]> => {
    const all = await api.getCourses();
    return all.filter((c) => c.isFeatured);
  },

  getQuiz: async (quizId: string): Promise<Quiz | undefined> => {
    const res = await fetch(`${API_URL}/api/quizzes/${quizId}`, {
      headers: authHeaders(),
    });
    if (!res.ok) return undefined;
    const data = await res.json();
    return mapQuiz(data, data.courseId ?? "");
  },

  submitQuiz: async (
    quizId: string,
    answers: Record<string, number | string>,
  ): Promise<
    | {
        score: number;
        totalQuestions: number;
        percentage: number;
        passed: boolean;
        completedAt: string;
        quiz?: Quiz;
      }
    | undefined
  > => {
    const res = await fetch(`${API_URL}/api/quizzes/${quizId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ answers }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Failed to submit quiz");
    return {
      ...data,
      quiz: data.quiz ? mapQuiz(data.quiz, data.quiz.courseId ?? "") : undefined,
    };
  },
};

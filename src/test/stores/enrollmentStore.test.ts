import { describe, it, expect, beforeEach, vi } from "vitest";
import { useEnrollmentStore } from "@/stores/enrollmentStore";

interface MockFetchResult {
  ok?: boolean;
  body?: unknown;
}

function mockFetchResponses(handler: (url: string, init?: RequestInit) => MockFetchResult) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      const result = handler(url, init);
      return {
        ok: result.ok ?? true,
        json: async () => result.body ?? {},
      } as Response;
    }),
  );
}

beforeEach(() => {
  localStorage.clear();
  useEnrollmentStore.setState({ userId: null, enrolledCourses: [] });
  vi.unstubAllGlobals();
});

describe("enrollmentStore.enroll / isEnrolled", () => {
  it("adds a course to enrolledCourses on a successful enroll call", async () => {
    useEnrollmentStore.setState({ userId: "u1", enrolledCourses: [] });
    mockFetchResponses(() => ({
      ok: true,
      body: { courseId: "course-1", createdAt: "2026-01-01T00:00:00Z", isCompleted: false },
    }));

    await useEnrollmentStore.getState().enroll("course-1");

    expect(useEnrollmentStore.getState().isEnrolled("course-1")).toBe(true);
  });

  it("is a no-op if already enrolled (does not call the API again)", async () => {
    useEnrollmentStore.setState({
      userId: "u1",
      enrolledCourses: [
        {
          courseId: "course-1",
          enrolledAt: "2026-01-01T00:00:00Z",
          completedLessons: [],
          completedModules: [],
          quizAttempts: [],
          isCompleted: false,
        },
      ],
    });
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    await useEnrollmentStore.getState().enroll("course-1");

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("throws when the server rejects the enrollment", async () => {
    useEnrollmentStore.setState({ userId: "u1", enrolledCourses: [] });
    mockFetchResponses(() => ({ ok: false, body: { error: "Course is not available" } }));

    await expect(useEnrollmentStore.getState().enroll("course-1")).rejects.toThrow(
      "Course is not available",
    );
    expect(useEnrollmentStore.getState().isEnrolled("course-1")).toBe(false);
  });

  it("returns false for isEnrolled on a course with no enrollment record", () => {
    expect(useEnrollmentStore.getState().isEnrolled("unknown-course")).toBe(false);
  });
});

describe("enrollmentStore.completeLesson / isLessonCompleted (video/lesson progress)", () => {
  beforeEach(() => {
    mockFetchResponses(() => ({ ok: true, body: {} }));
  });

  it("marks a lesson complete for an enrolled course", () => {
    useEnrollmentStore.setState({
      userId: "u1",
      enrolledCourses: [
        {
          courseId: "course-1",
          enrolledAt: "2026-01-01T00:00:00Z",
          completedLessons: [],
          completedModules: [],
          quizAttempts: [],
          isCompleted: false,
        },
      ],
    });

    useEnrollmentStore.getState().completeLesson("course-1", "lesson-1");

    expect(useEnrollmentStore.getState().isLessonCompleted("course-1", "lesson-1")).toBe(true);
    expect(useEnrollmentStore.getState().getCompletedLessonCount("course-1")).toBe(1);
  });

  it("does not duplicate a lesson that is already marked complete", () => {
    useEnrollmentStore.setState({
      userId: "u1",
      enrolledCourses: [
        {
          courseId: "course-1",
          enrolledAt: "2026-01-01T00:00:00Z",
          completedLessons: ["lesson-1"],
          completedModules: [],
          quizAttempts: [],
          isCompleted: false,
        },
      ],
    });

    useEnrollmentStore.getState().completeLesson("course-1", "lesson-1");

    expect(useEnrollmentStore.getState().getCompletedLessonCount("course-1")).toBe(1);
  });

  it("creates a preview enrollment record when completing a lesson for a course with none (admin preview)", () => {
    useEnrollmentStore.setState({ userId: "u1", enrolledCourses: [] });

    useEnrollmentStore.getState().completeLesson("preview-course", "lesson-1");

    expect(useEnrollmentStore.getState().isLessonCompleted("preview-course", "lesson-1")).toBe(true);
  });

  it("returns false for a lesson that has not been completed", () => {
    useEnrollmentStore.setState({
      userId: "u1",
      enrolledCourses: [
        {
          courseId: "course-1",
          enrolledAt: "2026-01-01T00:00:00Z",
          completedLessons: [],
          completedModules: [],
          quizAttempts: [],
          isCompleted: false,
        },
      ],
    });

    expect(useEnrollmentStore.getState().isLessonCompleted("course-1", "lesson-1")).toBe(false);
  });
});

describe("enrollmentStore.getEnrolledCourse", () => {
  it("finds the enrolled course by id", () => {
    useEnrollmentStore.setState({
      userId: "u1",
      enrolledCourses: [
        {
          courseId: "course-1",
          enrolledAt: "2026-01-01T00:00:00Z",
          completedLessons: [],
          completedModules: [],
          quizAttempts: [],
          isCompleted: false,
        },
      ],
    });

    expect(useEnrollmentStore.getState().getEnrolledCourse("course-1")?.courseId).toBe("course-1");
    expect(useEnrollmentStore.getState().getEnrolledCourse("missing")).toBeUndefined();
  });
});

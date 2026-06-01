import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Calendar,
  BookOpen,
  Award,
  Trophy,
  TrendingUp,
  Star,
  Zap,
  Target,
  Flame,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import MainLayout from "@/components/layouts/MainLayout";
import { useAuthStore } from "@/stores/authStore";
import { useEnrollmentStore } from "@/stores/enrollmentStore";
import { api } from "@/services/api";
import type { Course } from "@/types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
} from "chart.js";
import { Bar, Radar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
);

interface AchievementDef {
  icon: typeof BookOpen;
  label: string;
  desc: string;
  unlocked: boolean;
  color: string;
}

const Profile = () => {
  const { user } = useAuthStore();
  const { enrolledCourses, refreshFromServer } = useEnrollmentStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    refreshFromServer().finally(() => {});
  }, [refreshFromServer]);

  useEffect(() => {
    setLoadingCourses(true);
    api
      .getCourses()
      .then((all) => {
        setCourses(
          all.filter((c) => enrolledCourses.some((e) => e.courseId === c.id)),
        );
      })
      .finally(() => setLoadingCourses(false));
  }, [enrolledCourses]);

  const completedCourses = enrolledCourses.filter((e) => e.isCompleted);
  const learningCourses = enrolledCourses.filter((e) => !e.isCompleted);

  const totalLessonsCompleted = enrolledCourses.reduce(
    (sum, e) => sum + (e.completedLessons?.length ?? 0),
    0,
  );

  const totalLessonsAvailable = courses.reduce(
    (sum, c) => sum + c.modules.reduce((acc, m) => acc + m.lessons.length, 0),
    0,
  );

  const averageProgress =
    courses.length > 0
      ? Math.round(
          courses.reduce((sum, course) => {
            const enrollment = enrolledCourses.find(
              (e) => e.courseId === course.id,
            );
            const total = course.modules.reduce(
              (acc, m) => acc + m.lessons.length,
              0,
            );
            const pct =
              total > 0
                ? Math.round(
                    ((enrollment?.completedLessons?.length || 0) / total) * 100,
                  )
                : enrollment?.isCompleted
                  ? 100
                  : 0;
            return sum + pct;
          }, 0) / courses.length,
        )
      : 0;

  // Dynamic achievements
  const achievements: AchievementDef[] = [
    {
      icon: BookOpen,
      label: "First Step",
      desc: "Enrolled in your first course",
      unlocked: enrolledCourses.length >= 1,
      color: "bg-blue-500",
    },
    {
      icon: Zap,
      label: "Quick Start",
      desc: "Completed your first lesson",
      unlocked: totalLessonsCompleted >= 1,
      color: "bg-yellow-500",
    },
    {
      icon: Flame,
      label: "On Fire",
      desc: "Completed 10 lessons",
      unlocked: totalLessonsCompleted >= 10,
      color: "bg-orange-500",
    },
    {
      icon: Target,
      label: "Halfway There",
      desc: "Completed 50% of any course",
      unlocked: courses.some((c) => {
        const e = enrolledCourses.find((en) => en.courseId === c.id);
        const total = c.modules.reduce((acc, m) => acc + m.lessons.length, 0);
        return total > 0 && (e?.completedLessons?.length ?? 0) / total >= 0.5;
      }),
      color: "bg-teal-500",
    },
    {
      icon: Trophy,
      label: "Course Completer",
      desc: "Completed your first course",
      unlocked: completedCourses.length >= 1,
      color: "bg-emerald-500",
    },
    {
      icon: Star,
      label: "Star Student",
      desc: "Completed 3 or more courses",
      unlocked: completedCourses.length >= 3,
      color: "bg-purple-500",
    },
    {
      icon: GraduationCap,
      label: "Scholar",
      desc: "Completed 5 or more courses",
      unlocked: completedCourses.length >= 5,
      color: "bg-indigo-500",
    },
    {
      icon: Award,
      label: "Dedicated Learner",
      desc: "Enrolled in 5 or more courses",
      unlocked: enrolledCourses.length >= 5,
      color: "bg-pink-500",
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  // Progress chart data (per-course progress bars)
  const chartCourses = courses.slice(0, 6);
  const barData = {
    labels: chartCourses.map((c) =>
      c.title.length > 20 ? c.title.slice(0, 20) + "…" : c.title,
    ),
    datasets: [
      {
        label: "Progress (%)",
        data: chartCourses.map((c) => {
          const e = enrolledCourses.find((en) => en.courseId === c.id);
          const total = c.modules.reduce(
            (acc, m) => acc + m.lessons.length,
            0,
          );
          if (e?.isCompleted) return 100;
          return total > 0
            ? Math.round(((e?.completedLessons?.length ?? 0) / total) * 100)
            : 0;
        }),
        backgroundColor: chartCourses.map((c) => {
          const e = enrolledCourses.find((en) => en.courseId === c.id);
          return e?.isCompleted
            ? "hsla(142, 50%, 35%, 0.8)"
            : "hsla(45, 90%, 50%, 0.8)";
        }),
        borderColor: chartCourses.map((c) => {
          const e = enrolledCourses.find((en) => en.courseId === c.id);
          return e?.isCompleted
            ? "hsl(142, 50%, 35%)"
            : "hsl(45, 90%, 50%)";
        }),
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const radarData = {
    labels: ["Enrolled", "In Progress", "Completed", "Lessons Done", "Achievements"],
    datasets: [
      {
        label: "Your Stats",
        data: [
          Math.min((enrolledCourses.length / 5) * 100, 100),
          Math.min((learningCourses.length / 3) * 100, 100),
          Math.min((completedCourses.length / 3) * 100, 100),
          Math.min((totalLessonsCompleted / 20) * 100, 100),
          Math.min((unlockedCount / achievements.length) * 100, 100),
        ],
        backgroundColor: "hsla(45, 90%, 50%, 0.2)",
        borderColor: "hsl(45, 90%, 50%)",
        pointBackgroundColor: "hsl(45, 90%, 50%)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-5xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-8 flex flex-col sm:flex-row items-center gap-6">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.name}
                className="h-24 w-24 rounded-full object-cover ring-4 ring-yellow-400/30"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-yellow-400/20 ring-4 ring-yellow-400/30 flex items-center justify-center text-3xl font-bold text-yellow-600">
                {user?.name?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <div className="text-center sm:text-left space-y-2">
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <div className="flex flex-col sm:flex-row gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </span>
                {user?.joinedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(user.joinedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="flex gap-4 text-sm pt-1 flex-wrap">
                <span>
                  <strong>{enrolledCourses.length}</strong> Enrolled
                </span>
                <span>
                  <strong>{completedCourses.length}</strong> Completed
                </span>
                <span>
                  <strong>{learningCourses.length}</strong> In Progress
                </span>
                <span>
                  <strong>{unlockedCount}</strong> / {achievements.length}{" "}
                  Achievements
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-5 text-center">
              <TrendingUp className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
              <p className="text-2xl font-bold">{averageProgress}%</p>
              <p className="text-xs text-muted-foreground mt-1">Avg Progress</p>
              <Progress value={averageProgress} className="mt-2 h-1.5" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <BookOpen className="h-6 w-6 mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold">{totalLessonsCompleted}</p>
              <p className="text-xs text-muted-foreground mt-1">Lessons Done</p>
              {totalLessonsAvailable > 0 && (
                <Progress
                  value={Math.round(
                    (totalLessonsCompleted / totalLessonsAvailable) * 100,
                  )}
                  className="mt-2 h-1.5"
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <Flame className="h-6 w-6 mx-auto text-orange-500 mb-2" />
              <p className="text-2xl font-bold">{learningCourses.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Still Learning</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <CheckCircle2 className="h-6 w-6 mx-auto text-emerald-500 mb-2" />
              <p className="text-2xl font-bold">{completedCourses.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        {courses.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Course Progress</CardTitle>
              </CardHeader>
              <CardContent className="h-56">
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { callback: (v) => `${v}%` },
                      },
                      x: { ticks: { font: { size: 11 } } },
                    },
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Learning Profile</CardTitle>
              </CardHeader>
              <CardContent className="h-56 flex items-center justify-center">
                <div className="w-full h-full">
                  <Radar
                    data={radarData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        r: {
                          min: 0,
                          max: 100,
                          ticks: { display: false },
                          pointLabels: { font: { size: 10 } },
                        },
                      },
                      plugins: { legend: { display: false } },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Enrolled Courses */}
          <div>
            <h2 className="text-xl font-bold mb-4">My Courses</h2>
            {loadingCourses ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="h-14 bg-muted animate-pulse rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>No courses enrolled yet.</p>
                  <Link
                    to="/courses"
                    className="text-primary hover:underline text-sm mt-1 block"
                  >
                    Browse the Academy
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {courses.map((course) => {
                  const e = enrolledCourses.find(
                    (en) => en.courseId === course.id,
                  );
                  const total = course.modules.reduce(
                    (acc, m) => acc + m.lessons.length,
                    0,
                  );
                  const pct =
                    e?.isCompleted
                      ? 100
                      : total > 0
                        ? Math.round(
                            ((e?.completedLessons?.length || 0) / total) * 100,
                          )
                        : 0;
                  return (
                    <Link key={course.id} to={`/learn/${course.id}`}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center gap-4">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="h-14 w-20 rounded object-cover shrink-0"
                            />
                          ) : (
                            <div className="h-14 w-20 rounded bg-muted flex items-center justify-center shrink-0">
                              <BookOpen className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium truncate">
                              {course.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={pct} className="h-1.5 flex-1" />
                              <span className="text-xs text-muted-foreground shrink-0">
                                {pct}%
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {e?.isCompleted ? (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-emerald-100 text-emerald-700"
                                >
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Completed
                                </Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  {e?.completedLessons?.length ?? 0}/{total}{" "}
                                  lessons
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Achievements */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Achievements</h2>
              <Badge variant="outline" className="text-xs">
                {unlockedCount} / {achievements.length} unlocked
              </Badge>
            </div>
            <div className="space-y-3">
              {achievements.map((a, i) => (
                <Card
                  key={i}
                  className={`transition-all ${
                    a.unlocked
                      ? "border-yellow-200 shadow-sm"
                      : "opacity-50 grayscale"
                  }`}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                        a.unlocked ? a.color : "bg-muted"
                      }`}
                    >
                      <a.icon
                        className={`h-5 w-5 ${
                          a.unlocked ? "text-white" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold">{a.label}</h3>
                      <p className="text-xs text-muted-foreground">{a.desc}</p>
                    </div>
                    {a.unlocked && (
                      <Badge className="text-xs bg-yellow-400 text-black hover:bg-yellow-400 shrink-0">
                        Unlocked
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;

import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  ProtectedAdminRoute,
  StrictAdminRoute,
} from "@/components/admin/ProtectedAdminRoute";

// Eager: the entry points a first-time visitor actually lands on.
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

// Everything else is split per route. The bundle used to be one 1.7 MB file, so a
// visitor reading the homepage downloaded the whole admin dashboard, Chart.js,
// jsPDF, and html2canvas before anything rendered.
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const AdminInvite = lazy(() => import("./pages/AdminInvite"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const MyLearning = lazy(() => import("./pages/MyLearning"));
const CourseLearning = lazy(() => import("./pages/CourseLearning"));
const Certificate = lazy(() => import("./pages/Certificate"));
const VerifyCertificate = lazy(() => import("./pages/VerifyCertificate"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Team = lazy(() => import("./pages/Team"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Profile = lazy(() => import("./pages/Profile"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailed = lazy(() => import("./pages/PaymentFailed"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));
const GetStarted = lazy(() => import("./pages/GetStarted"));

// Admin dashboard — never loaded for a signed-out visitor.
const DashboardLayout = lazy(() =>
  import("@/components/layout/DashboardLayout").then((m) => ({
    default: m.DashboardLayout,
  })),
);
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminCourses = lazy(() => import("./pages/admin/Courses"));
const CourseNew = lazy(() => import("./pages/admin/CourseNew"));
const AdminCourseDetail = lazy(() => import("./pages/admin/CourseDetail"));
const CourseBuilder = lazy(() => import("./pages/admin/CourseBuilder"));
const CourseEnrollments = lazy(() => import("./pages/admin/CourseEnrollments"));
const Users = lazy(() => import("./pages/admin/Users"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const Revenue = lazy(() => import("./pages/admin/Revenue"));
const Instructors = lazy(() => import("./pages/admin/Instructors"));
const InstructorDetail = lazy(() => import("./pages/admin/InstructorDetail"));
const AdminProfile = lazy(() => import("./pages/admin/AdminProfile"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const EventsGallery = lazy(() => import("./pages/admin/EventsGallery"));
const AdminTestimonials = lazy(() => import("./pages/admin/Testimonials"));
const AdminFaculty = lazy(() => import("./pages/admin/Faculty"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min — don't refetch if data is fresh
      gcTime: 1000 * 60 * 10, // 10 min — keep unused data in memory
      retry: 1,
      refetchOnWindowFocus: false, // don't hammer the API when tab regains focus
    },
  },
});

const RouteFallback = () => (
  <div
    className="min-h-screen flex items-center justify-center bg-[#0B0B0C]"
    role="status"
    aria-label="Loading"
  >
    <div className="h-8 w-8 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* One page throwing must not blank the whole site. */}
          <ErrorBoundary>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                {/* Public & user routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/admin-invite" element={<AdminInvite />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/team" element={<Team />} />
                <Route path="/services" element={<Services />} />
                <Route path="/get" element={<GetStarted />} />
                <Route
                  path="/payment/success"
                  element={
                    <ProtectedRoute>
                      <PaymentSuccess />
                    </ProtectedRoute>
                  }
                />
                <Route path="/payment/failed" element={<PaymentFailed />} />
                <Route
                  path="/my-learning"
                  element={
                    <ProtectedRoute>
                      <MyLearning />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/learn/:courseId"
                  element={
                    <ProtectedRoute>
                      <CourseLearning />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/learn/:courseId/quiz/:quizId"
                  element={
                    <ProtectedRoute>
                      <Quiz />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/certificate/:courseId"
                  element={
                    <ProtectedRoute>
                      <Certificate />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/verify-certificate"
                  element={<VerifyCertificate />}
                />
                <Route
                  path="/verify-certificate/:certificateId"
                  element={<VerifyCertificate />}
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Admin routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedAdminRoute>
                      <DashboardLayout />
                    </ProtectedAdminRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="profile" element={<AdminProfile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="courses" element={<AdminCourses />} />
                  <Route path="courses/new" element={<CourseNew />} />
                  <Route path="courses/:id" element={<AdminCourseDetail />} />
                  <Route path="courses/:id/builder" element={<CourseBuilder />} />
                  <Route
                    path="courses/:id/enrollments"
                    element={<CourseEnrollments />}
                  />
                  <Route path="users" element={<Users />} />
                  <Route
                    path="analytics"
                    element={
                      <StrictAdminRoute>
                        <Analytics />
                      </StrictAdminRoute>
                    }
                  />
                  <Route
                    path="revenue"
                    element={
                      <StrictAdminRoute>
                        <Revenue />
                      </StrictAdminRoute>
                    }
                  />
                  <Route
                    path="events-gallery"
                    element={
                      <StrictAdminRoute>
                        <EventsGallery />
                      </StrictAdminRoute>
                    }
                  />
                  <Route
                    path="testimonials"
                    element={
                      <StrictAdminRoute>
                        <AdminTestimonials />
                      </StrictAdminRoute>
                    }
                  />
                  <Route
                    path="faculty"
                    element={
                      <StrictAdminRoute>
                        <AdminFaculty />
                      </StrictAdminRoute>
                    }
                  />
                  <Route
                    path="instructors"
                    element={
                      <StrictAdminRoute>
                        <Instructors />
                      </StrictAdminRoute>
                    }
                  />
                  <Route
                    path="instructors/:id"
                    element={
                      <StrictAdminRoute>
                        <InstructorDetail />
                      </StrictAdminRoute>
                    }
                  />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

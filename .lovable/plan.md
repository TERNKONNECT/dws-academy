

# Coursera-Style LMS — Implementation Plan

## Design System
- **Colors**: Blue-to-indigo-to-violet gradient palette (primary blue #4F46E5, accent violet #7C3AED)
- **Style**: Clean, professional, educational SaaS — soft gradients, rounded cards, calm tones
- **Typography**: Inter font, clear hierarchy
- **Mobile-first** responsive design throughout

## Architecture
- **State**: Zustand stores for auth, enrollment, progress, and quiz state
- **Mock API**: Service layer (`/services/api.ts`) with structured functions (getCourses, enrollCourse, etc.) backed by local JSON data — easy to swap for real endpoints later
- **Persistence**: LocalStorage for auth tokens, enrolled courses, progress, and quiz results
- **Types**: Shared TypeScript interfaces for Course, Module, Lesson, Quiz, User, Progress

## Pages & Features

### 1. Auth Pages (`/login`, `/signup`, `/forgot-password`)
- Clean forms with validation, JWT simulation via localStorage
- Protected route wrapper redirects unauthenticated users
- Toast notifications for success/error feedback

### 2. Homepage (`/`)
- Hero section with gradient background and CTA
- Search bar (navigates to /courses with query)
- Featured courses carousel/grid (6 courses)
- Category chips section
- Testimonials section
- Final CTA banner

### 3. Courses Page (`/courses`)
- Grid of course cards (thumbnail, title, instructor, rating, duration, level)
- Search input with mock filtering
- Category filter sidebar/dropdown
- Loading skeletons, empty states

### 4. Course Detail Page (`/courses/:id`)
- Course hero with title, instructor, rating, enrollment button
- "What you'll learn" checklist
- Expandable curriculum (modules → lessons)
- Instructor bio section
- Reviews/ratings section
- Enrollment adds course to "My Learning"

### 5. My Learning Page (`/my-learning`)
- Grid of enrolled course cards with progress bars
- "Continue Learning" button per course
- Empty state for no enrollments

### 6. Course Learning Interface (`/learn/:courseId`)
- **Left sidebar**: Module list with lessons, completion checkmarks, collapsible on mobile
- **Main area**: Video placeholder, lesson description, "Mark as Complete" button, Previous/Next navigation
- Progress auto-updates in Zustand store + localStorage
- Sequential module unlocking — next module unlocks when current is complete
- Final quiz unlocks after all lessons complete

### 7. Quiz Page (`/learn/:courseId/quiz/:quizId`)
- One question per screen with multiple choice options
- Next button, progress indicator
- Submit on final question → score page
- Shows correct/incorrect answers with explanations
- Retake button available

### 8. Course Completion Screen
- Congratulations display after final quiz
- Course stats summary
- Return to My Learning button

### 9. Profile Page (`/profile`)
- User info (name, email)
- Enrolled courses list
- Completed courses list
- Achievements section (badges UI)

## Mock Data
- 6+ courses across categories (Web Dev, Data Science, Design, etc.)
- Each course has 3-4 modules, each module has 3-5 lessons
- Quizzes with 5-10 multiple choice questions each
- Sample reviews, instructor bios, testimonials

## UX Polish
- Loading skeletons on all data-fetching pages
- Error and empty state components
- Smooth page transitions
- Hover effects on cards and buttons
- Toast notifications (enrollment, quiz submit, lesson complete)
- Keyboard navigation and ARIA labels throughout
- Semantic HTML structure

## Layout System
- Shared `MainLayout` with responsive navbar (logo, nav links, auth buttons, mobile hamburger menu)
- `LearningLayout` for the course player (sidebar + content)
- Footer with links


import type { Course, Quiz } from "@/types";

export const courses: Course[] = [];

export const quizzes: Quiz[] = [];

export const testimonials = [
  {
    id: "t1",
    name: "Amara Okafor",
    role: "Visually Impaired Learner, Lagos",
    avatar:
      "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=100&h=100&fit=crop&crop=face",
    quote:
      "Before TERNKONNECT, I could not access any online course independently. The screen reader integration and voice navigation changed everything. I completed my first web development course entirely on my own.",
  },
  {
    id: "t2",
    name: "Chukwuemeka Nwosu",
    role: "Deaf Student, Abuja",
    avatar:
      "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=100&h=100&fit=crop&crop=face",
    quote:
      "As a deaf learner, most platforms left me behind. The real-time captions and text-based voice commands on this platform meant I could follow every lesson without missing a single word. I finally feel included.",
  },
  {
    id: "t3",
    name: "Fatima Al-Hassan",
    role: "Learner with Cerebral Palsy, Kano",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
    quote:
      "Using a mouse was always a struggle for me. The keyboard-first navigation and voice commands let me move through the entire platform without any physical strain. I passed my data science quiz for the first time.",
  },
];

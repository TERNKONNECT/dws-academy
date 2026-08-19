import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    category: "1. General Information",
    faqs: [
      {
        q: "What is School of Events Africa?",
        a: "School of Events Africa is a professional learning platform designed to provide practical education, training, and resources across multiple disciplines within the events industry.",
      },
      {
        q: "Who is School of Events Africa for?",
        a: "Our programmes are designed for aspiring event professionals, existing practitioners, entrepreneurs, creatives, corporate professionals, and anyone looking to build or strengthen their skills in the events industry.",
      },
      {
        q: "What disciplines can I study?",
        a: "School of Events Africa offers programmes across multiple disciplines within the events industry. Our faculties and programmes will continue to expand as new areas of learning are introduced.",
      },
      {
        q: "Where is School of Events Africa located?",
        a: "School of Events Africa provides online learning opportunities, allowing students to access programmes and learning resources from wherever they are.",
      },
      {
        q: "Are the programmes online or physical?",
        a: "Programmes available through the platform are delivered online unless otherwise stated.",
      },
    ],
  },
  {
    category: "2. Courses & Programmes",
    faqs: [
      {
        q: "What courses are available?",
        a: "You can view all available courses and programmes in the Courses/Programmes section of the website.",
      },
      {
        q: "How do I choose the right course for me?",
        a: "Review the course description, learning objectives, programme structure, duration, and requirements before enrolling. If you're unsure which programme is right for you, you can book a Clarity Call with our team to discuss your goals and get guidance on the most suitable course for you.",
      },
      {
        q: "Can I enrol in more than one course?",
        a: "Yes, where applicable, students can enrol in multiple courses or programmes.",
      },
      {
        q: "Can I learn at my own pace?",
        a: "Where self-paced learning is available, students can progress through the course according to their own schedule, subject to the programme requirements.",
      },
    ],
  },
  {
    category: "3. Registration & Enrolment",
    faqs: [
      {
        q: "How do I register as a student?",
        a: "Click Student Registration and complete the required registration information.",
      },
      {
        q: "Do I need an account to enrol in a course?",
        a: "Yes. Students will need an account to access their enrolled programmes and learning dashboard.",
      },
      {
        q: "Can I register without immediately enrolling in a course?",
        a: "Yes, where registration is available independently from course enrolment.",
      },
      {
        q: "What happens after I enrol?",
        a: "After successful enrolment and payment confirmation, you will receive information about your course access and next steps.",
      },
      {
        q: "Where can I access my courses and student information?",
        a: "Once you are signed in, click on your profile to access your Student Dashboard. Your dashboard provides access to your enrolled courses, learning progress, certificates, notifications, and other student information available to you.",
      },
      {
        q: "How do I access my Student Dashboard?",
        a: "Sign in to your School of Events Africa account and click on your profile. Your Student Dashboard will be available from your profile menu.",
      },
      {
        q: "How do I access my courses?",
        a: "Log in through the Student Login section of the website and access your courses through your Student Dashboard.",
      },
    ],
  },
  {
    category: "4. Payments",
    faqs: [
      {
        q: "How do I pay for a course?",
        a: "Payments can be made through the available payment options on the platform, including Paystack.",
      },
      {
        q: "What happens after I make payment?",
        a: "Your payment will be verified. Once payment is successfully confirmed, your course access will be activated.",
      },
      {
        q: "What if my payment was successful but I cannot access my course?",
        a: "Contact Support with your payment details or transaction reference so the team can verify your payment and assist you.",
      },
      {
        q: "What if my payment failed?",
        a: "You can attempt the payment again. If you continue experiencing issues, contact Support.",
      },
      {
        q: "I was charged twice. What should I do?",
        a: "Contact Support with your transaction details so the payment can be investigated and reconciled.",
      },
      {
        q: "Can I get a refund?",
        a: "No Refunds.",
      },
    ],
  },
  {
    category: "5. Learning & Student Dashboard",
    faqs: [
      {
        q: "Where can I see my courses?",
        a: "Your enrolled courses will be available through your Student Dashboard.",
      },
      {
        q: "How do I access my Student Dashboard?",
        a: "Sign in to your account and click on your profile. You will find your Student Dashboard in the profile menu.",
      },
      {
        q: "Can I track my course progress?",
        a: "Yes. The LMS tracks relevant course and lesson completion information.",
      },
      {
        q: "What happens when I complete a lesson or module?",
        a: "Your completion status will be recorded, allowing you to track your progress through the programme.",
      },
      {
        q: "Can I access my course on my phone?",
        a: "Yes. The platform is designed to support mobile access.",
      },
      {
        q: "Can I access my course from different devices?",
        a: "Yes, you can access your account from supported devices using your login credentials.",
      },
      {
        q: "What happens if I forget my password?",
        a: "Use the password reset option on the Student Login page to securely reset your password.",
      },
    ],
  },
  {
    category: "6. Quizzes & Assessments",
    faqs: [
      {
        q: "Do the courses include quizzes or assessments?",
        a: "Some programmes may include quizzes, assignments, projects, or other assessments.",
      },
      {
        q: "What types of questions are included in quizzes?",
        a: "Assessments may include multiple-choice and other supported question types depending on the programme.",
      },
      {
        q: "Can I retake a quiz?",
        a: "Retakes will depend on the requirements configured for the specific programme.",
      },
      {
        q: "How will I know my quiz result?",
        a: "Where results are configured for immediate display, your score will be shown after submission.",
      },
      {
        q: "What happens if I do not pass an assessment?",
        a: "The applicable course requirements will determine whether you can retake the assessment or complete another required activity.",
      },
    ],
  },
  {
    category: "7. Certificates",
    faqs: [
      {
        q: "Will I receive a certificate after completing my programme?",
        a: "Yes, eligible students will receive a certificate after successfully completing the required programme requirements.",
      },
      {
        q: "Is the certificate issued after completing one class?",
        a: "Certificate issuance is tied to completion of the required full bundled programme, rather than an individual class where the programme is structured as a bundle.",
      },
      {
        q: "How will I receive my certificate?",
        a: "Eligible students will be notified when their certificate is generated and will be able to access/download it through the platform.",
      },
      {
        q: "Will my certificate have a certificate ID?",
        a: "Yes, certificates will include a unique certificate ID where applicable.",
      },
      {
        q: "Can my certificate be verified?",
        a: "Yes. The platform will support certificate verification and authenticity checks.",
      },
      {
        q: "What if my name is incorrect on my certificate?",
        a: "Contact Support so your student information can be reviewed and the appropriate correction can be made.",
      },
    ],
  },
  {
    category: "8. Notifications & Communication",
    faqs: [
      {
        q: "How will I know when I enrol successfully?",
        a: "You will receive an enrolment confirmation through the available notification channels.",
      },
      {
        q: "Will I receive notifications when new course modules are added?",
        a: "Yes. Affected students can receive notifications when new modules are added to their courses.",
      },
      {
        q: "Will I receive a notification when I complete my programme?",
        a: "Yes. Completion notifications can be sent through email and in-platform notifications.",
      },
      {
        q: "Will I receive reminders if I stop taking a course?",
        a: "Yes. The platform can send configurable reminders to students with incomplete or inactive courses.",
      },
      {
        q: "How will I know about upcoming webinars?",
        a: "Registered participants can receive webinar confirmation and reminder notifications, including scheduled reminders before the event.",
      },
    ],
  },
  {
    category: "10. Support",
    faqs: [
      {
        q: "How can I contact School of Events Africa?",
        a: "You can contact the team through the Support section, email, WhatsApp, or the relevant contact channels provided on the website.",
      },
      {
        q: "What can Support help me with?",
        a: "Support can assist with:\nCourse enquiries.\nEnrolment.\nPayments.\nCourse access.\nAccount/login issues.\nCertificates.\nTechnical issues.\nWebinars/events.\nPartnerships.\nGeneral enquiries.",
      },
      {
        q: "What if I need help that cannot be resolved by Support?",
        a: "Your enquiry can be escalated to a member of the appropriate team for further assistance.",
      },
    ],
  },
  {
    category: "12. Newsletter & Latest Updates",
    faqs: [
      {
        q: "Where can I find the latest updates from School of Events Africa?",
        a: "You can find the latest news, announcements, industry updates, new programmes, events, resources, and other updates through the Newsletter and Insights sections of the website.",
      },
      {
        q: "Can I subscribe to the School of Events Africa newsletter?",
        a: "Yes. You can subscribe through the Newsletter section of the website.",
      },
      {
        q: "What will I receive when I subscribe?",
        a: "Depending on your preferences, you may receive information about courses, events, webinars, books, insights, resources, opportunities, announcements, and other School of Events Africa updates.",
      },
      {
        q: "Can I unsubscribe?",
        a: "Yes. Marketing communications will include appropriate unsubscribe options.",
      },
      {
        q: "Can I change my communication preferences?",
        a: "Where preference management is available, you can update your communication preferences.",
      },
    ],
  },
  {
    category: "13. Partnerships & Opportunities",
    faqs: [
      {
        q: "Can I partner with School of Events Africa?",
        a: "Yes. We welcome partnership opportunities with organisations, brands, professionals, institutions, and other industry stakeholders. Visit the Partner with Us tab on the website to learn more and submit a partnership enquiry.",
      },
      {
        q: "What types of organisations can partner with School of Events Africa?",
        a: "Partnership opportunities may be available to brands, organisations, educational institutions, industry professionals, corporate organisations, event companies, and other relevant stakeholders.",
      },
      {
        q: "Where can I find career and job opportunities?",
        a: "Job opportunities and career-related opportunities can be published in the Career/Opportunities area of the website and through relevant updates.",
      },
      {
        q: "Are there opportunities for students and professionals?",
        a: "Yes. The platform may feature career opportunities, partnerships, scholarships, promotions, industry opportunities, and other relevant updates.",
      },
    ],
  },
  {
    category: "14. Community",
    faqs: [
      {
        q: "Does School of Events Africa have a student community?",
        a: "Yes. The platform includes a Student Community area where students can connect and engage.",
      },
      {
        q: "Who can join the Student Community?",
        a: "Access to the Student Community will depend on the community requirements and the type of programme or membership you have.",
      },
    ],
  },
  {
    category: "15. Website Content & Insights",
    faqs: [
      {
        q: "Where can I find insights from School of Events Africa?",
        a: "Visit the Insights section to explore articles, industry perspectives, educational content, and other relevant resources.",
      },
      {
        q: "Where can I find books and learning resources?",
        a: "Available books and resources will be published in the Books and relevant resource sections of the website.",
      },
      {
        q: "Where can I find announcements and major updates?",
        a: "Major announcements and updates will be available through the Newsletter, Insights, and Updates/What’s New sections, where applicable.",
      },
      {
        q: "How often is the website updated?",
        a: "Website content will be updated as new programmes, events, resources, announcements, and other information become available.",
      },
    ],
  },
  {
    category: "18. Still Have Questions?",
    faqs: [
      {
        q: "I couldn’t find the answer to my question. What should I do?",
        a: "If your question is not answered in the FAQ, visit the Support section or contact the School of Events Africa Support team through the available support channels and a member of the team will assist you.",
      },
    ],
  },
];

export default function FAQ() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-300/5" />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Frequently Asked <span className="text-yellow-400">Questions</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about School of Events Africa.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-[#0B0B0C]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-12">
            {faqData.map((section, index) => (
              <div key={index}>
                <h2 className="text-2xl font-bold text-white mb-6">
                  {section.category}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {section.faqs.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`item-${index}-${faqIndex}`}
                      className="border-b border-white/10"
                    >
                      <AccordionTrigger className="text-left text-white/90 hover:text-yellow-400">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-white/70 whitespace-pre-line">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

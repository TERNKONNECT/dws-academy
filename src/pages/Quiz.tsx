import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Mic,
  MicOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/services/api";
import { useEnrollmentStore } from "@/stores/enrollmentStore";
import { useToast } from "@/hooks/use-toast";
import type { Quiz as QuizType } from "@/types";

const isAnswered = (
  q: { id: string; type?: "mcq" | "theory" },
  answers: Record<string, number | string>,
) => {
  const a = answers[q.id];
  if (q.type === "theory") return typeof a === "string" && a.trim().length > 0;
  return a !== undefined;
};

const Quiz = () => {
  const { courseId, quizId } = useParams<{
    courseId: string;
    quizId: string;
  }>();
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number | string>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addQuizAttempt, completeCourse } = useEnrollmentStore();

  // Refs so voice callbacks always have latest state
  const quizRef = useRef<QuizType | null>(null);
  const currentQuestionRef = useRef(0);
  const selectedAnswersRef = useRef<Record<string, number | string>>({});
  const submittedRef = useRef(false);

  useEffect(() => {
    quizRef.current = quiz;
  }, [quiz]);
  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);
  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);
  useEffect(() => {
    submittedRef.current = submitted;
  }, [submitted]);

  useEffect(() => {
    if (quizId)
      api.getQuiz(quizId).then((q) => {
        setQuiz(q || null);
        setLoading(false);
      });
  }, [quizId]);

  const handleSelectAnswer = (optionIndex: number) => {
    if (submitted) return;
    const q = quiz!.questions[currentQuestion];
    setSelectedAnswers((prev) => ({ ...prev, [q.id]: optionIndex }));
    selectedAnswersRef.current = {
      ...selectedAnswersRef.current,
      [q.id]: optionIndex,
    };
  };

  const handleTheoryAnswer = (value: string) => {
    if (submitted) return;
    const q = quiz!.questions[currentQuestion];
    setSelectedAnswers((prev) => ({ ...prev, [q.id]: value }));
    selectedAnswersRef.current = {
      ...selectedAnswersRef.current,
      [q.id]: value,
    };
  };

  const handleNext = () => {
    if (!quiz) return;
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setSubmitting(true);
    const gradable = quiz.questions.filter((q) => q.type !== "theory");
    let score = gradable.reduce(
      (acc, q) =>
        acc + (selectedAnswersRef.current[q.id] === q.correctAnswer ? 1 : 0),
      0,
    );
    let totalQuestions = gradable.length;
    let passed = gradable.length === 0 || score === gradable.length;
    let completedAt = new Date().toISOString();

    try {
      if (quizId) {
        const result = await api.submitQuiz(quizId, selectedAnswersRef.current);
        if (result) {
          score = result.score;
          totalQuestions = result.totalQuestions;
          passed = result.passed;
          completedAt = result.completedAt ?? completedAt;
          if (result.quiz) setQuiz(result.quiz);
        }
      }
    } catch (err: any) {
      toast({
        title: "Quiz saved locally",
        description:
          err.message ||
          "We could not reach the server, but your score was calculated here.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }

    if (courseId && quizId) {
      addQuizAttempt(courseId, {
        quizId,
        answers: selectedAnswersRef.current,
        score,
        totalQuestions,
        completedAt,
      });
      if (passed) completeCourse(courseId);
    }

    setSubmitted(true);

    toast({
      title: "Quiz Submitted!",
      description:
        totalQuestions > 0
          ? `You scored ${score}/${totalQuestions}`
          : "Your answers have been saved for review.",
    });
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    selectedAnswersRef.current = {};
    setCurrentQuestion(0);
    setSubmitted(false);
    // speak("Quiz restarted. Good luck!");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading quiz...
      </div>
    );
  if (!quiz)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Quiz not found
      </div>
    );

  const question = quiz.questions[currentQuestion];
  const totalQuestions = quiz.questions.length;
  const progressPct = submitted
    ? 100
    : Math.round((currentQuestion / totalQuestions) * 100);
  const gradableQuestions = quiz.questions.filter((q) => q.type !== "theory");
  const score = gradableQuestions.reduce(
    (acc, q) => acc + (selectedAnswers[q.id] === q.correctAnswer ? 1 : 0),
    0,
  );
  const hasGradableQuestions = gradableQuestions.length > 0;
  const scorePct = hasGradableQuestions
    ? Math.round((score / gradableQuestions.length) * 100)
    : 100;

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="h-14 border-b bg-card flex items-center px-4 gap-4">
          <Link
            to={`/learn/${courseId}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Back to course
          </Link>
        </header>
        <div className="container max-w-2xl py-12 space-y-8">
          <div className="text-center space-y-4">
            <div
              className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto ${
                !hasGradableQuestions || scorePct >= 80
                  ? "bg-yellow-400"
                  : "bg-muted"
              }`}
            >
              <Trophy
                className={`h-10 w-10 ${!hasGradableQuestions || scorePct >= 80 ? "text-black" : "text-muted-foreground"}`}
              />
            </div>
            <h1 className="text-3xl font-bold">
              {!hasGradableQuestions
                ? "Quiz Completed!"
                : scorePct >= 80
                  ? "Great Job! 🎉"
                  : "Keep Trying!"}
            </h1>
            {hasGradableQuestions ? (
              <p className="text-xl">
                Score:{" "}
                <strong>
                  {score}/{gradableQuestions.length}
                </strong>{" "}
                ({scorePct}%)
              </p>
            ) : (
              <p className="text-muted-foreground">
                Review your answers below.
              </p>
            )}
          </div>

          <div className="space-y-4">
            {quiz.questions.map((q, i) => {
              const userAnswer = selectedAnswers[q.id];

              if (q.type === "theory") {
                return (
                  <Card key={q.id}>
                    <CardContent className="p-4 space-y-3">
                      <p className="font-medium text-sm">
                        Q{i + 1}: {q.question}
                      </p>
                      <div className="text-sm p-3 rounded bg-muted">
                        <p className="text-xs text-muted-foreground mb-1">
                          Your answer:
                        </p>
                        <p className="whitespace-pre-wrap">
                          {typeof userAnswer === "string" && userAnswer.trim()
                            ? userAnswer
                            : "No answer provided"}
                        </p>
                      </div>
                      {q.sampleAnswer && (
                        <div className="text-sm p-3 rounded bg-yellow-50 border border-yellow-200">
                          <p className="text-xs font-medium text-yellow-700 mb-1">
                            Sample answer:
                          </p>
                          <p className="whitespace-pre-wrap text-yellow-800">
                            {q.sampleAnswer}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              }

              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <Card
                  key={q.id}
                  className={
                    isCorrect ? "border-yellow-300" : "border-destructive/30"
                  }
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          Q{i + 1}: {q.question}
                        </p>
                        <div className="mt-2 space-y-1">
                          {q.options.map((opt, oi) => (
                            <div
                              key={oi}
                              className={`text-sm p-2 rounded ${
                                oi === q.correctAnswer
                                  ? "bg-yellow-50 text-yellow-700 font-medium border border-yellow-200"
                                  : oi === userAnswer && !isCorrect
                                    ? "bg-destructive/10 text-destructive line-through"
                                    : "text-muted-foreground"
                              }`}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={handleRetake} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Retake Quiz
            </Button>
            <Link to={`/learn/${courseId}`}>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-0">
                Back to Course
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b bg-card flex items-center px-4 gap-4">
        <Link
          to={`/learn/${courseId}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Back to course
        </Link>
        <h1 className="text-sm font-medium truncate flex-1">{quiz.title}</h1>
        <div className="flex items-center gap-3">
          <Progress
            value={progressPct}
            className="w-24 h-2 [&>div]:bg-yellow-400"
          />
          <span className="text-xs text-muted-foreground">
            {currentQuestion + 1}/{totalQuestions}
          </span>
        </div>
      </header>

      <div className="container max-w-2xl py-12">
        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">
                Question {currentQuestion + 1} of {totalQuestions}
              </p>
              <h2 className="text-xl font-bold">{question.question}</h2>
            </div>

            {question.type === "theory" ? (
              <Textarea
                value={
                  typeof selectedAnswers[question.id] === "string"
                    ? (selectedAnswers[question.id] as string)
                    : ""
                }
                onChange={(e) => handleTheoryAnswer(e.target.value)}
                placeholder="Type your answer..."
                rows={6}
              />
            ) : (
              <div className="space-y-3">
                {question.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectAnswer(i)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all text-sm ${
                      selectedAnswers[question.id] === i
                        ? "border-yellow-400 bg-yellow-50 font-medium"
                        : "border-border hover:border-yellow-300"
                    }`}
                  >
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full border mr-3 text-xs font-medium">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
              >
                Previous
              </Button>
              {currentQuestion < totalQuestions - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!isAnswered(question, selectedAnswers)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-0"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={
                    submitting ||
                    quiz.questions.some((q) => !isAnswered(q, selectedAnswers))
                  }
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-0"
                >
                  {submitting ? "Submitting..." : "Submit Quiz"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;

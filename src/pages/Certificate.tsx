import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Download, Loader2, ArrowLeft } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import Certificate from "@/components/certificate/Certificate";
import { downloadCertificatePdf, downloadCertificateImage } from "@/components/certificate/downloadCertificate";
import { useAuthStore } from "@/stores/authStore";
import { useEnrollmentStore } from "@/stores/enrollmentStore";
import { certificatesApi, type CertificateRecord } from "@/api/certificates";

const formatDate = (iso?: string) =>
  new Date(iso ?? Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const CertificatePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const user = useAuthStore((s) => s.user);
  const { getEnrolledCourse } = useEnrollmentStore();
  const [certificate, setCertificate] = useState<CertificateRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingImage, setDownloadingImage] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const enrollment = courseId ? getEnrolledCourse(courseId) : undefined;
  const isCompleted = Boolean(enrollment?.isCompleted);

  useEffect(() => {
    if (!courseId || !isCompleted) {
      setLoading(false);
      return;
    }
    setLoading(true);
    certificatesApi
      .issue(courseId)
      .then(setCertificate)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseId, isCompleted]);

  const handleDownloadPdf = async () => {
    if (!certRef.current || !certificate) return;
    setDownloadingPdf(true);
    try {
      await downloadCertificatePdf(
        certRef.current,
        `${certificate.courseName.replace(/[^a-z0-9]+/gi, "-")}-certificate.pdf`,
      );
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!certRef.current || !certificate) return;
    setDownloadingImage(true);
    try {
      await downloadCertificateImage(
        certRef.current,
        `${certificate.courseName.replace(/[^a-z0-9]+/gi, "-")}-certificate.png`,
      );
    } finally {
      setDownloadingImage(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-20 text-center text-muted-foreground">Loading...</div>
      </MainLayout>
    );
  }

  if (!user || !isCompleted || error || !certificate) {
    return (
      <MainLayout>
        <div className="container py-20 text-center space-y-4">
          <h3 className="text-xl font-semibold">Certificate not available</h3>
          <p className="text-muted-foreground">
            {error ?? "You need to complete this course before your certificate is ready."}
          </p>
          <Link to="/my-learning">
            <Button className="gradient-primary border-0 text-white">Back to My Learning</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const verifyUrl = `${window.location.origin}/verify-certificate/${certificate.certificateId}`;

  return (
    <MainLayout>
      <div className="container py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link
            to="/my-learning"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to My Learning
          </Link>
          <div className="flex gap-2">
            <Button onClick={handleDownloadImage} disabled={downloadingImage} variant="outline" className="gap-2">
              {downloadingImage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Save as Image
            </Button>
            <Button onClick={handleDownloadPdf} disabled={downloadingPdf} className="gap-2">
              {downloadingPdf ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Save as PDF
            </Button>
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-lg border bg-muted/30 p-6 flex justify-center">
          <Certificate
            ref={certRef}
            studentName={certificate.studentName}
            courseName={certificate.courseName}
            completionDate={formatDate(certificate.issuedAt)}
            instructorName={certificate.instructorName ?? undefined}
            certificateId={certificate.certificateId}
            verifyUrl={verifyUrl}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default CertificatePage;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, ShieldX, Search, Loader2 } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { certificatesApi, type VerifyCertificateResult } from "@/api/certificates";

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

const VerifyCertificate = () => {
  const { certificateId: paramId } = useParams<{ certificateId?: string }>();
  const navigate = useNavigate();
  const [input, setInput] = useState(paramId ?? "");
  const [result, setResult] = useState<VerifyCertificateResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runLookup = (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setResult(null);
    certificatesApi
      .verify(id.trim())
      .then(setResult)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (paramId) runLookup(paramId);
  }, [paramId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    navigate(`/verify-certificate/${encodeURIComponent(input.trim())}`);
    runLookup(input);
  };

  return (
    <MainLayout>
      <div className="container py-16 max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Verify a Certificate</h1>
          <p className="text-muted-foreground">
            Enter the certificate ID printed on a School of Events Africa certificate to confirm it's genuine.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="e.g. DWS-A1B2C3D4"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="uppercase"
          />
          <Button type="submit" disabled={loading || !input.trim()} className="gap-2 shrink-0">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Verify
          </Button>
        </form>

        {result && (
          <Card
            className={
              result.valid
                ? "border-emerald-300 bg-emerald-50/50"
                : "border-destructive/40 bg-destructive/5"
            }
          >
            <CardContent className="p-6 space-y-4">
              {result.valid ? (
                <>
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <ShieldCheck className="h-5 w-5" />
                    Valid certificate
                  </div>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Student</dt>
                      <dd className="font-medium">{result.studentName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Course</dt>
                      <dd className="font-medium">{result.courseName}</dd>
                    </div>
                    {result.instructorName && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Instructor</dt>
                        <dd className="font-medium">{result.instructorName}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Issued</dt>
                      <dd className="font-medium">{formatDate(result.issuedAt)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Certificate ID</dt>
                      <dd className="font-mono font-medium">{result.certificateId}</dd>
                    </div>
                  </dl>
                </>
              ) : (
                <div className="flex items-center gap-2 text-destructive font-semibold">
                  <ShieldX className="h-5 w-5" />
                  This certificate ID could not be found
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default VerifyCertificate;

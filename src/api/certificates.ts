import { authHeaders as sessionAuthHeaders } from "@/lib/session";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const authHeaders = () => ({
  "Content-Type": "application/json",
  ...sessionAuthHeaders(),
});

export interface CertificateRecord {
  id: string;
  certificateId: string;
  userId: string;
  courseId: string;
  studentName: string;
  courseName: string;
  instructorName: string | null;
  issuedAt: string;
}

export interface VerifyCertificateResult {
  valid: boolean;
  certificateId?: string;
  studentName?: string;
  courseName?: string;
  instructorName?: string | null;
  issuedAt?: string;
  error?: string;
}

async function parseOrThrow<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data as T;
}

export const certificatesApi = {
  issue: async (courseId: string): Promise<CertificateRecord> => {
    const res = await fetch(`${API_URL}/api/certificates/issue`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ courseId }),
    });
    return parseOrThrow<CertificateRecord>(res);
  },

  getMine: async (courseId: string): Promise<CertificateRecord | null> => {
    const res = await fetch(`${API_URL}/api/certificates/mine/${courseId}`, {
      headers: authHeaders(),
    });
    if (res.status === 404) return null;
    return parseOrThrow<CertificateRecord>(res);
  },

  verify: async (certificateId: string): Promise<VerifyCertificateResult> => {
    const res = await fetch(
      `${API_URL}/api/certificates/verify/${encodeURIComponent(certificateId)}`,
    );
    const data = await res.json().catch(() => ({}));
    return data as VerifyCertificateResult;
  },
};

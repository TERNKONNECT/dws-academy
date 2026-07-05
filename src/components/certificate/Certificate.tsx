import { forwardRef } from "react";
import { GraduationCap } from "lucide-react";

export interface CertificateProps {
  studentName: string;
  courseName: string;
  completionDate: string; // already formatted, e.g. "July 5, 2026"
  instructorName?: string;
  certificateId?: string;
  verifyUrl?: string;
}

// Fixed landscape pixel size (matches A4 landscape ratio at 96dpi) so html2canvas
// captures a consistent, predictable layout regardless of the viewport it's rendered in.
const WIDTH = 1123;
const HEIGHT = 794;

const Certificate = forwardRef<HTMLDivElement, CertificateProps>(
  ({ studentName, courseName, completionDate, instructorName, certificateId, verifyUrl }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: WIDTH,
          height: HEIGHT,
          background: "#ffffff",
          fontFamily: "Georgia, 'Times New Roman', serif",
          color: "#1a1a1a",
          position: "relative",
          padding: 28,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "2px solid #d4af37",
            boxSizing: "border-box",
            padding: "36px 64px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 10,
              border: "1px solid #d4af37",
              pointerEvents: "none",
            }}
          />

          <div style={{ textAlign: "center", marginTop: 8 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "#facc15",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <GraduationCap size={20} color="#111111" />
              </div>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: 3,
                  color: "#111111",
                }}
              >
                DWS ACADEMY
              </span>
            </div>
            <p
              style={{
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: 6,
                textTransform: "uppercase",
                margin: "18px 0 4px",
                color: "#111111",
              }}
            >
              Certificate of Completion
            </p>
            <p style={{ fontSize: 14, color: "#666666", letterSpacing: 1 }}>
              This certificate is proudly presented to
            </p>
          </div>

          <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p
              style={{
                fontSize: 52,
                fontStyle: "italic",
                fontWeight: 400,
                margin: 0,
                color: "#111111",
                borderBottom: "1px solid #d4af37",
                paddingBottom: 12,
                display: "inline-block",
              }}
            >
              {studentName}
            </p>
            <p style={{ fontSize: 15, color: "#444444", marginTop: 22 }}>
              for successfully completing the course
            </p>
            <p
              style={{
                fontSize: 26,
                fontWeight: 700,
                margin: "8px 0 0",
                color: "#111111",
              }}
            >
              {courseName}
            </p>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <div style={{ textAlign: "center", minWidth: 180 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  borderTop: "1px solid #999999",
                  paddingTop: 6,
                }}
              >
                {completionDate}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#888888", letterSpacing: 1 }}>
                DATE
              </p>
            </div>

            {certificateId && (
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 11, color: "#aaaaaa", letterSpacing: 1 }}>
                  Certificate ID: {certificateId}
                </p>
                {verifyUrl && (
                  <p style={{ margin: "4px 0 0", fontSize: 10, color: "#bbbbbb" }}>
                    Verify at {verifyUrl}
                  </p>
                )}
              </div>
            )}

            <div style={{ textAlign: "center", minWidth: 180 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontStyle: "italic",
                  borderTop: "1px solid #999999",
                  paddingTop: 6,
                }}
              >
                {instructorName ?? "DWS Academy"}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#888888", letterSpacing: 1 }}>
                INSTRUCTOR
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

Certificate.displayName = "Certificate";

export default Certificate;

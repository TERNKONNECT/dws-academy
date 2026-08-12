import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Captures the rendered certificate DOM node as an image and drops it into a
// landscape PDF page sized to exactly match the image, so there's no distortion
// or awkward margins — the page *is* the certificate.
export async function downloadCertificatePdf(node: HTMLElement, filename: string) {
  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(filename);
}

export async function downloadCertificateImage(node: HTMLElement, filename: string) {
  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

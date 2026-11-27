import QRCode from "qrcode";

export interface UpiPaymentDetails {
  upiId: string;
  payeeName: string;
  amount?: number;
  transactionNote?: string;
  invoiceNumber?: string;
}

/**
 * Builds standard NPCI UPI URI string.
 * Example: upi://pay?pa=apenerfy@sbi&pn=AP%20Enerfy%20Solar&am=125000.00&cu=INR&tn=Invoice%20INV-2025-0145
 */
export function buildUpiUri(details: UpiPaymentDetails): string {
  const { upiId, payeeName, amount, transactionNote, invoiceNumber } = details;
  const cleanUpi = upiId.trim();
  const encodedName = encodeURIComponent(payeeName.trim());
  const note = transactionNote || (invoiceNumber ? `Invoice ${invoiceNumber}` : "Solar Invoice Payment");
  const encodedNote = encodeURIComponent(note);

  let uri = `upi://pay?pa=${cleanUpi}&pn=${encodedName}&cu=INR&tn=${encodedNote}`;
  if (typeof amount === "number" && amount > 0) {
    uri += `&am=${amount.toFixed(2)}`;
  }

  return uri;
}

/**
 * Generates dynamic high-contrast base64 Data URL for UPI QR code.
 */
export async function generatePaymentQrCode(details: UpiPaymentDetails): Promise<string> {
  const upiUri = buildUpiUri(details);
  try {
    const dataUrl = await QRCode.toDataURL(upiUri, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 256,
      color: {
        dark: "#145C32", // Dark forest green matching brand
        light: "#FFFFFF",
      },
    });
    return dataUrl;
  } catch (err) {
    console.error("Failed to generate UPI QR code:", err);
    return "";
  }
}

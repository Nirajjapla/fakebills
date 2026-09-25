import QRCode from 'qrcode';

export interface UpiPaymentParams {
  payeeAddress: string; // VPA e.g. airtel.pay@axisbank or custom UPI ID
  payeeName: string;    // e.g. Bharti Airtel Ltd
  amount?: number;      // e.g. 706.82
  transactionNote?: string; // e.g. Bill payment 946841495
  currency?: string;    // default INR
}

/**
 * Builds standard UPI deep link URI string
 */
export function buildUpiUri(params: UpiPaymentParams): string {
  const { payeeAddress, payeeName, amount, transactionNote, currency = 'INR' } = params;
  const encodedPa = encodeURIComponent(payeeAddress.trim());
  const encodedPn = encodeURIComponent(payeeName.trim());
  
  let uri = `upi://pay?pa=${encodedPa}&pn=${encodedPn}&cu=${currency}`;
  
  if (amount !== undefined && !isNaN(amount) && amount > 0) {
    uri += `&am=${amount.toFixed(2)}`;
  }
  
  if (transactionNote) {
    uri += `&tn=${encodeURIComponent(transactionNote.trim())}`;
  }
  
  return uri;
}

/**
 * Generates Base64 Data URL for QR Code
 */
export async function generateQrDataUrl(
  text: string, 
  options: {
    width?: number;
    margin?: number;
    color?: { dark: string; light: string };
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  } = {}
): Promise<string> {
  const defaultOptions: QRCode.QRCodeToDataURLOptions = {
    width: options.width || 200,
    margin: options.margin !== undefined ? options.margin : 1,
    errorCorrectionLevel: options.errorCorrectionLevel || 'M',
    color: {
      dark: options.color?.dark || '#000000',
      light: options.color?.light || '#ffffff',
    },
  };

  try {
    return await QRCode.toDataURL(text || 'https://billing.portal.in', defaultOptions);
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
}

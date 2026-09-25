/**
 * Convert numerical amount to Indian English Currency Words
 * Example: 706.82 -> "Seven Hundred Six Rupees and Eighty Two Paise Only"
 * Example: 2000 -> "Two Thousand Rupees Only"
 * Example: 15420.50 -> "Fifteen Thousand Four Hundred Twenty Rupees and Fifty Paise Only"
 */

const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertLessThanThousand(num: number): string {
  if (num === 0) return '';
  
  let result = '';
  
  if (num >= 100) {
    result += ones[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }
  
  if (num > 0) {
    if (num < 20) {
      result += ones[num] + ' ';
    } else {
      result += tens[Math.floor(num / 10)] + ' ';
      if (num % 10 > 0) {
        result += ones[num % 10] + ' ';
      }
    }
  }
  
  return result.trim();
}

export function numberToIndianWords(amount: number, currency: string = 'Rupees'): string {
  if (amount === 0) return `Zero ${currency} Only`;
  if (isNaN(amount)) return '';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const wholePart = Math.floor(absAmount);
  const decimalPart = Math.round((absAmount - wholePart) * 100);

  if (wholePart === 0 && decimalPart === 0) {
    return `Zero ${currency} Only`;
  }

  let words = '';

  // Crores (1,00,00,000)
  const crore = Math.floor(wholePart / 10000000);
  let remainder = wholePart % 10000000;

  // Lakhs (1,00,000)
  const lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;

  // Thousands (1,000)
  const thousand = Math.floor(remainder / 1000);
  const hundredAndBelow = remainder % 1000;

  if (crore > 0) {
    words += convertLessThanThousand(crore) + ' Crore ';
  }

  if (lakh > 0) {
    words += convertLessThanThousand(lakh) + ' Lakh ';
  }

  if (thousand > 0) {
    words += convertLessThanThousand(thousand) + ' Thousand ';
  }

  if (hundredAndBelow > 0) {
    words += convertLessThanThousand(hundredAndBelow) + ' ';
  }

  words = words.trim();

  let result = (isNegative ? 'Minus ' : '') + words + ` ${currency}`;

  if (decimalPart > 0) {
    const paiseWords = convertLessThanThousand(decimalPart);
    result += ` and ${paiseWords} Paise`;
  }

  return result.trim() + ' Only';
}

export function formatINR(val: number, decimals: number = 2): string {
  if (isNaN(val)) return '0.00';
  return val.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

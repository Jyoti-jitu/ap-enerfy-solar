/**
 * Converts a financial numeric amount (INR) into formal Indian words.
 * Handles Crores, Lakhs, Thousands, Hundreds, Units, and Paise with decimal safety.
 *
 * Example: 125000 -> "Indian Rupees One Lakh Twenty-Five Thousand Only"
 * Example: 2480500.50 -> "Indian Rupees Twenty-Four Lakh Eighty Thousand Five Hundred and Fifty Paise Only"
 */

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];

const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

function twoDigits(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  const ten = Math.floor(n / 10);
  const one = n % 10;
  return TENS[ten] + (one ? `-${ONES[one]}` : "");
}

function threeDigits(n: number): string {
  if (n === 0) return "";
  const hundred = Math.floor(n / 100);
  const rest = n % 100;
  const hStr = hundred ? `${ONES[hundred]} Hundred` : "";
  const rStr = twoDigits(rest);
  if (hStr && rStr) return `${hStr} and ${rStr}`;
  return hStr || rStr;
}

export function amountInWords(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num) || num === 0) {
    return "Indian Rupees Zero Only";
  }

  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const integerPart = Math.floor(absNum);
  const paisePart = Math.round((absNum - integerPart) * 100);

  // Indian numbering: Crores (10,000,000), Lakhs (100,000), Thousands (1,000), Hundreds (100)
  const crore = Math.floor(integerPart / 10000000);
  let rem = integerPart % 10000000;

  const lakh = Math.floor(rem / 100000);
  rem = rem % 100000;

  const thousand = Math.floor(rem / 1000);
  rem = rem % 1000;

  const hundredPart = rem;

  const parts: string[] = [];

  if (crore > 0) {
    parts.push(`${threeDigits(crore)} Crore`);
  }
  if (lakh > 0) {
    parts.push(`${twoDigits(lakh)} Lakh`);
  }
  if (thousand > 0) {
    parts.push(`${twoDigits(thousand)} Thousand`);
  }
  if (hundredPart > 0) {
    parts.push(threeDigits(hundredPart));
  }

  const rupeesStr = parts.join(" ") || "Zero";
  let result = `Indian Rupees ${rupeesStr}`;

  if (paisePart > 0) {
    result += ` and ${twoDigits(paisePart)} Paise`;
  }

  result += " Only";

  return isNegative ? `Minus ${result}` : result;
}

import { BillType } from '../types';

const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_NAMES_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Format a Date object or ISO string (YYYY-MM-DD) into desired format
 */
export function formatDateStr(
  isoDateStr: string,
  style: 'DD/MM/YYYY' | 'DD-MMM-YYYY' | 'DD MMM YYYY' | 'DD-MM-YYYY' = 'DD/MM/YYYY'
): string {
  if (!isoDateStr) return '';
  
  // If already in DD/MM/YYYY format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(isoDateStr)) {
    if (style === 'DD/MM/YYYY') return isoDateStr;
    const [d, m, y] = isoDateStr.split('/');
    const monthIdx = parseInt(m, 10) - 1;
    const monthName = MONTH_NAMES_SHORT[monthIdx] || 'Jan';
    if (style === 'DD-MMM-YYYY') return `${d}-${monthName}-${y}`;
    if (style === 'DD MMM YYYY') return `${d} ${monthName} ${y}`;
    return `${d}-${m}-${y}`;
  }

  const dObj = new Date(isoDateStr);
  if (isNaN(dObj.getTime())) return isoDateStr;

  const day = String(dObj.getDate()).padStart(2, '0');
  const monthNum = String(dObj.getMonth() + 1).padStart(2, '0');
  const monthName = MONTH_NAMES_SHORT[dObj.getMonth()];
  const year = dObj.getFullYear();

  switch (style) {
    case 'DD-MMM-YYYY':
      return `${day}-${monthName}-${year}`;
    case 'DD MMM YYYY':
      return `${day} ${monthName} ${year}`;
    case 'DD-MM-YYYY':
      return `${day}-${monthNum}-${year}`;
    case 'DD/MM/YYYY':
    default:
      return `${day}/${monthNum}/${year}`;
  }
}

/**
 * Convert DD/MM/YYYY or DD-MMM-YYYY to YYYY-MM-DD for standard HTML date input
 */
export function toIsoDateInput(dateStr: string): string {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [d, m, y] = dateStr.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  if (/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(dateStr)) {
    const [d, mStr, y] = dateStr.split('-');
    const mIdx = MONTH_NAMES_SHORT.findIndex(
      m => m.toLowerCase() === mStr.toLowerCase()
    );
    const m = mIdx >= 0 ? String(mIdx + 1).padStart(2, '0') : '01';
    return `${y}-${m}-${d.padStart(2, '0')}`;
  }

  // Handle "26 May 2024" or "01 Apr 2024"
  if (/^\d{1,2}\s+[A-Za-z]{3,}\s+\d{4}$/.test(dateStr.trim())) {
    const [d, mStr, y] = dateStr.trim().split(/\s+/);
    const mIdx = MONTH_NAMES_SHORT.findIndex(
      m => m.toLowerCase() === mStr.slice(0, 3).toLowerCase()
    );
    const m = mIdx >= 0 ? String(mIdx + 1).padStart(2, '0') : '01';
    return `${y}-${m}-${d.padStart(2, '0')}`;
  }

  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }

  return '';
}

/**
 * Extract active ISO dates from any bill data model
 */
export function extractBillDates(billType: BillType, billData: any) {
  let fromIso = '';
  let toIso = '';
  let issueIso = '';
  let dueIso = '';

  // Extract issue / transaction date
  if (billData.statementDate) issueIso = toIsoDateInput(billData.statementDate);
  else if (billData.billDate) issueIso = toIsoDateInput(billData.billDate);
  else if (billData.invoiceDate) issueIso = toIsoDateInput(String(billData.invoiceDate).split(' ')[0]);
  else if (billData.receiptDate) issueIso = toIsoDateInput(billData.receiptDate);
  else if (billData.date) issueIso = toIsoDateInput(billData.date);
  else if (billData.tripDate) issueIso = toIsoDateInput(billData.tripDate);

  // Extract due / pay-by date
  if (billData.dueDate) dueIso = toIsoDateInput(billData.dueDate);
  else if (billData.payByDate) dueIso = toIsoDateInput(billData.payByDate);

  // Extract from & to range
  if (billData.periodFrom && billData.periodTo) {
    fromIso = toIsoDateInput(billData.periodFrom);
    toIso = toIsoDateInput(billData.periodTo);
  } else if (billData.startDate && billData.endDate) {
    fromIso = toIsoDateInput(billData.startDate);
    toIso = toIsoDateInput(billData.endDate);
  } else if (billData.statementPeriod) {
    const parts = billData.statementPeriod.split(/\s*[-–]\s*/);
    if (parts.length === 2) {
      fromIso = toIsoDateInput(parts[0]);
      toIso = toIsoDateInput(parts[1]);
    }
  } else if (billData.billPeriod || billData.usagePeriod) {
    const raw = billData.billPeriod || billData.usagePeriod;
    const parts = raw.split(/\s+to\s+|\s*[-–]\s*/i);
    if (parts.length === 2) {
      fromIso = toIsoDateInput(parts[0]);
      toIso = toIsoDateInput(parts[1]);
    }
  } else if (billData.orderDate) {
    fromIso = toIsoDateInput(billData.orderDate);
    toIso = issueIso || fromIso;
  } else {
    fromIso = issueIso;
    toIso = issueIso;
  }

  // Fallback defaults
  const presets = getDateRangePresets();
  if (!fromIso) fromIso = presets.currentMonth.from;
  if (!toIso) toIso = presets.currentMonth.to;
  if (!issueIso) issueIso = toIso;

  return { fromIso, toIso, issueIso, dueIso };
}

function formatLocalIso(year: number, month1Based: number, day: number): string {
  return `${year}-${String(month1Based).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Pre-configured presets
 */
export function getDateRangePresets() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed (0 = Jan, 11 = Dec)

  // 1. Current Month (01 to end of current month)
  const curEndDayNum = new Date(currentYear, currentMonth + 1, 0).getDate();
  const curFrom = formatLocalIso(currentYear, currentMonth + 1, 1);
  const curTo = formatLocalIso(currentYear, currentMonth + 1, curEndDayNum);

  // 2. Last Month (01 to end of previous month)
  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const lastYear = lastMonthDate.getFullYear();
  const lastMonth = lastMonthDate.getMonth();
  const lastEndDayNum = new Date(lastYear, lastMonth + 1, 0).getDate();
  const lastFrom = formatLocalIso(lastYear, lastMonth + 1, 1);
  const lastTo = formatLocalIso(lastYear, lastMonth + 1, lastEndDayNum);

  // 3. Current Quarter (3 Months)
  const qMonthStart = Math.floor(currentMonth / 3) * 3;
  const qEndMonth = qMonthStart + 2;
  const qEndDayNum = new Date(currentYear, qEndMonth + 1, 0).getDate();
  const qFrom = formatLocalIso(currentYear, qMonthStart + 1, 1);
  const qTo = formatLocalIso(currentYear, qEndMonth + 1, qEndDayNum);

  // 4. Financial Year (01 April to 31 March)
  const fyStartYear = currentMonth >= 3 ? currentYear : currentYear - 1;
  const fyFrom = formatLocalIso(fyStartYear, 4, 1);
  const fyTo = formatLocalIso(fyStartYear + 1, 3, 31);

  return {
    currentMonth: {
      from: curFrom,
      to: curTo,
      label: `${MONTH_NAMES_FULL[currentMonth]} ${currentYear}`,
    },
    lastMonth: {
      from: lastFrom,
      to: lastTo,
      label: `${MONTH_NAMES_FULL[lastMonth]} ${lastYear}`,
    },
    quarter: {
      from: qFrom,
      to: qTo,
      label: `Q${Math.floor(currentMonth / 3) + 1} (${MONTH_NAMES_SHORT[qMonthStart]}-${MONTH_NAMES_SHORT[qEndMonth]} ${currentYear})`,
    },
    financialYear: {
      from: fyFrom,
      to: fyTo,
      label: `FY ${fyStartYear}-${String(fyStartYear + 1).slice(2)}`,
    },
  };
}

/**
 * Universally apply a Date Range to ANY bill template data model
 */
export function applyDateRangeToBill(
  billType: BillType,
  currentData: any,
  fromIso: string,
  toIso: string,
  issueIso?: string,
  dueIso?: string
): any {
  const nextData = { ...currentData };

  const fromSlash = formatDateStr(fromIso, 'DD/MM/YYYY');
  const toSlash = formatDateStr(toIso, 'DD/MM/YYYY');
  const fromSpace = formatDateStr(fromIso, 'DD MMM YYYY');
  const toSpace = formatDateStr(toIso, 'DD MMM YYYY');
  const fromDash = formatDateStr(fromIso, 'DD-MMM-YYYY');
  const toDash = formatDateStr(toIso, 'DD-MMM-YYYY');

  // Month & Year labels
  const fromDateObj = new Date(fromIso);
  const monthName = !isNaN(fromDateObj.getTime())
    ? MONTH_NAMES_FULL[fromDateObj.getMonth()]
    : 'June';
  const yearNum = !isNaN(fromDateObj.getTime())
    ? fromDateObj.getFullYear()
    : 2024;
  const monthYearLabel = `${monthName} ${yearNum}`;

  // Calculated or user-provided Issue / Bill Date
  const issueDateSlash = issueIso ? formatDateStr(issueIso, 'DD/MM/YYYY') : toSlash;
  const issueDateSpace = issueIso ? formatDateStr(issueIso, 'DD MMM YYYY') : toSpace;
  const issueDateDash = issueIso ? formatDateStr(issueIso, 'DD-MMM-YYYY') : toDash;

  // Calculated or user-provided Due Date (default 10 days after bill date)
  let defaultDueDateObj = new Date(toIso);
  if (!isNaN(defaultDueDateObj.getTime())) {
    defaultDueDateObj.setDate(defaultDueDateObj.getDate() + 10);
  } else {
    defaultDueDateObj = new Date();
  }
  const dueDateSlash = dueIso ? formatDateStr(dueIso, 'DD/MM/YYYY') : formatDateStr(defaultDueDateObj.toISOString().split('T')[0], 'DD/MM/YYYY');
  const dueDateSpace = dueIso ? formatDateStr(dueIso, 'DD MMM YYYY') : formatDateStr(defaultDueDateObj.toISOString().split('T')[0], 'DD MMM YYYY');
  const dueDateDash = dueIso ? formatDateStr(dueIso, 'DD-MMM-YYYY') : formatDateStr(defaultDueDateObj.toISOString().split('T')[0], 'DD-MMM-YYYY');

  switch (billType) {
    case 'fuel_thermal':
      nextData.date = toSlash;
      break;

    case 'airtel_statement':
      nextData.statementPeriod = `${fromSpace} - ${toSpace}`;
      nextData.statementDate = issueDateSpace;
      nextData.dueDate = dueDateSpace;
      break;

    case 'airtel_mobile_tax':
      nextData.billPeriod = `${fromDash} to ${toDash}`;
      nextData.billDate = issueDateDash;
      nextData.payByDate = dueDateDash;
      break;

    case 'bsnl_broadband':
      nextData.usagePeriod = `${fromSlash} to ${toSlash}`;
      nextData.invoiceDate = issueDateSlash;
      nextData.dueDate = dueDateDash;
      break;

    case 'jio_fiber':
      nextData.invoiceDate = `${issueDateSpace} 10:14:11`;
      nextData.digitalSignDate = `${toIso.replace(/-/g, '.')} 11:05:38`;
      break;

    case 'gym_membership':
      nextData.startDate = fromSlash;
      nextData.endDate = toSlash;
      nextData.invoiceDate = issueDateSlash;
      break;

    case 'rent_receipt':
      nextData.periodFrom = fromSlash;
      nextData.periodTo = toSlash;
      nextData.rentMonthYear = monthYearLabel;
      nextData.receiptDate = issueDateSlash;
      break;

    case 'electricity_bill':
      nextData.billPeriod = `${fromSlash} to ${toSlash}`;
      nextData.billDate = issueDateSlash;
      nextData.dueDate = dueDateSlash;
      break;

    case 'restaurant_pos':
      nextData.date = toSlash;
      break;

    case 'supermarket_mart':
      nextData.date = toSlash;
      break;

    case 'medical_pharmacy':
      nextData.date = toSlash;
      break;

    case 'ecommerce_retail':
      nextData.orderDate = fromSlash;
      nextData.invoiceDate = issueDateSlash;
      break;

    case 'cab_ride':
      nextData.tripDate = toSlash;
      break;

    case 'freelance_invoice':
      nextData.invoiceDate = issueDateSlash;
      nextData.dueDate = dueDateSlash;
      nextData.notes = `Invoice for professional deliverables for the period ${fromSpace} to ${toSpace}. Thank you for your business!`;
      break;

    default:
      nextData.date = toSlash;
  }

  return nextData;
}

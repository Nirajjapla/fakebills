export type BillCategory = 
  | 'telecom' 
  | 'fuel' 
  | 'fitness' 
  | 'housing' 
  | 'utility' 
  | 'dining' 
  | 'retail' 
  | 'healthcare' 
  | 'travel' 
  | 'freelance';

export type BillType =
  | 'airtel_statement'
  | 'airtel_mobile_tax'
  | 'bsnl_broadband'
  | 'jio_fiber'
  | 'fuel_thermal'
  | 'gym_membership'
  | 'rent_receipt'
  | 'electricity_bill'
  | 'restaurant_pos'
  | 'supermarket_mart'
  | 'medical_pharmacy'
  | 'ecommerce_retail'
  | 'cab_ride'
  | 'freelance_invoice';

export type BillingCycle = 'monthly' | 'yearly';

export interface AddressProfile {
  id: string;
  label: string; // e.g. "Home Address", "Office HQ", "Landlord Ramesh"
  category: 'personal' | 'business' | 'landlord' | 'client' | 'vendor';
  fullName: string;
  companyName?: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email?: string;
  gstin?: string;
  pan?: string;
}

export interface LineItem {
  id: string;
  description: string;
  hsnSac?: string;
  qty: number;
  rate: number;
  discount?: number;
  taxRate?: number; // e.g. 18 for 18%
  amount: number;
}

export interface FuelBillData {
  brand: 'HP' | 'IOCL' | 'BPCL' | 'SHELL' | 'NAYARA';
  dealerName: string;
  dealerSub: string;
  location: string;
  cityPincode: string;
  billNo: string;
  trnsId: string;
  atndId: string;
  receiptType: string;
  vehiNo: string;
  mobNo: string;
  date: string;
  time: string;
  fpId: string;
  nozlNo: string;
  fuelType: 'PETROL' | 'DIESEL' | 'CNG' | 'POWER PETROL';
  density: string;
  rate: number;
  amount: number;
  volume: number; // auto-calculated: amount / rate
  paymentMode: string;
  footerNote: string;
  customLogoUrl?: string;
  billingCycle?: BillingCycle;
  upiId?: string;
}

export interface AirtelStatementData {
  customerName: string;
  addressLine1: string;
  addressLine2: string;
  cityStatePin: string;
  email: string;
  phone: string;
  mobileNumber: string;
  planName: string;
  statementDate: string;
  statementPeriod: string;
  totalAmountPayable: number;
  dueDate: string;
  amountAfterDueDate: number;
  upiId: string;
  lastBillAmount: number;
  paymentMade: number;
  credits: number;
  thisMonthCharges: number;
  planCharges: number;
  otherCharges: number;
  gstAmount: number;
  billingCycle?: BillingCycle;
  customLogoUrl?: string;
  accountHistory: Array<{
    month: string;
    previousDues: number;
    payments: number;
    credits: number;
    thisMonthCharges: number;
    amountPayable: number;
  }>;
}

export interface AirtelMobileInvoiceData {
  recipientName: string;
  addressLine1: string;
  addressLine2: string;
  cityPin: string;
  landmark: string;
  mobileNumber: string;
  relationshipNumber: string;
  billNumber: string;
  billDate: string;
  billPeriod: string;
  payByDate: string;
  creditLimit: number;
  securityDeposit: number;
  previousBalance: number;
  payments: number;
  adjustments: number;
  monthlyRentals: number;
  usageCharges: number;
  oneTimeCharges: number;
  lateFee: number;
  taxesGst: number;
  amountDue: number;
  amountDueAfterDate: number;
  upiId: string;
  gstin: string;
  pan: string;
  billingCycle?: BillingCycle;
  customLogoUrl?: string;
}

export interface BSNLBroadbandData {
  customerName: string;
  addressLine1: string;
  addressLine2: string;
  cityStatePin: string;
  accountNo: string;
  invoiceNo: string;
  invoiceDate: string;
  usagePeriod: string;
  telephoneNumber: string;
  tariffPlan: string;
  dueDate: string;
  amountPayable: number;
  previousBalance: number;
  paymentReceived: number;
  adjustments: number;
  currentCharges: number;
  recurringCharges: number;
  oneTimeCharges: number;
  usageCharges: number;
  miscCharges: number;
  discount: number;
  taxableValue: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  totalCurrentCharges: number;
  billingCycle?: BillingCycle;
  customLogoUrl?: string;
  usageHistory: Array<{
    month: string;
    dataGb: number;
    voiceMin: number;
  }>;
  upiId: string;
}

export interface JioFiberData {
  companyName: string;
  companyAddress: string;
  cin: string;
  pan: string;
  gstin: string;
  invoiceNo: string;
  invoiceDate: string;
  orderRefNo: string;
  customerName: string;
  customerAddress: string;
  jioNumber: string;
  placeOfSupply: string;
  planName: string;
  hsnSac: string;
  planPrice: number;
  discount: number;
  taxableAmount: number;
  cgstPercent: number;
  cgstAmount: number;
  sgstPercent: number;
  sgstAmount: number;
  totalAmount: number;
  digitalSignDate: string;
  billingCycle?: BillingCycle;
  customLogoUrl?: string;
  upiId: string;
}

export interface GymMembershipData {
  gymName: string;
  tagline: string;
  gymAddress: string;
  gymGstin: string;
  gymPhone: string;
  gymEmail: string;
  invoiceNo: string;
  invoiceDate: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  memberEmail: string;
  memberAddress: string;
  planName: string; // e.g. "Annual Elite Pro Membership"
  durationMonths: number;
  startDate: string;
  endDate: string;
  membershipFee: number;
  personalTrainerFee: number;
  trainerName: string;
  lockerFee: number;
  admissionFee: number;
  discount: number;
  gstPercent: number;
  paymentMode: string;
  trainerAssigned: string;
  terms: string[];
  billingCycle?: BillingCycle;
  customLogoUrl?: string;
  upiId: string;
}

export interface RentReceiptData {
  receiptNo: string;
  receiptDate: string;
  tenantName: string;
  landlordName: string;
  landlordPan: string;
  landlordPhone: string;
  propertyAddress: string;
  rentAmount: number;
  rentMonthYear: string; // e.g. "June 2024"
  periodFrom: string;
  periodTo: string;
  paymentMode: 'UPI / Online Transfer' | 'Cheque' | 'Cash';
  transactionRef: string;
  showRevenueStamp: boolean;
  billingCycle?: BillingCycle;
  customLogoUrl?: string;
  upiId: string;
}

export interface ElectricityBillData {
  discomName: string;
  subdivision: string;
  consumerNo: string;
  accountNo: string;
  meterNo: string;
  tariffType: string;
  sanctionedLoad: string;
  consumerName: string;
  billingAddress: string;
  billNo: string;
  billDate: string;
  billPeriod: string;
  dueDate: string;
  previousReading: number;
  currentReading: number;
  unitsConsumed: number;
  energyCharges: number;
  fixedCharges: number;
  fuelAdjustmentCharges: number;
  electricityDuty: number;
  rebateDiscount: number;
  netAmount: number;
  amountAfterDueDate: number;
  billingCycle?: BillingCycle;
  customLogoUrl?: string;
  upiId: string;
}

export interface RestaurantReceiptData {
  restaurantName: string;
  tagline: string;
  address: string;
  fssaiNo: string;
  gstin: string;
  phone: string;
  billNo: string;
  tableNo: string;
  date: string;
  time: string;
  serverName: string;
  items: Array<{
    name: string;
    qty: number;
    rate: number;
    amount: number;
  }>;
  subTotal: number;
  cgstPercent: number;
  sgstPercent: number;
  serviceChargePercent: number;
  discount: number;
  tip: number;
  grandTotal: number;
  paymentMethod: string;
  billingCycle?: BillingCycle;
  customLogoUrl?: string;
  upiId: string;
  wifiPassword?: string;
}

export interface SupermarketBillData {
  storeName: string;
  branchAddress: string;
  gstin: string;
  cin: string;
  phone: string;
  billNo: string;
  date: string;
  time: string;
  cashierName: string;
  customerName?: string;
  items: Array<{
    barcode?: string;
    name: string;
    qty: number;
    mrp: number;
    sp: number;
    total: number;
  }>;
  totalMrp: number;
  totalAmount: number;
  totalSavings: number;
  paymentMode: string;
  billingCycle?: BillingCycle;
  customLogoUrl?: string;
  upiId: string;
}

export interface MedicalPharmacyData {
  pharmacyName: string;
  address: string;
  dlNumber: string; // Drug License No
  gstin: string;
  phone: string;
  billNo: string;
  date: string;
  doctorName: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  items: Array<{
    name: string;
    batchNo: string;
    expDate: string;
    hsn: string;
    qty: number;
    mrp: number;
    rate: number;
    gstPercent: number;
    amount: number;
  }>;
  subTotal: number;
  discount: number;
  gstAmount: number;
  grandTotal: number;
  billingCycle?: BillingCycle;
  customLogoUrl?: string;
  upiId: string;
}

export interface ECommerceInvoiceData {
  sellerName: string;
  sellerAddress: string;
  sellerGstin: string;
  sellerPan: string;
  orderId: string;
  orderDate: string;
  invoiceNo: string;
  invoiceDate: string;
  billingAddress: AddressProfile;
  shippingAddress: AddressProfile;
  items: LineItem[];
  shippingFee: number;
  giftWrapFee: number;
  totalTaxable: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  grandTotal: number;
  billingCycle?: BillingCycle;
  customLogoUrl?: string;
  upiId: string;
}

export interface CabRideData {
  company: 'Uber' | 'Ola' | 'BluSmart';
  driverName: string;
  vehicleModel: string;
  vehicleNo: string;
  tripId: string;
  tripDate: string;
  tripStartTime: string;
  tripEndTime: string;
  durationMins: number;
  distanceKm: number;
  pickupLocation: string;
  dropLocation: string;
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  waitingFare: number;
  tollFee: number;
  taxGst: number;
  discount: number;
  totalFare: number;
  paymentMethod: string;
  billingCycle?: BillingCycle;
  customLogoUrl?: string;
  upiId: string;
}

export interface FreelanceInvoiceData {
  freelancerName: string;
  businessTitle: string;
  freelancerEmail: string;
  freelancerPhone: string;
  freelancerAddress: string;
  freelancerGstin?: string;
  freelancerPan?: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientAddress: string;
  clientGstin?: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  items: LineItem[];
  taxPercent: number;
  discountPercent: number;
  currency: string;
  notes: string;
  paymentTerms: string;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  upiId: string;
  signatureName: string;
  billingCycle?: BillingCycle;
  customLogoUrl?: string;
}

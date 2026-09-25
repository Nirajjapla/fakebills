import React, { useState, useEffect } from 'react';
import { BillCategory, BillType, AddressProfile } from './types';
import { Navbar } from './components/Navbar';
import { LiveEditorSidebar } from './components/LiveEditorSidebar';
import { AddressBookModal } from './components/AddressBookModal';
import { FuelStackerModal } from './components/FuelStackerModal';
import { getSavedAddresses } from './utils/storage';
import { exportToPdf, exportToImage, triggerPrint } from './utils/pdfExporter';

// Templates
import { FuelThermalReceipt } from './components/templates/FuelThermalReceipt';
import { AirtelPostpaidStatement } from './components/templates/AirtelPostpaidStatement';
import { AirtelMobileInvoice } from './components/templates/AirtelMobileInvoice';
import { BSNLBroadbandBill } from './components/templates/BSNLBroadbandBill';
import { JioFiberInvoice } from './components/templates/JioFiberInvoice';
import { GymMembershipInvoice } from './components/templates/GymMembershipInvoice';
import { RentReceipt } from './components/templates/RentReceipt';
import { ElectricityBill } from './components/templates/ElectricityBill';
import { RestaurantReceipt } from './components/templates/RestaurantReceipt';
import { SupermarketBill } from './components/templates/SupermarketBill';
import { MedicalPharmacyInvoice } from './components/templates/MedicalPharmacyInvoice';
import { ECommerceInvoice } from './components/templates/ECommerceInvoice';
import { CabRideReceipt } from './components/templates/CabRideReceipt';
import { FreelancerInvoice } from './components/templates/FreelancerInvoice';

// Initial Dataset presets faithful to user uploaded images & realistic data
const INITIAL_DATA: Record<BillType, any> = {
  fuel_thermal: {
    brand: 'HP',
    dealerName: 'SRI SIDDESHWARA SWAMY FS',
    dealerSub: 'HPCL DEALER',
    location: 'ETTAKODI MALUR TQ',
    cityPincode: 'KOLAR DIST.563160',
    billNo: 'Jun-217412-ORGNL',
    trnsId: '0000000300171246',
    atndId: '01',
    receiptType: 'Physical Receipt',
    vehiNo: 'KA-03-MX-8899',
    mobNo: 'NotEntered',
    date: '17/06/2024',
    time: '19:45:37',
    fpId: '2',
    nozlNo: '4',
    fuelType: 'PETROL',
    density: '751.1kg/m3',
    rate: 101.50,
    amount: 2000.00,
    volume: 19.70,
    paymentMode: 'UPI / Online',
    footerNote: 'THANK YOU VISIT AGAIN',
    upiId: 'hpcl.malur@axisbank',
    billingCycle: 'monthly'
  },
  airtel_statement: {
    customerName: 'Mr. Mohammad Mubasshir',
    addressLine1: '282 Gate No 5 Old Collector Compound',
    addressLine2: 'Malwani Plot No 19 Near Kharodi Post No 19',
    cityStatePin: 'Mumbai Suburban, Mumbai, Maharashtra, 400095',
    email: 'mubasshirraza759@gmail.com',
    phone: '7738677653',
    mobileNumber: '7738677653',
    planName: 'Infinity Family 599',
    statementDate: '27 Apr 2024',
    statementPeriod: '26 Mar 2024-25 Apr 2024',
    totalAmountPayable: 706.82,
    dueDate: '07 May 2024',
    amountAfterDueDate: 824.82,
    upiId: 'airtelthanks@axisbank',
    lastBillAmount: 706.82,
    paymentMade: 706.82,
    credits: 0.00,
    thisMonthCharges: 706.82,
    planCharges: 599.0,
    otherCharges: 0.0,
    gstAmount: 107.82,
    billingCycle: 'monthly',
    accountHistory: [
      { month: "April'24", previousDues: 706.82, payments: 706.82, credits: 0.00, thisMonthCharges: 706.82, amountPayable: 706.82 },
      { month: "March'24", previousDues: 824.82, payments: 824.82, credits: 0.00, thisMonthCharges: 706.82, amountPayable: 706.82 },
      { month: "February'24", previousDues: 824.82, payments: 824.82, credits: 0.00, thisMonthCharges: 824.82, amountPayable: 824.82 },
      { month: "January'24", previousDues: 824.82, payments: 824.82, credits: 0.00, thisMonthCharges: 824.82, amountPayable: 824.82 },
    ]
  },
  airtel_mobile_tax: {
    recipientName: 'Mr N V Ram Babu Choppala',
    addressLine1: 'H No-3-773 Pno-197/a, Phase-1 Vijayapuri Colony',
    addressLine2: 'Vanasthalipuram',
    cityPin: 'Hyderabad 500070 Telangana',
    landmark: 'Near Sai Baba Temple',
    mobileNumber: '9866078632',
    relationshipNumber: '1351126907',
    billNumber: '946841495',
    billDate: '03-Feb-2024',
    billPeriod: '02-Jan-2024 to 01-Feb-2024',
    payByDate: '21-Feb-2024',
    creditLimit: 3600.00,
    securityDeposit: 0.00,
    previousBalance: 470.10,
    payments: 471.00,
    adjustments: 0.00,
    monthlyRentals: 399.00,
    usageCharges: 1.00,
    oneTimeCharges: 0.00,
    lateFee: 100.00,
    taxesGst: 90.00,
    amountDue: 590.00,
    amountDueAfterDate: 707.10,
    upiId: 'airtel.bills@icici',
    gstin: '36AABCB2807M1ZY',
    pan: 'AABCB2807M',
    billingCycle: 'monthly'
  },
  bsnl_broadband: {
    customerName: 'Mr. CIVIL KANNAD',
    addressLine1: 'CIVIL AND CRIMINAL COURT',
    addressLine2: 'KANNAD-KANNAD MH IN, KANNAD-AURANGABAD',
    cityStatePin: 'Aurangabad, Maharashtra - 431103 India',
    accountNo: '1027055768',
    invoiceNo: 'WDCMH2334812957',
    invoiceDate: '04/04/2024',
    usagePeriod: '01/03/2024 to 31/03/2024',
    telephoneNumber: '02435220311',
    tariffPlan: 'FTTH-WIFI-ENABLED-ONT',
    dueDate: '19-04-2024',
    amountPayable: 589.00,
    previousBalance: 588.29,
    paymentReceived: 589.00,
    adjustments: 0.00,
    currentCharges: 588.82,
    recurringCharges: 499.00,
    oneTimeCharges: 0.00,
    usageCharges: 0.00,
    miscCharges: 0.00,
    discount: 0.00,
    taxableValue: 499.00,
    cgstRate: 9,
    cgstAmount: 44.91,
    sgstRate: 9,
    sgstAmount: 44.91,
    totalCurrentCharges: 588.82,
    billingCycle: 'monthly',
    usageHistory: [
      { month: "Sep'23", dataGb: 48, voiceMin: 5 },
      { month: "Oct'23", dataGb: 38, voiceMin: 4 },
      { month: "Nov'23", dataGb: 52, voiceMin: 6 },
      { month: "Dec'23", dataGb: 42, voiceMin: 3 },
      { month: "Jan'24", dataGb: 68, voiceMin: 7 },
      { month: "Feb'24", dataGb: 71, voiceMin: 8 },
    ],
    upiId: 'bsnl.mhsandip@sbi'
  },
  jio_fiber: {
    companyName: 'Reliance Retail Limited',
    companyAddress: 'C/o. Reliance Corporate IT Park Limited, 17th and 18th Floor, Plot No. 5, Godrej, Waterside, Sector-V, Electronics Complex, Salt Lake City, Kolkata, Kolkata, West Bengal, 700091',
    cin: 'U01100MH1999PLC120563',
    pan: 'AABCR1718E',
    gstin: '19AABCR1718E1ZM',
    invoiceNo: '19R22I9999180053',
    invoiceDate: '11 May,2024 10:14:11',
    orderRefNo: 'TB00000QJ56Z',
    customerName: 'Subhra Prakash De',
    customerAddress: '1st floor, de house, East Vivekananda Pally, Rabinda nagar main road siliguri, Darjeeling, West Bengal, 734006',
    jioNumber: '3533550368',
    placeOfSupply: '19 West Bengal',
    planName: 'JioFiber_1M_699',
    hsnSac: '998422',
    planPrice: 631.01,
    discount: 0.00,
    taxableAmount: 631.01,
    cgstPercent: 9,
    cgstAmount: 56.79,
    sgstPercent: 9,
    sgstAmount: 56.79,
    totalAmount: 744.59,
    digitalSignDate: '2024.05.11 11:05:38',
    billingCycle: 'monthly',
    upiId: 'relianceretail@icici'
  },
  gym_membership: {
    gymName: "GOLD'S GYM INDIA",
    tagline: 'The Mecca of Bodybuilding & Elite Fitness',
    gymAddress: 'Plot 102, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
    gymGstin: '29AABCG1234F1Z5',
    gymPhone: '+91 80 4123 9900',
    gymEmail: 'indiranagar@goldsgymindia.com',
    invoiceNo: 'GG-BLR-2024-0891',
    invoiceDate: '01/06/2024',
    memberId: 'GG-IND-8842',
    memberName: 'Rahul Vardhan',
    memberPhone: '9845019283',
    memberEmail: 'rahul.vardhan@outlook.com',
    memberAddress: 'Flat 304, Palm Meadows, Whitefield, Bengaluru - 560066',
    planName: 'Annual Pro Elite (Weights + Cardio + CrossFit + Steam)',
    durationMonths: 12,
    startDate: '01/06/2024',
    endDate: '31/05/2025',
    membershipFee: 18000,
    personalTrainerFee: 4000,
    trainerName: 'Vikram Malhotra (Senior Coach)',
    lockerFee: 1500,
    admissionFee: 1000,
    discount: 2500,
    gstPercent: 18,
    paymentMode: 'UPI / Google Pay',
    trainerAssigned: 'Vikram Malhotra',
    terms: [],
    billingCycle: 'yearly',
    upiId: 'goldsgym.indiranagar@hdfcbank'
  },
  rent_receipt: {
    receiptNo: 'HRA-2024-06',
    receiptDate: '30/06/2024',
    tenantName: 'Mohammad Mubasshir',
    landlordName: 'Suresh Chandra Sharma',
    landlordPan: 'ABCPS9876K',
    landlordPhone: '9845019283',
    propertyAddress: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru, Karnataka - 560103',
    rentAmount: 28000,
    rentMonthYear: 'June 2024',
    periodFrom: '01/06/2024',
    periodTo: '30/06/2024',
    paymentMode: 'UPI / Online Transfer',
    transactionRef: 'UPI/417289012345/Rent',
    showRevenueStamp: true,
    billingCycle: 'monthly',
    upiId: 'suresh.sharma@okaxis'
  },
  electricity_bill: {
    discomName: 'BESCOM - Bangalore Electricity Supply Co.',
    subdivision: 'HSR Layout Sub-Division C-4',
    consumerNo: 'BES-89104820',
    accountNo: '0482910384',
    meterNo: 'LTT-98412',
    tariffType: 'LT-2(a) Domestic',
    sanctionedLoad: '5.00 KW',
    consumerName: 'N V Ram Babu Choppala',
    billingAddress: 'No 45, 14th Main, Sector 4, HSR Layout, Bengaluru - 560102',
    billNo: 'BES-JUN24-81920',
    billDate: '05/06/2024',
    billPeriod: '04/05/2024 to 04/06/2024',
    dueDate: '20/06/2024',
    previousReading: 14210,
    currentReading: 14595,
    unitsConsumed: 385,
    energyCharges: 2150.50,
    fixedCharges: 350.00,
    fuelAdjustmentCharges: 185.20,
    electricityDuty: 241.10,
    rebateDiscount: 50.00,
    netAmount: 2876.80,
    amountAfterDueDate: 2950.00,
    billingCycle: 'monthly',
    upiId: 'bescom.billdesk@icici'
  },
  restaurant_pos: {
    restaurantName: 'THE ROYAL BISTRO & CAFE',
    tagline: 'Fine Dining & Artisan Cafe',
    address: '12th Main Road, Indiranagar 100ft Rd, Bengaluru - 560038',
    fssaiNo: '11223344556677',
    gstin: '29AABCR9912E1Z4',
    phone: '+91 80 2521 8899',
    billNo: 'TRB-8192',
    tableNo: 'T-04',
    date: '15/06/2024',
    time: '20:45:10',
    serverName: 'Vikram',
    items: [
      { name: 'Paneer Tikka Platter', qty: 1, rate: 380, amount: 380 },
      { name: 'Wood-fired Farmhouse Pizza', qty: 1, rate: 490, amount: 490 },
      { name: 'Truffle Mushroom Pasta', qty: 1, rate: 440, amount: 440 },
      { name: 'Cold Brew Artisanal Coffee', qty: 2, rate: 210, amount: 420 },
      { name: 'Classic Belgian Waffle', qty: 1, rate: 290, amount: 290 },
    ],
    subTotal: 2020.00,
    cgstPercent: 2.5,
    sgstPercent: 2.5,
    serviceChargePercent: 0,
    discount: 100.00,
    tip: 50.00,
    grandTotal: 2011.00,
    paymentMethod: 'UPI / GPay',
    billingCycle: 'monthly',
    upiId: 'royalbistro.pos@hdfcbank',
    wifiPassword: 'royalbistro_guest'
  },
  supermarket_mart: {
    storeName: 'SMART BAZAAR SUPERMARKET',
    branchAddress: 'Phoenix Marketcity Mall, Whitefield Main Road, Bengaluru - 560048',
    gstin: '29AABCR1718E1ZM',
    cin: 'U01100MH1999PLC120563',
    phone: '+91 80 6726 1000',
    billNo: 'SM-2024-91823',
    date: '18/06/2024',
    time: '17:35:22',
    cashierName: 'Pooja R (POS 03)',
    customerName: 'Subhra Prakash De',
    items: [
      { barcode: '8901030891234', name: 'Aashirvaad Select Atta 5kg', qty: 1, mrp: 340, sp: 295, total: 295 },
      { barcode: '8901262010052', name: 'Amul Pure Ghee 1L Tin', qty: 1, mrp: 650, sp: 585, total: 585 },
      { barcode: '8901725181229', name: 'Tata Tea Gold 500g', qty: 1, mrp: 320, sp: 275, total: 275 },
      { barcode: '8901058852331', name: 'Fortune Sunlite Oil 1L', qty: 2, mrp: 180, sp: 145, total: 290 },
      { barcode: '8901499008210', name: 'Surf Excel Matic 2kg', qty: 1, mrp: 460, sp: 399, total: 399 },
    ],
    totalMrp: 2130.00,
    totalAmount: 1844.00,
    totalSavings: 286.00,
    paymentMode: 'UPI / PhonePe',
    billingCycle: 'monthly',
    upiId: 'smartbazaar.pos@icici'
  },
  medical_pharmacy: {
    pharmacyName: 'APOLLO 24/7 PHARMACY',
    address: 'Shop 4 & 5, Ground Floor, Outer Ring Road, Bellandur, Bengaluru - 560103',
    dlNumber: 'KA-B1-20B-18290 & 21B-18291',
    gstin: '29AAACA1234F1Z8',
    phone: '+91 80 4918 2736',
    billNo: 'AP-BLR-98412',
    date: '22/06/2024',
    doctorName: 'Dr. Ananya Rao, MD (General Medicine)',
    patientName: 'Mohammad Mubasshir',
    patientAge: '32 Yrs',
    patientGender: 'Male',
    items: [
      { name: 'Augmentin 625 Duo Tablet', batchNo: 'AG8912', expDate: '11/25', hsn: '3004', qty: 10, mrp: 22.50, rate: 20.00, gstPercent: 12, amount: 200.00 },
      { name: 'Pan 40 DSR Capsule', batchNo: 'PN4410', expDate: '08/25', hsn: '3004', qty: 15, mrp: 18.00, rate: 16.00, gstPercent: 12, amount: 240.00 },
      { name: 'Dolo 650mg Paracetamol', batchNo: 'DL1023', expDate: '04/26', hsn: '3004', qty: 20, mrp: 3.50, rate: 3.00, gstPercent: 12, amount: 60.00 },
      { name: 'Becosules Z Capsules', batchNo: 'BZ9912', expDate: '01/26', hsn: '3004', qty: 30, mrp: 4.50, rate: 4.00, gstPercent: 12, amount: 120.00 },
    ],
    subTotal: 620.00,
    discount: 50.00,
    gstAmount: 68.40,
    grandTotal: 638.40,
    billingCycle: 'monthly',
    upiId: 'apollopharmacy@hdfcbank'
  },
  ecommerce_retail: {
    sellerName: 'Appario Retail Private Limited',
    sellerAddress: 'Warehouse Block 8, Bidadi Industrial Area, Ramanagara, Karnataka - 562109',
    sellerGstin: '29AABCA9918F1Z2',
    sellerPan: 'AABCA9918F',
    orderId: '408-9182391-8849102',
    orderDate: '10/06/2024',
    invoiceNo: 'IN-BLR8-2024-9182',
    invoiceDate: '10/06/2024',
    billingAddress: {
      id: 'ecom-1',
      label: 'Home',
      category: 'personal',
      fullName: 'Mohammad Mubasshir',
      addressLine1: '282 Gate No 5 Old Collector Compound',
      addressLine2: 'Malwani Plot No 19 Near Kharodi Post No 19',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400095',
      phone: '7738677653'
    },
    shippingAddress: {
      id: 'ecom-2',
      label: 'Home',
      category: 'personal',
      fullName: 'Mohammad Mubasshir',
      addressLine1: '282 Gate No 5 Old Collector Compound',
      addressLine2: 'Malwani Plot No 19 Near Kharodi Post No 19',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400095',
      phone: '7738677653'
    },
    items: [
      { id: '1', description: 'Logitech MX Master 3S Wireless Performance Mouse', hsnSac: '8471', qty: 1, rate: 7499.00, amount: 7499.00, taxRate: 18 },
      { id: '2', description: 'Type-C Braided Fast Charging Cable (2M)', hsnSac: '8544', qty: 1, rate: 499.00, amount: 499.00, taxRate: 18 }
    ],
    shippingFee: 0,
    giftWrapFee: 0,
    totalTaxable: 7998.00,
    cgstAmount: 719.82,
    sgstAmount: 719.82,
    igstAmount: 0.00,
    grandTotal: 9437.64,
    billingCycle: 'monthly',
    upiId: 'amazonpay@apl'
  },
  cab_ride: {
    company: 'Uber',
    driverName: 'Manjunath Gowda',
    vehicleModel: 'Maruti Suzuki Dzire (White)',
    vehicleNo: 'KA-03-AG-4912',
    tripId: 'ub-blr-89104820',
    tripDate: '14/06/2024',
    tripStartTime: '08:30 AM',
    tripEndTime: '09:22 AM',
    durationMins: 52,
    distanceKm: 24.8,
    pickupLocation: 'Kempegowda International Airport Terminal 1, Bengaluru',
    dropLocation: 'Prestige Tech Park, Marathahalli-Sarjapur Outer Ring Road, Bengaluru',
    baseFare: 150.00,
    distanceFare: 496.00,
    timeFare: 104.00,
    waitingFare: 0.00,
    tollFee: 110.00,
    taxGst: 43.00,
    discount: 50.00,
    totalFare: 853.00,
    paymentMethod: 'Uber Cash / UPI',
    billingCycle: 'monthly',
    upiId: 'uber.rides@icici'
  },
  freelance_invoice: {
    freelancerName: 'Aarav Sharma',
    businessTitle: 'Senior Full-Stack Cloud Architect & UI Engineer',
    freelancerEmail: 'aarav.sharma.dev@gmail.com',
    freelancerPhone: '+91 98765 43210',
    freelancerAddress: '1402, High Street Heights, HSR Sector 2, Bengaluru, Karnataka 560102',
    freelancerGstin: '29AABCS1234Q1Z9',
    freelancerPan: 'AABCS1234Q',
    clientName: 'Sarah Jenkins (VP of Engineering)',
    clientCompany: 'AcroDynamics Systems Inc.',
    clientEmail: 'billing@acrodynamics.io',
    clientAddress: 'Tower B, Cyber City, Phase 3, Gurugram, Haryana 122002',
    clientGstin: '06AABCA5544R1Z1',
    invoiceNo: 'INV-2024-0042',
    invoiceDate: '15/06/2024',
    dueDate: '30/06/2024',
    items: [
      { id: '1', description: 'React 18 & Next.js Enterprise Dashboard Development (Sprint 12)', qty: 40, rate: 1200, amount: 48000 },
      { id: '2', description: 'GraphQL API Integration & Real-time WebSocket Optimization', qty: 25, rate: 1400, amount: 35000 },
      { id: '3', description: 'Automated CI/CD Pipeline & Docker Containerization on AWS ECS', qty: 15, rate: 1500, amount: 22500 }
    ],
    taxPercent: 18,
    discountPercent: 5,
    currency: 'INR',
    notes: 'Thank you for your business! Please remit payment via NEFT/IMPS or UPI within 15 days.',
    paymentTerms: 'Net 15 Days',
    bankName: 'HDFC Bank Ltd (Indiranagar Branch)',
    accountNo: '50200084918234',
    ifscCode: 'HDFC0001234',
    upiId: 'aarav.tech@okaxis',
    signatureName: 'Aarav Sharma',
    billingCycle: 'monthly'
  }
};

export function App() {
  const [activeType, setActiveType] = useState<BillType>('fuel_thermal');
  const [activeCategory, setActiveCategory] = useState<BillCategory | 'all'>('all');
  const [allBillData, setAllBillData] = useState<Record<BillType, any>>(INITIAL_DATA);
  const [isAddressBookOpen, setIsAddressBookOpen] = useState<boolean>(false);
  const [isFuelStackerOpen, setIsFuelStackerOpen] = useState<boolean>(false);
  const [savedAddresses, setSavedAddresses] = useState<AddressProfile[]>([]);

  useEffect(() => {
    setSavedAddresses(getSavedAddresses());
  }, [isAddressBookOpen]);

  const currentBillData = allBillData[activeType];

  const handleUpdateCurrentBillData = (newData: any) => {
    setAllBillData((prev) => ({
      ...prev,
      [activeType]: newData,
    }));
  };

  // 1-Click Autofill Address from Address Book (User or Vendor)
  const handleAutofillAddress = (address: AddressProfile, target: 'user' | 'vendor' = 'user') => {
    const nextData = { ...currentBillData };

    if (target === 'vendor' || address.category === 'vendor') {
      // Apply as Vendor / Merchant Details
      if (activeType === 'fuel_thermal') {
        nextData.dealerName = address.fullName;
        nextData.location = address.addressLine1;
        nextData.cityPincode = `${address.city.toUpperCase()} - ${address.pincode}`;
      } else if (activeType === 'gym_membership') {
        nextData.gymName = address.fullName;
        nextData.gymAddress = `${address.addressLine1}, ${address.addressLine2 || ''} ${address.city} - ${address.pincode}`;
        if (address.gstin) nextData.gymGstin = address.gstin;
        if (address.phone) nextData.gymPhone = address.phone;
      } else if (activeType === 'restaurant_pos') {
        nextData.restaurantName = address.fullName.toUpperCase();
        nextData.address = `${address.addressLine1}, ${address.city} - ${address.pincode}`;
        if (address.gstin) nextData.gstin = address.gstin;
        if (address.phone) nextData.phone = address.phone;
      } else if (activeType === 'supermarket_mart') {
        nextData.storeName = address.fullName.toUpperCase();
        nextData.branchAddress = `${address.addressLine1}, ${address.city} - ${address.pincode}`;
        if (address.gstin) nextData.gstin = address.gstin;
        if (address.phone) nextData.phone = address.phone;
      } else if (activeType === 'medical_pharmacy') {
        nextData.pharmacyName = address.fullName.toUpperCase();
        nextData.address = `${address.addressLine1}, ${address.city} - ${address.pincode}`;
        if (address.gstin) nextData.gstin = address.gstin;
        if (address.phone) nextData.phone = address.phone;
      } else if (activeType === 'rent_receipt') {
        nextData.landlordName = address.fullName;
        if (address.pan) nextData.landlordPan = address.pan;
        if (address.phone) nextData.landlordPhone = address.phone;
      }
    } else {
      // Apply as Customer / User Details
      if (activeType === 'airtel_statement') {
        nextData.customerName = address.fullName;
        nextData.addressLine1 = address.addressLine1;
        nextData.addressLine2 = address.addressLine2 || '';
        nextData.cityStatePin = `${address.city}, ${address.state}, ${address.pincode}`;
        if (address.email) nextData.email = address.email;
        if (address.phone) {
          nextData.phone = address.phone;
          nextData.mobileNumber = address.phone;
        }
      } else if (activeType === 'airtel_mobile_tax') {
        nextData.recipientName = address.fullName;
        nextData.addressLine1 = address.addressLine1;
        nextData.addressLine2 = address.addressLine2 || '';
        nextData.cityPin = `${address.city} ${address.pincode} ${address.state}`;
        if (address.phone) nextData.mobileNumber = address.phone;
        if (address.gstin) nextData.gstin = address.gstin;
        if (address.pan) nextData.pan = address.pan;
      } else if (activeType === 'bsnl_broadband') {
        nextData.customerName = address.fullName;
        nextData.addressLine1 = address.addressLine1;
        nextData.addressLine2 = address.addressLine2 || '';
        nextData.cityStatePin = `${address.city}, ${address.state} - ${address.pincode}`;
        if (address.phone) nextData.telephoneNumber = address.phone;
      } else if (activeType === 'jio_fiber') {
        nextData.customerName = address.fullName;
        nextData.customerAddress = `${address.addressLine1}, ${address.addressLine2 || ''} ${address.city}, ${address.state}, ${address.pincode}`;
        nextData.placeOfSupply = `${address.state.slice(0, 2)} ${address.state}`;
        if (address.phone) nextData.jioNumber = address.phone;
      } else if (activeType === 'rent_receipt') {
        if (address.category === 'landlord') {
          nextData.landlordName = address.fullName;
          if (address.pan) nextData.landlordPan = address.pan;
          if (address.phone) nextData.landlordPhone = address.phone;
        } else {
          nextData.tenantName = address.fullName;
          nextData.propertyAddress = `${address.addressLine1}, ${address.addressLine2 || ''} ${address.city}, ${address.state} - ${address.pincode}`;
        }
      } else if (activeType === 'gym_membership') {
        nextData.memberName = address.fullName;
        nextData.memberAddress = `${address.addressLine1}, ${address.city} - ${address.pincode}`;
        if (address.phone) nextData.memberPhone = address.phone;
        if (address.email) nextData.memberEmail = address.email;
      } else if (activeType === 'electricity_bill') {
        nextData.consumerName = address.fullName;
        nextData.billingAddress = `${address.addressLine1}, ${address.addressLine2 || ''} ${address.city} - ${address.pincode}`;
      } else if (activeType === 'ecommerce_retail') {
        nextData.billingAddress = address;
        nextData.shippingAddress = address;
      } else if (activeType === 'freelance_invoice') {
        if (address.category === 'client' || address.category === 'business') {
          nextData.clientName = address.fullName;
          nextData.clientCompany = address.companyName || address.fullName;
          nextData.clientAddress = `${address.addressLine1}, ${address.city}, ${address.state} - ${address.pincode}`;
          if (address.email) nextData.clientEmail = address.email;
          if (address.gstin) nextData.clientGstin = address.gstin;
        } else {
          nextData.freelancerName = address.fullName;
          nextData.freelancerAddress = `${address.addressLine1}, ${address.city} - ${address.pincode}`;
          if (address.email) nextData.freelancerEmail = address.email;
          if (address.phone) nextData.freelancerPhone = address.phone;
          if (address.gstin) nextData.freelancerGstin = address.gstin;
          if (address.pan) nextData.freelancerPan = address.pan;
        }
      }
    }

    handleUpdateCurrentBillData(nextData);
  };

  // Generate random data variations
  const handleRandomize = () => {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const randAmt = Math.round(500 + Math.random() * 4500);

    const updated = { ...currentBillData };
    if (updated.billNo) updated.billNo = `BIL-${randNum}-ORGNL`;
    if (updated.invoiceNo) updated.invoiceNo = `INV-2024-${randNum}`;
    
    // update amount
    if (updated.amount !== undefined) {
      updated.amount = randAmt;
      if (updated.rate) updated.volume = Number((randAmt / updated.rate).toFixed(2));
    }
    if (updated.totalAmountPayable !== undefined) updated.totalAmountPayable = randAmt + 0.50;
    if (updated.amountDue !== undefined) updated.amountDue = randAmt;
    if (updated.amountPayable !== undefined) updated.amountPayable = randAmt;
    if (updated.totalAmount !== undefined) updated.totalAmount = randAmt;
    if (updated.rentAmount !== undefined) updated.rentAmount = randAmt * 5;
    if (updated.netAmount !== undefined) updated.netAmount = randAmt;
    if (updated.grandTotal !== undefined) updated.grandTotal = randAmt;
    if (updated.totalFare !== undefined) updated.totalFare = randAmt;

    handleUpdateCurrentBillData(updated);
  };

  const handleExportPdf = () => {
    const isThermal = activeType === 'fuel_thermal' || activeType === 'restaurant_pos' || activeType === 'supermarket_mart';
    exportToPdf('active-bill-document', `${activeType}_bill.pdf`, {
      format: isThermal ? 'thermal' : 'a4',
      orientation: 'portrait'
    });
  };

  const handleExportImage = () => {
    exportToImage('active-bill-document', `${activeType}_bill.png`);
  };

  // Render the currently selected template
  const renderActiveTemplate = () => {
    switch (activeType) {
      case 'fuel_thermal':
        return <FuelThermalReceipt data={currentBillData} onChange={handleUpdateCurrentBillData} />;
      case 'airtel_statement':
        return <AirtelPostpaidStatement data={currentBillData} onChange={handleUpdateCurrentBillData} />;
      case 'airtel_mobile_tax':
        return <AirtelMobileInvoice data={currentBillData} onChange={handleUpdateCurrentBillData} />;
      case 'bsnl_broadband':
        return <BSNLBroadbandBill data={currentBillData} onChange={handleUpdateCurrentBillData} />;
      case 'jio_fiber':
        return <JioFiberInvoice data={currentBillData} onChange={handleUpdateCurrentBillData} />;
      case 'gym_membership':
        return <GymMembershipInvoice data={currentBillData} onChange={handleUpdateCurrentBillData} />;
      case 'rent_receipt':
        return <RentReceipt data={currentBillData} onChange={handleUpdateCurrentBillData} />;
      case 'electricity_bill':
        return <ElectricityBill data={currentBillData} onChange={handleUpdateCurrentBillData} />;
      case 'restaurant_pos':
        return <RestaurantReceipt data={currentBillData} onChange={handleUpdateCurrentBillData} />;
      case 'supermarket_mart':
        return <SupermarketBill data={currentBillData} onChange={handleUpdateCurrentBillData} />;
      case 'medical_pharmacy':
        return <MedicalPharmacyInvoice data={currentBillData} onChange={handleUpdateCurrentBillData} />;
      case 'ecommerce_retail':
        return <ECommerceInvoice data={currentBillData} onChange={handleUpdateCurrentBillData} />;
      case 'cab_ride':
        return <CabRideReceipt data={currentBillData} onChange={handleUpdateCurrentBillData} />;
      case 'freelance_invoice':
        return <FreelancerInvoice data={currentBillData} onChange={handleUpdateCurrentBillData} />;
      default:
        return <FuelThermalReceipt data={currentBillData} onChange={handleUpdateCurrentBillData} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeType={activeType}
        onSelectType={setActiveType}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onOpenAddressBook={() => setIsAddressBookOpen(true)}
        onOpenFuelStacker={() => setIsFuelStackerOpen(true)}
        onRandomizeData={handleRandomize}
        onExportPdf={handleExportPdf}
        onExportImage={handleExportImage}
        onPrint={triggerPrint}
        savedAddressCount={savedAddresses.length}
      />

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Customization Sidebar */}
        <LiveEditorSidebar
          activeType={activeType}
          billData={currentBillData}
          onUpdateData={handleUpdateCurrentBillData}
          onOpenAddressBook={() => setIsAddressBookOpen(true)}
        />

        {/* Right Canvas Document Preview Area */}
        <main className="flex-1 bg-slate-950 p-6 lg:p-8 overflow-y-auto flex flex-col items-center justify-start min-h-[calc(100vh-57px)]">
          {/* Document Container */}
          <div className="w-full flex flex-col items-center justify-center pb-12">
            <div id="active-bill-document" className="print:m-0 print:p-0">
              {renderActiveTemplate()}
            </div>
          </div>
        </main>
      </div>

      {/* Centralized Address Book Modal */}
      <AddressBookModal
        isOpen={isAddressBookOpen}
        onClose={() => setIsAddressBookOpen(false)}
        onSelectAddress={handleAutofillAddress}
      />

      {/* Multi-Bill Stacker & Batch Generator Modal */}
      <FuelStackerModal
        isOpen={isFuelStackerOpen}
        onClose={() => setIsFuelStackerOpen(false)}
      />
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import { BillType, BillingCycle, AddressProfile } from '../types';
import { getAllIndianCities, generateRealCityAddress } from '../utils/indianAddresses';
import { 
  getDateRangePresets, 
  extractBillDates, 
  applyDateRangeToBill 
} from '../utils/dateUtils';
import { LineItemsEditor } from './LineItemsEditor';
import { 
  Sparkles, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Building, 
  Plus, 
  Trash2, 
  QrCode,
  Check,
  Upload,
  RotateCcw,
  Store,
  Compass,
  Layers,
  Clock
} from 'lucide-react';

interface Props {
  activeType: BillType;
  billData: any;
  onUpdateData: (newData: any) => void;
  onOpenAddressBook: () => void;
}

export const LiveEditorSidebar: React.FC<Props> = ({
  activeType,
  billData,
  onUpdateData,
  onOpenAddressBook,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('Bengaluru');
  const indianCities = getAllIndianCities();

  const updateField = (field: string, value: any) => {
    onUpdateData({
      ...billData,
      [field]: value,
    });
  };

  // Billing Cycle Toggle (Monthly vs Yearly)
  const handleToggleBillingCycle = (cycle: BillingCycle) => {
    const isNowYearly = cycle === 'yearly';
    const wasYearly = billData.billingCycle === 'yearly';
    if (isNowYearly === wasYearly) return;

    const nextData = { ...billData, billingCycle: cycle };

    // Prorate or expand amounts and dates
    if (isNowYearly) {
      if (activeType === 'airtel_statement') {
        const annualBase = Number((billData.planCharges * 12 * 0.9).toFixed(2));
        const annualGst = Number((annualBase * 0.18).toFixed(2));
        const total = Number((annualBase + annualGst).toFixed(2));
        nextData.planCharges = annualBase;
        nextData.gstAmount = annualGst;
        nextData.thisMonthCharges = total;
        nextData.totalAmountPayable = total;
        nextData.amountAfterDueDate = Number((total + 150).toFixed(2));
        nextData.statementPeriod = '01 Apr 2024 - 31 Mar 2025';
      } else if (activeType === 'airtel_mobile_tax') {
        const annualBase = Number((billData.monthlyRentals * 12 * 0.9).toFixed(2));
        const annualGst = Number((annualBase * 0.18).toFixed(2));
        const total = Number((annualBase + annualGst).toFixed(2));
        nextData.monthlyRentals = annualBase;
        nextData.taxesGst = annualGst;
        nextData.amountDue = total;
        nextData.amountDueAfterDate = Number((total + 150).toFixed(2));
        nextData.billPeriod = '01-Apr-2024 to 31-Mar-2025';
      } else if (activeType === 'bsnl_broadband') {
        const annualBase = Number((billData.recurringCharges * 12).toFixed(2));
        const halfGst = Number((annualBase * 0.09).toFixed(2));
        const total = Number((annualBase + halfGst * 2).toFixed(2));
        nextData.recurringCharges = annualBase;
        nextData.cgstAmount = halfGst;
        nextData.sgstAmount = halfGst;
        nextData.currentCharges = total;
        nextData.amountPayable = total;
        nextData.totalCurrentCharges = total;
        nextData.usagePeriod = '01/04/2024 to 31/03/2025';
      } else if (activeType === 'jio_fiber') {
        const annualBase = Number((billData.taxableAmount * 12).toFixed(2));
        const halfGst = Number((annualBase * 0.09).toFixed(2));
        const total = Number((annualBase + halfGst * 2).toFixed(2));
        nextData.taxableAmount = annualBase;
        nextData.cgstAmount = halfGst;
        nextData.sgstAmount = halfGst;
        nextData.totalAmount = total;
        nextData.planName = 'JioFiber_12M_Annual_699';
      } else if (activeType === 'gym_membership') {
        nextData.durationMonths = 12;
        nextData.membershipFee = 18000;
        nextData.planName = 'Annual Pro Elite (12 Months)';
      } else if (activeType === 'rent_receipt') {
        nextData.rentAmount = Number(((billData.rentAmount || 28000) * 12).toFixed(0));
        nextData.rentMonthYear = 'FY 2024-25 (Annual Total)';
        nextData.periodFrom = '01/04/2024';
        nextData.periodTo = '31/03/2025';
      }
    } else {
      // Revert to Monthly
      if (activeType === 'airtel_statement') {
        nextData.planCharges = 599.0;
        nextData.gstAmount = 107.82;
        nextData.thisMonthCharges = 706.82;
        nextData.totalAmountPayable = 706.82;
        nextData.amountAfterDueDate = 824.82;
        nextData.statementPeriod = '26 Mar 2024-25 Apr 2024';
      } else if (activeType === 'airtel_mobile_tax') {
        nextData.monthlyRentals = 399.0;
        nextData.taxesGst = 90.0;
        nextData.amountDue = 590.0;
        nextData.amountDueAfterDate = 707.10;
        nextData.billPeriod = '02-Jan-2024 to 01-Feb-2024';
      } else if (activeType === 'bsnl_broadband') {
        nextData.recurringCharges = 499.0;
        nextData.cgstAmount = 44.91;
        nextData.sgstAmount = 44.91;
        nextData.currentCharges = 588.82;
        nextData.amountPayable = 589.00;
        nextData.totalCurrentCharges = 588.82;
        nextData.usagePeriod = '01/03/2024 to 31/03/2024';
      } else if (activeType === 'jio_fiber') {
        nextData.taxableAmount = 631.01;
        nextData.cgstAmount = 56.79;
        nextData.sgstAmount = 56.79;
        nextData.totalAmount = 744.59;
        nextData.planName = 'JioFiber_1M_699';
      } else if (activeType === 'gym_membership') {
        nextData.durationMonths = 1;
        nextData.membershipFee = 2500;
        nextData.planName = 'Monthly Pro Fitness Plan';
      } else if (activeType === 'rent_receipt') {
        nextData.rentAmount = 28000;
        nextData.rentMonthYear = 'June 2024';
        nextData.periodFrom = '01/06/2024';
        nextData.periodTo = '30/06/2024';
      }
    }

    onUpdateData(nextData);
  };

  // Logo upload from sidebar
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateField('customLogoUrl', event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Quick Indian City Injector
  const handleInjectCityAddress = (target: 'vendor' | 'user') => {
    const generated = generateRealCityAddress(
      selectedCity,
      target === 'vendor' ? 'vendor' : 'personal'
    );

    const nextData = { ...billData };
    if (target === 'vendor') {
      if (activeType === 'fuel_thermal') {
        nextData.dealerName = generated.fullName;
        nextData.location = generated.addressLine1;
        nextData.cityPincode = `${generated.city.toUpperCase()} - ${generated.pincode}`;
      } else if (activeType === 'gym_membership') {
        nextData.gymName = generated.fullName;
        nextData.gymAddress = `${generated.addressLine1}, ${generated.addressLine2 || ''}, ${generated.city} - ${generated.pincode}`;
        if (generated.gstin) nextData.gymGstin = generated.gstin;
        if (generated.phone) nextData.gymPhone = generated.phone;
      } else if (activeType === 'restaurant_pos') {
        nextData.restaurantName = generated.fullName.toUpperCase();
        nextData.address = `${generated.addressLine1}, ${generated.city} - ${generated.pincode}`;
        if (generated.gstin) nextData.gstin = generated.gstin;
        if (generated.phone) nextData.phone = generated.phone;
      } else if (activeType === 'supermarket_mart') {
        nextData.storeName = generated.fullName.toUpperCase();
        nextData.branchAddress = `${generated.addressLine1}, ${generated.addressLine2 || ''}, ${generated.city} - ${generated.pincode}`;
        if (generated.gstin) nextData.gstin = generated.gstin;
        if (generated.phone) nextData.phone = generated.phone;
      } else if (activeType === 'medical_pharmacy') {
        nextData.pharmacyName = generated.fullName.toUpperCase();
        nextData.address = `${generated.addressLine1}, ${generated.city} - ${generated.pincode}`;
        if (generated.gstin) nextData.gstin = generated.gstin;
        if (generated.phone) nextData.phone = generated.phone;
      } else if (activeType === 'jio_fiber') {
        nextData.placeOfSupply = `${generated.state.slice(0, 2)} ${generated.state}`;
      }
    } else {
      // User / Customer
      if (activeType === 'airtel_statement') {
        nextData.customerName = generated.fullName;
        nextData.addressLine1 = generated.addressLine1;
        nextData.addressLine2 = generated.addressLine2 || '';
        nextData.cityStatePin = `${generated.city}, ${generated.state}, ${generated.pincode}`;
      } else if (activeType === 'airtel_mobile_tax') {
        nextData.recipientName = generated.fullName;
        nextData.addressLine1 = generated.addressLine1;
        nextData.addressLine2 = generated.addressLine2 || '';
        nextData.cityPin = `${generated.city} ${generated.pincode} ${generated.state}`;
      } else if (activeType === 'bsnl_broadband') {
        nextData.customerName = generated.fullName;
        nextData.addressLine1 = generated.addressLine1;
        nextData.addressLine2 = generated.addressLine2 || '';
        nextData.cityStatePin = `${generated.city}, ${generated.state} - ${generated.pincode}`;
      } else if (activeType === 'jio_fiber') {
        nextData.customerName = generated.fullName;
        nextData.customerAddress = `${generated.addressLine1}, ${generated.addressLine2 || ''} ${generated.city}, ${generated.state}, ${generated.pincode}`;
      } else if (activeType === 'rent_receipt') {
        nextData.tenantName = generated.fullName;
        nextData.propertyAddress = `${generated.addressLine1}, ${generated.city} - ${generated.pincode}`;
      } else if (activeType === 'gym_membership') {
        nextData.memberName = generated.fullName;
        nextData.memberAddress = `${generated.addressLine1}, ${generated.city} - ${generated.pincode}`;
      }
    }

    onUpdateData(nextData);
  };

  // Smart Auto-Calculation Handler
  const handleQuickAmountChange = (newAmount: number) => {
    if (isNaN(newAmount) || newAmount < 0) return;

    if (activeType === 'fuel_thermal') {
      const rate = billData.rate || 101.5;
      const vol = Number((newAmount / rate).toFixed(2));
      onUpdateData({
        ...billData,
        amount: newAmount,
        volume: vol,
      });
    } else if (activeType === 'airtel_statement') {
      const base = Number((newAmount / 1.18).toFixed(2));
      const gst = Number((newAmount - base).toFixed(2));
      onUpdateData({
        ...billData,
        totalAmountPayable: newAmount,
        thisMonthCharges: newAmount,
        planCharges: base,
        gstAmount: gst,
      });
    } else if (activeType === 'airtel_mobile_tax') {
      const base = Number((newAmount / 1.18).toFixed(2));
      const gst = Number((newAmount - base).toFixed(2));
      onUpdateData({
        ...billData,
        amountDue: newAmount,
        monthlyRentals: base,
        taxesGst: gst,
      });
    } else if (activeType === 'bsnl_broadband') {
      const base = Number((newAmount / 1.18).toFixed(2));
      const halfGst = Number(((newAmount - base) / 2).toFixed(2));
      onUpdateData({
        ...billData,
        amountPayable: newAmount,
        currentCharges: newAmount,
        recurringCharges: base,
        cgstAmount: halfGst,
        sgstAmount: halfGst,
        totalCurrentCharges: newAmount,
      });
    } else if (activeType === 'jio_fiber') {
      const base = Number((newAmount / 1.18).toFixed(2));
      const halfGst = Number(((newAmount - base) / 2).toFixed(2));
      onUpdateData({
        ...billData,
        totalAmount: newAmount,
        taxableAmount: base,
        planPrice: base,
        cgstAmount: halfGst,
        sgstAmount: halfGst,
      });
    } else if (activeType === 'rent_receipt') {
      onUpdateData({
        ...billData,
        rentAmount: newAmount,
      });
    } else if (activeType === 'electricity_bill') {
      const energy = Number((newAmount * 0.75).toFixed(2));
      const fixed = Number((newAmount * 0.15).toFixed(2));
      const duty = Number((newAmount * 0.10).toFixed(2));
      onUpdateData({
        ...billData,
        netAmount: newAmount,
        energyCharges: energy,
        fixedCharges: fixed,
        electricityDuty: duty,
        amountAfterDueDate: Number((newAmount + 50).toFixed(2)),
      });
    } else if (activeType === 'gym_membership') {
      const base = Number((newAmount / 1.18).toFixed(2));
      onUpdateData({
        ...billData,
        membershipFee: base,
      });
    } else if (activeType === 'restaurant_pos') {
      const base = Number((newAmount / 1.05).toFixed(2));
      onUpdateData({
        ...billData,
        grandTotal: newAmount,
        subTotal: base,
      });
    } else if (activeType === 'cab_ride') {
      onUpdateData({
        ...billData,
        totalFare: newAmount,
        distanceFare: Number((newAmount * 0.7).toFixed(2)),
        baseFare: Number((newAmount * 0.2).toFixed(2)),
        taxGst: Number((newAmount * 0.05).toFixed(2)),
      });
    }
  };

  const currentCycle = billData.billingCycle || 'monthly';
  const { fromIso, toIso, issueIso, dueIso } = extractBillDates(activeType, billData);
  const presets = getDateRangePresets();

  const handleApplyPreset = (presetKey: 'currentMonth' | 'lastMonth' | 'quarter' | 'financialYear') => {
    const p = presets[presetKey];
    const updated = applyDateRangeToBill(activeType, billData, p.from, p.to);
    onUpdateData(updated);
  };

  const handleDateChange = (field: 'from' | 'to' | 'issue' | 'due', val: string) => {
    const nextFrom = field === 'from' ? val : fromIso;
    const nextTo = field === 'to' ? val : toIso;
    const nextIssue = field === 'issue' ? val : issueIso;
    const nextDue = field === 'due' ? val : dueIso;
    const updated = applyDateRangeToBill(activeType, billData, nextFrom, nextTo, nextIssue, nextDue);
    onUpdateData(updated);
  };

  return (
    <aside className="app-sidebar no-print w-80 lg:w-96 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-[calc(100vh-57px)] sticky top-[57px] overflow-y-auto transition-colors">
      {/* Top Controls: Frequency, Amount, Date Range, Logo, Addresses */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-850 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Bill Frequency
          </span>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">Auto-Prorates Charges</span>
        </div>

        {/* Monthly vs Yearly Pills */}
        <div className="grid grid-cols-2 gap-2 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => handleToggleBillingCycle('monthly')}
            className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              currentCycle === 'monthly'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Monthly Bill
          </button>
          <button
            onClick={() => handleToggleBillingCycle('yearly')}
            className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              currentCycle === 'yearly'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Yearly / Annual
          </button>
        </div>

        {/* Date Range & Billing Period Selector */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Date Range & Period
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Universal Sync
            </span>
          </div>

          {/* Quick Presets Grid */}
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => handleApplyPreset('currentMonth')}
              className="py-1 px-1.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-750 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 transition text-center"
              title="Current month"
            >
              This Month
            </button>
            <button
              onClick={() => handleApplyPreset('lastMonth')}
              className="py-1 px-1.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-750 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 transition text-center"
              title="Previous month"
            >
              Last Month
            </button>
            <button
              onClick={() => handleApplyPreset('quarter')}
              className="py-1 px-1.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-750 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 transition text-center"
              title="Current quarter (3 Months)"
            >
              Quarter
            </button>
            <button
              onClick={() => handleApplyPreset('financialYear')}
              className="py-1 px-1.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-750 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 transition text-center"
              title="Indian Financial Year (01 Apr - 31 Mar)"
            >
              FY 24-25
            </button>
          </div>

          {/* From Date & To Date Range Inputs */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                From Date
              </label>
              <input
                type="date"
                value={fromIso}
                onChange={(e) => handleDateChange('from', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2 py-1 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                To Date
              </label>
              <input
                type="date"
                value={toIso}
                onChange={(e) => handleDateChange('to', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2 py-1 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Issue Date & Due Date Inputs */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                Bill / Issue Date
              </label>
              <input
                type="date"
                value={issueIso}
                onChange={(e) => handleDateChange('issue', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2 py-1 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                Due / Pay-by Date
              </label>
              <input
                type="date"
                value={dueIso}
                onChange={(e) => handleDateChange('due', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2 py-1 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Big Quick Amount Adjuster */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 space-y-1 shadow-sm">
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Enter Total Amount (Auto-Calculates All)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
            <input
              type="number"
              step="any"
              value={
                billData.amount ||
                billData.totalAmountPayable ||
                billData.amountDue ||
                billData.amountPayable ||
                billData.totalAmount ||
                billData.rentAmount ||
                billData.netAmount ||
                billData.grandTotal ||
                billData.totalFare ||
                ''
              }
              onChange={(e) => handleQuickAmountChange(Number(e.target.value))}
              placeholder="e.g. 706.82"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-indigo-500 rounded-lg pl-7 pr-3 py-1.5 text-base font-extrabold text-slate-900 dark:text-white"
            />
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Automatically computes taxes (GST), rates, volume & Indian currency words!
          </p>
        </div>

        {/* Logo Uploader Card */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Vendor / Merchant Logo
            </span>
            {billData.customLogoUrl && (
              <button
                onClick={() => updateField('customLogoUrl', undefined)}
                className="text-[10px] text-red-500 hover:text-red-400 flex items-center gap-1"
                title="Reset to brand default"
              >
                <RotateCcw className="w-3 h-3" /> Reset Default
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <label className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg cursor-pointer text-center shadow transition flex items-center justify-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>{billData.customLogoUrl ? 'Replace Custom Logo' : 'Upload Vendor Logo'}</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Upload custom PNG/JPG or use the authentic built-in brand preset.
          </p>
        </div>

        {/* Indian City Address Quick Injector */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Select Indian City
            </span>
            <button
              onClick={onOpenAddressBook}
              className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              Address Book →
            </button>
          </div>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
          >
            {indianCities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={() => handleInjectCityAddress('vendor')}
              className="py-1 px-2 bg-amber-500/10 dark:bg-amber-600/20 hover:bg-amber-500/20 dark:hover:bg-amber-600/40 text-amber-800 dark:text-amber-300 border border-amber-500/30 dark:border-amber-500/40 font-semibold text-[10.5px] rounded-lg transition"
            >
              + Set Vendor in {selectedCity}
            </button>
            <button
              onClick={() => handleInjectCityAddress('user')}
              className="py-1 px-2 bg-indigo-500/10 dark:bg-indigo-600/20 hover:bg-indigo-500/20 dark:hover:bg-indigo-600/40 text-indigo-800 dark:text-indigo-300 border border-indigo-500/30 dark:border-indigo-500/40 font-semibold text-[10.5px] rounded-lg transition"
            >
              + Set Customer in {selectedCity}
            </button>
          </div>
        </div>
      </div>

      {/* Template Specific Form Controls */}
      <div className="p-4 space-y-4 flex-1 text-xs">
        {/* FUEL THERMAL CONTROLS */}
        {activeType === 'fuel_thermal' && (
          <div className="space-y-3">
            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Fuel Brand Preset</label>
              <div className="grid grid-cols-4 gap-1">
                {(['HP', 'IOCL', 'BPCL', 'SHELL'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      updateField('brand', b);
                      updateField('customLogoUrl', undefined);
                    }}
                    className={`py-1.5 rounded font-bold border transition ${
                      billData.brand === b && !billData.customLogoUrl
                        ? 'bg-amber-600 text-white border-amber-500 shadow'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Pump Station Dealer Name</label>
              <input
                type="text"
                value={billData.dealerName || ''}
                onChange={(e) => updateField('dealerName', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Station Location / Address</label>
              <input
                type="text"
                value={billData.location || ''}
                onChange={(e) => updateField('location', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Date</label>
                <input
                  type="text"
                  value={billData.date || ''}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Time</label>
                <input
                  type="text"
                  value={billData.time || ''}
                  onChange={(e) => updateField('time', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Fuel Type</label>
                <select
                  value={billData.fuelType || 'PETROL'}
                  onChange={(e) => updateField('fuelType', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="PETROL">PETROL</option>
                  <option value="DIESEL">DIESEL</option>
                  <option value="CNG">CNG</option>
                  <option value="POWER PETROL">POWER PETROL</option>
                </select>
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Rate / Liter (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={billData.rate || 101.5}
                  onChange={(e) => {
                    const r = Number(e.target.value);
                    const amt = billData.amount || 2000;
                    onUpdateData({
                      ...billData,
                      rate: r,
                      volume: Number((amt / (r || 101.5)).toFixed(2)),
                    });
                  }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Volume (Liters)</label>
                <input
                  type="number"
                  step="0.01"
                  value={billData.volume || 19.7}
                  onChange={(e) => updateField('volume', Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Density</label>
                <input
                  type="text"
                  value={billData.density || '751.1kg/m3'}
                  onChange={(e) => updateField('density', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Vehicle No</label>
                <input
                  type="text"
                  value={billData.vehiNo || ''}
                  onChange={(e) => updateField('vehiNo', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Nozzle No / FP</label>
                <input
                  type="text"
                  value={billData.nozlNo || '4'}
                  onChange={(e) => updateField('nozlNo', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Bill Number</label>
              <input
                type="text"
                value={billData.billNo || ''}
                onChange={(e) => updateField('billNo', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
        )}

        {/* AIRTEL STATEMENT CONTROLS */}
        {activeType === 'airtel_statement' && (
          <div className="space-y-3">
            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Customer Full Name</label>
              <input
                type="text"
                value={billData.customerName || ''}
                onChange={(e) => updateField('customerName', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Address Line 1</label>
              <input
                type="text"
                value={billData.addressLine1 || ''}
                onChange={(e) => updateField('addressLine1', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Address Line 2</label>
              <input
                type="text"
                value={billData.addressLine2 || ''}
                onChange={(e) => updateField('addressLine2', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">City, State & PIN</label>
              <input
                type="text"
                value={billData.cityStatePin || ''}
                onChange={(e) => updateField('cityStatePin', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Mobile / Account No</label>
                <input
                  type="text"
                  value={billData.mobileNumber || ''}
                  onChange={(e) => updateField('mobileNumber', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Plan Name</label>
                <input
                  type="text"
                  value={billData.planName || ''}
                  onChange={(e) => updateField('planName', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Statement Date</label>
                <input
                  type="text"
                  value={billData.statementDate || ''}
                  onChange={(e) => updateField('statementDate', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Due Date</label>
                <input
                  type="text"
                  value={billData.dueDate || ''}
                  onChange={(e) => updateField('dueDate', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold text-red-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Statement Period</label>
              <input
                type="text"
                value={billData.statementPeriod || ''}
                onChange={(e) => updateField('statementPeriod', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* GYM MEMBERSHIP CONTROLS */}
        {activeType === 'gym_membership' && (
          <div className="space-y-3">
            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Gym / Fitness Center Name</label>
              <input
                type="text"
                value={billData.gymName || ''}
                onChange={(e) => updateField('gymName', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Member ID</label>
                <input
                  type="text"
                  value={billData.memberId || ''}
                  onChange={(e) => updateField('memberId', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Member Name</label>
                <input
                  type="text"
                  value={billData.memberName || ''}
                  onChange={(e) => updateField('memberName', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Plan Name</label>
              <input
                type="text"
                value={billData.planName || ''}
                onChange={(e) => updateField('planName', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Duration (Months)</label>
                <input
                  type="number"
                  value={billData.durationMonths || 12}
                  onChange={(e) => updateField('durationMonths', Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Membership Fee (₹)</label>
                <input
                  type="number"
                  value={billData.membershipFee || 15000}
                  onChange={(e) => updateField('membershipFee', Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Personal Trainer Fee (₹)</label>
                <input
                  type="number"
                  value={billData.personalTrainerFee || 0}
                  onChange={(e) => updateField('personalTrainerFee', Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Locker Fee (₹)</label>
                <input
                  type="number"
                  value={billData.lockerFee || 0}
                  onChange={(e) => updateField('lockerFee', Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Start Date</label>
                <input
                  type="text"
                  value={billData.startDate || ''}
                  onChange={(e) => updateField('startDate', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">End Date</label>
                <input
                  type="text"
                  value={billData.endDate || ''}
                  onChange={(e) => updateField('endDate', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-mono text-red-500 font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* RENT RECEIPT CONTROLS */}
        {activeType === 'rent_receipt' && (
          <div className="space-y-3">
            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Tenant Name (Employee)</label>
              <input
                type="text"
                value={billData.tenantName || ''}
                onChange={(e) => updateField('tenantName', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Landlord Name</label>
              <input
                type="text"
                value={billData.landlordName || ''}
                onChange={(e) => updateField('landlordName', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Landlord PAN (Mandatory &gt;1L)</label>
                <input
                  type="text"
                  value={billData.landlordPan || ''}
                  onChange={(e) => updateField('landlordPan', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Landlord Phone</label>
                <input
                  type="text"
                  value={billData.landlordPhone || ''}
                  onChange={(e) => updateField('landlordPhone', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Rented Property Full Address</label>
              <textarea
                rows={2}
                value={billData.propertyAddress || ''}
                onChange={(e) => updateField('propertyAddress', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Rent Period / Month</label>
                <input
                  type="text"
                  value={billData.rentMonthYear || ''}
                  onChange={(e) => updateField('rentMonthYear', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Payment Mode</label>
                <select
                  value={billData.paymentMode || 'UPI / Online Transfer'}
                  onChange={(e) => updateField('paymentMode', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="UPI / Online Transfer">UPI / Online</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>

            <label className="flex items-center space-x-2 pt-1 text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={billData.showRevenueStamp !== false}
                onChange={(e) => updateField('showRevenueStamp', e.target.checked)}
                className="rounded text-indigo-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
              />
              <span className="font-semibold text-amber-700 dark:text-amber-300">Show ₹1 Revenue Stamp Graphic</span>
            </label>
          </div>
        )}

        {/* RESTAURANT POS CONTROLS */}
        {activeType === 'restaurant_pos' && (
          <div className="space-y-3">
            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Restaurant / Cafe Name</label>
              <input
                type="text"
                value={billData.restaurantName || ''}
                onChange={(e) => updateField('restaurantName', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Table No</label>
                <input
                  type="text"
                  value={billData.tableNo || 'T-04'}
                  onChange={(e) => updateField('tableNo', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Server / Captain</label>
                <input
                  type="text"
                  value={billData.serverName || 'Rajesh'}
                  onChange={(e) => updateField('serverName', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Discount (₹)</label>
                <input
                  type="number"
                  value={billData.discount || 0}
                  onChange={(e) => {
                    const disc = Number(e.target.value);
                    const sub = billData.subTotal || 0;
                    const tax = (sub * (billData.cgstPercent + billData.sgstPercent)) / 100;
                    onUpdateData({
                      ...billData,
                      discount: disc,
                      grandTotal: Number((Math.max(0, sub - disc) + tax + (billData.tip || 0)).toFixed(2))
                    });
                  }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Tip / Gratuity (₹)</label>
                <input
                  type="number"
                  value={billData.tip || 0}
                  onChange={(e) => {
                    const tip = Number(e.target.value);
                    const sub = billData.subTotal || 0;
                    const disc = billData.discount || 0;
                    const tax = (sub * (billData.cgstPercent + billData.sgstPercent)) / 100;
                    onUpdateData({
                      ...billData,
                      tip: tip,
                      grandTotal: Number((Math.max(0, sub - disc) + tax + tip).toFixed(2))
                    });
                  }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <LineItemsEditor activeType={activeType} billData={billData} onUpdateData={onUpdateData} />
          </div>
        )}

        {/* SUPERMARKET & MART CONTROLS */}
        {activeType === 'supermarket_mart' && (
          <div className="space-y-3">
            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Store / Supermarket Name</label>
              <input
                type="text"
                value={billData.storeName || ''}
                onChange={(e) => updateField('storeName', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Branch Address</label>
              <input
                type="text"
                value={billData.branchAddress || ''}
                onChange={(e) => updateField('branchAddress', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Cashier / Counter</label>
                <input
                  type="text"
                  value={billData.cashierName || ''}
                  onChange={(e) => updateField('cashierName', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Customer Name</label>
                <input
                  type="text"
                  value={billData.customerName || ''}
                  onChange={(e) => updateField('customerName', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>

            <LineItemsEditor activeType={activeType} billData={billData} onUpdateData={onUpdateData} />
          </div>
        )}

        {/* MEDICAL & PHARMACY CONTROLS */}
        {activeType === 'medical_pharmacy' && (
          <div className="space-y-3">
            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Pharmacy / Medical Store Name</label>
              <input
                type="text"
                value={billData.pharmacyName || ''}
                onChange={(e) => updateField('pharmacyName', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Doctor Name & Reg</label>
              <input
                type="text"
                value={billData.doctorName || ''}
                onChange={(e) => updateField('doctorName', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Patient Name</label>
                <input
                  type="text"
                  value={billData.patientName || ''}
                  onChange={(e) => updateField('patientName', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Age / Gender</label>
                <div className="grid grid-cols-2 gap-1">
                  <input
                    type="text"
                    value={billData.patientAge || '32 Yrs'}
                    onChange={(e) => updateField('patientAge', e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={billData.patientGender || 'Male'}
                    onChange={(e) => updateField('patientGender', e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <LineItemsEditor activeType={activeType} billData={billData} onUpdateData={onUpdateData} />
          </div>
        )}

        {/* E-COMMERCE RETAIL CONTROLS */}
        {activeType === 'ecommerce_retail' && (
          <div className="space-y-3">
            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Seller / Merchant Name</label>
              <input
                type="text"
                value={billData.sellerName || ''}
                onChange={(e) => updateField('sellerName', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Order ID</label>
                <input
                  type="text"
                  value={billData.orderId || ''}
                  onChange={(e) => updateField('orderId', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Invoice No</label>
                <input
                  type="text"
                  value={billData.invoiceNo || ''}
                  onChange={(e) => updateField('invoiceNo', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Shipping Fee (₹)</label>
                <input
                  type="number"
                  value={billData.shippingFee || 0}
                  onChange={(e) => updateField('shippingFee', Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Gift Wrap Fee (₹)</label>
                <input
                  type="number"
                  value={billData.giftWrapFee || 0}
                  onChange={(e) => updateField('giftWrapFee', Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <LineItemsEditor activeType={activeType} billData={billData} onUpdateData={onUpdateData} />
          </div>
        )}

        {/* FREELANCE INVOICE CONTROLS */}
        {activeType === 'freelance_invoice' && (
          <div className="space-y-3">
            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Freelancer / Agency Name</label>
              <input
                type="text"
                value={billData.freelancerName || ''}
                onChange={(e) => updateField('freelancerName', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Professional Title</label>
              <input
                type="text"
                value={billData.businessTitle || ''}
                onChange={(e) => updateField('businessTitle', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Client Contact</label>
                <input
                  type="text"
                  value={billData.clientName || ''}
                  onChange={(e) => updateField('clientName', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Client Company</label>
                <input
                  type="text"
                  value={billData.clientCompany || ''}
                  onChange={(e) => updateField('clientCompany', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Invoice No</label>
                <input
                  type="text"
                  value={billData.invoiceNo || ''}
                  onChange={(e) => updateField('invoiceNo', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Discount %</label>
                <input
                  type="number"
                  value={billData.discountPercent || 0}
                  onChange={(e) => updateField('discountPercent', Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>

            <LineItemsEditor activeType={activeType} billData={billData} onUpdateData={onUpdateData} />
          </div>
        )}

        {/* BSNL BROADBAND CONTROLS */}
        {activeType === 'bsnl_broadband' && (
          <div className="space-y-3">
            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Customer Full Name</label>
              <input
                type="text"
                value={billData.customerName || ''}
                onChange={(e) => updateField('customerName', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Telephone / Landline</label>
                <input
                  type="text"
                  value={billData.telephoneNumber || ''}
                  onChange={(e) => updateField('telephoneNumber', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Account No</label>
                <input
                  type="text"
                  value={billData.accountNo || ''}
                  onChange={(e) => updateField('accountNo', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Tariff Plan</label>
                <input
                  type="text"
                  value={billData.tariffPlan || ''}
                  onChange={(e) => updateField('tariffPlan', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Recurring Charges (₹)</label>
                <input
                  type="number"
                  value={billData.recurringCharges || 499}
                  onChange={(e) => {
                    const rc = Number(e.target.value);
                    const cgst = Number((rc * 0.09).toFixed(2));
                    const sgst = Number((rc * 0.09).toFixed(2));
                    const total = Number((rc + cgst + sgst).toFixed(2));
                    onUpdateData({
                      ...billData,
                      recurringCharges: rc,
                      cgstAmount: cgst,
                      sgstAmount: sgst,
                      currentCharges: total,
                      amountPayable: total,
                      totalCurrentCharges: total
                    });
                  }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* JIO FIBER CONTROLS */}
        {activeType === 'jio_fiber' && (
          <div className="space-y-3">
            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Customer Full Name</label>
              <input
                type="text"
                value={billData.customerName || ''}
                onChange={(e) => updateField('customerName', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Jio Fiber Fixed Line No</label>
                <input
                  type="text"
                  value={billData.jioNumber || ''}
                  onChange={(e) => updateField('jioNumber', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Plan Name</label>
                <input
                  type="text"
                  value={billData.planName || ''}
                  onChange={(e) => updateField('planName', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-semibold"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Plan Taxable Price (₹)</label>
                <input
                  type="number"
                  value={billData.planPrice || 631.01}
                  onChange={(e) => {
                    const price = Number(e.target.value);
                    const cgst = Number((price * 0.09).toFixed(2));
                    const sgst = Number((price * 0.09).toFixed(2));
                    const total = Number((price + cgst + sgst).toFixed(2));
                    onUpdateData({
                      ...billData,
                      planPrice: price,
                      taxableAmount: price,
                      cgstAmount: cgst,
                      sgstAmount: sgst,
                      totalAmount: total
                    });
                  }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Place of Supply</label>
                <input
                  type="text"
                  value={billData.placeOfSupply || '19 West Bengal'}
                  onChange={(e) => updateField('placeOfSupply', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ELECTRICITY BILL CONTROLS */}
        {activeType === 'electricity_bill' && (
          <div className="space-y-3">
            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">DISCOM Name</label>
              <input
                type="text"
                value={billData.discomName || ''}
                onChange={(e) => updateField('discomName', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Consumer Name</label>
                <input
                  type="text"
                  value={billData.consumerName || ''}
                  onChange={(e) => updateField('consumerName', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Consumer / RR No</label>
                <input
                  type="text"
                  value={billData.consumerNo || ''}
                  onChange={(e) => updateField('consumerNo', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Units Consumed (kWh)</label>
                <input
                  type="number"
                  value={billData.unitsConsumed || 385}
                  onChange={(e) => updateField('unitsConsumed', Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Energy Charges (₹)</label>
                <input
                  type="number"
                  value={billData.energyCharges || 2150.50}
                  onChange={(e) => updateField('energyCharges', Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* CAB RIDE CONTROLS */}
        {activeType === 'cab_ride' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Cab Company</label>
                <select
                  value={billData.company || 'Uber'}
                  onChange={(e) => updateField('company', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 text-slate-900 dark:text-white font-bold"
                >
                  <option value="Uber">Uber</option>
                  <option value="Ola">Ola</option>
                  <option value="BluSmart">BluSmart</option>
                </select>
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Driver Name</label>
                <input
                  type="text"
                  value={billData.driverName || ''}
                  onChange={(e) => updateField('driverName', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Vehicle Model</label>
                <input
                  type="text"
                  value={billData.vehicleModel || ''}
                  onChange={(e) => updateField('vehicleModel', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Vehicle Reg No</label>
                <input
                  type="text"
                  value={billData.vehicleNo || ''}
                  onChange={(e) => updateField('vehicleNo', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Pickup Location</label>
              <input
                type="text"
                value={billData.pickupLocation || ''}
                onChange={(e) => updateField('pickupLocation', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Drop Location</label>
              <input
                type="text"
                value={billData.dropLocation || ''}
                onChange={(e) => updateField('dropLocation', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Base Fare (₹)</label>
                <input
                  type="number"
                  value={billData.baseFare || 150}
                  onChange={(e) => updateField('baseFare', Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Distance Fare (₹)</label>
                <input
                  type="number"
                  value={billData.distanceFare || 496}
                  onChange={(e) => updateField('distanceFare', Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* DYNAMIC QR CODE CONFIG SECTION */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
            <QrCode className="w-4 h-4" /> Live Dynamic UPI QR Code
          </div>
          <div>
            <label className="text-slate-700 dark:text-slate-400 block mb-1 font-medium">Payee UPI VPA / ID</label>
            <input
              type="text"
              value={billData.upiId || ''}
              onChange={(e) => updateField('upiId', e.target.value)}
              placeholder="e.g. airtel.pay@axisbank"
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-mono"
            />
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Realtime QR code generates UPI deep-links that work with PhonePe, Google Pay, Paytm & BHIM when scanned.
          </p>
        </div>
      </div>
    </aside>
  );
};

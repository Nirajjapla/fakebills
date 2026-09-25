import React, { useState, useEffect } from 'react';
import { ElectricityBillData } from '../../types';
import { BrandAssets } from '../../utils/brandAssets';
import { generateQrDataUrl, buildUpiUri } from '../../utils/qrGenerator';
import { numberToIndianWords } from '../../utils/numberToWords';
import { Upload } from 'lucide-react';

interface Props {
  data: ElectricityBillData;
  onChange?: (updated: ElectricityBillData) => void;
  scale?: number;
}

export const ElectricityBill: React.FC<Props> = ({ data, onChange, scale = 1 }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const upiUri = buildUpiUri({
      payeeAddress: data.upiId || 'bescom.billdesk@icici',
      payeeName: data.discomName,
      amount: data.netAmount,
      transactionNote: `Electricity Bill ${data.consumerNo}`,
    });
    generateQrDataUrl(upiUri, { width: 140, margin: 0 }).then(setQrUrl);
  }, [data.netAmount, data.consumerNo, data.discomName, data.upiId]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onChange) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ ...data, customLogoUrl: event.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const amountInWords = numberToIndianWords(data.netAmount);
  const isYearly = data.billingCycle === 'yearly';

  return (
    <div
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      className="bg-white text-slate-900 font-sans text-[10px] leading-normal p-6 w-[794px] min-h-[1050px] mx-auto shadow-2xl border border-slate-300 select-text flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-amber-600 pb-3 mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <div className="relative group cursor-pointer">
                {data.customLogoUrl ? (
                  <img src={data.customLogoUrl} alt="Utility Logo" className="max-h-9 max-w-[120px] object-contain" />
                ) : (
                  <div className="w-8 h-8 rounded bg-amber-600 text-white font-black text-xs flex items-center justify-center">
                    ⚡
                  </div>
                )}
                <label className="absolute inset-0 bg-black/60 text-white text-[8px] font-bold flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition rounded cursor-pointer no-export">
                  <Upload className="w-3 h-3" />
                  <span>Change</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
              <div>
                <h1 className="text-base font-black text-slate-900 uppercase">{data.discomName}</h1>
                <div className="text-[9.5px] text-slate-600 font-semibold">{data.subdivision}</div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-amber-600 text-white px-2 py-0.5 font-bold uppercase text-[9.5px] rounded">
              {isYearly ? 'ANNUAL ELECTRICITY STATEMENT' : 'ELECTRICITY BILL CUM NOTICE'}
            </div>
            <div className="mt-1 text-[9.5px] text-slate-600 font-medium">
              Bill No: <span className="font-bold text-black">{data.billNo}</span> | Date: {data.billDate}
            </div>
          </div>
        </div>

        {/* Consumer & Bill Summary Grid */}
        <div className="grid grid-cols-12 gap-3 mb-4">
          <div className="col-span-7 border border-slate-300 rounded p-2.5 bg-slate-50 space-y-1">
            <div className="font-bold text-xs text-blue-900">{data.consumerName}</div>
            <div className="text-slate-700">{data.billingAddress}</div>
            <div className="pt-2 grid grid-cols-2 gap-1 border-t border-slate-200 text-[9.5px]">
              <div><span className="font-bold">Consumer No / CA:</span> {data.consumerNo}</div>
              <div><span className="font-bold">Account No:</span> {data.accountNo}</div>
              <div><span className="font-bold">Meter No:</span> {data.meterNo}</div>
              <div><span className="font-bold">Tariff / Load:</span> {data.tariffType} ({data.sanctionedLoad})</div>
            </div>
          </div>

          {/* Amount Due Card with QR */}
          <div className="col-span-5 border-2 border-red-500 rounded p-2.5 bg-red-50/50 flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-[9px] font-bold text-slate-600 uppercase">DUE DATE: {data.dueDate}</div>
              <div className="text-[10px] text-slate-500 font-semibold">Net Amount Payable</div>
              <div className="text-xl font-black text-red-600">₹ {data.netAmount?.toFixed(2)}</div>
              <div className="text-[8.5px] text-slate-600 font-medium">
                After Due Date: <span className="font-bold text-black">₹ {data.amountAfterDueDate?.toFixed(2)}</span>
              </div>
            </div>
            {qrUrl && (
              <div className="text-center">
                <img src={qrUrl} alt="Bill QR" className="w-16 h-16 border border-slate-300 bg-white p-0.5 rounded" />
                <span className="text-[7.5px] font-bold text-slate-600 block mt-0.5">Instant UPI Pay</span>
              </div>
            )}
          </div>
        </div>

        {/* Meter Consumption Box */}
        <div className="border border-slate-300 rounded mb-4 overflow-hidden">
          <div className="bg-slate-800 text-white px-2.5 py-1 font-bold text-[9.5px] uppercase">
            METER READING & CONSUMPTION DETAILS
          </div>
          <div className="grid grid-cols-4 divide-x divide-slate-300 p-2 text-center text-[9.5px] bg-slate-50">
            <div>
              <div className="text-slate-500 font-medium">Previous Reading</div>
              <div className="font-bold text-sm">{data.previousReading}</div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">Current Reading</div>
              <div className="font-bold text-sm">{data.currentReading}</div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">Units Consumed</div>
              <div className="font-bold text-sm text-blue-900">{data.unitsConsumed} kWh</div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">Billing Period</div>
              <div className="font-bold text-xs">{data.billPeriod}</div>
            </div>
          </div>
        </div>

        {/* Tariff & Energy Calculation Table */}
        <div className="border border-slate-300 rounded overflow-hidden mb-4">
          <table className="w-full text-left text-[9.5px] border-collapse">
            <thead>
              <tr className="bg-slate-100 font-bold border-b border-slate-300">
                <th className="py-1.5 px-3">Charges Description</th>
                <th className="py-1.5 px-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-1 px-3">{isYearly ? 'Energy Charges (Annual Cumulative Slab)' : 'Energy Charges (Slab Calculated Consumption)'}</td>
                <td className="py-1 px-3 text-right font-medium">₹{data.energyCharges?.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-1 px-3">Fixed / Demand Charges ({data.sanctionedLoad})</td>
                <td className="py-1 px-3 text-right">₹{data.fixedCharges?.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-1 px-3">Fuel Adjustment Charges (FAC / FPPCA)</td>
                <td className="py-1 px-3 text-right">₹{data.fuelAdjustmentCharges?.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-1 px-3">Electricity Duty & Taxes (9%)</td>
                <td className="py-1 px-3 text-right">₹{data.electricityDuty?.toFixed(2)}</td>
              </tr>
              {data.rebateDiscount > 0 && (
                <tr className="text-green-700 bg-green-50">
                  <td className="py-1 px-3">Prompt Payment Rebate / Solar Subsidy</td>
                  <td className="py-1 px-3 text-right font-semibold">- ₹{data.rebateDiscount?.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 border-t-2 border-black font-extrabold text-[11px] text-black">
                <td className="py-2 px-3">NET AMOUNT PAYABLE:</td>
                <td className="py-2 px-3 text-right text-xs">₹{data.netAmount?.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Amount in words */}
        <div className="bg-slate-50 border border-slate-200 p-2 rounded text-[9.5px] font-medium mb-4">
          <span className="font-bold">In Words:</span> {amountInWords}
        </div>

        {/* Important Info */}
        <div className="border border-slate-200 p-2 text-[8.5px] text-slate-600 space-y-0.5">
          <div className="font-bold text-slate-800">Important Notices:</div>
          <div>1. Please pay on or before the due date to avoid late payment surcharge and power disconnection.</div>
          <div>2. Cheques / DDs are subject to realization. Online payments reflect within 10 minutes.</div>
          <div>3. Helplines: 1912 (24x7 Customer Care) | WhatsApp Support: +91 94808 19120</div>
        </div>
      </div>

      {/* Footer Barcode & Receipt Tear-off */}
      <div className="border-t-2 border-dashed border-slate-400 pt-3 text-[9px]">
        <div className="flex justify-between items-center">
          <BrandAssets.Barcode value={data.consumerNo} height={18} />
          <div className="text-right text-slate-600">
            <div>Account No: {data.accountNo} | Amount: ₹{data.netAmount?.toFixed(2)}</div>
            <div className="text-[8px] text-slate-400">Computer Generated Electricity Bill</div>
          </div>
        </div>
      </div>
    </div>
  );
};

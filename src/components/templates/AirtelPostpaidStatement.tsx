import React, { useState, useEffect } from 'react';
import { AirtelStatementData } from '../../types';
import { BrandAssets } from '../../utils/brandAssets';
import { generateQrDataUrl, buildUpiUri } from '../../utils/qrGenerator';
import { numberToIndianWords } from '../../utils/numberToWords';
import { Upload } from 'lucide-react';

interface Props {
  data: AirtelStatementData;
  onChange?: (updated: AirtelStatementData) => void;
  scale?: number;
}

export const AirtelPostpaidStatement: React.FC<Props> = ({ data, onChange, scale = 1 }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const upiUri = buildUpiUri({
      payeeAddress: data.upiId || 'airtelthanks@axisbank',
      payeeName: 'Bharti Airtel Limited',
      amount: data.totalAmountPayable,
      transactionNote: `Airtel Bill ${data.mobileNumber}`,
    });
    generateQrDataUrl(upiUri, { width: 140, margin: 0 }).then(setQrUrl);
  }, [data.totalAmountPayable, data.mobileNumber, data.upiId]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onChange) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ ...data, customLogoUrl: event.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const amountInWords = numberToIndianWords(data.totalAmountPayable);
  const isYearly = data.billingCycle === 'yearly';

  return (
    <div
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      className="bg-white text-slate-900 font-sans text-[11px] leading-normal p-8 w-[794px] min-h-[1050px] mx-auto shadow-2xl border border-slate-200 select-text relative flex flex-col justify-between"
    >
      <div>
        {/* Top Header */}
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-[#E40000] font-black text-xl tracking-tight uppercase">
            {isYearly ? 'POSTPAID ANNUAL STATEMENT' : 'POSTPAID MONTHLY STATEMENT'}
          </h1>
          <div className="relative group cursor-pointer">
            {data.customLogoUrl ? (
              <img src={data.customLogoUrl} alt="Custom Logo" className="max-h-8 max-w-[140px] object-contain" />
            ) : (
              <BrandAssets.AirtelLogo className="h-7" />
            )}
            <label className="absolute inset-0 bg-black/60 text-white text-[8px] font-bold flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition rounded cursor-pointer no-export">
              <Upload className="w-3 h-3" />
              <span>Change</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Customer Info & Summary Box Grid */}
        <div className="grid grid-cols-12 gap-4 mb-6">
          {/* Customer info */}
          <div className="col-span-7 space-y-1 text-slate-800">
            <div className="font-bold text-[12px] text-black">{data.customerName}</div>
            <div>{data.addressLine1}</div>
            <div>{data.addressLine2}</div>
            <div>{data.cityStatePin}</div>
            <div className="pt-2 text-[10.5px]">
              <div><span className="font-semibold">Email Address:</span> {data.email}</div>
              <div><span className="font-semibold">Phone Number:</span> {data.phone}</div>
            </div>
            <div className="pt-2 text-[10.5px]">
              <div><span className="font-semibold">Your Plan:</span> {data.planName} {isYearly && <span className="text-[#E40000] font-bold">(Annual)</span>}</div>
              <div><span className="font-semibold">Statement Date:</span> {data.statementDate}</div>
              <div><span className="font-semibold">Statement Period:</span> {data.statementPeriod}</div>
            </div>
          </div>

          {/* Amount Due & QR Box */}
          <div className="col-span-5 border border-black rounded-sm overflow-hidden flex flex-col">
            <div className="grid grid-cols-2 border-b border-black p-2.5 bg-slate-50">
              <div>
                <div className="text-[10px] text-slate-600 font-semibold">Total Amount Payable:</div>
                <div className="text-base font-extrabold text-black">₹ {data.totalAmountPayable?.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-600 font-semibold">Due Date:</div>
                <div className="text-sm font-extrabold text-black">{data.dueDate}</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white flex-1">
              <div className="space-y-1">
                <div className="text-[10px] text-slate-500">Pay via</div>
                <div className="font-bold text-black text-[12px]">Airtel Thanks App</div>
                <div className="text-[9.5px] text-blue-600 underline">www.airtel.in/pay</div>
                <div className="text-[8px] text-slate-500 pt-1">Scan & pay via any UPI Apps</div>
                <div className="text-[8px] text-slate-400">Powered by <span className="text-[#E40000] font-bold">airtel Payments Bank</span></div>
              </div>
              {qrUrl && (
                <div className="p-1 border border-slate-200 rounded">
                  <img src={qrUrl} alt="Airtel Thanks UPI QR" className="w-20 h-20" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Black Account Summary Bar */}
        <div className="bg-black text-white p-3 mb-6">
          <div className="grid grid-cols-6 gap-2 text-center text-[10px]">
            <div>
              <div className="text-slate-400 text-[9px] mb-1">Last bill amount</div>
              <div className="font-bold">₹ {data.lastBillAmount?.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[9px] mb-1">Payment made</div>
              <div className="font-bold">- ₹ {data.paymentMade?.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[9px] mb-1">Credits</div>
              <div className="font-bold">- ₹ {data.credits?.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[9px] mb-1">{isYearly ? 'Annual Charges' : "This Month's Charges"}</div>
              <div className="font-bold">+ ₹ {data.thisMonthCharges?.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[9px] mb-1">Amount Payable</div>
              <div className="font-bold">= ₹ {data.totalAmountPayable?.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[9px] mb-1">Amount after due date</div>
              <div className="font-bold text-amber-400">₹ {data.amountAfterDueDate?.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* This Month's Charges Summary */}
        <div className="mb-6">
          <div className="bg-black text-white px-3 py-1.5 font-bold text-[11px] uppercase tracking-wide">
            {isYearly ? "Annual Charges Summary" : "This Month's Charges Summary"}
          </div>
          <table className="w-full text-left border-collapse mt-1">
            <thead>
              <tr className="border-b border-black text-[10.5px] font-bold text-black">
                <th className="py-1.5 px-2">Services</th>
                <th className="py-1.5 px-2 text-right">Plan/Pack Charges</th>
                <th className="py-1.5 px-2 text-right">Other Charges</th>
                <th className="py-1.5 px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 text-[10.5px]">
              <tr>
                <td className="py-1.5 px-2 font-medium">Mobile {data.mobileNumber} {isYearly && '(12 Months Package)'}</td>
                <td className="py-1.5 px-2 text-right">₹{data.planCharges?.toFixed(1)}</td>
                <td className="py-1.5 px-2 text-right">₹{data.otherCharges?.toFixed(1)}</td>
                <td className="py-1.5 px-2 text-right font-semibold">₹{data.planCharges?.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 font-medium">Taxes (GST)</td>
                <td className="py-1.5 px-2 text-right">₹{data.gstAmount?.toFixed(2)}</td>
                <td className="py-1.5 px-2 text-right">₹0.0</td>
                <td className="py-1.5 px-2 text-right font-semibold">₹{data.gstAmount?.toFixed(2)}</td>
              </tr>
              <tr className="bg-slate-50 font-semibold">
                <td className="py-1.5 px-2">{isYearly ? "Annual charges" : "This month's charges"}</td>
                <td className="py-1.5 px-2 text-right">-</td>
                <td className="py-1.5 px-2 text-right">-</td>
                <td className="py-1.5 px-2 text-right">₹{data.thisMonthCharges?.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-1.5 px-2">Last bill amount</td>
                <td className="py-1.5 px-2 text-right">-</td>
                <td className="py-1.5 px-2 text-right">-</td>
                <td className="py-1.5 px-2 text-right">₹{data.lastBillAmount?.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-1.5 px-2">Payment made¹</td>
                <td className="py-1.5 px-2 text-right">-</td>
                <td className="py-1.5 px-2 text-right">-</td>
                <td className="py-1.5 px-2 text-right">₹{data.paymentMade?.toFixed(2)}</td>
              </tr>
              <tr className="border-t-2 border-red-600 font-extrabold text-[12px] text-black">
                <td className="py-2 px-2">Total (Incl. Taxes)</td>
                <td></td>
                <td></td>
                <td className="py-2 px-2 text-right text-[13px]">₹{data.totalAmountPayable?.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <div className="pt-2 text-[10.5px] font-semibold text-slate-800">
            Total : <span className="font-normal">{amountInWords}</span>
          </div>
        </div>

        {/* Bills & Payments Summary History Table */}
        <div className="mb-6">
          <div className="bg-black text-white px-3 py-1.5 font-bold text-[11px] uppercase tracking-wide">
            Bills & Payments Summary
          </div>
          <table className="w-full text-center border-collapse border border-black mt-1 text-[10px]">
            <thead>
              <tr className="border-b border-black bg-slate-50 font-bold text-slate-800">
                <th className="border-r border-black py-1.5 px-2">Month</th>
                <th className="border-r border-black py-1.5 px-2">Previous Dues (A)</th>
                <th className="border-r border-black py-1.5 px-2">Payments (B)</th>
                <th className="border-r border-black py-1.5 px-2">Credits (C)</th>
                <th className="border-r border-black py-1.5 px-2">{isYearly ? "Charges (D)" : "This month's charges (D)"}</th>
                <th className="py-1.5 px-2">Amount Payable (A+B+C+D)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {data.accountHistory?.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="border-r border-black py-1.5 px-2 font-bold">{row.month}</td>
                  <td className="border-r border-black py-1.5 px-2">{row.previousDues?.toFixed(2)}</td>
                  <td className="border-r border-black py-1.5 px-2">-{row.payments?.toFixed(2)}</td>
                  <td className="border-r border-black py-1.5 px-2">{row.credits?.toFixed(2)}</td>
                  <td className="border-r border-black py-1.5 px-2">{row.thisMonthCharges?.toFixed(2)}</td>
                  <td className="py-1.5 px-2 font-bold">{row.amountPayable?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { GymMembershipData } from '../../types';
import { BrandAssets } from '../../utils/brandAssets';
import { generateQrDataUrl, buildUpiUri } from '../../utils/qrGenerator';
import { numberToIndianWords } from '../../utils/numberToWords';
import { Upload } from 'lucide-react';

interface Props {
  data: GymMembershipData;
  onChange?: (updated: GymMembershipData) => void;
  scale?: number;
}

export const GymMembershipInvoice: React.FC<Props> = ({ data, onChange, scale = 1 }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  const subtotal = data.membershipFee + data.personalTrainerFee + data.lockerFee + data.admissionFee - data.discount;
  const gstAmount = (subtotal * data.gstPercent) / 100;
  const totalAmount = subtotal + gstAmount;

  useEffect(() => {
    const upiUri = buildUpiUri({
      payeeAddress: data.upiId || 'fitnessclub@hdfcbank',
      payeeName: data.gymName,
      amount: totalAmount,
      transactionNote: `Gym Membership ${data.memberId}`,
    });
    generateQrDataUrl(upiUri, { width: 140, margin: 0 }).then(setQrUrl);
  }, [totalAmount, data.memberId, data.gymName, data.upiId]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onChange) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ ...data, customLogoUrl: event.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const amountInWords = numberToIndianWords(totalAmount);
  const isYearly = data.billingCycle === 'yearly' || data.durationMonths >= 12;

  return (
    <div
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      className="bg-white text-slate-900 font-sans text-[11px] leading-normal p-8 w-[794px] min-h-[1050px] mx-auto shadow-2xl border border-slate-200 select-text flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-amber-500 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="relative group cursor-pointer">
              {data.customLogoUrl ? (
                <img src={data.customLogoUrl} alt="Gym Logo" className="max-h-12 max-w-[140px] object-contain" />
              ) : (
                <BrandAssets.GoldsGymLogo />
              )}
              <label className="absolute inset-0 bg-black/60 text-white text-[8px] font-bold flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition rounded cursor-pointer no-export">
                <Upload className="w-3 h-3" />
                <span>Change</span>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
            <div>
              <h1 className="text-xl font-black uppercase text-slate-900 tracking-tight">{data.gymName}</h1>
              <p className="text-xs text-amber-600 font-bold">{data.tagline}</p>
              <p className="text-[10px] text-slate-600 max-w-sm mt-0.5">{data.gymAddress}</p>
              <p className="text-[9.5px] text-slate-500 font-semibold">GSTIN: {data.gymGstin} | Tel: {data.gymPhone}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-amber-500 text-black px-3 py-1 font-black text-xs uppercase tracking-wider rounded">
              {isYearly ? 'ANNUAL GYM TAX INVOICE' : 'MONTHLY GYM INVOICE'}
            </div>
            <div className="mt-2 text-[10.5px] space-y-0.5 text-slate-700">
              <div><span className="font-bold">Invoice No:</span> {data.invoiceNo}</div>
              <div><span className="font-bold">Date:</span> {data.invoiceDate}</div>
              <div><span className="font-bold">Payment Mode:</span> {data.paymentMode}</div>
            </div>
          </div>
        </div>

        {/* Member Details Box & Validity Box */}
        <div className="grid grid-cols-12 gap-4 mb-6">
          <div className="col-span-7 border border-slate-300 rounded p-3 bg-slate-50">
            <div className="text-xs font-black uppercase text-slate-800 border-b border-slate-200 pb-1 mb-2">
              MEMBER DETAILS
            </div>
            <div className="space-y-1 text-slate-800">
              <div><span className="font-bold">Member ID:</span> <span className="font-mono bg-amber-100 px-1 py-0.5 rounded text-black font-bold">{data.memberId}</span></div>
              <div><span className="font-bold">Member Name:</span> {data.memberName}</div>
              <div><span className="font-bold">Contact:</span> {data.memberPhone} | {data.memberEmail}</div>
              <div><span className="font-bold">Address:</span> {data.memberAddress}</div>
            </div>
          </div>

          <div className="col-span-5 border border-amber-500 rounded p-3 bg-amber-50/60">
            <div className="text-xs font-black uppercase text-amber-900 border-b border-amber-200 pb-1 mb-2">
              MEMBERSHIP PLAN & VALIDITY
            </div>
            <div className="space-y-1 text-slate-800">
              <div><span className="font-bold">Plan:</span> <span className="text-amber-800 font-bold">{data.planName}</span></div>
              <div><span className="font-bold">Duration:</span> {data.durationMonths} Month(s) {isYearly && '(Annual Package)'}</div>
              <div><span className="font-bold">Start Date:</span> {data.startDate}</div>
              <div><span className="font-bold">End Date:</span> <span className="font-bold text-red-600">{data.endDate}</span></div>
              {data.trainerAssigned && (
                <div><span className="font-bold">Personal Trainer:</span> {data.trainerAssigned}</div>
              )}
            </div>
          </div>
        </div>

        {/* Fee Breakdown Table */}
        <div className="border border-slate-300 rounded overflow-hidden mb-6">
          <table className="w-full text-left border-collapse text-[10.5px]">
            <thead>
              <tr className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-center w-24">SAC Code</th>
                <th className="py-2.5 px-3 text-right w-32">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-2 px-3 font-semibold">{data.planName} ({data.durationMonths} Months Access)</td>
                <td className="py-2 px-3 text-center text-slate-500">999723</td>
                <td className="py-2 px-3 text-right font-medium">₹{data.membershipFee?.toFixed(2)}</td>
              </tr>
              {data.admissionFee > 0 && (
                <tr>
                  <td className="py-2 px-3">One-Time Registration / Admission Fee</td>
                  <td className="py-2 px-3 text-center text-slate-500">999723</td>
                  <td className="py-2 px-3 text-right">₹{data.admissionFee?.toFixed(2)}</td>
                </tr>
              )}
              {data.personalTrainerFee > 0 && (
                <tr>
                  <td className="py-2 px-3">Personal Training Package ({data.trainerName || 'Dedicated Trainer'})</td>
                  <td className="py-2 px-3 text-center text-slate-500">999723</td>
                  <td className="py-2 px-3 text-right">₹{data.personalTrainerFee?.toFixed(2)}</td>
                </tr>
              )}
              {data.lockerFee > 0 && (
                <tr>
                  <td className="py-2 px-3">Locker & Steam Spa Access</td>
                  <td className="py-2 px-3 text-center text-slate-500">999723</td>
                  <td className="py-2 px-3 text-right">₹{data.lockerFee?.toFixed(2)}</td>
                </tr>
              )}
              {data.discount > 0 && (
                <tr className="text-green-700 bg-green-50/50">
                  <td className="py-2 px-3 font-semibold">Promotional Seasonal Discount</td>
                  <td className="py-2 px-3 text-center">-</td>
                  <td className="py-2 px-3 text-right font-semibold">- ₹{data.discount?.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t border-slate-300 font-bold">
                <td colSpan={2} className="py-2 px-3 text-right">Taxable Subtotal:</td>
                <td className="py-2 px-3 text-right">₹{subtotal.toFixed(2)}</td>
              </tr>
              <tr className="bg-slate-50 font-medium">
                <td colSpan={2} className="py-1 px-3 text-right">CGST ({(data.gstPercent / 2).toFixed(1)}%):</td>
                <td className="py-1 px-3 text-right">₹{(gstAmount / 2).toFixed(2)}</td>
              </tr>
              <tr className="bg-slate-50 font-medium">
                <td colSpan={2} className="py-1 px-3 text-right">SGST ({(data.gstPercent / 2).toFixed(1)}%):</td>
                <td className="py-1 px-3 text-right">₹{(gstAmount / 2).toFixed(2)}</td>
              </tr>
              <tr className="bg-amber-500 text-black font-extrabold text-[12px] border-t-2 border-black">
                <td colSpan={2} className="py-2 px-3 text-right uppercase">Total Amount Paid:</td>
                <td className="py-2 px-3 text-right text-sm">₹{totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Amount in words */}
        <div className="bg-slate-100 p-2.5 rounded border border-slate-300 font-medium text-[10.5px] mb-6">
          <span className="font-bold text-slate-800">Amount in Words:</span> {amountInWords}
        </div>

        {/* Terms & QR Validation */}
        <div className="grid grid-cols-12 gap-4 items-center mb-6">
          <div className="col-span-8 space-y-1 text-[9.5px] text-slate-600">
            <div className="font-bold text-slate-800 uppercase text-[10px]">Terms & Gym Rules:</div>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Membership fees once paid are non-refundable and non-transferable under any circumstances.</li>
              <li>Members must carry clean workout shoes, gym towel, and scan their membership QR at turnstiles.</li>
              <li>Management holds no liability for personal belongings or injuries sustained during workouts.</li>
            </ul>
          </div>
          <div className="col-span-4 flex flex-col items-center justify-center text-center border-l border-slate-200 pl-4">
            {qrUrl && <img src={qrUrl} alt="Member Verification QR" className="w-20 h-20 border border-slate-300 p-1" />}
            <span className="text-[8.5px] font-bold text-slate-700 mt-1">Digital Access & Payment QR</span>
          </div>
        </div>
      </div>

      {/* Signature & Footer */}
      <div className="flex justify-between items-end border-t border-slate-300 pt-4">
        <div className="text-[9.5px] text-slate-500">
          <div>Generated on: {data.invoiceDate}</div>
          <div>Authorized Fitness & Health Center</div>
        </div>
        <div className="text-center">
          <div className="font-serif italic text-blue-900 font-bold text-sm">Vikram Malhotra</div>
          <div className="border-t border-black w-36 mt-1 pt-0.5 text-[9px] font-bold uppercase text-slate-700">
            Authorized Signatory
          </div>
        </div>
      </div>
    </div>
  );
};

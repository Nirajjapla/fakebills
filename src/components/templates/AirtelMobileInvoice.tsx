import React from 'react';
import { AirtelMobileInvoiceData } from '../../types';
import { BrandAssets } from '../../utils/brandAssets';
import { numberToIndianWords } from '../../utils/numberToWords';
import { Upload } from 'lucide-react';

interface Props {
  data: AirtelMobileInvoiceData;
  onChange?: (updated: AirtelMobileInvoiceData) => void;
  scale?: number;
}

export const AirtelMobileInvoice: React.FC<Props> = ({ data, onChange, scale = 1 }) => {
  const amountInWords = numberToIndianWords(data.monthlyRentals + data.usageCharges + data.oneTimeCharges + data.lateFee + data.taxesGst);
  const isYearly = data.billingCycle === 'yearly';

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onChange) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ ...data, customLogoUrl: event.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      className="bg-white text-slate-900 font-sans text-[10px] leading-normal p-6 w-[794px] min-h-[1050px] mx-auto shadow-2xl border border-slate-200 select-text flex flex-col justify-between"
    >
      <div>
        {/* Top Header Banner */}
        <div className="bg-[#E40000] text-white p-3 flex justify-between items-center mb-4">
          <div>
            <div className="text-base font-extrabold tracking-wide uppercase">
              {isYearly ? 'MOBILE SERVICES - ANNUAL TAX INVOICE' : 'MOBILE SERVICES'}
            </div>
            <div className="text-[9px] opacity-90">Original Copy for Recipient - Tax Invoice</div>
          </div>
          <div className="bg-white px-2 py-0.5 rounded relative group cursor-pointer">
            {data.customLogoUrl ? (
              <img src={data.customLogoUrl} alt="Custom Logo" className="max-h-7 max-w-[120px] object-contain" />
            ) : (
              <BrandAssets.AirtelLogo className="h-6" />
            )}
            <label className="absolute inset-0 bg-black/60 text-white text-[8px] font-bold flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition rounded cursor-pointer no-export">
              <Upload className="w-3 h-3" />
              <span>Change</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Top Info Grid */}
        <div className="grid grid-cols-12 gap-3 border-b border-slate-300 pb-3 mb-3">
          {/* Customer Left details */}
          <div className="col-span-6 border-r border-slate-200 pr-3 space-y-1">
            <div className="font-bold text-[11px] text-black">{data.recipientName}</div>
            <div>{data.addressLine1}</div>
            <div>{data.addressLine2}</div>
            <div>{data.cityPin}</div>
            {data.landmark && <div>Landmark: {data.landmark}</div>}
            
            <div className="pt-2">
              <BrandAssets.Barcode value={`${data.mobileNumber}${data.relationshipNumber}`} height={22} />
            </div>

            <div className="pt-1 text-[9px] text-slate-600">
              <div>State Code: 36</div>
              <div>GST No/UID No: {data.gstin || 'Not Provided'}</div>
              <div>PAN No: {data.pan || 'Not Provided'}</div>
              <div className="italic text-slate-500 pt-0.5">To update your e-mail id, SMS EMAIL &lt;email id&gt; to 121</div>
            </div>
          </div>

          {/* Account Right details */}
          <div className="col-span-6 pl-2 space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Airtel number</span>
              <span>{data.mobileNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Relationship number</span>
              <span>{data.relationshipNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Bill number</span>
              <span>{data.billNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Bill date</span>
              <span>{data.billDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Bill period</span>
              <span>{data.billPeriod}</span>
            </div>
            <div className="flex justify-between font-bold text-[#E40000]">
              <span>Pay by date</span>
              <span>{data.payByDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Credit limit</span>
              <span>₹ {data.creditLimit?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Security deposit</span>
              <span>₹ {data.securityDeposit?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* GST Notice */}
        <div className="text-[9px] text-slate-600 mb-3 bg-slate-50 p-1.5 border border-slate-200">
          As per the Government directive, effective 1-July-17, existing service tax of 15% has been replaced with 18% GST.
        </div>

        {/* Two Red Banners for Summary */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Account summary */}
          <div className="border border-slate-300">
            <div className="bg-[#E40000] text-white font-bold px-2 py-1 uppercase text-[10px]">
              YOUR ACCOUNT SUMMARY
            </div>
            <div className="p-2 space-y-1">
              <div className="flex justify-between">
                <span>Previous balance</span>
                <span>{data.previousBalance?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payments</span>
                <span>- {data.payments?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Adjustments</span>
                <span>{data.adjustments?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{isYearly ? 'Annual charges' : "This month's charges"}</span>
                <span>+ {data.amountDue?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-[#E40000] border-t border-slate-300 pt-1">
                <span>Amount due till {data.payByDate}</span>
                <span>= {data.amountDue?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Amount due after {data.payByDate}</span>
                <span>{data.amountDueAfterDate?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* This Month's charges */}
          <div className="border border-slate-300">
            <div className="bg-[#E40000] text-white font-bold px-2 py-1 uppercase text-[10px] flex justify-between">
              <span>{isYearly ? 'ANNUAL CHARGES' : "THIS MONTH'S CHARGES"}</span>
              <span>amount (₹)</span>
            </div>
            <div className="p-2 space-y-1">
              <div className="flex justify-between">
                <span>{isYearly ? 'Annual package rentals' : 'Monthly rentals'}</span>
                <span>{data.monthlyRentals?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Usage</span>
                <span>{data.usageCharges?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>One time charges</span>
                <span>{data.oneTimeCharges?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Late payment fee</span>
                <span>{data.lateFee?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>{data.taxesGst?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-black pt-1">
                <span>Total (₹)</span>
                <span>{data.amountDue?.toFixed(2)}</span>
              </div>
              <div className="text-[8px] text-slate-500 pt-1">
                Total : {amountInWords}
              </div>
            </div>
          </div>
        </div>

        {/* Promo Banner */}
        <div className="border border-slate-200 p-3 mb-3 flex items-center justify-between bg-gradient-to-r from-red-50 to-orange-50 rounded">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-8 bg-red-600 rounded flex items-center justify-center text-white font-black text-[9px] shadow">
              airtel TV
            </div>
            <div>
              <div className="text-[#E40000] font-black text-sm uppercase">GET LIVE TV ON YOUR MOBILE</div>
              <div className="text-slate-700 text-xs">Download the App now</div>
            </div>
          </div>
          <div className="text-[8px] text-slate-400">T&C Apply</div>
        </div>

        {/* Tariff Details */}
        <div className="mb-4">
          <div className="bg-[#E40000] text-white font-bold px-2 py-0.5 text-[9px] uppercase">
            Tariff Details
          </div>
          <div className="grid grid-cols-2 border border-slate-300 p-2 text-[9px] gap-2">
            <div>
              <div className="font-bold border-b pb-0.5 mb-1 flex justify-between">
                <span>Call rates</span>
                <span className="space-x-4"><span>Local(₹)</span><span>STD(₹)</span></span>
              </div>
              <div className="flex justify-between text-slate-600"><span>to airtel mobile</span><span>0/min  0/min</span></div>
              <div className="flex justify-between text-slate-600"><span>to other mobile</span><span>0/min  0/min</span></div>
              <div className="flex justify-between text-slate-600"><span>to landline</span><span>0/min  0/min</span></div>
            </div>
            <div>
              <div className="font-bold border-b pb-0.5 mb-1 flex justify-between">
                <span>SMS rates</span>
                <span className="space-x-4"><span>Local(₹)</span><span>National(₹)</span></span>
              </div>
              <div className="flex justify-between text-slate-600"><span>local/national</span><span>1/msg  1.5/msg</span></div>
              <div className="flex justify-between text-slate-600"><span>national roaming</span><span>0.25/msg  0.38/msg</span></div>
              <div className="flex justify-between text-slate-600"><span>international</span><span>5/msg  5/msg</span></div>
            </div>
          </div>
        </div>

        {/* Authorized Signature */}
        <div className="mb-3">
          <div className="text-[9px] text-slate-600">For Bharti Airtel Limited</div>
          <div className="font-serif italic text-base text-blue-900 font-bold -mb-1">Varun Saini</div>
          <div className="text-[8px] text-slate-500">Varun Saini, General Manager</div>
        </div>
      </div>

      {/* Bottom Payment Slip Tear-off */}
      <div className="border-t-2 border-dashed border-slate-400 pt-2 text-[9px]">
        <div className="flex justify-center mb-1">
          <BrandAssets.Barcode value={`${data.mobileNumber}${data.relationshipNumber}`} height={20} />
        </div>
        <div className="grid grid-cols-3 gap-2 font-semibold">
          <div>Airtel number: {data.mobileNumber}</div>
          <div>Bill number: {data.billNumber}</div>
          <div>Relationship number: {data.relationshipNumber}</div>
        </div>
        <div className="flex justify-between items-center mt-1">
          <div className="font-bold text-[11px]">Amount due: ₹ {data.amountDue?.toFixed(2)}</div>
          <div className="text-[8px] text-slate-500">Signature & stamp .................................................</div>
        </div>
        <div className="text-center text-[8px] text-slate-500 italic mt-1">
          This is an electronically generated statement and does not require any signature
        </div>
        <div className="text-right text-[8px] text-slate-400 mt-1">
          Page 1 of 3
        </div>
      </div>
    </div>
  );
};

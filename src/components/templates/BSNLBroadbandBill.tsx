import React, { useState, useEffect } from 'react';
import { BSNLBroadbandData } from '../../types';
import { BrandAssets } from '../../utils/brandAssets';
import { generateQrDataUrl, buildUpiUri } from '../../utils/qrGenerator';
import { numberToIndianWords } from '../../utils/numberToWords';
import { Upload } from 'lucide-react';

interface Props {
  data: BSNLBroadbandData;
  onChange?: (updated: BSNLBroadbandData) => void;
  scale?: number;
}

export const BSNLBroadbandBill: React.FC<Props> = ({ data, onChange, scale = 1 }) => {
  const [portalQrUrl, setPortalQrUrl] = useState<string>('');
  const [upiQrUrl, setUpiQrUrl] = useState<string>('');

  useEffect(() => {
    // Portal QR
    generateQrDataUrl(`https://portal.bsnl.in/quickpay/verify?acc=${data.accountNo}&amt=${data.amountPayable}`, { width: 140 }).then(setPortalQrUrl);
    // UPI QR
    const upiUri = buildUpiUri({
      payeeAddress: data.upiId || 'bsnl.mhsandip@sbi',
      payeeName: 'Bharat Sanchar Nigam Ltd',
      amount: data.amountPayable,
      transactionNote: `BSNL Bill ${data.telephoneNumber}`,
    });
    generateQrDataUrl(upiUri, { width: 140 }).then(setUpiQrUrl);
  }, [data.accountNo, data.amountPayable, data.telephoneNumber, data.upiId]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onChange) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ ...data, customLogoUrl: event.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const amountInWords = numberToIndianWords(data.amountPayable);
  const isYearly = data.billingCycle === 'yearly';

  return (
    <div
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      className="bg-white text-slate-900 font-sans text-[10px] leading-tight p-6 w-[794px] min-h-[1050px] mx-auto shadow-2xl border border-slate-200 select-text flex flex-col justify-between"
    >
      <div>
        {/* Top Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-300 pb-3 mb-3">
          <div className="relative group cursor-pointer">
            {data.customLogoUrl ? (
              <img src={data.customLogoUrl} alt="Custom Logo" className="max-h-12 max-w-[160px] object-contain" />
            ) : (
              <BrandAssets.BSNLLogo className="h-12" />
            )}
            <label className="absolute inset-0 bg-black/60 text-white text-[8px] font-bold flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition rounded cursor-pointer no-export">
              <Upload className="w-3 h-3" />
              <span>Change</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>

          <div className="text-right text-[10px] space-y-0.5">
            <div><span className="font-bold">Account No:</span> {data.accountNo}</div>
            <div><span className="font-bold">Invoice No:</span> {data.invoiceNo}</div>
            <div><span className="font-bold">Invoice Date:</span> {data.invoiceDate}</div>
            <div><span className="font-bold">Usage Period:</span> {data.usagePeriod}</div>
            <div className="font-bold text-blue-800">Tariff Plan: {data.tariffPlan} {isYearly && '(Annual)'}</div>
          </div>
        </div>

        {/* 3-Column Middle Box: Customer info, Due Date/Amount, QR Code */}
        <div className="grid grid-cols-12 gap-3 mb-4">
          {/* Customer box */}
          <div className="col-span-5 border border-slate-300 p-2.5 rounded bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="text-[9px] text-slate-500 font-bold uppercase mb-1">
                {isYearly ? 'Annual Broadband Bill - Tax Invoice' : 'Bill Mail Service - Tax Invoice'}
              </div>
              <div className="font-extrabold text-[11px] text-blue-900">{data.customerName}</div>
              <div className="text-slate-700 text-[9.5px] mt-1">{data.addressLine1}</div>
              <div className="text-slate-700 text-[9.5px]">{data.addressLine2}</div>
              <div className="text-slate-700 text-[9.5px]">{data.cityStatePin}</div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200">
              <div className="text-[9px] text-slate-500 font-bold uppercase">TELEPHONE NUMBER</div>
              <div className="font-bold text-sm text-black">{data.telephoneNumber}</div>
              <div className="text-[9px] text-slate-500 mt-1">GSTIN: Unregistered</div>
            </div>
          </div>

          {/* Due date & amount payable */}
          <div className="col-span-4 border border-blue-600 rounded p-3 flex flex-col items-center justify-center bg-blue-50 text-center">
            <div className="text-xs font-black uppercase text-blue-900 tracking-wider">DUE DATE</div>
            <div className="text-sm font-bold text-slate-800 my-0.5">{data.dueDate}</div>
            <div className="text-xs font-black uppercase text-blue-900 mt-1">AMOUNT PAYABLE</div>
            <div className="text-xl font-black text-black">₹ {data.amountPayable?.toFixed(2)}</div>
            <div className="mt-2 bg-red-600 text-white font-black text-[11px] px-6 py-1 rounded shadow cursor-pointer uppercase">
              PAY NOW
            </div>
          </div>

          {/* Portal QR */}
          <div className="col-span-3 border border-slate-300 rounded p-2 flex flex-col items-center justify-center bg-white text-center">
            {portalQrUrl && <img src={portalQrUrl} alt="BSNL Portal QR" className="w-20 h-20" />}
            <span className="text-[8px] font-bold text-slate-700 mt-1">Scan QR Code to make online Portal Payment</span>
          </div>
        </div>

        {/* Account Summary Banner Bar */}
        <div className="border border-slate-300 rounded mb-4 overflow-hidden">
          <div className="bg-[#EAAA00] text-black font-extrabold px-3 py-1 text-[10px] uppercase flex justify-between">
            <span>ACCOUNT SUMMARY</span>
            <span>Deposit Amount: 500.00</span>
          </div>
          <div className="grid grid-cols-6 divide-x divide-slate-300 text-center p-2 text-[9px] bg-slate-50">
            <div>
              <div className="text-slate-500 font-semibold mb-0.5">PREVIOUS BALANCE</div>
              <div className="font-bold">₹ {data.previousBalance?.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-slate-500 font-semibold mb-0.5">PAYMENT RECEIVED</div>
              <div className="font-bold text-green-700">₹ {data.paymentReceived?.toFixed(2)} (-)</div>
            </div>
            <div>
              <div className="text-slate-500 font-semibold mb-0.5">ADJUSTMENTS</div>
              <div className="font-bold">₹ {data.adjustments?.toFixed(2)} (+)</div>
            </div>
            <div>
              <div className="text-slate-500 font-semibold mb-0.5">CURRENT CHARGES</div>
              <div className="font-bold">₹ {data.currentCharges?.toFixed(2)} (+)</div>
            </div>
            <div>
              <div className="text-slate-500 font-semibold mb-0.5">TOTAL DUE</div>
              <div className="font-bold">₹ {((data.previousBalance || 0) - (data.paymentReceived || 0) + (data.currentCharges || 0)).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-slate-500 font-semibold mb-0.5">AMOUNT PAYABLE</div>
              <div className="font-extrabold text-blue-900">₹ {data.amountPayable?.toFixed(2)}</div>
            </div>
          </div>
          <div className="text-[8.5px] italic text-slate-600 px-3 py-0.5 border-t border-slate-200 bg-white">
            Amount in Words: {amountInWords}
          </div>
        </div>

        {/* Two Columns: Summary Charges Table & Usage History Bar Chart */}
        <div className="grid grid-cols-12 gap-3 mb-4">
          {/* Summary Charges Table */}
          <div className="col-span-6 border border-slate-300 rounded p-2 bg-white">
            <div className="text-[#005BAC] font-bold text-[10.5px] uppercase border-b pb-1 mb-1">
              SUMMARY CHARGES
            </div>
            <table className="w-full text-[9px] leading-tight">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-0.5">{isYearly ? 'Annual Recurring Charges' : 'Recurring Charges'}</td>
                  <td className="text-right font-medium">₹{data.recurringCharges?.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-0.5">One Time Charges</td>
                  <td className="text-right">₹{data.oneTimeCharges?.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-0.5">Usage Charges</td>
                  <td className="text-right">₹{data.usageCharges?.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-0.5">Tax (CGST 9% + SGST 9%)</td>
                  <td className="text-right font-medium">₹{(data.cgstAmount + data.sgstAmount).toFixed(2)}</td>
                </tr>
                <tr className="font-extrabold border-t border-black text-black">
                  <td className="py-1">Total Current Charges</td>
                  <td className="text-right">₹{data.totalCurrentCharges?.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            
            {/* Tax Details Sub-box */}
            <div className="mt-2 pt-1 border-t border-dashed border-slate-300 text-[8.5px]">
              <div className="font-bold text-slate-700 mb-0.5">Tax Details</div>
              <div className="flex justify-between text-slate-600">
                <span>CGST (9.00% on ₹{data.recurringCharges?.toFixed(2)})</span>
                <span>₹{data.cgstAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST/UTGST (9.00% on ₹{data.recurringCharges?.toFixed(2)})</span>
                <span>₹{data.sgstAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Usage History 6-Month Chart */}
          <div className="col-span-6">
            <BrandAssets.BSNLUsageChart history={data.usageHistory || [
              { month: "Sep'23", dataGb: 48, voiceMin: 5 },
              { month: "Oct'23", dataGb: 38, voiceMin: 4 },
              { month: "Nov'23", dataGb: 52, voiceMin: 6 },
              { month: "Dec'23", dataGb: 42, voiceMin: 3 },
              { month: "Jan'24", dataGb: 68, voiceMin: 7 },
              { month: "Feb'24", dataGb: 71, voiceMin: 8 },
            ]} />
          </div>
        </div>

        {/* Promo Notification Banner */}
        <div className="bg-[#EAAA00] text-black font-bold p-2 text-center text-[10px] rounded mb-3">
          Fibre Basic Plan with higher browsing speeds upto 40 Mbps at FMC Rs 499/- wef 01.11.2022 is enabled.
        </div>

        {/* Ad & Accounts Officer Signature + UPI QR */}
        <div className="border border-slate-300 rounded p-3 mb-3 grid grid-cols-12 gap-3 items-center bg-gradient-to-r from-amber-50 to-blue-50">
          <div className="col-span-7">
            <div className="text-orange-600 font-black text-sm uppercase">AN UNBEATABLE DEAL</div>
            <div className="text-[9.5px] font-bold text-slate-800">Avail Super Star Premium Plus Plan in Rs. 999</div>
            <div className="text-[8.5px] text-slate-600">Get up to 150 Mbps speed till 2000 GB, includes premium OTT subscriptions!</div>
          </div>
          <div className="col-span-5 flex flex-col items-center justify-center border-l border-slate-200 pl-2 text-center">
            <div className="text-[9px] text-slate-600 font-semibold">Accounts Officer (TR)</div>
            {upiQrUrl && <img src={upiQrUrl} alt="BSNL UPI QR" className="w-16 h-16 my-1" />}
            <span className="text-[8px] text-slate-500 font-bold">Scan QR Code to make UPI Payment</span>
          </div>
        </div>
      </div>

      {/* Bottom Payment Slip Tear-off */}
      <div className="border-t-2 border-dashed border-slate-400 pt-2 text-[8.5px]">
        <div className="flex justify-between items-center mb-1">
          <span className="font-extrabold text-[9px] text-blue-900">BHARAT SANCHAR NIGAM LTD - PAYMENT SLIP</span>
          <div className="space-x-3 text-slate-600">
            <span>[ ] Cash</span>
            <span>[ ] Cheque/DD</span>
            <span>[ ] Credit/Debit Card</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 border border-slate-300 p-1.5 bg-slate-50">
          <div>Invoice No: {data.invoiceNo}</div>
          <div>Account No: {data.accountNo}</div>
          <div className="font-bold">Due Date: {data.dueDate}</div>
          <div>Phone No: {data.telephoneNumber}</div>
          <div>Invoice Date: {data.invoiceDate}</div>
          <div className="font-extrabold text-blue-900">Amount Payable: ₹{data.amountPayable?.toFixed(2)}</div>
        </div>
        <div className="flex justify-start items-center mt-1">
          <BrandAssets.Barcode value={data.invoiceNo} height={16} />
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { JioFiberData } from '../../types';
import { generateQrDataUrl, buildUpiUri } from '../../utils/qrGenerator';
import { numberToIndianWords } from '../../utils/numberToWords';
import { Upload } from 'lucide-react';

interface Props {
  data: JioFiberData;
  onChange?: (updated: JioFiberData) => void;
  scale?: number;
}

export const JioFiberInvoice: React.FC<Props> = ({ data, onChange, scale = 1 }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const upiUri = buildUpiUri({
      payeeAddress: data.upiId || 'relianceretail@icici',
      payeeName: 'Reliance Retail Limited',
      amount: data.totalAmount,
      transactionNote: `JioFiber ${data.invoiceNo}`,
    });
    generateQrDataUrl(upiUri, { width: 140, margin: 0 }).then(setQrUrl);
  }, [data.totalAmount, data.invoiceNo, data.upiId]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onChange) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ ...data, customLogoUrl: event.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const amountInWords = numberToIndianWords(data.totalAmount);
  const isYearly = data.billingCycle === 'yearly';

  return (
    <div
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      className="bg-white text-slate-900 font-sans text-[10.5px] leading-normal p-8 w-[794px] min-h-[1050px] mx-auto shadow-2xl border border-black select-text flex flex-col justify-between"
    >
      <div>
        {/* Header with Title & QR */}
        <div className="grid grid-cols-12 gap-2 border-b border-black pb-4 mb-3">
          <div className="col-span-9 text-center pr-4">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <h1 className="text-base font-extrabold text-black">{data.companyName}</h1>
              {data.customLogoUrl && (
                <div className="relative group cursor-pointer inline-block">
                  <img src={data.customLogoUrl} alt="Custom Logo" className="max-h-7 max-w-[120px] object-contain ml-2 inline" />
                  <label className="absolute inset-0 bg-black/60 text-white text-[8px] font-bold flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition rounded cursor-pointer no-export">
                    <Upload className="w-3 h-3" />
                    <span>Change</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              )}
            </div>
            <p className="text-[10px] text-slate-700 max-w-lg mx-auto leading-tight">
              {data.companyAddress}
            </p>
            <div className="text-[9.5px] text-slate-500 mt-2 italic">
              (Original for Recipient) {isYearly && <span className="font-bold text-black">- Annual Tax Invoice</span>}
            </div>
          </div>
          <div className="col-span-3 flex flex-col items-center justify-center">
            {qrUrl && <img src={qrUrl} alt="Jio Invoice QR" className="w-24 h-24 border border-black p-1" />}
          </div>
        </div>

        <div className="text-center font-extrabold text-sm py-1 border-b border-black uppercase mb-3">
          {isYearly ? 'Annual Tax Invoice' : 'Tax Invoice'}
        </div>

        {/* Invoice & Customer Meta Grid with Black Borders */}
        <div className="border border-black mb-4">
          <div className="grid grid-cols-2 divide-x divide-black border-b border-black p-2">
            <div><span className="font-bold">Invoice No :</span> {data.invoiceNo}</div>
            <div><span className="font-bold">Invoice/Payment Date & Time :</span> {data.invoiceDate}</div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-black border-b border-black p-2">
            <div><span className="font-bold">PAN No :</span> {data.pan}</div>
            <div><span className="font-bold">GST No :</span> {data.gstin}</div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-black border-b border-black p-2">
            <div><span className="font-bold">Order Ref. No. :</span> {data.orderRefNo}</div>
            <div><span className="font-bold">Invoice Reference No :</span> null</div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-black p-2">
            <div className="space-y-1">
              <div><span className="font-bold">Customer Name :</span> {data.customerName}</div>
              <div><span className="font-bold">Jio Number :</span> {data.jioNumber}</div>
              <div><span className="font-bold">Customer GST No :</span> null</div>
            </div>
            <div className="space-y-1">
              <div><span className="font-bold">Place of Supply :</span> {data.placeOfSupply}</div>
              <div><span className="font-bold">Customer Address :</span> {data.customerAddress}</div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse border border-black mb-0 text-[10px]">
          <thead>
            <tr className="bg-slate-50 border-b border-black font-bold text-center">
              <th className="border-r border-black py-2 px-1 w-10">Sr. No.</th>
              <th className="border-r border-black py-2 px-2">Item Name</th>
              <th className="border-r border-black py-2 px-2 w-20">HSN/SAC</th>
              <th className="border-r border-black py-2 px-2 w-12">Qty</th>
              <th className="border-r border-black py-2 px-2 w-24">Price/Unit( ₹)</th>
              <th className="border-r border-black py-2 px-2 w-24">Discount( ₹)</th>
              <th className="py-2 px-2 w-24 text-right">Value( ₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-black text-center">
              <td className="border-r border-black py-2">1</td>
              <td className="border-r border-black py-2 px-2 text-left font-medium">
                {data.planName} {isYearly && '(12 Months Unlimited High-Speed Fiber)'}
              </td>
              <td className="border-r border-black py-2">{data.hsnSac}</td>
              <td className="border-r border-black py-2">1</td>
              <td className="border-r border-black py-2">{data.taxableAmount?.toFixed(2)}</td>
              <td className="border-r border-black py-2">{data.discount?.toFixed(2)}</td>
              <td className="py-2 px-2 text-right">{data.taxableAmount?.toFixed(2)}</td>
            </tr>
            {/* Totals Breakdown */}
            <tr className="border-b border-black font-bold">
              <td colSpan={6} className="border-r border-black py-1.5 px-3 text-right">Total Taxable Charges</td>
              <td className="py-1.5 px-2 text-right">{data.taxableAmount?.toFixed(2)}</td>
            </tr>
            <tr className="border-b border-black font-medium">
              <td colSpan={6} className="border-r border-black py-1 px-3 text-right">CGST ({data.cgstPercent}%)</td>
              <td className="py-1 px-2 text-right">{data.cgstAmount?.toFixed(2)}</td>
            </tr>
            <tr className="border-b border-black font-medium">
              <td colSpan={6} className="border-r border-black py-1 px-3 text-right">SGST ({data.sgstPercent}%)</td>
              <td className="py-1 px-2 text-right">{data.sgstAmount?.toFixed(2)}</td>
            </tr>
            <tr className="border-b border-black font-extrabold text-[11px] bg-slate-50">
              <td colSpan={6} className="border-r border-black py-2 px-3 text-right">Total Value( ₹)</td>
              <td className="py-2 px-2 text-right">{data.totalAmount?.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Total in words box */}
        <div className="border-x border-b border-black p-2 bg-slate-50 font-bold mb-3">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-3">Total Amount (in words)</div>
            <div className="col-span-9 font-normal">{amountInWords}</div>
          </div>
        </div>

        {/* Legal Disclaimers */}
        <div className="border border-black p-2 text-[9px] text-slate-700 space-y-0.5 mb-3 leading-tight">
          <div>Telecommunication services to be provided by Reliance Jio Infocomm Limited</div>
          <div>Platform services to be provided by Jio Platforms Limited</div>
          <div>All disputes are subjected to Mumbai Jurisdiction</div>
          <div>Tax is not payable under Reverse Charge basis for this supply.</div>
        </div>

        {/* Declaration & Digital Signature Box */}
        <div className="border border-black p-2 flex justify-between items-end mb-4">
          <div className="text-[9.5px]">
            <span className="font-bold">Declaration :</span> Certified that all the particulars given above are true and correct
          </div>
          <div className="border border-slate-400 p-2 text-[8px] text-slate-600 bg-slate-50 w-56 text-left">
            <div className="font-bold text-black">Digitally signed by DS RELIANCE RETAIL LIMITED</div>
            <div>Date: {data.digitalSignDate} IST</div>
            <div>Reason: Invoice</div>
            <div>Location: {data.placeOfSupply}</div>
            <div className="text-center font-bold text-[9px] mt-1 pt-1 border-t border-slate-300 text-black">
              Digital Signature
            </div>
          </div>
        </div>
      </div>

      {/* Registered Office Footer */}
      <div className="border-t border-black pt-2 text-center text-[8.5px] text-slate-600">
        Registered Office: Reliance Retail Limited 3rd floor, Court House, Lokmanya Tilak Marg, Dhobi Talao, Mumbai - 400002
        <br />
        CIN: {data.cin} | www.relianceretail.com
      </div>
    </div>
  );
};

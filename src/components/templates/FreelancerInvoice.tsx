import React, { useState, useEffect } from 'react';
import { FreelanceInvoiceData } from '../../types';
import { generateQrDataUrl, buildUpiUri } from '../../utils/qrGenerator';
import { numberToIndianWords } from '../../utils/numberToWords';
import { Upload } from 'lucide-react';

interface Props {
  data: FreelanceInvoiceData;
  onChange?: (updated: FreelanceInvoiceData) => void;
  scale?: number;
}

export const FreelancerInvoice: React.FC<Props> = ({ data, onChange, scale = 1 }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  const subtotal = data.items?.reduce((sum, item) => sum + item.amount, 0) || 0;
  const discountAmt = (subtotal * (data.discountPercent || 0)) / 100;
  const taxable = subtotal - discountAmt;
  const taxAmt = (taxable * (data.taxPercent || 0)) / 100;
  const totalAmount = taxable + taxAmt;

  useEffect(() => {
    const upiUri = buildUpiUri({
      payeeAddress: data.upiId || 'freelancer@icici',
      payeeName: data.freelancerName,
      amount: totalAmount,
      transactionNote: `Invoice ${data.invoiceNo}`,
    });
    generateQrDataUrl(upiUri, { width: 130, margin: 0 }).then(setQrUrl);
  }, [totalAmount, data.invoiceNo, data.freelancerName, data.upiId]);

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
  const isYearly = data.billingCycle === 'yearly';

  return (
    <div
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      className="bg-white text-slate-900 font-sans text-[11px] leading-normal p-8 w-[794px] min-h-[1050px] mx-auto shadow-2xl border border-slate-200 select-text flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-indigo-600 pb-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-black text-indigo-900 tracking-tight">{data.freelancerName}</div>
              {data.customLogoUrl && (
                <div className="relative group cursor-pointer inline-block">
                  <img src={data.customLogoUrl} alt="Freelancer Logo" className="max-h-8 max-w-[120px] object-contain ml-2 inline" />
                  <label className="absolute inset-0 bg-black/60 text-white text-[8px] font-bold flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition rounded cursor-pointer no-export">
                    <Upload className="w-3 h-3" />
                    <span>Change</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              )}
            </div>
            <div className="text-xs text-indigo-600 font-bold">{data.businessTitle}</div>
            <div className="text-[10px] text-slate-600 mt-1 max-w-sm">{data.freelancerAddress}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Email: {data.freelancerEmail} | Phone: {data.freelancerPhone}
            </div>
            {data.freelancerGstin && (
              <div className="text-[9.5px] text-slate-500 font-semibold">GSTIN: {data.freelancerGstin}</div>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {isYearly ? 'ANNUAL INVOICE' : 'INVOICE'}
            </div>
            <div className="text-xs font-mono font-bold text-slate-600 mt-1">#{data.invoiceNo}</div>
            <div className="mt-2 space-y-0.5 text-[10px] text-slate-600">
              <div><span className="font-semibold">Invoice Date:</span> {data.invoiceDate}</div>
              <div><span className="font-semibold text-red-600">Due Date:</span> {data.dueDate}</div>
            </div>
          </div>
        </div>

        {/* Client Info Grid */}
        <div className="bg-slate-50 border border-slate-200 rounded p-4 mb-6">
          <div className="text-[10px] font-black uppercase tracking-wider text-indigo-900 mb-1">
            BILLED TO / CLIENT DETAILS:
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-bold text-xs text-slate-900">{data.clientName}</div>
              <div className="font-semibold text-slate-700">{data.clientCompany}</div>
              <div className="text-slate-600 text-[10.5px] mt-0.5">{data.clientAddress}</div>
            </div>
            <div className="text-right text-[10.5px] space-y-0.5 text-slate-600">
              <div><span className="font-semibold">Email:</span> {data.clientEmail}</div>
              {data.clientGstin && <div><span className="font-semibold">GSTIN:</span> {data.clientGstin}</div>}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="border border-slate-200 rounded overflow-hidden mb-6">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-indigo-950 text-white font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Service / Deliverable Description</th>
                <th className="py-2.5 px-3 text-center w-20">Qty / Hrs</th>
                <th className="py-2.5 px-3 text-right w-28">Rate (₹)</th>
                <th className="py-2.5 px-3 text-right w-32">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.items?.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-medium text-slate-800">{item.description}</td>
                  <td className="py-2.5 px-3 text-center">{item.qty}</td>
                  <td className="py-2.5 px-3 text-right">₹{item.rate?.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-semibold">₹{item.amount?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t border-slate-300 font-semibold">
                <td colSpan={3} className="py-2 px-3 text-right">Subtotal:</td>
                <td className="py-2 px-3 text-right">₹{subtotal.toFixed(2)}</td>
              </tr>
              {data.discountPercent > 0 && (
                <tr className="bg-slate-50 text-green-700">
                  <td colSpan={3} className="py-1 px-3 text-right">Discount ({data.discountPercent}%):</td>
                  <td className="py-1 px-3 text-right">- ₹{discountAmt.toFixed(2)}</td>
                </tr>
              )}
              {data.taxPercent > 0 && (
                <tr className="bg-slate-50 text-slate-700">
                  <td colSpan={3} className="py-1 px-3 text-right">GST ({data.taxPercent}%):</td>
                  <td className="py-1 px-3 text-right">₹{taxAmt.toFixed(2)}</td>
                </tr>
              )}
              <tr className="bg-indigo-900 text-white font-extrabold text-[12px]">
                <td colSpan={3} className="py-2.5 px-3 text-right uppercase">TOTAL AMOUNT DUE:</td>
                <td className="py-2.5 px-3 text-right text-sm">₹{totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Amount in words */}
        <div className="bg-slate-100 p-2.5 rounded border border-slate-200 font-medium text-[10.5px] mb-6">
          <span className="font-bold text-slate-800">In Words:</span> {amountInWords}
        </div>

        {/* Payment & Bank Details + QR Code */}
        <div className="grid grid-cols-12 gap-4 border border-slate-200 rounded p-4 bg-slate-50 mb-6 items-center">
          <div className="col-span-8 space-y-1 text-[10.5px]">
            <div className="font-bold text-indigo-950 uppercase text-[11px] mb-1">
              Bank Transfer / Payment Methods:
            </div>
            <div><span className="font-semibold text-slate-600">Bank Name:</span> {data.bankName}</div>
            <div><span className="font-semibold text-slate-600">Account Number:</span> <span className="font-mono font-bold">{data.accountNo}</span></div>
            <div><span className="font-semibold text-slate-600">IFSC Code:</span> <span className="font-mono font-bold">{data.ifscCode}</span></div>
            <div><span className="font-semibold text-slate-600">UPI ID:</span> <span className="font-mono font-bold text-indigo-700">{data.upiId}</span></div>
            <div className="text-[10px] text-slate-500 pt-1">Payment Terms: {data.paymentTerms || 'Due upon receipt'}</div>
          </div>
          <div className="col-span-4 flex flex-col items-center justify-center text-center border-l border-slate-300 pl-4">
            {qrUrl && <img src={qrUrl} alt="Freelancer UPI QR" className="w-20 h-20 border border-slate-300 p-1 bg-white" />}
            <span className="text-[8.5px] font-bold text-slate-700 mt-1">Scan to Pay directly via UPI</span>
          </div>
        </div>
      </div>

      {/* Signature & Terms */}
      <div className="flex justify-between items-end border-t border-slate-300 pt-4">
        <div className="text-[9.5px] text-slate-500 max-w-sm">
          {data.notes || 'Thank you for your business! Please quote invoice number during wire transfer.'}
        </div>
        <div className="text-center">
          <div className="font-serif italic text-blue-900 text-base font-bold">{data.signatureName || data.freelancerName}</div>
          <div className="border-t border-slate-800 w-40 pt-1 text-[9px] font-bold uppercase text-slate-700">
            Authorized Signature
          </div>
        </div>
      </div>
    </div>
  );
};

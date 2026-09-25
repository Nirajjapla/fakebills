import React, { useState, useEffect } from 'react';
import { MedicalPharmacyData } from '../../types';
import { generateQrDataUrl, buildUpiUri } from '../../utils/qrGenerator';
import { numberToIndianWords } from '../../utils/numberToWords';
import { Upload } from 'lucide-react';

interface Props {
  data: MedicalPharmacyData;
  onChange?: (updated: MedicalPharmacyData) => void;
  scale?: number;
}

export const MedicalPharmacyInvoice: React.FC<Props> = ({ data, onChange, scale = 1 }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const upiUri = buildUpiUri({
      payeeAddress: data.upiId || 'apollo.pharmacy@hdfcbank',
      payeeName: data.pharmacyName,
      amount: data.grandTotal,
      transactionNote: `Rx Bill ${data.billNo}`,
    });
    generateQrDataUrl(upiUri, { width: 130, margin: 0 }).then(setQrUrl);
  }, [data.grandTotal, data.billNo, data.pharmacyName, data.upiId]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onChange) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ ...data, customLogoUrl: event.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const amountInWords = numberToIndianWords(data.grandTotal);

  return (
    <div
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      className="bg-white text-slate-900 font-sans text-[10px] leading-normal p-6 w-[794px] min-h-[1050px] mx-auto shadow-2xl border border-slate-300 select-text flex flex-col justify-between"
    >
      <div>
        {/* Pharmacy Header */}
        <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-3 mb-3">
          <div className="flex items-center space-x-3">
            <div className="relative group cursor-pointer">
              {data.customLogoUrl ? (
                <img src={data.customLogoUrl} alt="Pharmacy Logo" className="max-h-12 max-w-[140px] object-contain" />
              ) : (
                <div className="w-10 h-10 bg-emerald-700 text-white font-black text-xl flex items-center justify-center rounded">
                  ✚
                </div>
              )}
              <label className="absolute inset-0 bg-black/60 text-white text-[8px] font-bold flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition rounded cursor-pointer no-export">
                <Upload className="w-3 h-3" />
                <span>Change</span>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">{data.pharmacyName}</h1>
              <div className="text-[10px] text-slate-600 max-w-md">{data.address}</div>
              <div className="text-[9px] text-slate-500 font-medium mt-0.5">
                DL No: <span className="font-bold text-black">{data.dlNumber}</span> | GSTIN: {data.gstin} | Ph: {data.phone}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-emerald-700 text-white px-2 py-0.5 font-bold uppercase text-[9.5px] rounded">
              RETAIL TAX INVOICE
            </div>
            <div className="mt-1 space-y-0.5 text-[9.5px] text-slate-700">
              <div><span className="font-bold">Bill No:</span> {data.billNo}</div>
              <div><span className="font-bold">Date:</span> {data.date}</div>
            </div>
          </div>
        </div>

        {/* Doctor & Patient Info Box */}
        <div className="border border-slate-300 rounded p-2.5 bg-slate-50 grid grid-cols-2 gap-4 mb-4 text-[10px]">
          <div>
            <div><span className="font-bold">Doctor:</span> <span className="font-semibold text-blue-900">{data.doctorName}</span></div>
            <div className="mt-1"><span className="font-bold">Patient Name:</span> {data.patientName}</div>
          </div>
          <div className="text-right space-y-1">
            <div><span className="font-bold">Age / Gender:</span> {data.patientAge} / {data.patientGender}</div>
            <div><span className="font-bold">Payment Mode:</span> UPI / Card</div>
          </div>
        </div>

        {/* Medicines Table */}
        <div className="border border-slate-300 rounded overflow-hidden mb-4">
          <table className="w-full text-left text-[9.5px] border-collapse">
            <thead>
              <tr className="bg-slate-800 text-white font-bold uppercase text-[9px]">
                <th className="py-1.5 px-2">Sr</th>
                <th className="py-1.5 px-2">Medicine / Item Name</th>
                <th className="py-1.5 px-2 text-center">Batch No</th>
                <th className="py-1.5 px-2 text-center">Exp.</th>
                <th className="py-1.5 px-2 text-center">HSN</th>
                <th className="py-1.5 px-2 text-center">Qty</th>
                <th className="py-1.5 px-2 text-right">MRP</th>
                <th className="py-1.5 px-2 text-right">Rate</th>
                <th className="py-1.5 px-2 text-right">GST%</th>
                <th className="py-1.5 px-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.items?.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-1 px-2 text-slate-500">{idx + 1}</td>
                  <td className="py-1 px-2 font-bold text-slate-800">{item.name}</td>
                  <td className="py-1 px-2 text-center font-mono text-slate-600">{item.batchNo}</td>
                  <td className="py-1 px-2 text-center text-slate-600">{item.expDate}</td>
                  <td className="py-1 px-2 text-center text-slate-500">{item.hsn}</td>
                  <td className="py-1 px-2 text-center font-semibold">{item.qty}</td>
                  <td className="py-1 px-2 text-right text-slate-500">₹{item.mrp?.toFixed(2)}</td>
                  <td className="py-1 px-2 text-right">₹{item.rate?.toFixed(2)}</td>
                  <td className="py-1 px-2 text-right">{item.gstPercent}%</td>
                  <td className="py-1 px-2 text-right font-bold">₹{item.amount?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 border-t border-slate-300 font-semibold">
                <td colSpan={9} className="py-1 px-3 text-right">Sub Total:</td>
                <td className="py-1 px-2 text-right font-bold">₹{data.subTotal?.toFixed(2)}</td>
              </tr>
              {data.discount > 0 && (
                <tr className="text-green-700 bg-green-50">
                  <td colSpan={9} className="py-1 px-3 text-right font-medium">Healthcare Discount:</td>
                  <td className="py-1 px-2 text-right font-semibold">- ₹{data.discount?.toFixed(2)}</td>
                </tr>
              )}
              <tr className="bg-slate-100">
                <td colSpan={9} className="py-1 px-3 text-right text-slate-600">Total GST Included:</td>
                <td className="py-1 px-2 text-right">₹{data.gstAmount?.toFixed(2)}</td>
              </tr>
              <tr className="bg-emerald-700 text-white font-extrabold text-[11px]">
                <td colSpan={9} className="py-1.5 px-3 text-right uppercase">NET AMOUNT PAYABLE:</td>
                <td className="py-1.5 px-2 text-right text-sm">₹{data.grandTotal?.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Amount in words */}
        <div className="bg-slate-50 border border-slate-200 p-2 rounded text-[9.5px] font-medium mb-3">
          <span className="font-bold">In Words:</span> {amountInWords}
        </div>

        {/* Schedule H warning */}
        <div className="border border-red-300 bg-red-50/70 p-2 rounded text-[8.5px] text-red-900 leading-tight mb-4">
          <span className="font-bold">SCHEDULE H PRESCRIPTION DRUG WARNING:</span> To be sold by retail on the prescription of a Registered Medical Practitioner only. Store in a cool, dry place. Keep medicines out of reach of children.
        </div>
      </div>

      {/* Footer & QR */}
      <div className="border-t border-slate-300 pt-3 flex justify-between items-end">
        <div className="flex items-center space-x-3">
          {qrUrl && (
            <div className="border border-slate-200 p-1 rounded bg-white text-center">
              <img src={qrUrl} alt="Pharmacy QR" className="w-16 h-16" />
              <span className="text-[7.5px] text-slate-500 font-bold block">Digital Pay</span>
            </div>
          )}
          <div className="text-[8.5px] text-slate-500">
            <div>Goods once sold cannot be returned without original batch verification.</div>
            <div>Consult doctor before substituting any medication.</div>
          </div>
        </div>

        <div className="text-center">
          <div className="font-serif italic text-blue-900 text-sm font-bold">R. Ramesh Kumar</div>
          <div className="border-t border-slate-800 w-36 pt-0.5 text-[8.5px] font-bold uppercase text-slate-700">
            Registered Pharmacist
          </div>
        </div>
      </div>
    </div>
  );
};

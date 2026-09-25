import React, { useState, useEffect } from 'react';
import { SupermarketBillData } from '../../types';
import { BrandAssets } from '../../utils/brandAssets';
import { generateQrDataUrl, buildUpiUri } from '../../utils/qrGenerator';
import { Upload } from 'lucide-react';

interface Props {
  data: SupermarketBillData;
  onChange?: (updated: SupermarketBillData) => void;
  scale?: number;
}

export const SupermarketBill: React.FC<Props> = ({ data, onChange, scale = 1 }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const upiUri = buildUpiUri({
      payeeAddress: data.upiId || 'dmart.store@icici',
      payeeName: data.storeName,
      amount: data.totalAmount,
      transactionNote: `Supermarket Bill ${data.billNo}`,
    });
    generateQrDataUrl(upiUri, { width: 120, margin: 0 }).then(setQrUrl);
  }, [data.totalAmount, data.billNo, data.storeName, data.upiId]);

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
      className="bg-white text-black font-mono text-[11.5px] leading-relaxed p-6 w-[340px] mx-auto shadow-2xl border border-dashed border-slate-400 select-text relative"
    >
      {/* Supermarket Header */}
      <div className="text-center space-y-0.5 mb-2 leading-snug">
        {data.customLogoUrl && (
          <div className="flex justify-center mb-1 relative group cursor-pointer">
            <img src={data.customLogoUrl} alt="Store Logo" className="max-h-10 max-w-[140px] object-contain" />
            <label className="absolute inset-0 bg-black/60 text-white text-[8px] font-sans font-bold flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition rounded cursor-pointer no-export">
              <Upload className="w-3 h-3" />
              <span>Change</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
        )}
        <div className="font-black text-base uppercase tracking-tight">{data.storeName}</div>
        <div className="text-[10px] text-slate-700">{data.branchAddress}</div>
        <div className="text-[9px] text-slate-600 font-sans">
          GSTIN: {data.gstin} | CIN: {data.cin}
        </div>
        <div className="text-[9.5px] text-slate-700">Phone: {data.phone}</div>
      </div>

      <div className="border-t border-black my-2"></div>

      {/* Bill & Cashier Info */}
      <div className="text-[10.5px] space-y-0.5 mb-2 leading-normal">
        <div className="flex justify-between py-0.5">
          <span>Bill No: <span className="font-bold">{data.billNo}</span></span>
          <span>Cashier: {data.cashierName}</span>
        </div>
        <div className="flex justify-between py-0.5">
          <span>Date: {data.date}</span>
          <span>Time: {data.time}</span>
        </div>
        {data.customerName && (
          <div className="py-0.5">Cust: <span className="font-semibold">{data.customerName}</span></div>
        )}
      </div>

      <div className="border-t border-black border-dashed my-1.5"></div>

      {/* Items Table */}
      <table className="w-full text-left text-[11px] mb-2 leading-normal">
        <thead>
          <tr className="border-b border-black font-bold">
            <th className="py-1 px-0.5">Item Description</th>
            <th className="py-1 px-0.5 text-center w-6">Qty</th>
            <th className="py-1 px-0.5 text-right w-12">MRP</th>
            <th className="py-1 px-0.5 text-right w-14">Net Amt</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dotted divide-slate-300">
          {data.items?.map((item, idx) => (
            <tr key={idx}>
              <td className="py-1 px-0.5">
                <div className="font-semibold">{item.name}</div>
                {item.barcode && <div className="text-[8.5px] text-slate-500">{item.barcode}</div>}
              </td>
              <td className="py-1 px-0.5 text-center">{item.qty}</td>
              <td className="py-1 px-0.5 text-right line-through text-slate-400">₹{item.mrp?.toFixed(2)}</td>
              <td className="py-1 px-0.5 text-right font-bold">₹{item.total?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-black my-1.5"></div>

      {/* Total Calculations */}
      <div className="space-y-1 text-[11px] leading-normal">
        <div className="flex justify-between py-0.5">
          <span>Total MRP:</span>
          <span>₹{data.totalMrp?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-green-700 py-0.5">
          <span>Total Savings / Discount:</span>
          <span>- ₹{data.totalSavings?.toFixed(2)}</span>
        </div>
        
        {/* Independent line dividers for Total Amount */}
        <div className="border-t-2 border-black my-1.5"></div>

        <div className="flex justify-between text-[14px] font-black py-0.5">
          <span>TOTAL AMOUNT:</span>
          <span>₹{data.totalAmount?.toFixed(2)}</span>
        </div>

        <div className="border-t-2 border-black my-1.5"></div>

        <div className="flex justify-between text-[10.5px] py-0.5">
          <span>Payment Mode:</span>
          <span className="font-semibold">{data.paymentMode}</span>
        </div>
      </div>

      {/* Big Savings Highlight Badge */}
      {data.totalSavings > 0 && (
        <div className="my-2.5 p-1.5 bg-green-100 border border-green-600 text-green-900 text-center font-bold text-[11px] rounded">
          ★ YOU SAVED ₹{data.totalSavings?.toFixed(2)} TODAY! ★
        </div>
      )}

      {/* Barcode & QR */}
      <div className="flex flex-col items-center justify-center my-3 space-y-1">
        <BrandAssets.Barcode value={data.billNo} height={22} />
        {qrUrl && <img src={qrUrl} alt="Bill QR" className="w-16 h-16 pt-1" />}
      </div>

      <div className="text-center font-bold text-[10.5px] uppercase tracking-wide mt-2">
        Goods once sold can be exchanged within 7 days with original invoice.
      </div>
    </div>
  );
};

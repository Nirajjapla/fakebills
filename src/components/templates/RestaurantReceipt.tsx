import React, { useState, useEffect } from 'react';
import { RestaurantReceiptData } from '../../types';
import { generateQrDataUrl, buildUpiUri } from '../../utils/qrGenerator';
import { numberToIndianWords } from '../../utils/numberToWords';
import { Upload } from 'lucide-react';

interface Props {
  data: RestaurantReceiptData;
  onChange?: (updated: RestaurantReceiptData) => void;
  scale?: number;
}

export const RestaurantReceipt: React.FC<Props> = ({ data, onChange, scale = 1 }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const upiUri = buildUpiUri({
      payeeAddress: data.upiId || 'bistro.pos@icici',
      payeeName: data.restaurantName,
      amount: data.grandTotal,
      transactionNote: `Table ${data.tableNo} Bill ${data.billNo}`,
    });
    generateQrDataUrl(upiUri, { width: 130, margin: 0 }).then(setQrUrl);
  }, [data.grandTotal, data.billNo, data.restaurantName, data.tableNo, data.upiId]);

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
      className="bg-white text-black font-mono text-[12px] leading-relaxed p-6 w-[340px] mx-auto shadow-2xl border border-dashed border-slate-400 select-text relative"
    >
      {/* Restaurant Header */}
      <div className="text-center space-y-0.5 mb-2 leading-snug">
        {data.customLogoUrl && (
          <div className="flex justify-center mb-1 relative group cursor-pointer">
            <img src={data.customLogoUrl} alt="Restaurant Logo" className="max-h-12 max-w-[140px] object-contain" />
            <label className="absolute inset-0 bg-black/60 text-white text-[8px] font-sans font-bold flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition rounded cursor-pointer no-export">
              <Upload className="w-3 h-3" />
              <span>Change</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
        )}
        <div className="font-black text-base uppercase tracking-tight">{data.restaurantName}</div>
        <div className="text-[10px] italic text-slate-700">{data.tagline}</div>
        <div className="text-[10.5px] text-slate-800">{data.address}</div>
        <div className="text-[9.5px] text-slate-600 font-sans">
          GSTIN: {data.gstin} | FSSAI: {data.fssaiNo}
        </div>
        <div className="text-[10px] text-slate-700">Ph: {data.phone}</div>
      </div>

      <div className="border-t-2 border-black border-dashed my-2"></div>

      {/* Bill & Table Meta */}
      <div className="grid grid-cols-2 gap-1 text-[11px] mb-2 leading-normal">
        <div><span className="font-bold">Bill No:</span> {data.billNo}</div>
        <div className="text-right"><span className="font-bold">Table:</span> {data.tableNo}</div>
        <div><span className="font-bold">Date:</span> {data.date}</div>
        <div className="text-right"><span className="font-bold">Time:</span> {data.time}</div>
        <div><span className="font-bold">Server:</span> {data.serverName}</div>
        <div className="text-right"><span className="font-bold">Type:</span> Dine In</div>
      </div>

      <div className="border-t border-black my-1.5"></div>

      {/* Itemized Table */}
      <table className="w-full text-left text-[11.5px] mb-2 leading-normal">
        <thead>
          <tr className="border-b border-black font-bold">
            <th className="py-1 px-0.5">Item</th>
            <th className="py-1 px-0.5 text-center w-8">Qty</th>
            <th className="py-1 px-0.5 text-right w-14">Rate</th>
            <th className="py-1 px-0.5 text-right w-16">Amt</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dotted divide-slate-300">
          {data.items?.map((item, idx) => (
            <tr key={idx}>
              <td className="py-1 px-0.5 font-semibold">{item.name}</td>
              <td className="py-1 px-0.5 text-center">{item.qty}</td>
              <td className="py-1 px-0.5 text-right">{item.rate?.toFixed(2)}</td>
              <td className="py-1 px-0.5 text-right font-medium">{item.amount?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-black my-1.5"></div>

      {/* Charges Breakdown */}
      <div className="space-y-1 text-[11.5px] leading-normal">
        <div className="flex justify-between py-0.5">
          <span>Sub Total:</span>
          <span>₹{data.subTotal?.toFixed(2)}</span>
        </div>
        {data.discount > 0 && (
          <div className="flex justify-between text-green-700 py-0.5">
            <span>Discount:</span>
            <span>- ₹{data.discount?.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-[10.5px] text-slate-700 py-0.5">
          <span>CGST ({data.cgstPercent}%):</span>
          <span>₹{((data.subTotal * data.cgstPercent) / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[10.5px] text-slate-700 py-0.5">
          <span>SGST ({data.sgstPercent}%):</span>
          <span>₹{((data.subTotal * data.sgstPercent) / 100).toFixed(2)}</span>
        </div>
        {data.serviceChargePercent > 0 && (
          <div className="flex justify-between text-[10.5px] py-0.5">
            <span>Service Charge ({data.serviceChargePercent}%):</span>
            <span>₹{((data.subTotal * data.serviceChargePercent) / 100).toFixed(2)}</span>
          </div>
        )}
        {data.tip > 0 && (
          <div className="flex justify-between text-[10.5px] py-0.5">
            <span>Tip / Gratuity:</span>
            <span>₹{data.tip?.toFixed(2)}</span>
          </div>
        )}

        {/* Independent line dividers for Grand Total */}
        <div className="border-t-2 border-black my-1.5"></div>

        <div className="flex justify-between text-[14px] font-black py-0.5">
          <span>GRAND TOTAL:</span>
          <span>₹{data.grandTotal?.toFixed(2)}</span>
        </div>

        <div className="border-t-2 border-black my-1.5"></div>
      </div>

      <div className="text-[9.5px] text-slate-600 italic mt-1 font-sans">
        In Words: {amountInWords}
      </div>

      {/* Dynamic UPI Payment QR Code */}
      {qrUrl && (
        <div className="flex flex-col items-center justify-center my-3 pt-2 border-t border-dashed border-slate-400">
          <img src={qrUrl} alt="Table UPI QR" className="w-20 h-20" />
          <span className="text-[9px] font-bold text-slate-700 mt-1">Scan & Pay at Table via UPI</span>
        </div>
      )}

      {/* WiFi info & gratitude */}
      {data.wifiPassword && (
        <div className="text-center text-[10px] bg-slate-100 p-1.5 rounded font-sans my-2">
          Guest WiFi: <span className="font-bold">{data.wifiPassword}</span>
        </div>
      )}

      <div className="text-center font-bold text-[11px] uppercase tracking-wider mt-2">
        Thank You! Visit Again!
      </div>
    </div>
  );
};

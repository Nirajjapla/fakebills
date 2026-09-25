import React, { useState, useEffect } from 'react';
import { ECommerceInvoiceData } from '../../types';
import { generateQrDataUrl, buildUpiUri } from '../../utils/qrGenerator';
import { numberToIndianWords } from '../../utils/numberToWords';
import { Upload } from 'lucide-react';

interface Props {
  data: ECommerceInvoiceData;
  onChange?: (updated: ECommerceInvoiceData) => void;
  scale?: number;
}

export const ECommerceInvoice: React.FC<Props> = ({ data, onChange, scale = 1 }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const upiUri = buildUpiUri({
      payeeAddress: data.upiId || 'amazonpay@apl',
      payeeName: data.sellerName,
      amount: data.grandTotal,
      transactionNote: `Order ${data.orderId}`,
    });
    generateQrDataUrl(upiUri, { width: 130, margin: 0 }).then(setQrUrl);
  }, [data.grandTotal, data.orderId, data.sellerName, data.upiId]);

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
      className="bg-white text-slate-900 font-sans text-[10px] leading-normal p-8 w-[794px] min-h-[1050px] mx-auto shadow-2xl border border-slate-300 select-text flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-300 pb-3 mb-4">
          <div>
            <div className="text-xl font-black tracking-tight text-slate-900">Tax Invoice / Bill of Supply</div>
            <div className="text-[9px] text-slate-500">(Original for Recipient)</div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end space-x-2">
              <div className="font-extrabold text-sm text-slate-800">{data.sellerName}</div>
              {data.customLogoUrl && (
                <div className="relative group cursor-pointer inline-block">
                  <img src={data.customLogoUrl} alt="Seller Logo" className="max-h-7 max-w-[100px] object-contain ml-1 inline" />
                  <label className="absolute inset-0 bg-black/60 text-white text-[8px] font-bold flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition rounded cursor-pointer no-export">
                    <Upload className="w-3 h-3" />
                    <span>Change</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              )}
            </div>
            <div className="text-[9px] text-slate-600 max-w-xs">{data.sellerAddress}</div>
            <div className="text-[9px] text-slate-500 font-medium">
              GSTIN: {data.sellerGstin} | PAN: {data.sellerPan}
            </div>
          </div>
        </div>

        {/* Order & Invoice Meta */}
        <div className="grid grid-cols-2 gap-4 border border-slate-300 rounded p-2.5 bg-slate-50 mb-4 text-[9.5px]">
          <div className="space-y-0.5">
            <div><span className="font-bold">Order Number:</span> {data.orderId}</div>
            <div><span className="font-bold">Order Date:</span> {data.orderDate}</div>
          </div>
          <div className="text-right space-y-0.5">
            <div><span className="font-bold">Invoice Number:</span> {data.invoiceNo}</div>
            <div><span className="font-bold">Invoice Date:</span> {data.invoiceDate}</div>
          </div>
        </div>

        {/* Billing & Shipping Address Grid */}
        <div className="grid grid-cols-2 gap-4 border border-slate-300 rounded p-3 mb-4 text-[9.5px]">
          <div>
            <div className="font-bold uppercase text-slate-700 border-b pb-1 mb-1">Billing Address</div>
            <div className="font-semibold text-black">{data.billingAddress?.fullName}</div>
            <div>{data.billingAddress?.addressLine1}</div>
            <div>{data.billingAddress?.addressLine2}</div>
            <div>{data.billingAddress?.city}, {data.billingAddress?.state} - {data.billingAddress?.pincode}</div>
            <div>Phone: {data.billingAddress?.phone}</div>
            {data.billingAddress?.gstin && <div>GSTIN: {data.billingAddress?.gstin}</div>}
          </div>
          <div>
            <div className="font-bold uppercase text-slate-700 border-b pb-1 mb-1">Shipping Address</div>
            <div className="font-semibold text-black">{data.shippingAddress?.fullName || data.billingAddress?.fullName}</div>
            <div>{data.shippingAddress?.addressLine1 || data.billingAddress?.addressLine1}</div>
            <div>{data.shippingAddress?.addressLine2 || data.billingAddress?.addressLine2}</div>
            <div>{data.shippingAddress?.city || data.billingAddress?.city}, {data.shippingAddress?.state || data.billingAddress?.state} - {data.shippingAddress?.pincode || data.billingAddress?.pincode}</div>
            <div>Phone: {data.shippingAddress?.phone || data.billingAddress?.phone}</div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-slate-300 rounded overflow-hidden mb-4">
          <table className="w-full text-left text-[9px] border-collapse">
            <thead>
              <tr className="bg-slate-100 font-bold border-b border-slate-300 text-slate-700">
                <th className="py-2 px-2">SI.</th>
                <th className="py-2 px-2">Description</th>
                <th className="py-2 px-2 text-center">HSN/SAC</th>
                <th className="py-2 px-2 text-right">Unit Price</th>
                <th className="py-2 px-2 text-center">Qty</th>
                <th className="py-2 px-2 text-right">Net Amount</th>
                <th className="py-2 px-2 text-right">Tax Rate</th>
                <th className="py-2 px-2 text-right">Tax Amount</th>
                <th className="py-2 px-2 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.items?.map((item, idx) => {
                const taxAmt = (item.amount * (item.taxRate || 18)) / 100;
                const total = item.amount + taxAmt;
                return (
                  <tr key={idx}>
                    <td className="py-1.5 px-2 text-slate-500">{idx + 1}</td>
                    <td className="py-1.5 px-2 font-medium text-slate-800">{item.description}</td>
                    <td className="py-1.5 px-2 text-center text-slate-500">{item.hsnSac || '8517'}</td>
                    <td className="py-1.5 px-2 text-right">₹{item.rate?.toFixed(2)}</td>
                    <td className="py-1.5 px-2 text-center">{item.qty}</td>
                    <td className="py-1.5 px-2 text-right">₹{item.amount?.toFixed(2)}</td>
                    <td className="py-1.5 px-2 text-right">{item.taxRate || 18}%</td>
                    <td className="py-1.5 px-2 text-right">₹{taxAmt.toFixed(2)}</td>
                    <td className="py-1.5 px-2 text-right font-semibold">₹{total.toFixed(2)}</td>
                  </tr>
                );
              })}
              {data.shippingFee > 0 && (
                <tr>
                  <td className="py-1.5 px-2 text-slate-500">{data.items.length + 1}</td>
                  <td className="py-1.5 px-2 text-slate-700">Standard Shipping & Handling Charges</td>
                  <td className="py-1.5 px-2 text-center text-slate-500">996813</td>
                  <td className="py-1.5 px-2 text-right">₹{data.shippingFee?.toFixed(2)}</td>
                  <td className="py-1.5 px-2 text-center">1</td>
                  <td className="py-1.5 px-2 text-right">₹{data.shippingFee?.toFixed(2)}</td>
                  <td className="py-1.5 px-2 text-right">18%</td>
                  <td className="py-1.5 px-2 text-right">₹{(data.shippingFee * 0.18).toFixed(2)}</td>
                  <td className="py-1.5 px-2 text-right font-semibold">₹{(data.shippingFee * 1.18).toFixed(2)}</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t border-slate-300 font-medium">
                <td colSpan={7} className="py-1.5 px-3 text-right">Total Taxable Value:</td>
                <td colSpan={2} className="py-1.5 px-2 text-right font-bold">₹{data.totalTaxable?.toFixed(2)}</td>
              </tr>
              <tr className="bg-slate-50">
                <td colSpan={7} className="py-1 px-3 text-right">CGST / SGST Breakdown:</td>
                <td colSpan={2} className="py-1 px-2 text-right">₹{(data.cgstAmount + data.sgstAmount).toFixed(2)}</td>
              </tr>
              <tr className="bg-slate-900 text-white font-extrabold text-[11px]">
                <td colSpan={7} className="py-2 px-3 text-right uppercase">GRAND TOTAL:</td>
                <td colSpan={2} className="py-2 px-2 text-right text-xs">₹{data.grandTotal?.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Amount in words */}
        <div className="bg-slate-50 border border-slate-200 p-2 rounded text-[9.5px] font-medium mb-3">
          <span className="font-bold">Amount in Words:</span> {amountInWords}
        </div>

        <div className="text-[8.5px] text-slate-500 space-y-0.5 mb-4">
          <div>Whether tax is payable under reverse charge: <span className="font-bold">No</span></div>
          <div>All disputes subject to seller jurisdiction. For return policy, visit customer support.</div>
        </div>
      </div>

      {/* Footer & Signature */}
      <div className="border-t border-slate-300 pt-3 flex justify-between items-end">
        <div className="flex items-center space-x-3">
          {qrUrl && <img src={qrUrl} alt="E-Invoice QR" className="w-16 h-16 border border-slate-200 p-0.5" />}
          <div className="text-[8px] text-slate-400">
            <div>Authorized marketplace invoice</div>
            <div>Digitally certified tax document</div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-[8.5px] text-slate-500">For {data.sellerName}:</div>
          <div className="font-serif italic text-blue-900 text-sm font-bold">Authorized Signatory</div>
          <div className="border-t border-slate-700 w-36 pt-0.5 text-[8px] font-bold uppercase text-slate-700">
            Signatory Stamp
          </div>
        </div>
      </div>
    </div>
  );
};

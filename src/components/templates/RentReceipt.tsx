import React, { useState, useEffect } from 'react';
import { RentReceiptData } from '../../types';
import { BrandAssets } from '../../utils/brandAssets';
import { generateQrDataUrl, buildUpiUri } from '../../utils/qrGenerator';
import { numberToIndianWords } from '../../utils/numberToWords';

interface Props {
  data: RentReceiptData;
  onChange?: (updated: RentReceiptData) => void;
  scale?: number;
}

export const RentReceipt: React.FC<Props> = ({ data, scale = 1 }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const upiUri = buildUpiUri({
      payeeAddress: data.upiId || 'landlord@upi',
      payeeName: data.landlordName,
      amount: data.rentAmount,
      transactionNote: `Rent ${data.rentMonthYear}`,
    });
    generateQrDataUrl(upiUri, { width: 130, margin: 0 }).then(setQrUrl);
  }, [data.rentAmount, data.landlordName, data.rentMonthYear, data.upiId]);

  const amountInWords = numberToIndianWords(data.rentAmount);
  const isYearly = data.billingCycle === 'yearly';

  return (
    <div
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      className="bg-white text-slate-900 font-serif text-[12px] leading-relaxed p-8 w-[794px] min-h-[600px] mx-auto shadow-2xl border-2 border-slate-700 select-text flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="text-center border-b-2 border-slate-700 pb-3 mb-6">
          <h1 className="text-2xl font-black uppercase tracking-widest text-slate-900 font-sans">
            {isYearly ? 'ANNUAL HOUSE RENT RECEIPT' : 'HOUSE RENT RECEIPT'}
          </h1>
          <p className="text-xs text-slate-600 font-sans mt-0.5">
            (Valid for Income Tax Exemption under Section 10(13A) - HRA)
          </p>
        </div>

        {/* Receipt No & Date */}
        <div className="flex justify-between items-center mb-6 font-sans text-xs">
          <div><span className="font-bold">Receipt No:</span> <span className="font-mono">{data.receiptNo}</span></div>
          <div><span className="font-bold">Date:</span> {data.receiptDate}</div>
        </div>

        {/* Main Body */}
        <div className="space-y-4 text-[13px] leading-loose text-slate-900">
          <p>
            Received a sum of <span className="font-bold text-base font-sans">₹{data.rentAmount?.toLocaleString('en-IN')}</span>{' '}
            (<span className="font-semibold italic font-sans">{amountInWords}</span>) from{' '}
            <span className="font-bold underline uppercase">{data.tenantName}</span> towards the house rent for the property situated at:
          </p>

          <div className="bg-slate-50 border border-slate-300 p-3 rounded font-sans text-xs text-slate-800 leading-normal">
            <span className="font-bold">Rental Premises:</span> {data.propertyAddress}
          </div>

          <p>
            For the period of <span className="font-bold underline">{data.periodFrom}</span> to{' '}
            <span className="font-bold underline">{data.periodTo}</span> ({isYearly ? `${data.rentMonthYear} (Full Year)` : data.rentMonthYear}) paid via{' '}
            <span className="font-semibold font-sans">{data.paymentMode}</span> (Ref No:{' '}
            <span className="font-mono text-xs">{data.transactionRef}</span>).
          </p>
        </div>

        {/* Landlord Details & PAN */}
        <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-2 gap-4 font-sans text-xs">
          <div className="space-y-1">
            <div><span className="font-bold">Landlord Name:</span> {data.landlordName}</div>
            <div><span className="font-bold">Landlord PAN:</span> <span className="font-mono font-bold bg-slate-100 px-1 py-0.5 rounded">{data.landlordPan || 'Not Specified'}</span></div>
            <div><span className="font-bold">Contact No:</span> {data.landlordPhone}</div>
          </div>
          <div className="text-[10px] text-slate-500 italic">
            * As per CBDT guidelines, Landlord's PAN is mandatory if annual rent exceeds ₹1,00,000.
          </div>
        </div>
      </div>

      {/* Revenue Stamp & Signature Area */}
      <div className="flex justify-between items-end border-t-2 border-slate-700 pt-6 mt-8">
        <div className="flex items-center space-x-3">
          {qrUrl && (
            <div className="border border-slate-300 p-1 bg-white text-center">
              <img src={qrUrl} alt="Rent Payment QR" className="w-16 h-16" />
              <span className="text-[8px] font-sans text-slate-500 block">Payment Proof</span>
            </div>
          )}
        </div>

        <div className="flex items-end space-x-6">
          {data.showRevenueStamp && (
            <div className="flex flex-col items-center">
              <BrandAssets.RevenueStamp amount="1" />
            </div>
          )}
          <div className="text-center font-sans">
            <div className="font-serif italic text-blue-900 text-lg font-bold pb-1">{data.landlordName}</div>
            <div className="border-t border-slate-800 w-44 pt-1 text-[11px] font-bold uppercase text-slate-800">
              Landlord's Signature
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

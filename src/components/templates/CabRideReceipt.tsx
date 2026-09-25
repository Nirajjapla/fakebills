import React, { useState, useEffect } from 'react';
import { CabRideData } from '../../types';
import { generateQrDataUrl, buildUpiUri } from '../../utils/qrGenerator';
import { Upload } from 'lucide-react';

interface Props {
  data: CabRideData;
  onChange?: (updated: CabRideData) => void;
  scale?: number;
}

export const CabRideReceipt: React.FC<Props> = ({ data, onChange, scale = 1 }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const upiUri = buildUpiUri({
      payeeAddress: data.upiId || 'uber.rides@icici',
      payeeName: `${data.company} Rides`,
      amount: data.totalFare,
      transactionNote: `Trip ${data.tripId}`,
    });
    generateQrDataUrl(upiUri, { width: 120, margin: 0 }).then(setQrUrl);
  }, [data.totalFare, data.tripId, data.company, data.upiId]);

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
      className="bg-white text-slate-900 font-sans text-[11px] leading-normal p-6 w-[400px] mx-auto shadow-2xl border border-slate-200 select-text flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="relative group cursor-pointer">
              {data.customLogoUrl ? (
                <img src={data.customLogoUrl} alt="Cab Logo" className="max-h-7 max-w-[90px] object-contain" />
              ) : (
                <div className={`px-2.5 py-1 text-white font-black text-sm rounded ${data.company === 'Uber' ? 'bg-black' : data.company === 'Ola' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                  {data.company}
                </div>
              )}
              <label className="absolute inset-0 bg-black/60 text-white text-[7px] font-bold flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition rounded cursor-pointer no-export">
                <Upload className="w-2.5 h-2.5" />
                <span>Change</span>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
            <span className="font-bold text-slate-700">Trip Receipt</span>
          </div>
          <div className="text-right text-[10px] text-slate-500">
            <div>{data.tripDate}</div>
            <div className="font-mono text-[9px]">ID: {data.tripId}</div>
          </div>
        </div>

        {/* Fare Highlight */}
        <div className="text-center bg-slate-50 border border-slate-200 rounded p-3 mb-4">
          <div className="text-[10px] text-slate-500 font-semibold uppercase">Total Fare Paid</div>
          <div className="text-2xl font-black text-black">₹{data.totalFare?.toFixed(2)}</div>
          <div className="text-[9.5px] text-slate-600 mt-0.5">Paid via {data.paymentMethod}</div>
        </div>

        {/* Route Details */}
        <div className="border border-slate-200 rounded p-3 mb-4 space-y-3 bg-slate-50/50">
          <div className="flex items-start space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1 flex-shrink-0"></div>
            <div>
              <div className="text-[9px] font-bold text-slate-500 uppercase">{data.tripStartTime} - PICKUP</div>
              <div className="font-medium text-slate-800 text-[10.5px]">{data.pickupLocation}</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 mt-1 flex-shrink-0"></div>
            <div>
              <div className="text-[9px] font-bold text-slate-500 uppercase">{data.tripEndTime} - DROP</div>
              <div className="font-medium text-slate-800 text-[10.5px]">{data.dropLocation}</div>
            </div>
          </div>
        </div>

        {/* Ride Stats */}
        <div className="grid grid-cols-2 gap-2 text-center border border-slate-200 rounded p-2 mb-4 text-[10px] bg-slate-50">
          <div>
            <span className="text-slate-500">Distance:</span> <span className="font-bold">{data.distanceKm} km</span>
          </div>
          <div>
            <span className="text-slate-500">Duration:</span> <span className="font-bold">{data.durationMins} mins</span>
          </div>
        </div>

        {/* Fare Breakdown */}
        <div className="space-y-1 text-[10.5px] border-b border-slate-200 pb-3 mb-4">
          <div className="font-bold text-slate-700 uppercase text-[9.5px] mb-1">Fare Breakdown</div>
          <div className="flex justify-between text-slate-600">
            <span>Base Fare</span>
            <span>₹{data.baseFare?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Distance & Time Fare</span>
            <span>₹{(data.distanceFare + data.timeFare)?.toFixed(2)}</span>
          </div>
          {data.waitingFare > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Waiting Charges</span>
              <span>₹{data.waitingFare?.toFixed(2)}</span>
            </div>
          )}
          {data.tollFee > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Tolls & Parking</span>
              <span>₹{data.tollFee?.toFixed(2)}</span>
            </div>
          )}
          {data.discount > 0 && (
            <div className="flex justify-between text-green-700 font-medium">
              <span>Promotion / Discount</span>
              <span>- ₹{data.discount?.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Taxes (5% GST)</span>
            <span>₹{data.taxGst?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-black border-t border-slate-300 pt-1 text-[11.5px]">
            <span>Total Amount</span>
            <span>₹{data.totalFare?.toFixed(2)}</span>
          </div>
        </div>

        {/* Driver & Vehicle Details */}
        <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[10px] space-y-0.5 mb-4">
          <div><span className="font-semibold text-slate-600">Driver Partner:</span> {data.driverName}</div>
          <div><span className="font-semibold text-slate-600">Vehicle:</span> {data.vehicleModel} ({data.vehicleNo})</div>
        </div>
      </div>

      {/* Footer with QR */}
      <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
        {qrUrl && (
          <div className="flex items-center space-x-2">
            <img src={qrUrl} alt="Trip QR" className="w-12 h-12" />
            <span className="text-[8px] text-slate-500">Scan to Verify Trip</span>
          </div>
        )}
        <div className="text-right text-[8px] text-slate-400">
          Electronic Receipt generated for reimbursement.
        </div>
      </div>
    </div>
  );
};

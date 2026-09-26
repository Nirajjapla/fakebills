import React, { useState, useEffect } from 'react';
import { FuelBillData } from '../../types';
import { BrandAssets } from '../../utils/brandAssets';
import { generateQrDataUrl, buildUpiUri } from '../../utils/qrGenerator';
import { Upload } from 'lucide-react';

interface Props {
  data: FuelBillData;
  onChange?: (updated: FuelBillData) => void;
  scale?: number;
  compact?: boolean;
}

export const FuelThermalReceipt: React.FC<Props> = ({
  data,
  onChange,
  scale = 1,
  compact = false,
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const upiUri = buildUpiUri({
      payeeAddress: data.upiId || 'hpcl.dealer@axisbank',
      payeeName: data.dealerName || 'HPCL Fuel Station',
      amount: data.amount,
      transactionNote: `Fuel ${data.billNo}`,
    });
    generateQrDataUrl(upiUri, { width: compact ? 80 : 120, margin: 0 }).then(setQrUrl);
  }, [data.amount, data.dealerName, data.billNo, data.upiId, compact]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onChange) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ ...data, customLogoUrl: event.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const renderBrandLogo = () => {
    if (data.customLogoUrl) {
      return (
        <div className="flex flex-col items-center justify-center p-0.5 bg-white">
          <img
            src={data.customLogoUrl}
            alt="Custom Logo"
            className={`${compact ? 'max-h-9 max-w-[110px]' : 'max-h-16 max-w-[140px]'} object-contain`}
          />
        </div>
      );
    }

    switch (data.brand) {
      case 'IOCL':
        return <BrandAssets.IOCLLogo className={compact ? "w-24 h-12 scale-90" : "w-28 h-16"} />;
      case 'BPCL':
        return <BrandAssets.BPCLLogo className={compact ? "w-24 h-12 scale-90" : "w-28 h-16"} />;
      case 'SHELL':
        return <BrandAssets.ShellLogo className={compact ? "w-24 h-12 scale-90" : "w-28 h-16"} />;
      case 'NAYARA':
        return (
          <div className="border-2 border-black p-1 text-center font-mono font-bold text-[10px]">
            NAYARA ENERGY
          </div>
        );
      case 'HP':
      default:
        return <BrandAssets.HPLogo className={compact ? "w-26 h-13 scale-90" : "w-32 h-20"} />;
    }
  };

  return (
    <div
      style={{ transform: scale !== 1 ? `scale(${scale})` : undefined, transformOrigin: 'top center' }}
      className={`bg-white text-black font-mono select-text relative border border-dashed border-slate-300 ${
        compact
          ? 'p-3 text-[10px] leading-tight w-full max-w-[340px] shadow-sm'
          : 'p-6 text-[12px] leading-relaxed w-[340px] mx-auto shadow-2xl'
      }`}
    >
      {/* Top subtle cut line */}
      <div className={`border-t border-dashed border-slate-300 ${compact ? '-mt-1 mb-1.5' : '-mt-2 mb-3'}`}></div>

      {/* Brand Logo Header with Upload Support */}
      <div className={`relative group flex justify-center cursor-pointer ${compact ? 'mb-1.5' : 'mb-3'}`}>
        {renderBrandLogo()}
        <label className="absolute inset-0 bg-black/50 text-white text-[9px] font-sans font-bold flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition rounded cursor-pointer no-export">
          <Upload className="w-3.5 h-3.5 mb-0.5" />
          <span>Change Logo</span>
          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
        </label>
      </div>

      {/* Pump Station Header */}
      <div className={`text-center font-bold uppercase tracking-tight space-y-0.5 leading-snug ${compact ? 'text-[10px] mb-1.5' : 'text-[12px] mb-2'}`}>
        <div>{data.dealerName || 'SRI SIDDESHWARA SWAMY FS'}</div>
        <div>{data.dealerSub || 'HPCL DEALER'}</div>
        <div>{data.location || 'ETTAKODI MALUR TQ'}</div>
        <div>{data.cityPincode || 'KOLAR DIST.563160'}</div>
      </div>

      {/* Clear Dashed Divider */}
      <div className={`border-t border-black border-dashed ${compact ? 'my-1' : 'my-2'}`}></div>

      {/* Transaction Details */}
      <div className={`space-y-0.5 ${compact ? 'text-[10px] leading-tight' : 'text-[11.5px] leading-normal space-y-1'}`}>
        <div className="flex justify-between py-0.2">
          <span>Bill No</span>
          <span className="font-bold">{data.billNo || 'Jun-217412-ORGNL'}</span>
        </div>
        <div className="flex justify-between py-0.2">
          <span>Trns.ID</span>
          <span>{data.trnsId || '0000000300171246'}</span>
        </div>
        <div className="flex justify-between py-0.2">
          <span>Atnd.ID</span>
          <span>{data.atndId || '01'}</span>
        </div>
        <div className="flex justify-between py-0.2">
          <span>Receipt</span>
          <span>{data.receiptType || 'Physical Receipt'}</span>
        </div>
        <div className="flex justify-between py-0.2">
          <span>Vehi.No</span>
          <span>{data.vehiNo || 'NotEntered'}</span>
        </div>
        <div className="flex justify-between py-0.2">
          <span>Mob.No</span>
          <span>{data.mobNo || 'NotEntered'}</span>
        </div>
        <div className="flex justify-between py-0.2">
          <span>Date</span>
          <span className="font-bold">{data.date || '17/06/2024'}</span>
        </div>
        <div className="flex justify-between py-0.2">
          <span>Time</span>
          <span>{data.time || '19:45:37'}</span>
        </div>
        <div className="flex justify-between py-0.2">
          <span>FP. ID</span>
          <span>{data.fpId || '2'}</span>
        </div>
        <div className="flex justify-between py-0.2">
          <span>Nozl No</span>
          <span>{data.nozlNo || '4'}</span>
        </div>
        <div className="flex justify-between py-0.2">
          <span>Fuel</span>
          <span className="font-bold uppercase">{data.fuelType || 'PETROL'}</span>
        </div>
        <div className="flex justify-between py-0.2">
          <span>Density</span>
          <span>{data.density || '751.1kg/m3'}</span>
        </div>
        <div className="flex justify-between py-0.2">
          <span>Preset</span>
          <span>:Rs.{data.amount?.toFixed(0) || '2000'}</span>
        </div>
        <div className="flex justify-between py-0.2">
          <span>Rate</span>
          <span className="font-bold">:Rs.{data.rate?.toFixed(2) || '101.50'}</span>
        </div>
        
        {/* Independent divider lines so html2canvas never overlaps text */}
        <div className={`border-t border-black ${compact ? 'my-1' : 'my-1.5'}`}></div>

        {/* Highlighted Sale Amount */}
        <div className={`flex justify-between font-black py-0.2 ${compact ? 'text-[11.5px]' : 'text-[13.5px]'}`}>
          <span>Sale</span>
          <span>:Rs.{data.amount?.toFixed(2) || '2000.00'}</span>
        </div>

        <div className={`border-t border-black ${compact ? 'my-1' : 'my-1.5'}`}></div>

        <div className={`flex justify-between font-bold py-0.2 ${compact ? 'text-[10.5px]' : 'text-[12px]'}`}>
          <span>Volume</span>
          <span>:{data.volume?.toFixed(2) || (data.amount / (data.rate || 100)).toFixed(2)}L</span>
        </div>
      </div>

      {/* Dynamic QR Code */}
      {qrUrl && (
        <div className={`flex flex-col items-center justify-center border-t border-dashed border-slate-300 ${compact ? 'my-1.5 pt-1' : 'my-3 pt-2'}`}>
          <img src={qrUrl} alt="UPI Payment QR" className={compact ? "w-14 h-14" : "w-20 h-20"} />
          <span className={`text-slate-600 ${compact ? 'text-[7.5px] mt-0.5' : 'text-[9px] mt-1'}`}>Scan to Verify / Pay via UPI</span>
        </div>
      )}

      {/* Footer message */}
      <div className={`text-center font-black uppercase tracking-widest leading-none ${compact ? 'text-[9px] mt-1.5' : 'text-[11.5px] mt-3'}`}>
        {data.footerNote || 'THANK YOU VISIT AGAIN'}
      </div>

      <div className={`border-b border-dashed border-slate-300 ${compact ? '-mb-1 mt-1.5' : '-mb-2 mt-3'}`}></div>
    </div>
  );
};

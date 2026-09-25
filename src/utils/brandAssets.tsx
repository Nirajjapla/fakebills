import React from 'react';

export const BrandAssets = {
  // HP Logo as in sample 1 - Clean vector layout guaranteed not to overlap in html2canvas
  HPLogo: ({ className = "w-32 h-20" }: { className?: string }) => (
    <div className={`flex flex-col items-center justify-center border-2 border-black px-2 py-1.5 bg-white text-black font-mono select-none ${className}`}>
      <div className="text-[10.5px] font-bold tracking-widest text-center border-b border-black w-full pb-1 mb-1 leading-tight">
        हिन्दुस्तान पेट्रोलियम
      </div>
      <div className="flex items-center justify-center space-x-2 py-0.5">
        <svg viewBox="0 0 36 36" className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor">
          <circle cx="18" cy="18" r="16" strokeWidth="2.5" />
          <circle cx="18" cy="18" r="9" strokeWidth="2" />
          <path d="M18 2 L18 34" strokeWidth="2" />
          <path d="M2 18 L34 18" strokeWidth="1.5" />
        </svg>
        <span className="text-xl font-black tracking-tight leading-none">HP</span>
      </div>
    </div>
  ),

  // IOCL (Indian Oil)
  IOCLLogo: ({ className = "w-28 h-16" }: { className?: string }) => (
    <div className={`flex flex-col items-center justify-center border-2 border-black p-1.5 bg-white text-black font-mono ${className}`}>
      <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-bold text-[10px] bg-slate-100">
        इंडियन
      </div>
      <div className="text-[10px] font-black tracking-wider uppercase mt-1 leading-none">IndianOil</div>
    </div>
  ),

  // BPCL (Bharat Petroleum)
  BPCLLogo: ({ className = "w-28 h-16" }: { className?: string }) => (
    <div className={`flex flex-col items-center justify-center border-2 border-black p-1.5 bg-white text-black font-mono ${className}`}>
      <div className="w-7 h-7 rounded-full border-2 border-black flex items-center justify-center font-bold text-xs">
        ★
      </div>
      <div className="text-[9px] font-bold text-center mt-1 leading-tight">BHARAT PETROLEUM</div>
    </div>
  ),

  // Shell
  ShellLogo: ({ className = "w-28 h-16" }: { className?: string }) => (
    <div className={`flex flex-col items-center justify-center border-2 border-black p-1.5 bg-white text-black font-mono ${className}`}>
      <div className="text-base font-black tracking-wider text-red-600 leading-none">SHELL</div>
      <div className="text-[9px] font-semibold mt-1">STATION RECEIPT</div>
    </div>
  ),

  // Airtel Logo (Red modern)
  AirtelLogo: ({ className = "h-8" }: { className?: string }) => (
    <div className={`flex items-center space-x-1.5 ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full aspect-square text-[#E40000]" fill="currentColor">
        <path d="M50 10 C 25 10, 10 30, 10 55 C 10 75, 25 90, 50 90 C 65 90, 75 82, 82 72 L 68 62 C 63 68, 58 72, 50 72 C 35 72, 28 60, 28 50 C 28 35, 38 28, 50 28 C 65 28, 72 38, 72 50 L 72 65 C 72 70, 75 74, 80 74 C 86 74, 90 70, 90 65 L 90 45 C 90 25, 75 10, 50 10 Z" />
      </svg>
      <span className="text-2xl font-black tracking-tighter text-[#E40000] font-sans lowercase">airtel</span>
    </div>
  ),

  // BSNL Logo
  BSNLLogo: ({ className = "h-14" }: { className?: string }) => (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#005BAC] rounded-full opacity-90"></div>
        <div className="absolute w-8 h-8 bg-[#EAAA00] rounded-full mix-blend-screen opacity-90 translate-x-2"></div>
        <div className="relative text-white font-black text-xs z-10">BSNL</div>
      </div>
      <div>
        <div className="text-[#005BAC] font-bold text-lg leading-tight">Bharat Sanchar</div>
        <div className="text-[#005BAC] font-bold text-lg leading-tight">Nigam Limited</div>
        <div className="text-[9px] text-[#EAAA00] italic font-semibold">Connecting India Faster</div>
      </div>
    </div>
  ),

  // Jio Logo
  JioLogo: ({ className = "h-8" }: { className?: string }) => (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="bg-[#0A2885] text-white font-black text-lg px-2.5 py-0.5 rounded-full tracking-wider font-sans">
        Jio
      </div>
      <span className="text-base font-bold text-slate-800 tracking-tight">Fiber</span>
    </div>
  ),

  // Gold's Gym Logo
  GoldsGymLogo: ({ className = "h-10" }: { className?: string }) => (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="w-10 h-10 rounded-full bg-amber-400 border-2 border-black flex items-center justify-center text-black font-black text-lg shadow-sm">
        G
      </div>
      <div>
        <div className="text-amber-500 font-black text-lg tracking-wider leading-none">GOLD'S GYM</div>
        <div className="text-[9px] font-bold text-slate-500 tracking-widest uppercase mt-0.5">The Mecca of Bodybuilding</div>
      </div>
    </div>
  ),

  // Cult.fit Logo
  CultFitLogo: ({ className = "h-10" }: { className?: string }) => (
    <div className={`flex items-center space-x-1.5 ${className}`}>
      <div className="bg-black text-white px-2 py-1 font-black rounded-lg text-sm tracking-widest border border-orange-500">
        CULT<span className="text-orange-500">.FIT</span>
      </div>
    </div>
  ),

  // Barcode generator component
  Barcode: ({ value = "98660786321351126907", height = 30, className = "" }: { value?: string; height?: number; className?: string }) => {
    const bars: boolean[] = [];
    for (let i = 0; i < value.length * 4 + 20; i++) {
      const charCode = value.charCodeAt(i % value.length) || 48;
      bars.push((charCode + i * 3) % 2 === 0 || (charCode + i) % 5 === 0);
    }

    return (
      <div className={`inline-flex flex-col items-center ${className}`}>
        <div className="flex items-stretch justify-center bg-white px-1" style={{ height: `${height}px` }}>
          <div className="w-1 bg-black mr-0.5"></div>
          <div className="w-0.5 bg-black mr-1"></div>
          {bars.map((isBlack, idx) => (
            <div
              key={idx}
              className={`${isBlack ? 'bg-black' : 'bg-white'}`}
              style={{ width: `${(idx % 4 === 0 ? 2 : 1)}px`, marginRight: '1px' }}
            />
          ))}
          <div className="w-0.5 bg-black mr-0.5"></div>
          <div className="w-1 bg-black"></div>
        </div>
        <span className="text-[9px] font-mono tracking-widest mt-1 text-slate-700">{value}</span>
      </div>
    );
  },

  // Revenue Stamp for HRA Rent Receipt
  RevenueStamp: ({ amount = "1" }: { amount?: string }) => (
    <div className="relative w-20 h-24 border-2 border-red-700 bg-red-50 p-1 flex flex-col items-center justify-between text-red-900 rounded-sm shadow-sm select-none">
      <div className="text-[7px] font-bold uppercase tracking-wider text-center border-b border-red-300 w-full pb-0.5">
        REVENUE
      </div>
      <div className="flex flex-col items-center my-1">
        <div className="w-7 h-7 rounded-full border border-red-700 flex items-center justify-center text-[10px] font-bold bg-white">
          ₹{amount}
        </div>
        <div className="text-[8px] font-extrabold mt-0.5 tracking-tighter">ONE RUPEE</div>
      </div>
      <div className="text-[6px] font-bold text-center border-t border-red-300 w-full pt-0.5">
        INDIA
      </div>
      {/* Diagonal handwritten signature line */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-24 h-0.5 bg-blue-800 rotate-[-35deg] opacity-75 shadow-sm"></div>
      </div>
    </div>
  ),

  // Authorized Signatory Stamp
  DigitalSignBox: ({ signer = "Varun Saini, General Manager", date = "07-May-2024", company = "Bharti Airtel Limited" }: { signer?: string; date?: string; company?: string }) => (
    <div className="border border-slate-300 p-2 text-[10px] bg-slate-50 text-slate-700 max-w-[240px]">
      <div className="font-semibold text-slate-800">Digitally signed by {company}</div>
      <div>Date: {date} 11:05:38 IST</div>
      <div>Reason: Invoice Authorization</div>
      <div>Location: Registered Office</div>
      <div className="mt-1 font-serif italic text-blue-900 text-xs border-t border-slate-200 pt-0.5">
        {signer}
      </div>
    </div>
  ),

  // BSNL 6-month usage chart Canvas component
  BSNLUsageChart: ({ history }: { history: Array<{ month: string; dataGb: number; voiceMin: number }> }) => {
    const maxData = Math.max(...history.map(h => h.dataGb), 80);

    return (
      <div className="border border-slate-300 p-2 bg-white rounded">
        <div className="flex items-center justify-between text-[11px] font-bold mb-2 pb-1 border-b border-slate-200">
          <span className="uppercase text-slate-700">USAGE HISTORY (6 MONTHS)</span>
          <div className="flex items-center space-x-3 text-[10px]">
            <span className="flex items-center"><span className="w-2.5 h-2.5 bg-blue-600 inline-block mr-1"></span>Voice (Min)</span>
            <span className="flex items-center"><span className="w-2.5 h-2.5 bg-red-600 inline-block mr-1"></span>Data (GB)</span>
          </div>
        </div>
        <div className="flex items-end justify-between h-32 pt-4 px-2">
          {history.map((item, idx) => {
            const barHeightPct = Math.min(100, Math.round((item.dataGb / maxData) * 90));
            return (
              <div key={idx} className="flex flex-col items-center flex-1">
                <span className="text-[9px] text-slate-500 font-semibold mb-1">{item.dataGb} GB</span>
                <div className="w-5 bg-red-600 rounded-t" style={{ height: `${Math.max(15, barHeightPct)}px` }}></div>
                <span className="text-[10px] font-bold text-slate-700 mt-1">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};

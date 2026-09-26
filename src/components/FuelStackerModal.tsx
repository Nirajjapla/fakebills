import React, { useState } from 'react';
import { FuelBillData } from '../types';
import { FuelThermalReceipt } from './templates/FuelThermalReceipt';
import { exportToPdf, exportToImage, triggerPrint } from '../utils/pdfExporter';
import { getDateRangePresets, formatDateStr } from '../utils/dateUtils';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Download, 
  Printer, 
  X, 
  Sparkles, 
  Check, 
  Columns, 
  Grid, 
  Calendar,
  IndianRupee,
  FileText,
  FileDown,
  Scissors
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export type StackerLayoutMode = '2col_4' | '1col_2' | '1col_3' | '2col_6';

const SAMPLE_STATION_NAMES = {
  HP: { dealer: 'SRI SIDDESHWARA SWAMY FS', sub: 'HPCL DEALER', loc: 'ETTAKODI MALUR TQ', pin: 'KOLAR DIST.563160' },
  IOCL: { dealer: 'INDIAN OIL RETAIL OUTLET', sub: 'IOCL AUTO CARE', loc: 'OUTER RING ROAD BELLANDUR', pin: 'BENGALURU - 560103' },
  BPCL: { dealer: 'BHARAT PETROLEUM AUTO SERVICE', sub: 'BPCL DEALER', loc: 'HSR LAYOUT SECTOR 1', pin: 'BENGALURU - 560102' },
  SHELL: { dealer: 'SHELL INDIA MARKETS PVT LTD', sub: 'AUTO RETAIL STATION', loc: 'WHITEFIELD MAIN ROAD', pin: 'BENGALURU - 560066' },
};

export const FuelStackerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [layoutMode, setLayoutMode] = useState<StackerLayoutMode>('2col_4');
  const [showCutLines, setShowCutLines] = useState<boolean>(true);
  const [showSheetHeader, setShowSheetHeader] = useState<boolean>(true);

  // Default stacked bills list
  const [bills, setBills] = useState<FuelBillData[]>([
    {
      brand: 'HP',
      dealerName: 'SRI SIDDESHWARA SWAMY FS',
      dealerSub: 'HPCL DEALER',
      location: 'ETTAKODI MALUR TQ',
      cityPincode: 'KOLAR DIST.563160',
      billNo: 'Jun-217412-ORGNL',
      trnsId: '0000000300171246',
      atndId: '01',
      receiptType: 'Physical Receipt',
      vehiNo: 'KA-03-MX-8899',
      mobNo: 'NotEntered',
      date: '04/06/2024',
      time: '09:12:45',
      fpId: '2',
      nozlNo: '4',
      fuelType: 'PETROL',
      density: '751.1kg/m3',
      rate: 101.50,
      amount: 2000,
      volume: 19.70,
      paymentMode: 'UPI / Online',
      footerNote: 'THANK YOU VISIT AGAIN'
    },
    {
      brand: 'IOCL',
      dealerName: 'INDIAN OIL RETAIL OUTLET',
      dealerSub: 'IOCL AUTO CARE',
      location: 'OUTER RING ROAD BELLANDUR',
      cityPincode: 'BENGALURU - 560103',
      billNo: 'Jun-481920-ORGNL',
      trnsId: '0000000300481920',
      atndId: '02',
      receiptType: 'Physical Receipt',
      vehiNo: 'KA-03-MX-8899',
      mobNo: 'NotEntered',
      date: '12/06/2024',
      time: '18:32:10',
      fpId: '1',
      nozlNo: '2',
      fuelType: 'PETROL',
      density: '750.2kg/m3',
      rate: 101.50,
      amount: 2500,
      volume: 24.63,
      paymentMode: 'UPI / PhonePe',
      footerNote: 'SAVE FUEL SAVE ENVIRONMENT'
    },
    {
      brand: 'BPCL',
      dealerName: 'BHARAT PETROLEUM AUTO SERVICE',
      dealerSub: 'BPCL DEALER',
      location: 'HSR LAYOUT SECTOR 1',
      cityPincode: 'BENGALURU - 560102',
      billNo: 'Jun-819234-ORGNL',
      trnsId: '0000000300819234',
      atndId: '04',
      receiptType: 'Physical Receipt',
      vehiNo: 'KA-03-MX-8899',
      mobNo: 'NotEntered',
      date: '20/06/2024',
      time: '11:15:30',
      fpId: '3',
      nozlNo: '1',
      fuelType: 'PETROL',
      density: '752.4kg/m3',
      rate: 101.80,
      amount: 1500,
      volume: 14.73,
      paymentMode: 'UPI / Online',
      footerNote: 'PURE FOR SURE - BPCL'
    },
    {
      brand: 'SHELL',
      dealerName: 'SHELL INDIA MARKETS PVT LTD',
      dealerSub: 'AUTO RETAIL STATION',
      location: 'WHITEFIELD MAIN ROAD',
      cityPincode: 'BENGALURU - 560066',
      billNo: 'Jun-991204-ORGNL',
      trnsId: '0000000300582910',
      atndId: '03',
      receiptType: 'Physical Receipt',
      vehiNo: 'KA-03-MX-8899',
      mobNo: 'NotEntered',
      date: '28/06/2024',
      time: '20:05:18',
      fpId: '2',
      nozlNo: '3',
      fuelType: 'PETROL',
      density: '750.5kg/m3',
      rate: 104.20,
      amount: 2000,
      volume: 19.19,
      paymentMode: 'UPI / GPay',
      footerNote: 'SHELL V-POWER FOR HIGH PERFORMANCE'
    }
  ]);

  // Batch generator state
  const presets = getDateRangePresets();
  const [batchTotalBudget, setBatchTotalBudget] = useState<number>(8000);
  const [batchCount, setBatchCount] = useState<number>(4);
  const [batchVehicleNo, setBatchVehicleNo] = useState<string>('KA-03-MX-8899');
  const [batchBrand, setBatchBrand] = useState<'HP' | 'IOCL' | 'BPCL' | 'SHELL' | 'MIX'>('MIX');
  const [batchFromDate, setBatchFromDate] = useState<string>(presets.currentMonth.from);
  const [batchToDate, setBatchToDate] = useState<string>(presets.currentMonth.to);

  if (!isOpen) return null;

  const handleApplyPreset = (presetKey: 'currentMonth' | 'lastMonth' | 'quarter' | 'financialYear') => {
    const p = presets[presetKey];
    setBatchFromDate(p.from);
    setBatchToDate(p.to);
  };

  const handleGenerateBatch = () => {
    const brands: Array<'HP' | 'IOCL' | 'BPCL' | 'SHELL'> = ['HP', 'IOCL', 'BPCL', 'SHELL'];
    const generated: FuelBillData[] = [];
    const avgAmount = Math.round(batchTotalBudget / batchCount);
    
    const startDate = new Date(batchFromDate);
    const endDate = new Date(batchToDate);
    const validStart = !isNaN(startDate.getTime()) ? startDate : new Date();
    const validEnd = !isNaN(endDate.getTime()) ? endDate : new Date();
    const startMs = validStart.getTime();
    const endMs = validEnd.getTime();
    const spanMs = Math.max(0, endMs - startMs);

    for (let i = 0; i < batchCount; i++) {
      const selectedBrand = batchBrand === 'MIX' ? brands[i % brands.length] : batchBrand;
      const stationInfo = SAMPLE_STATION_NAMES[selectedBrand] || SAMPLE_STATION_NAMES.HP;
      
      // Calculate date distributed evenly across range
      const ratio = batchCount > 1 ? i / (batchCount - 1) : 0.5;
      const jitter = batchCount > 1 ? (Math.random() - 0.5) * (spanMs / batchCount) * 0.4 : 0;
      const targetMs = Math.min(endMs, Math.max(startMs, startMs + ratio * spanMs + jitter));
      const billDateObj = new Date(targetMs);
      
      const day = String(billDateObj.getDate()).padStart(2, '0');
      const monthNum = String(billDateObj.getMonth() + 1).padStart(2, '0');
      const yearNum = billDateObj.getFullYear();
      const monthShort = billDateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      
      const hour = String(8 + Math.floor(Math.random() * 12)).padStart(2, '0');
      const min = String(Math.floor(Math.random() * 59)).padStart(2, '0');
      const sec = String(Math.floor(Math.random() * 59)).padStart(2, '0');
      
      const billAmount = i === batchCount - 1
        ? batchTotalBudget - (generated.reduce((s, b) => s + b.amount, 0))
        : Math.round((avgAmount + (Math.random() * 400 - 200)) / 100) * 100;

      const rate = 101.50 + Math.floor(Math.random() * 30) / 10;
      const volume = Number((billAmount / rate).toFixed(2));
      const randomBillNum = `${monthShort}-${Math.floor(100000 + Math.random() * 900000)}-ORGNL`;
      const randomTrns = `0000000300${Math.floor(100000 + Math.random() * 900000)}`;

      generated.push({
        brand: selectedBrand,
        dealerName: stationInfo.dealer,
        dealerSub: stationInfo.sub,
        location: stationInfo.loc,
        cityPincode: stationInfo.pin,
        billNo: randomBillNum,
        trnsId: randomTrns,
        atndId: `0${1 + Math.floor(Math.random() * 4)}`,
        receiptType: 'Physical Receipt',
        vehiNo: batchVehicleNo || 'NotEntered',
        mobNo: 'NotEntered',
        date: `${day}/${monthNum}/${yearNum}`,
        time: `${hour}:${min}:${sec}`,
        fpId: `${1 + Math.floor(Math.random() * 4)}`,
        nozlNo: `${1 + Math.floor(Math.random() * 6)}`,
        fuelType: 'PETROL',
        density: `${(749 + Math.random() * 3).toFixed(1)}kg/m3`,
        rate: rate,
        amount: billAmount,
        volume: volume,
        paymentMode: 'UPI / Online',
        footerNote: selectedBrand === 'HP' ? 'THANK YOU VISIT AGAIN' : selectedBrand === 'IOCL' ? 'SAVE FUEL SAVE ENVIRONMENT' : 'PURE FOR SURE'
      });
    }

    setBills(generated);
  };

  const handleAddSingleBill = () => {
    const newBill: FuelBillData = {
      brand: 'HP',
      dealerName: 'SRI SIDDESHWARA SWAMY FS',
      dealerSub: 'HPCL DEALER',
      location: 'ETTAKODI MALUR TQ',
      cityPincode: 'KOLAR DIST.563160',
      billNo: `Jul-${Math.floor(100000 + Math.random() * 900000)}-ORGNL`,
      trnsId: `0000000300${Math.floor(100000 + Math.random() * 900000)}`,
      atndId: '01',
      receiptType: 'Physical Receipt',
      vehiNo: batchVehicleNo || 'KA-03-MX-8899',
      mobNo: 'NotEntered',
      date: new Date().toLocaleDateString('en-GB'),
      time: new Date().toLocaleTimeString('en-GB'),
      fpId: '2',
      nozlNo: '4',
      fuelType: 'PETROL',
      density: '751.1kg/m3',
      rate: 101.50,
      amount: 2000,
      volume: 19.70,
      paymentMode: 'UPI / Online',
      footerNote: 'THANK YOU VISIT AGAIN'
    };
    setBills([...bills, newBill]);
  };

  const handleDeleteBill = (index: number) => {
    setBills(bills.filter((_, idx) => idx !== index));
  };

  const handleUpdateBill = (index: number, updated: FuelBillData) => {
    const next = [...bills];
    next[index] = updated;
    setBills(next);
  };

  const totalStackedAmount = bills.reduce((sum, b) => sum + b.amount, 0);

  // Pagination calculation based on layout mode
  const getBillsPerPage = (mode: StackerLayoutMode): number => {
    switch (mode) {
      case '1col_2': return 2;
      case '1col_3': return 3;
      case '2col_6': return 6;
      case '2col_4':
      default:
        return 4;
    }
  };

  const billsPerPage = getBillsPerPage(layoutMode);
  const totalPages = Math.ceil(bills.length / billsPerPage) || 1;

  // Group bills into discrete A4 pages
  const pageChunks: FuelBillData[][] = [];
  for (let i = 0; i < totalPages; i++) {
    pageChunks.push(bills.slice(i * billsPerPage, (i + 1) * billsPerPage));
  }

  const isCompactReceipt = layoutMode !== '1col_2';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 dark:bg-black/85 backdrop-blur-sm p-3 lg:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-[1500px] max-h-[94vh] flex flex-col shadow-2xl overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-3.5 lg:p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base lg:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Fuel Bill Multi-Stacker (A4 Print Engine)
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  {bills.length} Bills • ₹{totalStackedAmount.toLocaleString('en-IN')} Total
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                  {totalPages} A4 {totalPages === 1 ? 'Page' : 'Pages'}
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Fit multiple authentic thermal fuel receipts onto single or multi-page A4 sheets with zero overflow or awkward cuts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          {/* Left Controls & Batch Generator */}
          <div className="col-span-4 p-4 border-r border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 overflow-y-auto space-y-3 text-xs">
            {/* Batch Auto Generator Box */}
            <div className="p-3 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-amber-500" /> Batch Expense Generator</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-0.5 font-medium text-[11px]">Total Budget (₹)</label>
                  <input
                    type="number"
                    value={batchTotalBudget}
                    onChange={(e) => setBatchTotalBudget(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-0.5 font-medium text-[11px]">Total Bills Count</label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    value={batchCount}
                    onChange={(e) => setBatchCount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              {/* Date Range Presets */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-slate-600 dark:text-slate-400 font-medium text-[10.5px] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-indigo-500" /> Date Range & Period
                  </label>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('currentMonth')}
                    className="py-1 px-1 rounded text-[9.5px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-300 dark:border-slate-700 transition text-center"
                  >
                    This Month
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('lastMonth')}
                    className="py-1 px-1 rounded text-[9.5px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-300 dark:border-slate-700 transition text-center"
                  >
                    Last Month
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('quarter')}
                    className="py-1 px-1 rounded text-[9.5px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-300 dark:border-slate-700 transition text-center"
                  >
                    Quarter
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('financialYear')}
                    className="py-1 px-1 rounded text-[9.5px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-300 dark:border-slate-700 transition text-center"
                  >
                    FY 24-25
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-0.5 font-medium text-[10.5px]">From Date</label>
                  <input
                    type="date"
                    value={batchFromDate}
                    onChange={(e) => setBatchFromDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-0.5 text-slate-900 dark:text-white text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-0.5 font-medium text-[10.5px]">To Date</label>
                  <input
                    type="date"
                    value={batchToDate}
                    onChange={(e) => setBatchToDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-0.5 text-slate-900 dark:text-white text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-0.5 font-medium text-[10.5px]">Vehicle No</label>
                <input
                  type="text"
                  value={batchVehicleNo}
                  onChange={(e) => setBatchVehicleNo(e.target.value)}
                  placeholder="KA-03-MX-8899"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-0.5 font-medium text-[10.5px]">Pump Brands</label>
                <div className="grid grid-cols-5 gap-1 text-center font-bold text-[10px]">
                  {(['MIX', 'HP', 'IOCL', 'BPCL', 'SHELL'] as const).map((b) => (
                    <button
                      key={b}
                      onClick={() => setBatchBrand(b)}
                      className={`py-1 rounded border transition ${batchBrand === b ? 'bg-indigo-600 text-white border-indigo-500 shadow' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateBatch}
                className="w-full py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-lg shadow-md flex items-center justify-center gap-1.5 transition text-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-300" /> Auto-Generate {batchCount} Bills (₹{batchTotalBudget})
              </button>
            </div>

            {/* A4 Layout Density Selector */}
            <div className="p-3 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2.5 shadow-sm">
              <div className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center justify-between">
                <span>A4 Page Stacking Density</span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">
                  {billsPerPage} / page ({totalPages} {totalPages === 1 ? 'page' : 'pages'})
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setLayoutMode('2col_4')}
                  className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold text-left transition flex flex-col ${
                    layoutMode === '2col_4'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1"><Grid className="w-3.5 h-3.5" /> 4 Bills / Page</span>
                  <span className={`text-[9px] font-normal ${layoutMode === '2col_4' ? 'text-indigo-100' : 'text-slate-500'}`}>2×2 Standard Grid (Recommended)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLayoutMode('1col_2')}
                  className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold text-left transition flex flex-col ${
                    layoutMode === '1col_2'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1"><Columns className="w-3.5 h-3.5" /> 2 Bills / Page</span>
                  <span className={`text-[9px] font-normal ${layoutMode === '1col_2' ? 'text-indigo-100' : 'text-slate-500'}`}>1 Column Full Size</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLayoutMode('1col_3')}
                  className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold text-left transition flex flex-col ${
                    layoutMode === '1col_3'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1"><Columns className="w-3.5 h-3.5" /> 3 Bills / Page</span>
                  <span className={`text-[9px] font-normal ${layoutMode === '1col_3' ? 'text-indigo-100' : 'text-slate-500'}`}>1 Column Compact</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLayoutMode('2col_6')}
                  className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold text-left transition flex flex-col ${
                    layoutMode === '2col_6'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1"><Grid className="w-3.5 h-3.5" /> 6 Bills / Page</span>
                  <span className={`text-[9px] font-normal ${layoutMode === '2col_6' ? 'text-indigo-100' : 'text-slate-500'}`}>2×3 High Density</span>
                </button>
              </div>

              {/* Toggles */}
              <div className="space-y-1 pt-1 border-t border-slate-200 dark:border-slate-700">
                <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCutLines}
                    onChange={(e) => setShowCutLines(e.target.checked)}
                    className="rounded text-indigo-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                  />
                  <span className="text-[11px]">Printable Scissor Cut Guides (✂ - - - )</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSheetHeader}
                    onChange={(e) => setShowSheetHeader(e.target.checked)}
                    className="rounded text-indigo-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                  />
                  <span className="text-[11px]">Print Reimbursement Claim Header</span>
                </label>
              </div>
            </div>

            {/* Bills List & Quick Edit */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 dark:text-slate-200">Stacked Bills ({bills.length})</span>
                <button
                  onClick={handleAddSingleBill}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Bill
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {bills.map((bill, idx) => (
                  <div key={idx} className="p-2 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg space-y-1.5 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 dark:text-white text-[11px]">
                        #{idx + 1} - {bill.brand} ({bill.date})
                      </span>
                      <button
                        onClick={() => handleDeleteBill(idx)}
                        className="text-red-500 hover:text-red-600 dark:hover:text-red-400 p-0.5"
                        title="Delete bill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[9.5px]">Amount (₹)</span>
                        <input
                          type="number"
                          value={bill.amount}
                          onChange={(e) => {
                            const amt = Number(e.target.value);
                            handleUpdateBill(idx, {
                              ...bill,
                              amount: amt,
                              volume: Number((amt / (bill.rate || 101.5)).toFixed(2))
                            });
                          }}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-slate-900 dark:text-white font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[9.5px]">Rate / Liter</span>
                        <input
                          type="number"
                          value={bill.rate}
                          onChange={(e) => {
                            const r = Number(e.target.value);
                            handleUpdateBill(idx, {
                              ...bill,
                              rate: r,
                              volume: Number((bill.amount / (r || 101.5)).toFixed(2))
                            });
                          }}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[9.5px]">Date</span>
                        <input
                          type="text"
                          value={bill.date}
                          onChange={(e) => handleUpdateBill(idx, { ...bill, date: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[9.5px]">Time</span>
                        <input
                          type="text"
                          value={bill.time}
                          onChange={(e) => handleUpdateBill(idx, { ...bill, time: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right A4 Preview Canvas */}
          <div className="col-span-8 bg-slate-100 dark:bg-slate-950 p-4 lg:p-6 overflow-y-auto flex flex-col items-center transition-colors">
            {/* Top Download & Print Bar */}
            <div className="w-full max-w-[794px] flex flex-wrap justify-between items-center mb-4 gap-2 text-xs">
              <div className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>A4 Sheet Preview • {totalPages} {totalPages === 1 ? 'Page' : 'Pages'} ({bills.length} Bills Total)</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => exportToPdf('fuel-stacked-sheet', 'stacked_fuel_bills.pdf')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow transition"
                >
                  <Download className="w-4 h-4" /> Download A4 PDF
                </button>
                <button
                  onClick={() => exportToImage('fuel-stacked-sheet', 'stacked_fuel_bills.png')}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm transition"
                >
                  <FileDown className="w-4 h-4" /> Save PNG
                </button>
                <button
                  onClick={triggerPrint}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow transition"
                >
                  <Printer className="w-4 h-4" /> Direct Print
                </button>
              </div>
            </div>

            {/* Printable A4 Container with Multi-Page Sheets */}
            <div id="fuel-stacked-sheet" className="w-full flex flex-col items-center space-y-8 pb-10">
              {pageChunks.map((pageBills, pageIdx) => (
                <div
                  key={pageIdx}
                  className="a4-page-sheet bg-white text-black w-[794px] h-[1123px] min-h-[1123px] max-h-[1123px] p-6 shadow-2xl border border-slate-300 flex flex-col justify-between box-border relative select-text overflow-hidden"
                >
                  {/* Optional Claim Header */}
                  {showSheetHeader && (
                    <div className="border-b-2 border-black pb-2 mb-3 flex justify-between items-end shrink-0">
                      <div>
                        <div className="font-black text-sm uppercase tracking-tight">FUEL EXPENSE REIMBURSEMENT VOUCHER</div>
                        <div className="text-[10px] text-slate-600 mt-0.5">
                          Vehicle: <span className="font-bold text-black">{batchVehicleNo || 'KA-03-MX-8899'}</span> • Period: <span className="font-bold text-black">{formatDateStr(batchFromDate)} to {formatDateStr(batchToDate)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-indigo-950">
                          Page Amount: ₹{pageBills.reduce((s, b) => s + b.amount, 0).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[9.5px] text-slate-600 font-mono font-bold">
                          Page {pageIdx + 1} of {totalPages} ({pageBills.length} Bills)
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Grid Layout Container fitting A4 exact bounds */}
                  <div
                    className={`flex-1 grid ${
                      layoutMode === '1col_2'
                        ? 'grid-cols-1 gap-y-4'
                        : layoutMode === '1col_3'
                        ? 'grid-cols-1 gap-y-2'
                        : layoutMode === '2col_6'
                        ? 'grid-cols-2 gap-x-4 gap-y-2'
                        : 'grid-cols-2 gap-x-6 gap-y-3'
                    } items-center justify-items-center`}
                  >
                    {pageBills.map((bill, billIdx) => (
                      <div key={billIdx} className="w-full flex flex-col items-center relative">
                        <FuelThermalReceipt data={bill} compact={isCompactReceipt} />
                        {showCutLines && (
                          <div className="w-full text-center text-[8.5px] text-slate-400 font-mono my-1 tracking-widest no-export flex items-center justify-center gap-1">
                            <Scissors className="w-2.5 h-2.5 text-slate-400" />
                            <span>- - - - - - - - - Cut Line - - - - - - - - -</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Sheet Footer */}
                  <div className="border-t border-slate-300 pt-2 mt-2 flex justify-between items-center text-[9px] text-slate-500 font-mono shrink-0">
                    <span>Page {pageIdx + 1} of {totalPages} • Official Fuel Reimbursement Documentation</span>
                    <span>Total Claim: ₹{totalStackedAmount.toLocaleString('en-IN')} • Generated via BillCrafter Pro</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

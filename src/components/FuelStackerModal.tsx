import React, { useState } from 'react';
import { FuelBillData } from '../types';
import { FuelThermalReceipt } from './templates/FuelThermalReceipt';
import { exportToPdf, exportToImage, triggerPrint } from '../utils/pdfExporter';
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
  IndianRupee
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_STATION_NAMES = {
  HP: { dealer: 'SRI SIDDESHWARA SWAMY FS', sub: 'HPCL DEALER', loc: 'ETTAKODI MALUR TQ', pin: 'KOLAR DIST.563160' },
  IOCL: { dealer: 'INDIAN OIL RETAIL OUTLET', sub: 'IOCL AUTO CARE', loc: 'OUTER RING ROAD BELLANDUR', pin: 'BENGALURU - 560103' },
  BPCL: { dealer: 'BHARAT PETROLEUM AUTO SERVICE', sub: 'BPCL DEALER', loc: 'HSR LAYOUT SECTOR 1', pin: 'BENGALURU - 560102' },
  SHELL: { dealer: 'SHELL INDIA MARKETS PVT LTD', sub: 'AUTO RETAIL STATION', loc: 'WHITEFIELD MAIN ROAD', pin: 'BENGALURU - 560066' },
};

export const FuelStackerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [layoutColumns, setLayoutColumns] = useState<1 | 2>(2);
  const [showCutLines, setShowCutLines] = useState<boolean>(true);

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
  const [batchTotalBudget, setBatchTotalBudget] = useState<number>(8000);
  const [batchCount, setBatchCount] = useState<number>(4);
  const [batchVehicleNo, setBatchVehicleNo] = useState<string>('KA-03-MX-8899');
  const [batchBrand, setBatchBrand] = useState<'HP' | 'IOCL' | 'BPCL' | 'SHELL' | 'MIX'>('MIX');
  const [batchMonth, setBatchMonth] = useState<string>('2024-06');

  if (!isOpen) return null;

  const handleGenerateBatch = () => {
    const brands: Array<'HP' | 'IOCL' | 'BPCL' | 'SHELL'> = ['HP', 'IOCL', 'BPCL', 'SHELL'];
    const generated: FuelBillData[] = [];
    const avgAmount = Math.round(batchTotalBudget / batchCount);
    const [year, month] = batchMonth.split('-');

    for (let i = 0; i < batchCount; i++) {
      const selectedBrand = batchBrand === 'MIX' ? brands[i % brands.length] : batchBrand;
      const stationInfo = SAMPLE_STATION_NAMES[selectedBrand] || SAMPLE_STATION_NAMES.HP;
      const day = String(Math.min(28, 3 + Math.floor(i * (24 / batchCount)) + Math.floor(Math.random() * 2))).padStart(2, '0');
      const hour = String(8 + Math.floor(Math.random() * 12)).padStart(2, '0');
      const min = String(Math.floor(Math.random() * 59)).padStart(2, '0');
      const sec = String(Math.floor(Math.random() * 59)).padStart(2, '0');
      
      const billAmount = i === batchCount - 1
        ? batchTotalBudget - (generated.reduce((s, b) => s + b.amount, 0))
        : Math.round((avgAmount + (Math.random() * 400 - 200)) / 100) * 100;

      const rate = 101.50 + Math.floor(Math.random() * 30) / 10;
      const volume = Number((billAmount / rate).toFixed(2));
      const randomBillNum = `${month.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}-ORGNL`;
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
        date: `${day}/${month}/${year}`,
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
      vehiNo: 'KA-03-MX-8899',
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-7xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Fuel Bill Multi-Stacker (Print {bills.length} Bills / A4 Page)
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  Total: ₹{totalStackedAmount.toLocaleString('en-IN')}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Stack multiple compact thermal fuel receipts on a single A4 sheet for expense claims & paper savings.
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
          <div className="col-span-4 p-4 border-r border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 overflow-y-auto space-y-4 text-xs">
            {/* Batch Auto Generator Box */}
            <div className="p-3 bg-white dark:bg-gradient-to-br dark:from-indigo-950/70 dark:to-slate-800/80 border border-slate-200 dark:border-indigo-500/30 rounded-xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-300 font-bold text-sm">
                <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Batch Expense Generator</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">Total Target (₹)</label>
                  <input
                    type="number"
                    value={batchTotalBudget}
                    onChange={(e) => setBatchTotalBudget(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">Number of Bills</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={batchCount}
                    onChange={(e) => setBatchCount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">Month / Year</label>
                  <input
                    type="month"
                    value={batchMonth}
                    onChange={(e) => setBatchMonth(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">Vehicle No</label>
                  <input
                    type="text"
                    value={batchVehicleNo}
                    onChange={(e) => setBatchVehicleNo(e.target.value)}
                    placeholder="KA-03-MX-8899"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">Pump Brands</label>
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
                className="w-full py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-lg shadow-md flex items-center justify-center gap-1.5 transition"
              >
                <Sparkles className="w-4 h-4 text-amber-300" /> Auto-Generate {batchCount} Bills (₹{batchTotalBudget})
              </button>
            </div>

            {/* Layout Options */}
            <div className="p-3 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2 shadow-sm">
              <div className="font-bold text-slate-800 dark:text-slate-300">A4 Stacking Layout</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLayoutColumns(1)}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded border font-semibold ${layoutColumns === 1 ? 'bg-indigo-600 text-white border-indigo-500 shadow' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700'}`}
                >
                  <Columns className="w-3.5 h-3.5" /> 1 Column (Vertical)
                </button>
                <button
                  onClick={() => setLayoutColumns(2)}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded border font-semibold ${layoutColumns === 2 ? 'bg-indigo-600 text-white border-indigo-500 shadow' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700'}`}
                >
                  <Grid className="w-3.5 h-3.5" /> 2 Column Grid
                </button>
              </div>

              <label className="flex items-center space-x-2 pt-1 text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCutLines}
                  onChange={(e) => setShowCutLines(e.target.checked)}
                  className="rounded text-indigo-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                />
                <span>Show Printable Scissor Cut Lines (✂ - - -)</span>
              </label>
            </div>

            {/* Bills List & Quick Edit */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 dark:text-slate-300">Stacked Bills ({bills.length})</span>
                <button
                  onClick={handleAddSingleBill}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Bill
                </button>
              </div>

              {bills.map((bill, idx) => (
                <div key={idx} className="p-2.5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg space-y-1.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 dark:text-white">
                      #{idx + 1} - {bill.brand} ({bill.date})
                    </span>
                    <button
                      onClick={() => handleDeleteBill(idx)}
                      className="text-red-500 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Amount (₹)</span>
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
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-0.5 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Rate / Liter</span>
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
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-0.5 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Date</span>
                      <input
                        type="text"
                        value={bill.date}
                        onChange={(e) => handleUpdateBill(idx, { ...bill, date: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-0.5 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Time</span>
                      <input
                        type="text"
                        value={bill.time}
                        onChange={(e) => handleUpdateBill(idx, { ...bill, time: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-0.5 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right A4 Preview Canvas */}
          <div className="col-span-8 bg-slate-100 dark:bg-slate-950 p-6 overflow-y-auto flex flex-col items-center transition-colors">
            {/* Top Download & Print Bar */}
            <div className="w-full max-w-[794px] flex justify-between items-center mb-4 text-xs">
              <span className="text-slate-600 dark:text-slate-400">
                A4 Sheet Preview (Scaled to Fit) - Ready for Print / PDF Export
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => exportToPdf('fuel-stacked-sheet', 'stacked_fuel_bills.pdf')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1.5 shadow"
                >
                  <Download className="w-4 h-4" /> Download A4 PDF
                </button>
                <button
                  onClick={() => exportToImage('fuel-stacked-sheet', 'stacked_fuel_bills.png')}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm"
                >
                  <Download className="w-4 h-4" /> Save PNG
                </button>
                <button
                  onClick={triggerPrint}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" /> Direct Print
                </button>
              </div>
            </div>

            {/* Printable A4 Container */}
            <div
              id="fuel-stacked-sheet"
              className="bg-white text-black p-4 w-[794px] min-h-[1123px] shadow-xl border border-slate-200 relative print:m-0 print:p-2 print:shadow-none"
            >
              <div className={`grid ${layoutColumns === 2 ? 'grid-cols-2 gap-4' : 'grid-cols-1 gap-6'} items-start`}>
                {bills.map((b, idx) => (
                  <div key={idx} className="relative flex flex-col items-center">
                    <FuelThermalReceipt data={b} scale={0.92} />
                    {showCutLines && (
                      <div className="w-full border-b border-dashed border-slate-400 text-center text-[9px] text-slate-400 my-2 print:my-1">
                        ✂ - - - - - Cut Line {idx + 1} - - - - - ✂
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

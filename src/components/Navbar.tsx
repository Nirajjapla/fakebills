import React from 'react';
import { BillCategory, BillType, ThemeMode } from '../types';
import { 
  FileText, 
  BookUser, 
  Layers, 
  Download, 
  Printer, 
  Sparkles, 
  Image as ImageIcon,
  CheckCircle2,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';

interface Props {
  activeType: BillType;
  onSelectType: (type: BillType) => void;
  activeCategory: BillCategory | 'all';
  onSelectCategory: (cat: BillCategory | 'all') => void;
  onOpenAddressBook: () => void;
  onOpenFuelStacker: () => void;
  onRandomizeData: () => void;
  onExportPdf: () => void;
  onExportImage: () => void;
  onPrint: () => void;
  savedAddressCount: number;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const TEMPLATE_CONFIGS: Array<{
  id: BillType;
  title: string;
  category: BillCategory;
  badge?: string;
  icon?: string;
}> = [
  { id: 'fuel_thermal', title: 'Fuel Receipt (HP / IOCL / BPCL)', category: 'fuel', badge: 'Thermal POS' },
  { id: 'airtel_statement', title: 'Airtel Postpaid Statement', category: 'telecom', badge: 'Sample Exact' },
  { id: 'airtel_mobile_tax', title: 'Airtel Mobile Tax Invoice', category: 'telecom', badge: 'Sample Exact' },
  { id: 'bsnl_broadband', title: 'BSNL FTTH Broadband Bill', category: 'telecom', badge: 'With Chart' },
  { id: 'jio_fiber', title: 'JioFiber / Reliance Tax Invoice', category: 'telecom', badge: 'Sample Exact' },
  { id: 'gym_membership', title: 'Gym Membership Invoice', category: 'fitness', badge: 'Cult / Gold\'s' },
  { id: 'rent_receipt', title: 'House Rent (HRA) Receipt', category: 'housing', badge: 'Revenue Stamp' },
  { id: 'electricity_bill', title: 'Electricity / Utility Bill', category: 'utility', badge: 'DISCOM / Slabs' },
  { id: 'restaurant_pos', title: 'Restaurant & Cafe Receipt', category: 'dining', badge: 'POS Slip' },
  { id: 'supermarket_mart', title: 'Supermarket / DMart Bill', category: 'retail', badge: 'Savings Calc' },
  { id: 'medical_pharmacy', title: 'Pharmacy & Medical Bill', category: 'healthcare', badge: 'Rx & Batch' },
  { id: 'ecommerce_retail', title: 'E-Commerce Tax Invoice', category: 'retail', badge: 'Amazon / Flipkart' },
  { id: 'cab_ride', title: 'Cab Ride Receipt (Uber / Ola)', category: 'travel', badge: 'Route & Fare' },
  { id: 'freelance_invoice', title: 'Freelance & B2B Invoice', category: 'freelance', badge: 'SaaS / Bank' },
];

export const CATEGORIES: Array<{ id: BillCategory | 'all'; label: string }> = [
  { id: 'all', label: 'All Templates (14)' },
  { id: 'fuel', label: '⛽ Fuel' },
  { id: 'telecom', label: '📱 Telecom / Fiber' },
  { id: 'fitness', label: '🏋️ Gym / Fitness' },
  { id: 'housing', label: '🏠 Rent / HRA' },
  { id: 'utility', label: '⚡ Electricity' },
  { id: 'dining', label: '🍔 Restaurant' },
  { id: 'retail', label: '🛒 Supermarket / Mart' },
  { id: 'healthcare', label: '💊 Pharmacy' },
  { id: 'travel', label: '🚕 Cab / Travel' },
  { id: 'freelance', label: '💻 Freelance' },
];

export const Navbar: React.FC<Props> = ({
  activeType,
  onSelectType,
  activeCategory,
  onSelectCategory,
  onOpenAddressBook,
  onOpenFuelStacker,
  onRandomizeData,
  onExportPdf,
  onExportImage,
  onPrint,
  savedAddressCount,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-4 py-2.5 transition-colors">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 font-black text-xl">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">BillCrafter</span>
              <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 dark:border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Universal Bill Generator & Customizer</p>
          </div>
        </div>

        {/* Template Selector Dropdown & Pills */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={activeType}
              onChange={(e) => onSelectType(e.target.value as BillType)}
              className="appearance-none bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-900 dark:text-white font-semibold text-xs rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm transition"
            >
              {TEMPLATE_CONFIGS.map((tpl) => (
                <option key={tpl.id} value={tpl.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                  {tpl.title} ({tpl.badge})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Special Multi-Stacker Button */}
          <button
            onClick={onOpenFuelStacker}
            className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-900/20 transition"
          >
            <Layers className="w-3.5 h-3.5" /> Multi-Bill A4 Stacker
          </button>
        </div>

        {/* Action Tools: Address Book, Theme Toggle, Randomize, PDF, Image, Print */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-700 transition flex items-center gap-1.5 text-xs font-semibold"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenAddressBook}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 transition relative"
          >
            <BookUser className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Address Book</span>
            {savedAddressCount > 0 && (
              <span className="w-4 h-4 bg-indigo-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {savedAddressCount}
              </span>
            )}
          </button>

          <button
            onClick={onRandomizeData}
            title="Generate Realistic Sample Data"
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span className="hidden sm:inline">Randomize</span>
          </button>

          <button
            onClick={onExportPdf}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-900/20 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={onExportImage}
            title="Export PNG Image"
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-300 dark:border-slate-700 transition"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <button
            onClick={onPrint}
            title="Direct Browser Print"
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-300 dark:border-slate-700 transition"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Filter Horizontal Scrollbar */}
      <div className="max-w-[1600px] mx-auto mt-2 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3 py-1 rounded-lg whitespace-nowrap font-medium transition ${
              activeCategory === cat.id
                ? 'bg-indigo-600 text-white font-semibold shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </header>
  );
};

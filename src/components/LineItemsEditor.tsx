import React, { useState } from 'react';
import { BillType } from '../types';
import { 
  ITEM_PRESETS, 
  recalculateBillTotals, 
  toggleGstMode, 
  calculateItemAmount,
  ItemPreset 
} from '../utils/itemUtils';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Sparkles, 
  Percent, 
  IndianRupee, 
  Tag, 
  Layers, 
  ChevronDown,
  Info
} from 'lucide-react';

interface Props {
  activeType: BillType;
  billData: any;
  onUpdateData: (newData: any) => void;
}

export const LineItemsEditor: React.FC<Props> = ({
  activeType,
  billData,
  onUpdateData,
}) => {
  const isItemSupported = [
    'restaurant_pos',
    'supermarket_mart',
    'medical_pharmacy',
    'ecommerce_retail',
    'freelance_invoice'
  ].includes(activeType);

  if (!isItemSupported) return null;

  const [showPresets, setShowPresets] = useState<boolean>(false);
  const isInclusive = !!billData.isGstInclusive;
  const items: any[] = billData.items || [];
  const presets: ItemPreset[] = ITEM_PRESETS[activeType] || [];

  // Toggle GST mode
  const handleToggleMode = (mode: 'inclusive' | 'exclusive') => {
    const updated = toggleGstMode(activeType, billData, mode, true);
    onUpdateData(updated);
  };

  // Add blank item
  const handleAddBlankItem = () => {
    let newItem: any = {};
    if (activeType === 'restaurant_pos') {
      newItem = { name: 'Chef Special Dish', qty: 1, rate: 250, amount: 250 };
    } else if (activeType === 'supermarket_mart') {
      newItem = { barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`, name: 'Grocery Item', qty: 1, mrp: 100, sp: 90, total: 90 };
    } else if (activeType === 'medical_pharmacy') {
      newItem = { name: 'Medication Tablet 500mg', batchNo: `MD${Math.floor(1000 + Math.random() * 9000)}`, expDate: '12/26', hsn: '3004', qty: 1, mrp: 60, rate: 50, gstPercent: 12, amount: 50 };
    } else if (activeType === 'ecommerce_retail') {
      newItem = { id: String(Date.now()), description: 'Electronic Accessory Item', hsnSac: '8517', qty: 1, rate: 999, amount: 999, taxRate: 18 };
    } else if (activeType === 'freelance_invoice') {
      newItem = { id: String(Date.now()), description: 'Custom Software Engineering & Consulting', qty: 10, rate: 1500, amount: 15000 };
    }

    const nextItems = [...items, newItem];
    const updated = recalculateBillTotals(activeType, { ...billData, items: nextItems }, isInclusive);
    onUpdateData(updated);
  };

  // Add from preset
  const handleAddPreset = (preset: ItemPreset) => {
    let newItem: any = {};
    if (activeType === 'restaurant_pos') {
      newItem = { name: preset.name, qty: preset.qty, rate: preset.rate, amount: preset.qty * preset.rate };
    } else if (activeType === 'supermarket_mart') {
      newItem = { barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`, name: preset.name, qty: preset.qty, mrp: preset.mrp || preset.rate, sp: preset.sp || preset.rate, total: preset.qty * (preset.sp || preset.rate) };
    } else if (activeType === 'medical_pharmacy') {
      newItem = { name: preset.name, batchNo: preset.batchNo || `AG${Math.floor(1000 + Math.random() * 9000)}`, expDate: preset.expDate || '11/26', hsn: preset.hsnSac || '3004', qty: preset.qty, mrp: preset.mrp || preset.rate, rate: preset.rate, gstPercent: preset.taxRate, amount: preset.qty * preset.rate };
    } else if (activeType === 'ecommerce_retail') {
      newItem = { id: String(Date.now()), description: preset.name, hsnSac: preset.hsnSac || '8471', qty: preset.qty, rate: preset.rate, amount: preset.qty * preset.rate, taxRate: preset.taxRate };
    } else if (activeType === 'freelance_invoice') {
      newItem = { id: String(Date.now()), description: preset.name, qty: preset.qty, rate: preset.rate, amount: preset.qty * preset.rate };
    }

    const nextItems = [...items, newItem];
    const updated = recalculateBillTotals(activeType, { ...billData, items: nextItems }, isInclusive);
    onUpdateData(updated);
    setShowPresets(false);
  };

  // Update item field
  const handleUpdateItem = (index: number, field: string, value: any) => {
    const nextItems = [...items];
    const current = { ...nextItems[index], [field]: value };
    
    // Auto-compute row amount
    if (field === 'qty' || field === 'rate' || field === 'sp' || field === 'mrp' || field === 'taxRate' || field === 'gstPercent') {
      const q = Number(field === 'qty' ? value : current.qty || 1);
      const r = Number(field === 'rate' || field === 'sp' ? value : (current.sp || current.rate || 0));
      current.amount = Number((q * r).toFixed(2));
      current.total = Number((q * r).toFixed(2));
    }

    nextItems[index] = current;
    const updated = recalculateBillTotals(activeType, { ...billData, items: nextItems }, isInclusive);
    onUpdateData(updated);
  };

  // Duplicate item
  const handleDuplicateItem = (index: number) => {
    const nextItems = [...items];
    const copy = { ...nextItems[index], id: String(Date.now()) };
    nextItems.splice(index + 1, 0, copy);
    const updated = recalculateBillTotals(activeType, { ...billData, items: nextItems }, isInclusive);
    onUpdateData(updated);
  };

  // Delete item
  const handleDeleteItem = (index: number) => {
    const nextItems = items.filter((_, idx) => idx !== index);
    const updated = recalculateBillTotals(activeType, { ...billData, items: nextItems }, isInclusive);
    onUpdateData(updated);
  };

  return (
    <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 space-y-3 shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> Line Items ({items.length})
        </span>
        <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
          GST Configurable
        </span>
      </div>

      {/* GST Price Manipulation Mode Toggle */}
      <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/90 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Percent className="w-3.5 h-3.5 text-emerald-500" /> Price Tax Mode:
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            {isInclusive ? 'Prices Include GST' : 'GST Added on Top'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => handleToggleMode('exclusive')}
            className={`py-1.5 px-2 rounded-md text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              !isInclusive
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Tag className="w-3 h-3" /> GST Exclusive (Base + Tax)
          </button>
          <button
            type="button"
            onClick={() => handleToggleMode('inclusive')}
            className={`py-1.5 px-2 rounded-md text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              isInclusive
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <IndianRupee className="w-3 h-3" /> GST Inclusive (MRP/Net)
          </button>
        </div>

        <p className="text-[9.5px] text-slate-500 dark:text-slate-400 leading-tight flex items-start gap-1 pt-0.5">
          <Info className="w-3 h-3 shrink-0 mt-0.5 text-indigo-400" />
          {isInclusive 
            ? 'Item rates are final customer prices including GST. Taxable base & GST split are extracted automatically.' 
            : 'Item rates represent base taxable amounts. GST is computed and added on top.'}
        </p>
      </div>

      {/* Preset Quick Inserter */}
      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleAddBlankItem}
            className="flex-1 py-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Blank Item
          </button>
          {presets.length > 0 && (
            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="py-1.5 px-2.5 bg-amber-500/10 dark:bg-amber-600/20 hover:bg-amber-500/20 dark:hover:bg-amber-600/30 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-bold text-xs rounded-lg transition flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Quick Presets ({presets.length}) <ChevronDown className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Dropdown presets list */}
        {showPresets && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 max-h-60 overflow-y-auto space-y-1">
            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 py-0.5">
              Click to insert authentic item:
            </div>
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleAddPreset(preset)}
                className="w-full text-left p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg text-[11px] flex items-center justify-between transition group"
              >
                <div className="flex-1 pr-2 truncate">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 truncate block">
                    {preset.name}
                  </span>
                  <span className="text-[9.5px] text-slate-500 dark:text-slate-400">
                    {preset.category} {preset.hsnSac ? `• HSN: ${preset.hsnSac}` : ''}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{preset.rate}</span>
                  <span className="text-[9px] text-slate-400 block">{preset.taxRate}% GST</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Item List Rows */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {items.map((item: any, idx: number) => {
          const itemQty = item.qty || 1;
          const itemRate = item.sp || item.rate || 0;
          const taxRate = item.taxRate || item.gstPercent || (activeType === 'restaurant_pos' ? (billData.cgstPercent + billData.sgstPercent) : 18);
          const calc = calculateItemAmount(itemQty, itemRate, taxRate, isInclusive, item.discount || 0);

          return (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/90 rounded-xl p-2.5 space-y-2 shadow-xs transition hover:border-indigo-400 dark:hover:border-indigo-600"
            >
              {/* Item Top: Name / Description & Action Buttons */}
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={item.name || item.description || ''}
                  onChange={(e) => handleUpdateItem(idx, item.name !== undefined ? 'name' : 'description', e.target.value)}
                  placeholder="Item name / service description"
                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => handleDuplicateItem(idx)}
                  title="Duplicate this line item"
                  className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(idx)}
                  title="Delete this line item"
                  className="p-1 text-slate-400 hover:text-red-500 rounded transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Item Row 2: Qty, Rate, Tax Rate, Line Total */}
              <div className="grid grid-cols-4 gap-1.5 items-center">
                {/* Qty */}
                <div>
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                    Qty
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={item.qty ?? 1}
                    onChange={(e) => handleUpdateItem(idx, 'qty', Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-1.5 py-1 text-xs text-center font-bold text-slate-900 dark:text-white"
                  />
                </div>

                {/* Rate (Unit Price) */}
                <div className="col-span-1">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                    {isInclusive ? 'Rate (Incl)' : 'Rate (Base)'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={item.sp ?? item.rate ?? 0}
                    onChange={(e) => handleUpdateItem(idx, item.sp !== undefined ? 'sp' : 'rate', Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-1.5 py-1 text-xs text-right font-bold text-slate-900 dark:text-white"
                  />
                </div>

                {/* Tax Rate (GST %) where applicable */}
                <div>
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                    GST %
                  </label>
                  {item.taxRate !== undefined || item.gstPercent !== undefined ? (
                    <select
                      value={item.taxRate ?? item.gstPercent ?? 18}
                      onChange={(e) => handleUpdateItem(idx, item.taxRate !== undefined ? 'taxRate' : 'gstPercent', Number(e.target.value))}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-1 py-1 text-xs font-semibold text-slate-900 dark:text-white"
                    >
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  ) : (
                    <span className="block text-center text-[10.5px] font-semibold text-slate-500 py-1 bg-slate-200 dark:bg-slate-800 rounded">
                      {activeType === 'restaurant_pos' ? `${billData.cgstPercent + billData.sgstPercent}%` : 'Standard'}
                    </span>
                  )}
                </div>

                {/* Total Line Amount */}
                <div className="text-right">
                  <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                    Line Total
                  </span>
                  <div className="text-xs font-black text-indigo-700 dark:text-indigo-300 py-1">
                    ₹{calc.grossAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Extra row for Pharmacy batch/exp or Supermarket MRP if applicable */}
              {activeType === 'medical_pharmacy' && (
                <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div>
                    <label className="text-[8.5px] font-semibold text-slate-500 block">Batch No</label>
                    <input
                      type="text"
                      value={item.batchNo || ''}
                      onChange={(e) => handleUpdateItem(idx, 'batchNo', e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[8.5px] font-semibold text-slate-500 block">Expiry</label>
                    <input
                      type="text"
                      value={item.expDate || ''}
                      onChange={(e) => handleUpdateItem(idx, 'expDate', e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[8.5px] font-semibold text-slate-500 block">HSN</label>
                    <input
                      type="text"
                      value={item.hsn || ''}
                      onChange={(e) => handleUpdateItem(idx, 'hsn', e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              )}

              {activeType === 'supermarket_mart' && (
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div>
                    <label className="text-[8.5px] font-semibold text-slate-500 block">MRP (Original)</label>
                    <input
                      type="number"
                      value={item.mrp || 0}
                      onChange={(e) => handleUpdateItem(idx, 'mrp', Number(e.target.value))}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-[10.5px] font-bold text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[8.5px] font-semibold text-slate-500 block">Barcode / Code</label>
                    <input
                      type="text"
                      value={item.barcode || ''}
                      onChange={(e) => handleUpdateItem(idx, 'barcode', e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

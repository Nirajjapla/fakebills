import { BillType, LineItem } from '../types';

export type GstMode = 'inclusive' | 'exclusive';

export interface ItemPreset {
  id: string;
  name: string;
  category: string;
  qty: number;
  rate: number; // default base or inclusive rate
  taxRate: number; // GST percent (0, 5, 12, 18, 28)
  hsnSac?: string;
  mrp?: number;
  sp?: number;
  batchNo?: string;
  expDate?: string;
}

export const ITEM_PRESETS: Record<string, ItemPreset[]> = {
  restaurant_pos: [
    { id: 'r1', name: 'Paneer Tikka Platter', category: 'Starter', qty: 1, rate: 380, taxRate: 5 },
    { id: 'r2', name: 'Butter Chicken Masala', category: 'Main Course', qty: 1, rate: 440, taxRate: 5 },
    { id: 'r3', name: 'Butter Garlic Naan (2 pcs)', category: 'Breads', qty: 2, rate: 70, taxRate: 5 },
    { id: 'r4', name: 'Dum Biryani Handi (Chicken/Veg)', category: 'Rice', qty: 1, rate: 360, taxRate: 5 },
    { id: 'r5', name: 'Wood-fired Farmhouse Pizza', category: 'Pizza', qty: 1, rate: 490, taxRate: 5 },
    { id: 'r6', name: 'Truffle Mushroom Cream Pasta', category: 'Pasta', qty: 1, rate: 440, taxRate: 5 },
    { id: 'r7', name: 'Cold Brew Artisanal Coffee', category: 'Beverage', qty: 2, rate: 210, taxRate: 5 },
    { id: 'r8', name: 'Classic Belgian Chocolate Waffle', category: 'Dessert', qty: 1, rate: 290, taxRate: 5 },
  ],
  supermarket_mart: [
    { id: 's1', name: 'Aashirvaad Select Sharbati Atta 5kg', category: 'Staples', qty: 1, rate: 295, mrp: 340, sp: 295, taxRate: 0, hsnSac: '1101' },
    { id: 's2', name: 'Amul Pure Cow Ghee 1L Tin', category: 'Dairy', qty: 1, rate: 585, mrp: 650, sp: 585, taxRate: 12, hsnSac: '0405' },
    { id: 's3', name: 'Tata Tea Gold Premium 500g', category: 'Beverages', qty: 1, rate: 275, mrp: 320, sp: 275, taxRate: 5, hsnSac: '0902' },
    { id: 's4', name: 'Fortune Sunlite Refined Sunflower Oil 1L', category: 'Cooking Oil', qty: 2, rate: 145, mrp: 180, sp: 145, taxRate: 5, hsnSac: '1512' },
    { id: 's5', name: 'Surf Excel Matic Top Load Detergent 2kg', category: 'Home Care', qty: 1, rate: 399, mrp: 460, sp: 399, taxRate: 18, hsnSac: '3402' },
    { id: 's6', name: 'Daawat Rozana Super Basmati Rice 5kg', category: 'Grains', qty: 1, rate: 460, mrp: 525, sp: 460, taxRate: 0, hsnSac: '1006' },
    { id: 's7', name: 'Cadbury Celebrations Gift Pack 125g', category: 'Confectionery', qty: 2, rate: 140, mrp: 160, sp: 140, taxRate: 18, hsnSac: '1806' },
  ],
  medical_pharmacy: [
    { id: 'm1', name: 'Augmentin 625 Duo Tablet (10 Tab)', category: 'Antibiotic', qty: 1, rate: 200, mrp: 225, taxRate: 12, batchNo: 'AG8912', expDate: '11/26', hsnSac: '3004' },
    { id: 'm2', name: 'Pan 40 DSR Capsule (15 Cap)', category: 'Antacid', qty: 1, rate: 160, mrp: 185, taxRate: 12, batchNo: 'PN4410', expDate: '08/26', hsnSac: '3004' },
    { id: 'm3', name: 'Dolo 650mg Paracetamol (15 Tab)', category: 'Analgesic', qty: 2, rate: 30, mrp: 35, taxRate: 12, batchNo: 'DL1023', expDate: '04/27', hsnSac: '3004' },
    { id: 'm4', name: 'Becosules Z Multivitamin Capsules (30 Cap)', category: 'Supplements', qty: 1, rate: 40, mrp: 48, taxRate: 12, batchNo: 'BZ9912', expDate: '01/27', hsnSac: '3004' },
    { id: 'm5', name: 'Azithral 500mg Tablets (5 Tab)', category: 'Antibiotic', qty: 1, rate: 115, mrp: 130, taxRate: 12, batchNo: 'AZ7741', expDate: '09/26', hsnSac: '3004' },
    { id: 'm6', name: 'Allegra 120mg Anti-Allergy (10 Tab)', category: 'Antihistamine', qty: 1, rate: 190, mrp: 215, taxRate: 12, batchNo: 'AL5532', expDate: '03/27', hsnSac: '3004' },
    { id: 'm7', name: 'Shelcal 500 Calcium + Vit D3 (15 Tab)', category: 'Bone Health', qty: 1, rate: 125, mrp: 145, taxRate: 12, batchNo: 'SH9012', expDate: '05/27', hsnSac: '3004' },
  ],
  ecommerce_retail: [
    { id: 'e1', name: 'Logitech MX Master 3S Wireless Performance Mouse', category: 'Electronics', qty: 1, rate: 7499, taxRate: 18, hsnSac: '8471' },
    { id: 'e2', name: 'USB-C Braided Fast Charging 60W Cable (2M)', category: 'Accessories', qty: 2, rate: 499, taxRate: 18, hsnSac: '8544' },
    { id: 'e3', name: 'Apple 20W USB-C Power Adapter (Original)', category: 'Chargers', qty: 1, rate: 1900, taxRate: 18, hsnSac: '8504' },
    { id: 'e4', name: 'SanDisk Extreme Pro 128GB MicroSD Card', category: 'Storage', qty: 1, rate: 1699, taxRate: 18, hsnSac: '8523' },
    { id: 'e5', name: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones', category: 'Audio', qty: 1, rate: 26990, taxRate: 18, hsnSac: '8518' },
    { id: 'e6', name: 'Keychron K2 V2 Wireless Mechanical Keyboard', category: 'Keyboards', qty: 1, rate: 8499, taxRate: 18, hsnSac: '8471' },
  ],
  freelance_invoice: [
    { id: 'f1', name: 'React 18 & Next.js Enterprise Full-Stack Web Development', category: 'Engineering', qty: 40, rate: 1200, taxRate: 18, hsnSac: '998314' },
    { id: 'f2', name: 'GraphQL API Design & Realtime WebSocket Integration', category: 'Backend', qty: 25, rate: 1400, taxRate: 18, hsnSac: '998314' },
    { id: 'f3', name: 'Cloud DevOps, Docker & CI/CD Pipeline Setup on AWS ECS', category: 'Cloud/DevOps', qty: 15, rate: 1500, taxRate: 18, hsnSac: '998315' },
    { id: 'f4', name: 'UI/UX Interactive Figma Design System & Wireframing', category: 'Design', qty: 20, rate: 1100, taxRate: 18, hsnSac: '998311' },
    { id: 'f5', name: 'Monthly Production Maintenance & Security Auditing Retainer', category: 'Retainer', qty: 1, rate: 25000, taxRate: 18, hsnSac: '998316' },
  ]
};

/**
 * Calculate amount and tax breakdown for a single item
 */
export function calculateItemAmount(
  qty: number,
  rate: number,
  taxRate: number = 18,
  isInclusive: boolean = false,
  discount: number = 0
) {
  const safeQty = Math.max(0, qty || 1);
  const safeRate = Math.max(0, rate || 0);
  const safeTaxRate = Math.max(0, taxRate || 0);
  const rawTotal = safeQty * safeRate;

  if (isInclusive) {
    // Rate includes GST -> extract taxable base
    const grossAfterDiscount = Math.max(0, rawTotal - discount);
    const taxableAmount = Number((grossAfterDiscount / (1 + safeTaxRate / 100)).toFixed(2));
    const taxAmount = Number((grossAfterDiscount - taxableAmount).toFixed(2));
    return {
      taxableAmount,
      taxAmount,
      grossAmount: grossAfterDiscount,
      unitBasePrice: Number((safeRate / (1 + safeTaxRate / 100)).toFixed(2))
    };
  } else {
    // Rate is exclusive of GST -> add tax on top
    const taxableAmount = Math.max(0, rawTotal - discount);
    const taxAmount = Number(((taxableAmount * safeTaxRate) / 100).toFixed(2));
    const grossAmount = Number((taxableAmount + taxAmount).toFixed(2));
    return {
      taxableAmount,
      taxAmount,
      grossAmount,
      unitBasePrice: safeRate
    };
  }
}

/**
 * Universally recalculate all totals, taxes, and amounts on a bill model
 */
export function recalculateBillTotals(
  billType: BillType,
  billData: any,
  isGstInclusive: boolean = false
): any {
  const nextData = { ...billData, isGstInclusive };

  switch (billType) {
    case 'restaurant_pos': {
      const items = (nextData.items || []).map((item: any) => {
        const qty = item.qty || 1;
        const rate = item.rate || 0;
        const amt = Number((qty * rate).toFixed(2));
        return { ...item, amount: amt };
      });
      nextData.items = items;

      const rawSub = items.reduce((s: number, i: any) => s + (i.amount || 0), 0);
      const discount = Number(nextData.discount || 0);
      const tip = Number(nextData.tip || 0);
      const cgstPct = nextData.cgstPercent ?? 2.5;
      const sgstPct = nextData.sgstPercent ?? 2.5;
      const servicePct = nextData.serviceChargePercent ?? 0;
      const totalTaxPct = cgstPct + sgstPct + servicePct;

      if (isGstInclusive) {
        // Items rate includes 5% GST
        const gross = Math.max(0, rawSub - discount);
        const base = Number((gross / (1 + totalTaxPct / 100)).toFixed(2));
        nextData.subTotal = base;
        nextData.grandTotal = Number((gross + tip).toFixed(2));
      } else {
        // Items rate is base price, GST added on top
        const baseAfterDiscount = Math.max(0, rawSub - discount);
        const taxAmt = Number(((baseAfterDiscount * totalTaxPct) / 100).toFixed(2));
        nextData.subTotal = rawSub;
        nextData.grandTotal = Number((baseAfterDiscount + taxAmt + tip).toFixed(2));
      }
      break;
    }

    case 'supermarket_mart': {
      const items = (nextData.items || []).map((item: any) => {
        const qty = item.qty || 1;
        const sp = item.sp || item.rate || 0;
        const mrp = item.mrp || sp;
        return {
          ...item,
          qty,
          mrp,
          sp,
          total: Number((qty * sp).toFixed(2))
        };
      });
      nextData.items = items;

      const totalMrp = items.reduce((s: number, i: any) => s + (i.qty * i.mrp), 0);
      const totalAmt = items.reduce((s: number, i: any) => s + i.total, 0);
      const savings = Math.max(0, totalMrp - totalAmt);

      nextData.totalMrp = Number(totalMrp.toFixed(2));
      nextData.totalAmount = Number(totalAmt.toFixed(2));
      nextData.totalSavings = Number(savings.toFixed(2));
      break;
    }

    case 'medical_pharmacy': {
      let subTotal = 0;
      let totalGst = 0;
      const items = (nextData.items || []).map((item: any) => {
        const qty = item.qty || 1;
        const rate = item.rate || 0;
        const gstPct = item.gstPercent ?? 12;
        const calc = calculateItemAmount(qty, rate, gstPct, isGstInclusive);
        
        subTotal += calc.taxableAmount;
        totalGst += calc.taxAmount;
        return {
          ...item,
          qty,
          rate,
          gstPercent: gstPct,
          amount: isGstInclusive ? calc.grossAmount : calc.taxableAmount
        };
      });
      nextData.items = items;

      const discount = Number(nextData.discount || 0);
      const finalTaxable = Math.max(0, subTotal - discount);
      const finalGst = isGstInclusive 
        ? Number(totalGst.toFixed(2))
        : Number(((finalTaxable * (totalGst / (subTotal || 1)))).toFixed(2));

      nextData.subTotal = Number(subTotal.toFixed(2));
      nextData.gstAmount = Number(totalGst.toFixed(2));
      nextData.grandTotal = isGstInclusive
        ? Number((items.reduce((s: number, i: any) => s + i.amount, 0) - discount).toFixed(2))
        : Number((finalTaxable + finalGst).toFixed(2));
      break;
    }

    case 'ecommerce_retail': {
      let totalTaxable = 0;
      let totalTax = 0;
      const items = (nextData.items || []).map((item: any) => {
        const qty = item.qty || 1;
        const rate = item.rate || 0;
        const taxRate = item.taxRate ?? 18;
        const discount = item.discount || 0;
        const calc = calculateItemAmount(qty, rate, taxRate, isGstInclusive, discount);

        totalTaxable += calc.taxableAmount;
        totalTax += calc.taxAmount;
        return {
          ...item,
          qty,
          rate,
          taxRate,
          amount: isGstInclusive ? calc.taxableAmount : calc.taxableAmount
        };
      });
      nextData.items = items;

      const shipping = Number(nextData.shippingFee || 0);
      const giftWrap = Number(nextData.giftWrapFee || 0);
      const halfTax = Number((totalTax / 2).toFixed(2));

      nextData.totalTaxable = Number(totalTaxable.toFixed(2));
      nextData.cgstAmount = halfTax;
      nextData.sgstAmount = Number((totalTax - halfTax).toFixed(2));
      nextData.igstAmount = 0;
      nextData.grandTotal = Number((totalTaxable + totalTax + shipping + giftWrap).toFixed(2));
      break;
    }

    case 'freelance_invoice': {
      const items = (nextData.items || []).map((item: any) => {
        const qty = item.qty || 1;
        const rate = item.rate || 0;
        const amt = Number((qty * rate).toFixed(2));
        return { ...item, qty, rate, amount: amt };
      });
      nextData.items = items;

      const rawSum = items.reduce((s: number, i: any) => s + i.amount, 0);
      const discountPct = Number(nextData.discountPercent || 0);
      const taxPct = Number(nextData.taxPercent ?? 18);

      if (isGstInclusive) {
        // Items sum is gross including GST
        const discountAmt = (rawSum * discountPct) / 100;
        const netGross = Math.max(0, rawSum - discountAmt);
        const taxable = Number((netGross / (1 + taxPct / 100)).toFixed(2));
        nextData.subtotal = Number(rawSum.toFixed(2));
        nextData.taxAmount = Number((netGross - taxable).toFixed(2));
        nextData.grandTotal = Number(netGross.toFixed(2));
      } else {
        // Items sum is net base
        const discountAmt = (rawSum * discountPct) / 100;
        const taxable = Math.max(0, rawSum - discountAmt);
        const taxAmt = Number(((taxable * taxPct) / 100).toFixed(2));
        nextData.subtotal = Number(rawSum.toFixed(2));
        nextData.taxAmount = taxAmt;
        nextData.grandTotal = Number((taxable + taxAmt).toFixed(2));
      }
      break;
    }

    default:
      break;
  }

  return nextData;
}

/**
 * Toggle GST mode with optional price conversion
 */
export function toggleGstMode(
  billType: BillType,
  billData: any,
  nextMode: GstMode,
  recalibratePrices: boolean = true
): any {
  const isNowInclusive = nextMode === 'inclusive';
  const wasInclusive = !!billData.isGstInclusive;
  if (isNowInclusive === wasInclusive) return billData;

  const nextData = { ...billData };
  const items = nextData.items || [];

  if (recalibratePrices && items.length > 0) {
    if (isNowInclusive) {
      // Switching from Exclusive to Inclusive: convert base rate -> gross rate
      nextData.items = items.map((item: any) => {
        const taxPct = item.taxRate || item.gstPercent || billData.taxPercent || (billType === 'restaurant_pos' ? 5 : 18);
        const grossRate = Number((item.rate * (1 + taxPct / 100)).toFixed(2));
        return {
          ...item,
          rate: grossRate,
          mrp: item.mrp ? Number((item.mrp * (1 + taxPct / 100)).toFixed(2)) : undefined,
          sp: item.sp ? Number((item.sp * (1 + taxPct / 100)).toFixed(2)) : undefined,
        };
      });
    } else {
      // Switching from Inclusive to Exclusive: convert gross rate -> base rate
      nextData.items = items.map((item: any) => {
        const taxPct = item.taxRate || item.gstPercent || billData.taxPercent || (billType === 'restaurant_pos' ? 5 : 18);
        const baseRate = Number((item.rate / (1 + taxPct / 100)).toFixed(2));
        return {
          ...item,
          rate: baseRate,
          mrp: item.mrp ? Number((item.mrp / (1 + taxPct / 100)).toFixed(2)) : undefined,
          sp: item.sp ? Number((item.sp / (1 + taxPct / 100)).toFixed(2)) : undefined,
        };
      });
    }
  }

  return recalculateBillTotals(billType, nextData, isNowInclusive);
}

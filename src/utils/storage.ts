import { AddressProfile } from '../types';

const STORAGE_KEY_ADDRESSES = 'billcrafter_saved_addresses_v2';

export const DEFAULT_ADDRESSES: AddressProfile[] = [
  // User Profiles
  {
    id: 'user-1',
    label: 'Mohammad Mubasshir (Home)',
    category: 'personal',
    fullName: 'Mr. Mohammad Mubasshir',
    addressLine1: '282 Gate No 5 Old Collector Compound',
    addressLine2: 'Malwani Plot No 19 Near Kharodi Post No 19',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400095',
    phone: '7738677653',
    email: 'mubasshirraza759@gmail.com'
  },
  {
    id: 'user-2',
    label: 'Ram Babu Choppala (Home)',
    category: 'personal',
    fullName: 'Mr N V Ram Babu Choppala',
    addressLine1: 'H No-3-773 Pno-197/a, Phase-1 Vijayapuri Colony',
    addressLine2: 'Vanasthalipuram',
    landmark: 'Near Sai Baba Temple',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500070',
    phone: '9866078632'
  },
  {
    id: 'user-3',
    label: 'Subhra Prakash De (Home)',
    category: 'personal',
    fullName: 'Subhra Prakash De',
    addressLine1: '1st floor, de house, East Vivekananda Pally',
    addressLine2: 'Rabinda nagar main road',
    city: 'Siliguri',
    state: 'West Bengal',
    pincode: '734006',
    phone: '9434012345'
  },
  {
    id: 'user-4',
    label: 'Nexus Tech India (Business)',
    category: 'business',
    fullName: 'Nexus Technologies India Pvt Ltd',
    companyName: 'Nexus Technologies',
    addressLine1: 'Building 4B, Mindspace IT Park, Hitech City',
    addressLine2: 'Madhapur',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    phone: '040-49182736',
    email: 'accounts@nexustech.io',
    gstin: '36AABCN1234F1Z8',
    pan: 'AABCN1234F'
  },
  {
    id: 'user-5',
    label: 'Landlord - Suresh Chandra',
    category: 'landlord',
    fullName: 'Suresh Chandra Sharma',
    addressLine1: 'Flat 402, Green Glen Layout, Bellandur',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    phone: '9845019283',
    pan: 'ABCPS9876K'
  },

  // Vendor / Merchant Profiles
  {
    id: 'vendor-1',
    label: 'HPCL Fuel Station (Kolar/Malur)',
    category: 'vendor',
    fullName: 'SRI SIDDESHWARA SWAMY FS',
    companyName: 'HPCL AUTHORIZED DEALERSHIP',
    addressLine1: 'Ettakodi Malur Taluk',
    addressLine2: 'NH 75 Highway',
    city: 'Kolar Dist',
    state: 'Karnataka',
    pincode: '563160',
    phone: '9845019283',
    gstin: '29AABCH1234K1Z2',
    pan: 'AABCH1234K',
    email: 'hpcl.dealer563160@petrolpump.in'
  },
  {
    id: 'vendor-2',
    label: 'IndianOil Station (Bellandur)',
    category: 'vendor',
    fullName: 'SRI VENKATESHWARA FUELS',
    companyName: 'INDIAN OIL DEALER',
    addressLine1: 'Plot 48, Outer Ring Road, Bellandur',
    addressLine2: 'Near EcoSpace Tech Park',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    phone: '080-25741829',
    gstin: '29AABCI5544J1Z9',
    pan: 'AABCI5544J'
  },
  {
    id: 'vendor-3',
    label: 'Reliance Retail / Jio (Kolkata HQ)',
    category: 'vendor',
    fullName: 'Reliance Retail Limited',
    companyName: 'Reliance Retail Ltd',
    addressLine1: '17th & 18th Floor, Plot No. 5, Godrej Waterside, Sector-V',
    addressLine2: 'Electronics Complex, Salt Lake City',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700091',
    phone: '1800-896-9999',
    gstin: '19AABCR1718E1ZM',
    pan: 'AABCR1718E',
    email: 'customercare@jio.com'
  },
  {
    id: 'vendor-4',
    label: 'Gold\'s Gym Indiranagar',
    category: 'vendor',
    fullName: 'Gold\'s Gym India Pvt Ltd',
    companyName: 'Gold\'s Gym Franchise',
    addressLine1: 'Plot 102, 100 Feet Road, Indiranagar',
    addressLine2: 'Near BSNL Telephone Exchange',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    phone: '+91 80 4123 9900',
    gstin: '29AABCG1234F1Z5',
    pan: 'AABCG1234F',
    email: 'indiranagar@goldsgymindia.com'
  },
  {
    id: 'vendor-5',
    label: 'Apollo Pharmacy Bellandur',
    category: 'vendor',
    fullName: 'Apollo 24/7 Retail Pharmacy',
    companyName: 'Apollo Hospitals Enterprise Ltd',
    addressLine1: 'Shop 4 & 5, Ground Floor, Outer Ring Road',
    addressLine2: 'Bellandur',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    phone: '+91 80 4918 2736',
    gstin: '29AAACA1234F1Z8',
    pan: 'AAACA1234F'
  }
];

export function getSavedAddresses(): AddressProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADDRESSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ADDRESSES, JSON.stringify(DEFAULT_ADDRESSES));
      return DEFAULT_ADDRESSES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse saved addresses', e);
    return DEFAULT_ADDRESSES;
  }
}

export function saveAddress(address: AddressProfile): AddressProfile[] {
  const current = getSavedAddresses();
  const index = current.findIndex(a => a.id === address.id);
  let updated: AddressProfile[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = address;
  } else {
    updated = [address, ...current];
  }
  localStorage.setItem(STORAGE_KEY_ADDRESSES, JSON.stringify(updated));
  return updated;
}

export function deleteAddress(id: string): AddressProfile[] {
  const current = getSavedAddresses();
  const updated = current.filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY_ADDRESSES, JSON.stringify(updated));
  return updated;
}

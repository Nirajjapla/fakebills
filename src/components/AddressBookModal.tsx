import React, { useState, useEffect } from 'react';
import { AddressProfile } from '../types';
import { getSavedAddresses, saveAddress, deleteAddress } from '../utils/storage';
import { getAllIndianCities, generateRealCityAddress } from '../utils/indianAddresses';
import { 
  BookUser, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Search, 
  MapPin, 
  Building, 
  User, 
  Download, 
  Upload, 
  Sparkles,
  Store,
  Compass
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress?: (address: AddressProfile, target?: 'user' | 'vendor') => void;
}

export const AddressBookModal: React.FC<Props> = ({ isOpen, onClose, onSelectAddress }) => {
  const [addresses, setAddresses] = useState<AddressProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mainTab, setMainTab] = useState<'all' | 'user' | 'vendor'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingAddress, setEditingAddress] = useState<AddressProfile | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedCityForGen, setSelectedCityForGen] = useState<string>('Bengaluru');

  const indianCities = getAllIndianCities();

  useEffect(() => {
    if (isOpen) {
      setAddresses(getSavedAddresses());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredAddresses = addresses.filter((addr) => {
    // Tab filter
    if (mainTab === 'user' && addr.category === 'vendor') return false;
    if (mainTab === 'vendor' && addr.category !== 'vendor') return false;

    // Sub-category filter
    const matchesCat = selectedCategory === 'all' || addr.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      addr.fullName.toLowerCase().includes(query) ||
      addr.label.toLowerCase().includes(query) ||
      addr.city.toLowerCase().includes(query) ||
      addr.phone.includes(query) ||
      (addr.companyName && addr.companyName.toLowerCase().includes(query));
    return matchesCat && matchesSearch;
  });

  const handleSave = (addressToSave: AddressProfile) => {
    const updated = saveAddress(addressToSave);
    setAddresses(updated);
    setEditingAddress(null);
    setIsCreatingNew(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      const updated = deleteAddress(id);
      setAddresses(updated);
    }
  };

  const handleCreateNew = (category: 'personal' | 'vendor' = 'personal') => {
    const newAddr: AddressProfile = {
      id: `addr-${Date.now()}`,
      label: category === 'vendor' ? 'New Vendor' : 'New Address',
      category: category,
      fullName: '',
      addressLine1: '',
      city: selectedCityForGen,
      state: '',
      pincode: '',
      phone: '',
    };
    setEditingAddress(newAddr);
    setIsCreatingNew(true);
  };

  // Generate Real Indian City Address
  const handleGenerateCityAddress = (type: 'vendor' | 'user') => {
    const generated = generateRealCityAddress(
      selectedCityForGen,
      type === 'vendor' ? 'vendor' : 'personal'
    );
    const updated = saveAddress(generated);
    setAddresses(updated);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(addresses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `addresses_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          localStorage.setItem('billcrafter_addresses', JSON.stringify(imported));
          setAddresses(imported);
          alert(`Successfully imported ${imported.length} addresses!`);
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'vendor':
        return { label: '🏢 Vendor / Merchant', color: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/30' };
      case 'business':
        return { label: '🏢 Business HQ', color: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-500/30' };
      case 'landlord':
        return { label: '🏠 Landlord', color: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/30' };
      case 'client':
        return { label: '💼 Client', color: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-500/30' };
      case 'personal':
      default:
        return { label: '👤 Personal', color: 'bg-slate-500/10 dark:bg-slate-500/20 text-slate-800 dark:text-slate-300 border-slate-500/30' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden transition-colors">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <BookUser className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Central User & Vendor Address Manager
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                  {addresses.length} Saved
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage user & vendor profiles in one central place. Generate real Indian city addresses with 1-click.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportJson}
              title="Export to JSON"
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <Download className="w-4 h-4" />
            </button>
            <label
              title="Import JSON"
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* City Generator Ribbon */}
        <div className="p-3 bg-gradient-to-r from-indigo-50 via-slate-50 to-purple-50 dark:from-indigo-950/80 dark:via-slate-850 dark:to-purple-950/80 border-b border-indigo-200 dark:border-indigo-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="font-bold text-slate-800 dark:text-slate-200">Generate Real Indian Address for City:</span>
            <select
              value={selectedCityForGen}
              onChange={(e) => setSelectedCityForGen(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2.5 py-1 font-semibold focus:outline-none focus:border-indigo-500"
            >
              {indianCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleGenerateCityAddress('vendor')}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" /> + Auto-Generate Vendor in {selectedCityForGen}
            </button>
            <button
              onClick={() => handleGenerateCityAddress('user')}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition"
            >
              <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> + Generate Customer
            </button>
          </div>
        </div>

        {/* Main Tab Switcher (All vs User vs Vendor) & Search */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-bold bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => { setMainTab('all'); setSelectedCategory('all'); }}
              className={`px-3 py-1.5 rounded-lg transition ${mainTab === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              All Addresses ({addresses.length})
            </button>
            <button
              onClick={() => { setMainTab('user'); setSelectedCategory('all'); }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${mainTab === 'user' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <User className="w-3.5 h-3.5" /> User / Customer Profiles ({addresses.filter(a => a.category !== 'vendor').length})
            </button>
            <button
              onClick={() => { setMainTab('vendor'); setSelectedCategory('all'); }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${mainTab === 'vendor' ? 'bg-amber-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <Store className="w-3.5 h-3.5" /> Vendor / Merchant Profiles ({addresses.filter(a => a.category === 'vendor').length})
            </button>
          </div>

          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, city, phone, GSTIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={() => handleCreateNew(mainTab === 'vendor' ? 'vendor' : 'personal')}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition"
          >
            <Plus className="w-4 h-4" /> Add Profile Manually
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {/* Edit / Create Form inline */}
          {editingAddress && (
            <div className="bg-slate-50 dark:bg-slate-800/90 border-2 border-indigo-500/80 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-bold text-sm text-indigo-700 dark:text-indigo-300">
                  {isCreatingNew ? 'Create New Address Profile' : `Edit: ${editingAddress.label}`}
                </span>
                <button
                  onClick={() => { setEditingAddress(null); setIsCreatingNew(false); }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">Profile Label / Nickname</label>
                  <input
                    type="text"
                    value={editingAddress.label}
                    onChange={(e) => setEditingAddress({ ...editingAddress, label: e.target.value })}
                    placeholder="e.g. HP Petrol Pump Bellandur"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">Category</label>
                  <select
                    value={editingAddress.category}
                    onChange={(e) => setEditingAddress({ ...editingAddress, category: e.target.value as any })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="vendor">🏢 Vendor / Merchant / Station</option>
                    <option value="personal">👤 Personal (User)</option>
                    <option value="business">🏢 Business / Company HQ</option>
                    <option value="landlord">🏠 Landlord</option>
                    <option value="client">💼 Client</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">Full Name / Merchant Entity Name</label>
                  <input
                    type="text"
                    value={editingAddress.fullName}
                    onChange={(e) => setEditingAddress({ ...editingAddress, fullName: e.target.value })}
                    placeholder="e.g. SRI VENKATESHWARA FUELS"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">Company / Brand Subtitle (Optional)</label>
                  <input
                    type="text"
                    value={editingAddress.companyName || ''}
                    onChange={(e) => setEditingAddress({ ...editingAddress, companyName: e.target.value })}
                    placeholder="e.g. INDIAN OIL DEALER / Gold's Gym"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">Phone / Mobile Number</label>
                  <input
                    type="text"
                    value={editingAddress.phone}
                    onChange={(e) => setEditingAddress({ ...editingAddress, phone: e.target.value })}
                    placeholder="e.g. 9845019283"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">Address Line 1</label>
                  <input
                    type="text"
                    value={editingAddress.addressLine1}
                    onChange={(e) => setEditingAddress({ ...editingAddress, addressLine1: e.target.value })}
                    placeholder="Plot / Street / Highway"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">Address Line 2 / Landmark</label>
                  <input
                    type="text"
                    value={editingAddress.addressLine2 || ''}
                    onChange={(e) => setEditingAddress({ ...editingAddress, addressLine2: e.target.value })}
                    placeholder="Locality, Landmark"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">City</label>
                  <input
                    type="text"
                    value={editingAddress.city}
                    onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
                    placeholder="Bengaluru / Mumbai"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">State</label>
                  <input
                    type="text"
                    value={editingAddress.state}
                    onChange={(e) => setEditingAddress({ ...editingAddress, state: e.target.value })}
                    placeholder="Karnataka"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">PIN Code</label>
                  <input
                    type="text"
                    value={editingAddress.pincode}
                    onChange={(e) => setEditingAddress({ ...editingAddress, pincode: e.target.value })}
                    placeholder="560103"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">Email (Optional)</label>
                  <input
                    type="email"
                    value={editingAddress.email || ''}
                    onChange={(e) => setEditingAddress({ ...editingAddress, email: e.target.value })}
                    placeholder="dealer@example.com"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={editingAddress.gstin || ''}
                    onChange={(e) => setEditingAddress({ ...editingAddress, gstin: e.target.value })}
                    placeholder="29AABCH1234K1Z2"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">PAN (Optional)</label>
                  <input
                    type="text"
                    value={editingAddress.pan || ''}
                    onChange={(e) => setEditingAddress({ ...editingAddress, pan: e.target.value })}
                    placeholder="AABCH1234K"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => { setEditingAddress(null); setIsCreatingNew(false); }}
                  className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave(editingAddress)}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Save Profile
                </button>
              </div>
            </div>
          )}

          {/* Addresses Grid */}
          <div className="grid grid-cols-2 gap-3">
            {filteredAddresses.map((addr) => {
              const isVendor = addr.category === 'vendor';
              const badge = getCategoryBadge(addr.category);
              return (
                <div
                  key={addr.id}
                  className={`border rounded-xl p-3.5 space-y-2 transition flex flex-col justify-between ${
                    isVendor 
                      ? 'bg-amber-50/40 dark:bg-slate-800/80 border-amber-300 dark:border-amber-500/40 hover:border-amber-500' 
                      : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-slate-500 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        {isVendor ? <Store className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> : <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                        {addr.label}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="mt-2 text-xs space-y-0.5 text-slate-700 dark:text-slate-300">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{addr.fullName}</div>
                      {addr.companyName && (
                        <div className="text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">{addr.companyName}</div>
                      )}
                      <div className="text-slate-600 dark:text-slate-400 text-[11px]">{addr.addressLine1} {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</div>
                      <div className="text-slate-600 dark:text-slate-400 text-[11px] font-medium">{addr.city}, {addr.state} - {addr.pincode}</div>
                      <div className="text-slate-600 dark:text-slate-400 text-[11px]">Tel: {addr.phone} {addr.email ? `| ${addr.email}` : ''}</div>
                      {addr.gstin && (
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">GSTIN: {addr.gstin}</div>
                      )}
                      {addr.pan && (
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">PAN: {addr.pan}</div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700/60 mt-2">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => { setEditingAddress(addr); setIsCreatingNew(false); }}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(addr.id)}
                        className="p-1.5 text-red-500 hover:text-red-600 dark:hover:text-red-400 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {onSelectAddress && (
                      <div className="flex space-x-1.5">
                        {isVendor ? (
                          <button
                            onClick={() => {
                              onSelectAddress(addr, 'vendor');
                              onClose();
                            }}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Set as Vendor
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onSelectAddress(addr, 'user');
                              onClose();
                            }}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Set as Customer
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

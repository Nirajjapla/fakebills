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
    downloadAnchor.setAttribute('download', 'billcrafter_addresses.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            localStorage.setItem('billcrafter_saved_addresses_v2', JSON.stringify(parsed));
            setAddresses(parsed);
            alert('Addresses imported successfully!');
          }
        } catch (err) {
          alert('Invalid JSON file format.');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <BookUser className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Central User & Vendor Address Manager
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                  {addresses.length} Saved
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Manage user & vendor profiles in one central place. Generate real Indian city addresses with 1-click.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportJson}
              title="Export to JSON"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
            >
              <Download className="w-4 h-4" />
            </button>
            <label
              title="Import JSON"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* City Generator Ribbon */}
        <div className="p-3 bg-gradient-to-r from-indigo-950/80 via-slate-850 to-purple-950/80 border-b border-indigo-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-slate-200">Generate Real Indian Address for City:</span>
            <select
              value={selectedCityForGen}
              onChange={(e) => setSelectedCityForGen(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1 font-semibold focus:outline-none focus:border-indigo-500"
            >
              {indianCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleGenerateCityAddress('vendor')}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-lg shadow flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" /> + Auto-Generate Vendor in {selectedCityForGen}
            </button>
            <button
              onClick={() => handleGenerateCityAddress('user')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
            >
              <User className="w-3.5 h-3.5 text-indigo-400" /> + Generate Customer
            </button>
          </div>
        </div>

        {/* Main Tab Switcher (All vs User vs Vendor) & Search */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-bold bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => { setMainTab('all'); setSelectedCategory('all'); }}
              className={`px-3 py-1.5 rounded-lg transition ${mainTab === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              All Addresses ({addresses.length})
            </button>
            <button
              onClick={() => { setMainTab('user'); setSelectedCategory('all'); }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${mainTab === 'user' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <User className="w-3.5 h-3.5" /> User / Customer Profiles ({addresses.filter(a => a.category !== 'vendor').length})
            </button>
            <button
              onClick={() => { setMainTab('vendor'); setSelectedCategory('all'); }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${mainTab === 'vendor' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <Store className="w-3.5 h-3.5" /> Vendor / Merchant Profiles ({addresses.filter(a => a.category === 'vendor').length})
            </button>
          </div>

          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, city, phone, GSTIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
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
            <div className="bg-slate-800/90 border-2 border-indigo-500/80 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="font-bold text-sm text-indigo-300">
                  {isCreatingNew ? 'Create New Address Profile' : `Edit: ${editingAddress.label}`}
                </span>
                <button
                  onClick={() => { setEditingAddress(null); setIsCreatingNew(false); }}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Profile Label / Nickname</label>
                  <input
                    type="text"
                    value={editingAddress.label}
                    onChange={(e) => setEditingAddress({ ...editingAddress, label: e.target.value })}
                    placeholder="e.g. HP Petrol Pump Bellandur"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={editingAddress.category}
                    onChange={(e) => setEditingAddress({ ...editingAddress, category: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-semibold"
                  >
                    <option value="vendor">🏢 Vendor / Merchant / Station</option>
                    <option value="personal">👤 Personal (User)</option>
                    <option value="business">🏢 Business / Company HQ</option>
                    <option value="landlord">🏠 Landlord</option>
                    <option value="client">💼 Client</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Full Name / Merchant Entity Name</label>
                  <input
                    type="text"
                    value={editingAddress.fullName}
                    onChange={(e) => setEditingAddress({ ...editingAddress, fullName: e.target.value })}
                    placeholder="e.g. SRI VENKATESHWARA FUELS"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Company / Brand Subtitle (Optional)</label>
                  <input
                    type="text"
                    value={editingAddress.companyName || ''}
                    onChange={(e) => setEditingAddress({ ...editingAddress, companyName: e.target.value })}
                    placeholder="e.g. INDIAN OIL DEALER / Gold's Gym"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Phone / Mobile Number</label>
                  <input
                    type="text"
                    value={editingAddress.phone}
                    onChange={(e) => setEditingAddress({ ...editingAddress, phone: e.target.value })}
                    placeholder="e.g. 9845019283"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Address Line 1</label>
                  <input
                    type="text"
                    value={editingAddress.addressLine1}
                    onChange={(e) => setEditingAddress({ ...editingAddress, addressLine1: e.target.value })}
                    placeholder="Plot / Street / Highway"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Address Line 2 / Landmark</label>
                  <input
                    type="text"
                    value={editingAddress.addressLine2 || ''}
                    onChange={(e) => setEditingAddress({ ...editingAddress, addressLine2: e.target.value })}
                    placeholder="Locality, Landmark"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">City</label>
                  <input
                    type="text"
                    value={editingAddress.city}
                    onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
                    placeholder="Bengaluru / Mumbai"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">State</label>
                  <input
                    type="text"
                    value={editingAddress.state}
                    onChange={(e) => setEditingAddress({ ...editingAddress, state: e.target.value })}
                    placeholder="Karnataka"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={editingAddress.pincode}
                    onChange={(e) => setEditingAddress({ ...editingAddress, pincode: e.target.value })}
                    placeholder="560103"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={editingAddress.email || ''}
                    onChange={(e) => setEditingAddress({ ...editingAddress, email: e.target.value })}
                    placeholder="dealer@example.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={editingAddress.gstin || ''}
                    onChange={(e) => setEditingAddress({ ...editingAddress, gstin: e.target.value })}
                    placeholder="29AABCH1234K1Z2"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">PAN (Optional)</label>
                  <input
                    type="text"
                    value={editingAddress.pan || ''}
                    onChange={(e) => setEditingAddress({ ...editingAddress, pan: e.target.value })}
                    placeholder="AABCH1234K"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => { setEditingAddress(null); setIsCreatingNew(false); }}
                  className="px-4 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-xs font-semibold"
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
              return (
                <div
                  key={addr.id}
                  className={`border rounded-xl p-3.5 space-y-2 transition flex flex-col justify-between ${
                    isVendor 
                      ? 'bg-slate-800/80 border-amber-500/40 hover:border-amber-400' 
                      : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm flex items-center gap-1.5">
                        {isVendor ? (
                          <Store className="w-4 h-4 text-amber-400" />
                        ) : (
                          <MapPin className="w-4 h-4 text-indigo-400" />
                        )}
                        {addr.label}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        isVendor ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        addr.category === 'business' ? 'bg-blue-500/20 text-blue-300' :
                        addr.category === 'landlord' ? 'bg-purple-500/20 text-purple-300' :
                        addr.category === 'client' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {addr.category}
                      </span>
                    </div>

                    <div className="text-xs text-slate-200 font-bold mt-1">
                      {addr.fullName} {addr.companyName && <span className="text-slate-400 font-normal">({addr.companyName})</span>}
                    </div>

                    <div className="text-xs text-slate-400 mt-0.5 space-y-0.5">
                      <div>{addr.addressLine1}</div>
                      {addr.addressLine2 && <div>{addr.addressLine2}</div>}
                      <div>{addr.city}, {addr.state} - {addr.pincode}</div>
                      <div className="text-[11px] text-slate-500 pt-1">
                        <span>Ph: {addr.phone}</span>
                        {addr.gstin && <span className="text-amber-400/90 font-mono font-semibold"> | GST: {addr.gstin}</span>}
                        {addr.pan && <span> | PAN: {addr.pan}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 mt-2">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setEditingAddress(addr)}
                        className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(addr.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-700"
                        title="Delete"
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
                            <Store className="w-3 h-3" /> Set as Vendor
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onSelectAddress(addr, 'user');
                              onClose();
                            }}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-1"
                          >
                            <User className="w-3 h-3" /> Set as Customer
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAddresses.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">
              No address profiles found matching your search. Try clicking "+ Auto-Generate Vendor" above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

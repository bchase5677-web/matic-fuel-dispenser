import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Plus, Trash2, Users, ShoppingBag, Settings, LogOut, Package, Image as ImageIcon, CheckCircle, Clock, Search, X, LayoutDashboard, FileText, Bell, Menu, Fuel } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useSiteConfig } from '../SiteContext';
import { db, collection, getDocs, addDoc, updateDoc, doc, deleteDoc, onSnapshot, setDoc, getDoc } from '../firebase';
import defaultHeroImage from '../assets/images/luxury_gas_station_1782231212172.jpg';
import defaultProductsImage from '../assets/images/luxury_fuel_dispenser_1782231192519.jpg';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('matic_admin_auth') === 'true';
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === 'admin' && passwordInput === 'chasedev') {
      setIsAuthenticated(true);
      localStorage.setItem('matic_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid administrator credentials.');
    }
  };

  const { config: ctxConfig, refreshConfig } = useSiteConfig();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [config, setConfig] = useState({
    name: 'Matic FUELTEC Ltd', address: '', phone: '', whatsapp: '', email: ''
  });
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Stats
  const [stats, setStats] = useState({ revenue: 0, ordersCount: 0, customersCount: 0 });

  // Add Product Form
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', label: '', imageUrl: '', category: 'Dispensers', note: '' });

  useEffect(() => {
    // Sync with global config initial
    if (ctxConfig) {
      setConfig(prev => ({ ...prev, ...ctxConfig }));
    }
  }, [ctxConfig]);

  useEffect(() => {
    // Firestore Listeners
    const unsubProducts = onSnapshot(collection(db, 'products'), (snap) => {
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
      const ordersData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
      
      const totalRev = ordersData.reduce((acc, order: any) => acc + (order.total || 0), 0);
      setStats(prev => ({ ...prev, revenue: totalRev, ordersCount: ordersData.length }));
    });

    const unsubCustomers = onSnapshot(collection(db, 'customers'), (snap) => {
      setCustomers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setStats(prev => ({ ...prev, customersCount: snap.docs.length }));
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (snap) => {
      if (snap.exists()) {
        setConfig(prev => ({ ...prev, ...snap.data() }));
      }
    });

    // Socket for live visitors
    const s = io();
    s.on('visitors_update', (v) => setVisitors(v));
    setSocket(s);

    return () => {
      unsubProducts();
      unsubOrders();
      unsubCustomers();
      unsubSettings();
      s.disconnect();
    };
  }, []);

  const saveConfig = async () => {
    try {
      const configToSave = { ...config };
      // Remove any undefined values which Firestore rejects
      Object.keys(configToSave).forEach(key => {
        if ((configToSave as any)[key] === undefined) {
          delete (configToSave as any)[key];
        }
      });
      await setDoc(doc(db, 'settings', 'global'), configToSave, { merge: true });
      // Also update server for SSR/initial load fallback
      await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configToSave)
      });
      refreshConfig();
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. If images are too large, please try smaller ones.');
    }
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          setNewProduct(prev => ({ ...prev, imageUrl: canvas.toDataURL('image/jpeg', 0.7) }));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfigImageUpload = (e: any, field: string) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let MAX_WIDTH = 800;
          let MAX_HEIGHT = 800;
          
          if (field === 'logoUrl') {
            MAX_WIDTH = 400;
            MAX_HEIGHT = 400;
          }
          
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          setConfig(prev => ({ ...prev, [field]: canvas.toDataURL('image/jpeg', 0.5) }));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProduct = async () => {
    if (!newProduct.name || !newProduct.price) return alert("Name and price are required");
    
    try {
      if (editingProductId) {
        await updateDoc(doc(db, 'products', editingProductId), {
          ...newProduct,
          price: Number(newProduct.price),
        });
        alert('Product updated successfully!');
      } else {
        await addDoc(collection(db, 'products'), {
          ...newProduct,
          price: Number(newProduct.price),
          createdAt: new Date().toISOString()
        });
        alert('Product added successfully!');
      }
      
      setNewProduct({ name: '', price: '', description: '', label: '', imageUrl: '', category: 'Dispensers', note: '' });
      setEditingProductId(null);
      setShowAddProduct(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. If the image is too large, try a smaller one.');
    }
  };

  const openEditProduct = (p: any) => {
    setEditingProductId(p.id);
    setNewProduct({
      name: p.name || '',
      price: p.price || '',
      description: p.description || '',
      label: p.label || '',
      imageUrl: p.imageUrl || p.image || '',
      category: p.category || 'Dispensers',
      note: p.note || ''
    });
    setShowAddProduct(true);
  };

  const closeProductModal = () => {
    setShowAddProduct(false);
    setEditingProductId(null);
    setNewProduct({ name: '', price: '', description: '', label: '', imageUrl: '', category: 'Dispensers', note: '' });
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Delete this product?")) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  const exitAdmin = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('matic_admin_auth');
    window.location.hash = '';
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const seedMoreProducts = async () => {
    const moreProducts = [
      {
        name: "Eco-Pump Series 3", price: 6500, category: "Dispensers", label: "Eco-Friendly", description: "Energy efficient dispenser.", note: "Low power mode.", imageUrl: "https://images.unsplash.com/photo-1545464333-9cbd1f263054?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Industrial Flowmaster 9000", price: 18500, category: "Dispensers", label: "Heavy Duty", description: "High volume dispenser.", note: "Requires 3-phase power.", imageUrl: "https://images.unsplash.com/photo-1600868884976-9694e9766ee2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Fuel Filter Element Pro", price: 120, category: "Spare Parts", label: "Maintenance", description: "High flow filter.", note: "Replace every 6 months.", imageUrl: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Matic Calibration Can", price: 450, category: "Accessories", label: "Tools", description: "20L stainless steel calibration can.", note: "Certified accurate.", imageUrl: "https://images.unsplash.com/photo-1530983821817-482a033ce3b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      }
    ];
    for (const p of moreProducts) {
      await addDoc(collection(db, 'products'), { ...p, createdAt: new Date().toISOString() });
    }
    alert("Seeded!");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--color-matic-dark)] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#0F0F0F] border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-matic-gold)] to-yellow-600"></div>
          
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-matic-gold)] to-yellow-600 rounded-full flex items-center justify-center font-bold text-black text-xs">
                <Fuel className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="text-white font-bold text-xl tracking-widest leading-none uppercase">Matic Fueltec</div>
                <div className="text-gray-500 text-[10px] tracking-wider uppercase mt-1">Admin Portal</div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Administrator Sign In
          </h2>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg mb-6 text-center font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Username</label>
              <input 
                type="text" 
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
                placeholder="admin" 
                className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-matic-gold)] transition-all" 
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Password</label>
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                placeholder="••••••••" 
                className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-matic-gold)] transition-all" 
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button 
                type="button"
                onClick={() => window.location.hash = ''}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all text-center text-sm"
              >
                Back to Site
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-[var(--color-matic-gold)] hover:bg-[var(--color-matic-gold-hover)] text-black font-extrabold py-3 rounded-xl transition-all text-center text-sm"
              >
                Access Panel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex font-sans">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-64 bg-[#0F0F0F] border-r border-white/5 flex flex-col z-50 md:hidden"
            >
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-matic-gold)] to-yellow-600 rounded-full flex items-center justify-center font-bold text-black text-xs">
                    <Fuel className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <div className="font-bold tracking-widest text-white text-sm uppercase">MATIC</div>
                    <div className="text-[var(--color-matic-gold)] text-[10px] tracking-[0.2em] uppercase font-bold">FUELTEC</div>
                    <div className="text-gray-500 text-[9px] tracking-wider uppercase mt-1">Admin Dashboard</div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 py-6 flex flex-col gap-2 px-4 overflow-y-auto">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all ${
                        isActive 
                          ? 'bg-[#1a1810] text-[var(--color-matic-gold)] border border-[var(--color-matic-gold)]/20' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-[var(--color-matic-gold)]' : ''}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="p-4 border-t border-white/5">
                <button onClick={exitAdmin} className="flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl w-full transition-colors font-medium">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="w-64 bg-[#0F0F0F] border-r border-white/5 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-matic-gold)] to-yellow-600 rounded-full flex items-center justify-center font-bold text-black text-xs">
            <Fuel className="w-4 h-4 text-black" />
          </div>
          <div>
            <div className="font-bold tracking-widest text-white text-sm uppercase">MATIC</div>
            <div className="text-[var(--color-matic-gold)] text-[10px] tracking-[0.2em] uppercase font-bold">FUELTEC</div>
            <div className="text-gray-500 text-[9px] tracking-wider uppercase mt-1">Admin Dashboard</div>
          </div>
        </div>

        <div className="flex-1 py-6 flex flex-col gap-2 px-4 overflow-y-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-[#1a1810] text-[var(--color-matic-gold)] border border-[var(--color-matic-gold)]/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[var(--color-matic-gold)]' : ''}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5">
          <button onClick={exitAdmin} className="flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl w-full transition-colors font-medium">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <div className="h-16 border-b border-white/5 flex items-center px-4 md:px-8 bg-[#0A0A0A]">
          <button 
            className="md:hidden mr-4 text-gray-400 hover:text-white" 
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-white capitalize">{activeTab}</h2>
          <div className="ml-auto flex items-center gap-4">
            <button onClick={seedMoreProducts} className="text-xs bg-[var(--color-matic-gold)] text-black px-3 py-1 rounded font-bold">Seed</button>
            <button className="text-gray-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--color-matic-gold)] rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0F0F0F] p-6 rounded-2xl border border-white/5 flex flex-col justify-center">
                  <div className="text-gray-400 font-medium text-sm mb-2">Total Revenue</div>
                  <div className="text-3xl font-bold text-white">₦{stats.revenue.toLocaleString()}</div>
                  <div className="text-green-500 text-xs font-medium mt-2">+12.5%</div>
                </div>
                <div className="bg-[#0F0F0F] p-6 rounded-2xl border border-white/5 flex flex-col justify-center">
                  <div className="text-gray-400 font-medium text-sm mb-2">Orders</div>
                  <div className="text-3xl font-bold text-white">{stats.ordersCount}</div>
                  <div className="text-green-500 text-xs font-medium mt-2">+5.2%</div>
                </div>
                <div className="bg-[#0F0F0F] p-6 rounded-2xl border border-white/5 flex flex-col justify-center">
                  <div className="text-gray-400 font-medium text-sm mb-2">Live Visitors</div>
                  <div className="text-3xl font-bold text-white">{visitors.length}</div>
                  <div className="text-green-500 text-xs font-medium mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Active Now
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Products */}
          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-8">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Search products..." className="bg-[#0F0F0F] border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-matic-gold)]" />
                </div>
                <button onClick={() => {
                  setEditingProductId(null);
                  setNewProduct({ name: '', price: '', description: '', label: '', imageUrl: '', category: 'Dispensers', note: '' });
                  setShowAddProduct(true);
                }} className="bg-[var(--color-matic-gold)] text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-opacity text-sm">
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>

              {showAddProduct && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl w-full max-w-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white">{editingProductId ? 'Edit Product' : 'Add New Product'}</h3>
                      <button onClick={closeProductModal} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Product Image</label>
                        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center relative hover:border-[var(--color-matic-gold)]/50 transition-colors cursor-pointer bg-[#141414]">
                          {newProduct.imageUrl ? (
                            <img src={newProduct.imageUrl} alt="Preview" className="h-32 object-contain" />
                          ) : (
                            <>
                              <ImageIcon className="w-8 h-8 text-gray-500 mb-2" />
                              <span className="text-sm text-gray-400">Click to upload from device</span>
                            </>
                          )}
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Name</label>
                          <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-[#141414] border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[var(--color-matic-gold)]" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Price (₦)</label>
                          <input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-[#141414] border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[var(--color-matic-gold)]" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Label (e.g. Best Seller)</label>
                          <input type="text" placeholder="Optional" value={newProduct.label} onChange={e => setNewProduct({...newProduct, label: e.target.value})} className="w-full bg-[#141414] border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[var(--color-matic-gold)]" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
                          <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-[#141414] border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[var(--color-matic-gold)]">
                            <option value="Dispensers">Dispensers</option>
                            <option value="Spare Parts">Spare Parts</option>
                            <option value="Services">Services</option>
                            <option value="Accessories">Accessories</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                        <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} rows={2} className="w-full bg-[#141414] border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[var(--color-matic-gold)]"></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Product Note</label>
                        <textarea placeholder="Special notes about this product..." value={newProduct.note} onChange={e => setNewProduct({...newProduct, note: e.target.value})} rows={2} className="w-full bg-[#141414] border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[var(--color-matic-gold)]"></textarea>
                      </div>
                      
                      <div className="flex justify-end gap-3 mt-6">
                        <button onClick={closeProductModal} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white font-medium">Cancel</button>
                        <button onClick={saveProduct} className="bg-[var(--color-matic-gold)] text-black px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity">{editingProductId ? 'Save Changes' : 'Save Product'}</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(p => (
                  <div key={p.id} className="bg-[#0F0F0F] rounded-2xl border border-white/5 overflow-hidden group">
                    <div className="h-48 bg-[#141414] relative p-4 flex items-center justify-center">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="h-full w-full object-contain mix-blend-screen" />
                      ) : (
                        <Package className="w-12 h-12 text-white/10" />
                      )}
                      {p.label && (
                        <div className="absolute top-3 left-3 bg-[var(--color-matic-gold)] text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                          {p.label}
                        </div>
                      )}
                    </div>
                    <div className="p-4 border-t border-white/5">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-white text-lg line-clamp-1">{p.name}</h4>
                        <div className="text-[var(--color-matic-gold)] font-bold">₦{Number(p.price).toLocaleString()}</div>
                      </div>
                      <div className="text-gray-500 text-xs mb-4 line-clamp-2 min-h-[32px]">{p.description}</div>
                      
                      <div className="flex justify-end border-t border-white/5 pt-3 mt-3 gap-2">
                        <button onClick={() => openEditProduct(p)} className="text-[var(--color-matic-gold)] hover:bg-[var(--color-matic-gold)]/10 px-3 py-1 rounded transition-colors text-sm font-medium">
                          Edit
                        </button>
                        <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#141414] border-b border-white/5 text-xs uppercase tracking-wider text-gray-500 font-medium">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Contact & Address</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-mono text-xs">{order.id.substring(0,8)}</td>
                        <td className="px-6 py-4 font-medium">
                          <button onClick={() => {
                            const newName = prompt('Edit customer name', order.customerName);
                            if (newName !== null) updateDoc(doc(db, 'orders', order.id), { customerName: newName });
                          }} className="hover:text-white hover:underline text-left block">
                            {order.customerName || 'Guest'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">
                          <button onClick={() => {
                            const newPhone = prompt('Edit phone number', order.customerPhone || '');
                            if (newPhone !== null) updateDoc(doc(db, 'orders', order.id), { customerPhone: newPhone });
                          }} className="hover:text-white font-mono hover:underline block text-left">
                            📞 {order.customerPhone || 'Add phone'}
                          </button>
                          <button onClick={() => {
                            const newAddress = prompt('Edit delivery address', order.customerAddress || '');
                            if (newAddress !== null) updateDoc(doc(db, 'orders', order.id), { customerAddress: newAddress });
                          }} className="hover:text-white hover:underline block text-left max-w-[180px] truncate text-gray-500" title={order.customerAddress}>
                            📍 {order.customerAddress || 'Add address'}
                          </button>
                        </td>
                        <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <select 
                            value={order.status || 'Pending'} 
                            onChange={(e) => updateDoc(doc(db, 'orders', order.id), { status: e.target.value })}
                            className={`px-2 py-1 outline-none rounded text-xs font-medium ${order.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-[var(--color-matic-gold)]/10 text-[var(--color-matic-gold)]'}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 font-bold text-white">
                          <button onClick={() => {
                            const newTotal = prompt('Edit total (₦)', order.total);
                            if (newTotal && !isNaN(Number(newTotal))) updateDoc(doc(db, 'orders', order.id), { total: Number(newTotal) });
                          }} className="hover:text-[var(--color-matic-gold)]">
                            ₦{(order.total || 0).toLocaleString()}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={async () => {
                            if (confirm('Delete order?')) await deleteDoc(doc(db, 'orders', order.id));
                          }} className="text-red-500 hover:bg-red-500/10 p-2 rounded transition-colors inline-block">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No orders found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Customers */}
          {activeTab === 'customers' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map(c => (
                  <div key={c.id} className="bg-[#0F0F0F] p-5 rounded-2xl border border-white/5 flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[var(--color-matic-gold)] font-bold text-lg shrink-0">
                      {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-white cursor-pointer hover:underline" onClick={() => {
                        const newName = prompt('Edit customer name', c.name);
                        if (newName !== null) updateDoc(doc(db, 'customers', c.id), { name: newName });
                      }}>{c.name || 'Unknown User'}</div>
                      <div className="text-gray-500 text-xs mt-0.5 cursor-pointer hover:underline" onClick={() => {
                        const newEmail = prompt('Edit email', c.email);
                        if (newEmail !== null) updateDoc(doc(db, 'customers', c.id), { email: newEmail });
                      }}>{c.email || 'No email provided'}</div>
                      <div className="text-gray-400 text-xs font-mono mt-1 cursor-pointer hover:underline" onClick={() => {
                        const newPhone = prompt('Edit phone number', c.phone || '');
                        if (newPhone !== null) updateDoc(doc(db, 'customers', c.id), { phone: newPhone });
                      }}>📞 {c.phone || 'No phone number'}</div>
                      <div className="text-gray-500 text-xs mt-1 mb-2.5 cursor-pointer hover:underline max-w-[200px] truncate" title={c.address} onClick={() => {
                        const newAddress = prompt('Edit address', c.address || '');
                        if (newAddress !== null) updateDoc(doc(db, 'customers', c.id), { address: newAddress });
                      }}>📍 {c.address || 'No delivery address'}</div>
                      <div className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded inline-block cursor-pointer hover:bg-white/10" onClick={() => {
                        const newTotal = prompt('Edit total orders', c.totalOrders);
                        if (newTotal && !isNaN(Number(newTotal))) updateDoc(doc(db, 'customers', c.id), { totalOrders: Number(newTotal) });
                      }}>
                        Total Orders: {c.totalOrders || 0}
                      </div>
                    </div>
                    <button onClick={async () => {
                      if (confirm('Delete customer?')) await deleteDoc(doc(db, 'customers', c.id));
                    }} className="text-red-500 hover:bg-red-500/10 p-2 rounded transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {customers.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-500">No customers found.</div>
                )}
              </div>
            </motion.div>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-[#0F0F0F] p-6 rounded-2xl border border-white/5 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Live Visitor Stream</h3>
                  <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    {visitors.length} Active Users
                  </div>
                </div>
                
                <div className="space-y-3">
                  {visitors.map(v => (
                    <div key={v.id} className="flex items-center justify-between bg-[#141414] p-4 rounded-xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm">Session {v.id.substring(0, 8)}</div>
                          <div className="text-xs text-gray-500">IP: {v.ip}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs bg-[var(--color-matic-gold)]/10 text-[var(--color-matic-gold)] px-2 py-1 rounded font-medium inline-block mb-1">
                          Viewing: {v.page}
                        </div>
                        <div className="text-xs text-gray-500 block">
                          Joined {new Date(v.joinedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {visitors.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">No active visitors right now</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
              <div className="bg-[#0F0F0F] p-8 rounded-2xl border border-white/5">
                <h3 className="text-lg font-bold text-white mb-6">General Information</h3>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Website/Business Name</label>
                    <input type="text" value={config.name} onChange={e => setConfig({...config, name: e.target.value})} className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-matic-gold)] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Contact Email</label>
                    <input type="email" value={config.email} onChange={e => setConfig({...config, email: e.target.value})} className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-matic-gold)] transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                      <input type="text" value={config.phone} onChange={e => setConfig({...config, phone: e.target.value})} className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-matic-gold)] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">WhatsApp Number</label>
                      <input type="text" value={config.whatsapp} onChange={e => setConfig({...config, whatsapp: e.target.value})} className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-matic-gold)] transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Physical Address</label>
                    <textarea rows={3} value={config.address} onChange={e => setConfig({...config, address: e.target.value})} className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-matic-gold)] transition-colors" />
                  </div>
                  
                  <div className="pt-6 border-t border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4">Website Images</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Logo (Overrides text/icon logo)</label>
                        <div className="border-2 border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center relative hover:border-[var(--color-matic-gold)]/50 transition-colors cursor-pointer bg-[#141414] min-h-[100px]">
                          {config.logoUrl ? (
                            <img src={config.logoUrl} alt="Logo Preview" className="max-h-16 object-contain" />
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                               <Fuel className="w-8 h-8 text-[var(--color-matic-gold)]" />
                               <span className="text-sm text-gray-400">Click to upload custom logo</span>
                            </div>
                          )}
                          <input type="file" accept="image/*" onChange={(e) => handleConfigImageUpload(e, 'logoUrl')} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Hero Section Image</label>
                        <div className="border-2 border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center relative hover:border-[var(--color-matic-gold)]/50 transition-colors cursor-pointer bg-[#141414] min-h-[150px]">
                          <img src={config.heroImageUrl || defaultHeroImage} alt="Hero Preview" className="max-h-32 object-contain" />
                          <input type="file" accept="image/*" onChange={(e) => handleConfigImageUpload(e, 'heroImageUrl')} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Products Section Image</label>
                        <div className="border-2 border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center relative hover:border-[var(--color-matic-gold)]/50 transition-colors cursor-pointer bg-[#141414] min-h-[150px]">
                          <img src={config.productsImageUrl || defaultProductsImage} alt="Products Preview" className="max-h-32 object-contain" />
                          <input type="file" accept="image/*" onChange={(e) => handleConfigImageUpload(e, 'productsImageUrl')} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                  <button onClick={saveConfig} className="bg-[var(--color-matic-gold)] text-black px-8 py-3 font-bold rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <Save className="w-5 h-5" /> Save Configuration
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}


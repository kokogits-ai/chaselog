/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { 
  Home, 
  Send, 
  History, 
  CreditCard, 
  Bell, 
  Settings, 
  User, 
  Search, 
  LogOut, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  MoreHorizontal,
  ChevronRight,
  Menu,
  X,
  Plus,
  ArrowRightLeft,
  PieChart,
  Wallet,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Hardcoded User Data ---
const USER_DATA = {
  surname: "John",
  middleName: "camo",
  lastName: "smith",
  fullName: "John camo smith",
  username: "John camo",
  password: "cupcake123456",
  email: "johnprivate677i@gmail.com",
  pin: "2090",
  dob: "January 14, 1971",
  country: "United States of America",
  state: "North Carolina",
  city: "Charlotte",
  zip: "28203",
  address: "2205 Terrell Pl",
  occupation: "contractor",
  gender: "Male",
  accountNum: "175920396482",
  routing: Math.floor(100000000 + Math.random() * 900000000).toString(),
  availableBalance: 865700,
  savingsBalance: 865700,
  checkingBalance: 67000,
  creditLimit: 50000
};

// --- Transaction Data ---
const TRANSACTIONS = [
  { id: 0, name: "Transfer to Account 175920396482", amount: -150000.00, status: "Pending", date: "May 15, 2026", category: "Transfer", icon: "send", routing: "281081877", isPending: true },
  { id: 1, name: "Amazon Marketplace", amount: -128.50, status: "Completed", date: "May 18, 2026", category: "Shopping", icon: "shopping" },
  { id: 2, name: "Salary Deposit - Contractor", amount: 12500.00, status: "Completed", date: "May 15, 2026", category: "Income", icon: "income" },
  { id: 3, name: "Shell Gasoline", amount: -65.20, status: "Completed", date: "May 14, 2026", category: "Transport", icon: "transport" },
  { id: 4, name: "Whole Foods Market", amount: -212.45, status: "Completed", date: "May 12, 2026", category: "Groceries", icon: "groceries" },
  { id: 5, name: "Netflix Subscription", amount: -19.99, status: "Completed", date: "May 10, 2026", category: "Entertainment", icon: "entertainment" },
  { id: 6, name: "Interest Credit", amount: 45.30, status: "Completed", date: "May 01, 2026", category: "Rewards", icon: "rewards" },
];

// --- Nav Items ---
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Accounts', icon: Home },
  { id: 'transfer', label: 'Pay & Collect', icon: ArrowRightLeft },
  { id: 'transactions', label: 'Transactions', icon: History },
  { id: 'cards', label: 'Cards', icon: CreditCard },
  { id: 'notifications', label: 'Alerts', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authStep, setAuthStep] = useState<'login' | 'pin' | 'authenticated'>('login');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleTransferSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowRestrictionModal(true);
  };

  const handleLoginSuccess = () => setAuthStep('pin');
  const handlePinSuccess = () => setAuthStep('authenticated');
  const handleLogout = () => {
    setAuthStep('login');
    setActiveTab('dashboard');
    setIsSidebarOpen(false);
  };

  if (isLoading) {
    return (
      <div id="loader" className="fixed inset-0 bg-[#005db9] flex flex-col items-center justify-center z-50">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mb-4"
        />
        <h1 className="text-white font-sans font-medium text-xl tracking-tight">Securing Connection...</h1>
      </div>
    );
  }

  if (authStep === 'login') {
    return <LoginView onSuccess={handleLoginSuccess} />;
  }

  if (authStep === 'pin') {
    return <PinView onSuccess={handlePinSuccess} />;
  }

  if (selectedAccount === 'savings') {
    return <AccountDetailView onBack={() => setSelectedAccount(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans text-slate-900 flex flex-col items-center">
      {/* Container to limits width on large screens for mobile-first feel */}
      <div className="w-full max-w-md bg-[#F1F5F9] min-h-screen flex flex-col relative shadow-2xl">
        {/* --- Header --- */}
        <header className="bg-[#005db9] px-4 pt-8 pb-6 text-white sticky top-0 z-40">
          <div className="flex items-center justify-between mb-6">
            <Search className="text-white/80" size={20} />
            <div className="flex-1 px-4">
              <input 
                type="text" 
                placeholder="Search in the app" 
                className="w-full bg-white/10 border-none rounded-2xl py-2 px-4 text-sm placeholder:text-white/60 focus:ring-1 focus:ring-white/30 outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-white/80" />
              <button 
                onClick={() => setActiveTab('profile')}
                className="w-9 h-9 rounded-full bg-blue-400 flex items-center justify-center text-xs font-bold ring-1 ring-white/20 uppercase hover:bg-blue-300 transition-colors"
              >
                {USER_DATA.surname[0]}{USER_DATA.middleName[0]}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold tracking-tighter">CHASE</span>
              <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                <ShieldAlert size={14} />
              </div>
              <h2 className="text-base font-medium">Hi, {USER_DATA.fullName}</h2>
            </div>
            <button 
              onClick={() => setShowRestrictionModal(true)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
            >
              <Plus size={18} />
            </button>
          </div>
        </header>

        {/* --- View Rendering --- */}
        <div className="flex-1 pb-24 overflow-x-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <DashboardOverview 
                  onRestriction={handleTransferSubmit} 
                  onSelectSavings={() => setSelectedAccount('savings')}
                  onSelectProfile={() => setActiveTab('profile')}
                />
              </motion.div>
            )}
            {activeTab === 'transfer' && (
              <motion.div 
                key="transfer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                <TransferView onSubmit={handleTransferSubmit} />
              </motion.div>
            )}
            {activeTab === 'transactions' && (
              <motion.div 
                key="transactions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                <TransactionsView 
                  selectedTransaction={selectedTransaction} 
                  setSelectedTransaction={setSelectedTransaction} 
                  setShowRestrictionModal={setShowRestrictionModal} 
                />
              </motion.div>
            )}
            {activeTab === 'cards' && (
              <motion.div key="cards" className="p-6">
                <CardsView setShowRestrictionModal={setShowRestrictionModal} />
              </motion.div>
            )}
            {activeTab === 'notifications' && (
              <motion.div key="notifications" className="p-6">
                <NotificationsView />
              </motion.div>
            )}
            {activeTab === 'profile' && (
              <motion.div key="profile" className="p-6">
                <ProfileView onLogout={handleLogout} setShowRestrictionModal={setShowRestrictionModal} />
              </motion.div>
            )}
            {activeTab === 'settings' && (
              <motion.div key="settings" className="p-6">
                <SettingsView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- Mobile Nav Bar --- */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <NavButton id="dashboard" label="Accounts" icon={Home} active={activeTab} onClick={setActiveTab} />
          <NavButton id="transfer" label="Pay & Collect" icon={ArrowRightLeft} active={activeTab} onClick={setActiveTab} />
          <NavButton id="transactions" label="Transactions" icon={History} active={activeTab} onClick={setActiveTab} />
          <div className="relative group">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="flex flex-col items-center gap-1 text-slate-400">
               <Menu size={22} />
               <span className="text-[10px] font-bold uppercase tracking-widest">Menu</span>
            </button>
          </div>
        </nav>

        {/* --- Side Drawer (Simulated Sidebar for Mobile) --- */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-[55]"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="absolute right-0 top-0 h-full w-4/5 bg-white z-[60] shadow-xl p-8"
              >
                <div className="flex justify-between items-center mb-10">
                  <h3 className="font-bold text-slate-800">Menu</h3>
                  <button onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
                </div>
                <div className="space-y-6">
                  {NAV_ITEMS.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                      className={`flex items-center gap-4 w-full p-2 rounded-xl font-bold uppercase tracking-widest text-xs ${activeTab === item.id ? 'text-[#005db9]' : 'text-slate-400'}`}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </button>
                  ))}
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-4 w-full p-4 rounded-xl font-bold uppercase tracking-widest text-xs text-rose-500 bg-rose-50 mt-10"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* --- Restriction Modal --- */}
      <AnimatePresence>
        {showRestrictionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRestrictionModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl relative z-10 border border-slate-100 overflow-hidden"
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-20 w-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 text-amber-500">
                  <ShieldAlert size={42} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Transfer Restricted</h3>
                <p className="text-slate-500 leading-relaxed mb-8">
                  For security, compliance, geographical verification, and account protection purposes, both local and international transfers are currently restricted on this account.<br/><br/>
                  Please contact your account officer or visit your registered branch for further verification and transfer activation.
                </p>
                <div className="flex flex-col w-full gap-3">
                  <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">
                    Contact Support
                  </button>
                  <button 
                    onClick={() => setShowRestrictionModal(false)}
                    className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Views Components ---

function DashboardOverview({ onRestriction, onSelectSavings, onSelectProfile }: { onRestriction: (e: any) => void, onSelectSavings: () => void, onSelectProfile: () => void }) {
  return (
    <div className="space-y-6 pt-6">
      {/* Accounts Card (Screenshot style) */}
      <div className="px-4">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col space-y-6">
          <h3 className="text-base font-extrabold text-slate-800">Accounts</h3>
          
          <div className="flex flex-col space-y-6">
            <button onClick={onSelectSavings} className="flex justify-between items-start group text-left w-full">
              <div className="text-left">
                <h4 className="text-[#005db9] font-bold text-sm flex items-center gap-1 group-hover:underline">
                  ELITE SAVINGS <ChevronRight size={14} />
                </h4>
                <p className="text-slate-400 text-[11px] font-bold mt-1 tracking-widest">** 9346</p>
              </div>
              <p className="text-slate-800 font-extrabold text-lg">${USER_DATA.savingsBalance.toLocaleString()}.00</p>
            </button>

            <div className="h-px bg-slate-50 w-full" />

            <button onClick={onRestriction} className="flex justify-between items-start group">
              <div className="text-left">
                <h4 className="text-[#005db9] font-bold text-sm flex items-center gap-1 group-hover:underline">
                  TOTAL CHECKING <ChevronRight size={14} />
                </h4>
                <p className="text-slate-400 text-[11px] font-bold mt-1 tracking-widest">** 7590</p>
              </div>
              <p className="text-slate-800 font-extrabold text-lg">${USER_DATA.checkingBalance.toLocaleString()}.00</p>
            </button>

            <div className="h-px bg-slate-50 w-full" />

            <button onClick={onRestriction} className="text-[#005db9] font-bold text-sm flex items-center gap-2 py-2 hover:translate-x-1 transition-transform">
              <Plus size={16} /> Open an Account
            </button>
          </div>
        </div>
      </div>

      {/* Primary Actions as requested (Mobile row) */}
      <div className="px-4">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 grid grid-cols-4 gap-2 text-center">
          <ActionButton onClick={onRestriction} icon={Plus} label="Add Funds" />
          <ActionButton onClick={onRestriction} icon={History} label="Statement" />
          <ActionButton onClick={onRestriction} icon={PieChart} label="Analytics" />
          <ActionButton onClick={onRestriction} icon={ArrowRightLeft} label="Transfer" />
        </div>
      </div>

      {/* Quick Actions (Bento but mobile scroll) */}
      <div className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-slate-800">Elite offers</h3>
          <button onClick={onRestriction} className="text-[#005db9] text-xs font-bold">All offers &gt;</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
          <OfferCard onClick={onRestriction} icon={CreditCard} label="Cards" color="bg-slate-50 text-[#005db9]" />
          <OfferCard onClick={onRestriction} icon={TrendingUp} label="STOCKS" color="bg-rose-600 text-white" title="MARKET" />
          <OfferCard onClick={onRestriction} icon={ShieldAlert} label="SECURITY" color="bg-[#001e44] text-white" />
          <OfferCard onClick={onSelectProfile} icon={User} label="PROFILE" color="bg-white text-slate-800 border" />
        </div>
      </div>

      {/* Invest Section */}
      <div className="px-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group cursor-pointer" onClick={onRestriction}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-extrabold text-slate-800">Invest with EliteBank</h3>
            <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Work with an advisor, invest online and access market insights</p>
        </div>
      </div>

      {/* Schedule Visit */}
      <div className="px-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex justify-between items-center group cursor-pointer" onClick={onRestriction}>
          <div>
             <h3 className="text-sm font-extrabold text-slate-800">Schedule a visit</h3>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Visit our local branch</p>
          </div>
          <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-all" />
        </div>
      </div>

      {/* Stats as requested earlier but mobile refined */}
      <div className="px-4 space-y-4">
        <div className="bg-[#005db9] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group" onClick={onRestriction}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-2">Total Balance</h4>
          <h2 className="text-4xl font-extrabold tracking-tighter">${USER_DATA.availableBalance.toLocaleString()}<span className="text-blue-200 text-xl font-light">.70</span></h2>
          <div className="mt-8 flex justify-between items-end border-t border-white/10 pt-6">
            <div className="text-[10px] font-mono tracking-widest opacity-60">ACCT: **** 6482</div>
            <div className="text-[10px] font-mono tracking-widest opacity-60">ROUT: {USER_DATA.routing}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavButton({ id, label, icon: Icon, active, onClick }: any) {
  return (
    <button 
      onClick={() => onClick(id)}
      className={`flex flex-col items-center gap-1 transition-all ${active === id ? 'text-[#005db9]' : 'text-slate-400'}`}
    >
      <Icon size={22} className={active === id ? 'text-[#005db9]' : 'text-slate-400'} />
      <span className="text-[10px] font-extrabold uppercase tracking-widest">{label}</span>
    </button>
  );
}

function OfferCard({ icon: Icon, label, color, title, onClick }: any) {
  return (
    <div onClick={onClick} className={`min-w-[100px] h-24 rounded-2xl p-4 flex flex-col justify-between shrink-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow active:scale-95 ${color}`}>
      <Icon size={20} />
      <div className="flex flex-col">
        {title && <span className="text-[8px] font-black uppercase opacity-60">{title}</span>}
        <span className="text-[10px] font-black uppercase tracking-tight">{label}</span>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group p-2">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#005db9] flex items-center justify-center group-hover:bg-blue-100 active:scale-90 transition-all">
        <Icon size={20} />
      </div>
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
    </button>
  );
}

function ActivityItem({ title, time, desc, status }: any) {
  return (
    <div className="relative pl-8">
      <div className="absolute left-0 top-1.5 w-4.5 h-4.5 rounded-full border-4 border-white bg-[#004a99] shadow-sm z-10" />
      <div className="flex justify-between items-start mb-1">
        <h5 className="font-bold text-sm text-gray-900">{title}</h5>
        <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">{status}</span>
      </div>
      <p className="text-xs text-gray-500 mb-1">{desc}</p>
      <span className="text-[10px] font-bold text-gray-300 uppercase">{time}</span>
    </div>
  );
}

function TransferView({ onSubmit }: { onSubmit: (e: FormEvent) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-[32px] p-8 lg:p-12 shadow-sm border border-slate-200">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-3 tracking-tight text-slate-800">Move Funds</h2>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Global Network Transfer</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-1">Recipient Name</label>
              <input required type="text" placeholder="e.g. Alice Johnson" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#005db9] focus:bg-white outline-none transition-all text-sm font-bold text-slate-800" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-1">Bank Name</label>
              <input required type="text" placeholder="e.g. Chase Bank" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#005db9] focus:bg-white outline-none transition-all text-sm font-bold text-slate-800" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-1">Account Number / IBAN</label>
            <input required type="text" placeholder="US12 3456 ..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#005db9] focus:bg-white outline-none transition-all text-sm font-bold text-slate-800" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-1">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-300">$</span>
                <input required type="number" step="0.01" placeholder="0.00" className="w-full pl-8 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#005db9] focus:bg-white outline-none transition-all font-bold text-xl text-slate-800" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-1">Transfer Type</label>
              <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#005db9] focus:bg-white outline-none transition-all appearance-none cursor-pointer text-sm font-bold text-slate-800">
                <option>Local Transfer (Fastest)</option>
                <option>International Wire (SWIFT)</option>
                <option>Internal Account Move</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full py-5 bg-[#005db9] text-white rounded-[20px] font-bold text-lg shadow-lg shadow-blue-200 hover:bg-[#004a99] transition-all">
            Transfer Now
          </button>
        </form>
      </div>
    </motion.div>
  );
}

function TransactionsView({ selectedTransaction, setSelectedTransaction, setShowRestrictionModal }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-800 uppercase">Transactions</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Real-time status</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowRestrictionModal(true)} className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
            Filter <Search size={14} />
          </button>
          <button onClick={() => setShowRestrictionModal(true)} className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm text-slate-800">
            Download PDF
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {[...TRANSACTIONS].map((tx, idx) => (
          <div 
            key={`${tx.id}-${idx}`} 
            onClick={() => setSelectedTransaction(tx)}
            className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${tx.amount < 0 ? 'bg-slate-50 text-slate-400' : 'bg-emerald-50 text-emerald-600'}`}>
                {tx.amount < 0 ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
              </div>
              <div className="flex flex-col min-w-0 pr-2">
                <p className="font-extrabold text-[12px] text-slate-800 uppercase tracking-tight break-words leading-tight">{tx.name}</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 whitespace-nowrap">{tx.date}</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full shrink-0" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#005db9] whitespace-nowrap">{tx.category}</span>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className={`font-black text-sm tracking-tighter ${tx.isPending ? 'text-rose-600' : (tx.amount < 0 ? 'text-slate-900' : 'text-emerald-600')}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </p>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${tx.isPending ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                <span className={`text-[8px] font-black uppercase tracking-widest ${tx.isPending ? 'text-rose-500/80' : 'text-emerald-500/80'}`}>{tx.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedTransaction && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setSelectedTransaction(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="bg-[#005db9] p-8 text-white text-center relative">
                <button 
                  onClick={() => setSelectedTransaction(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X size={18} />
                </button>
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${selectedTransaction.amount < 0 ? 'bg-white/10' : 'bg-emerald-400/20'}`}>
                   {selectedTransaction.amount < 0 ? <TrendingDown size={32} /> : <TrendingUp size={32} />}
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">{selectedTransaction.category}</h3>
                <p className="text-3xl font-black tracking-tighter">
                  {selectedTransaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Merchant / Recipient</span>
                    <span className="text-sm font-bold text-slate-800 text-right uppercase tracking-tight max-w-[180px]">{selectedTransaction.name}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</span>
                    <span className="text-sm font-bold text-slate-800 uppercase tracking-tight">{selectedTransaction.date}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference ID</span>
                    <span className="text-[10px] font-mono text-slate-400">#TXN-{Math.random().toString(16).slice(2, 10).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${selectedTransaction.isPending ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${selectedTransaction.isPending ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      {selectedTransaction.status}
                    </span>
                  </div>
                  {selectedTransaction.routing && (
                     <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Routing Number</span>
                        <span className="text-[10px] font-mono text-slate-800 font-bold">{selectedTransaction.routing}</span>
                     </div>
                  )}
                </div>

                <button 
                  onClick={() => setSelectedTransaction(null)}
                  className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-100 transition-colors"
                >
                  Close Receipt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="py-10 text-center">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">End of recent transactions</p>
      </div>
    </motion.div>
  );
}

function CardsView({ setShowRestrictionModal }: any) {
  const cards = [
    { title: "Elite Platinum Card", type: "VISA", number: "**** 8273", expiry: "09/28", color: "bg-[#1e293b]", balance: "$24,500.00" },
    { title: "Personal Spending", type: "MASTERCARD", number: "**** 1290", expiry: "12/26", color: "bg-[#064e3b]", balance: "$5,102.40" },
    { title: "Corporate Expense", type: "VISA", number: "**** 9934", expiry: "02/27", color: "bg-[#451a03]", balance: "$12,000.00" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <div key={i} className={`${card.color} rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group perspective-1000`}>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative z-10 h-full flex flex-col">
               <div className="flex justify-between items-start mb-12">
                 <div>
                   <h4 className="font-bold text-lg mb-1">{card.title}</h4>
                   <p className="text-white/40 text-[10px] uppercase tracking-widest">Active Status</p>
                 </div>
                 <div className="italic font-bold text-xl opacity-80">{card.type}</div>
               </div>

               <div className="mt-auto">
                 <div className="flex items-center gap-6 mb-8 opacity-60">
                   <div className="w-10 h-8 bg-amber-400/20 rounded-md backdrop-blur-sm border border-amber-400/20 flex items-center justify-center">
                     <div className="w-6 h-4 border border-amber-400/30 rounded" />
                   </div>
                   <div className="text-lg font-mono tracking-[0.3em]">{card.number}</div>
                 </div>

                 <div className="flex justify-between items-end">
                   <div>
                     <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Expires</p>
                     <p className="font-bold">{card.expiry}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Current Balance</p>
                     <p className="text-2xl font-bold">{card.balance}</p>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] p-8 border border-slate-200">
        <h3 className="text-xl font-bold mb-10 tracking-tight text-slate-800 uppercase">Card Management</h3>
        <div className="space-y-6">
          <ManagementItem onClick={() => setShowRestrictionModal(true)} icon={ShieldAlert} title="Global Card Freeze" desc="Instantly disable all card payments globally" color="rose" />
          <ManagementItem onClick={() => setShowRestrictionModal(true)} icon={Send} title="International Payments" desc="Enable or disable cross-border transactions" color="blue" />
          <ManagementItem onClick={() => setShowRestrictionModal(true)} icon={CreditCard} title="Virtual Cards" desc="Create temporary cards for secure online shopping" color="amber" />
        </div>
      </div>
    </motion.div>
  );
}

function NotificationsView() {
  const alerts = [
    { title: "Unrecognized Login Attempt", desc: "A new device attempted to access your account from California, USA. Was this you?", time: "2 hours ago", type: "warning" },
    { title: "Payment Received", desc: "Your contractor payout for 'Project Blue' has been successfully credited.", time: "1 day ago", type: "success" },
    { title: "Statement Ready", desc: "Your April transaction statement is now available for download.", time: "3 days ago", type: "info" },
    { title: "Low Balance Alert", desc: "Secondary account balance is below your $1,000 threshold.", time: "1 week ago", type: "warning" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {alerts.map((alert, i) => (
        <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex gap-8 hover:shadow-md transition-all group">
          <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center ${
            alert.type === 'warning' ? 'bg-amber-50 text-amber-500' : 
            alert.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-[#005db9]'
          }`}>
            <Bell size={24} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-slate-800 group-hover:text-[#005db9] transition-colors uppercase tracking-tight">{alert.title}</h4>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{alert.time}</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">{alert.desc}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

// --- Auth & Detail Views ---

function LoginView({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email === USER_DATA.email && password === USER_DATA.password) {
      onSuccess();
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-[#005db9] flex flex-col items-center justify-center p-6 font-sans">
      <div className="mb-8 text-center">
        {/* Chase-style Octagon Logo */}
        <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
           <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
              <path d="M50 0 L85 15 L100 50 L85 85 L50 100 L15 85 L0 50 L15 15 Z M50 20 L27 30 L20 50 L27 70 L50 80 L73 70 L80 50 L73 30 Z" />
           </svg>
        </div>
        <h1 className="text-2xl font-medium text-white tracking-tight">Secure Sign In</h1>
      </div>

      <div className="w-full max-w-[400px] bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="p-8 pb-4 text-center">
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
            <Fingerprint size={28} />
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">Touch ID for Chase</p>
          <p className="text-xs text-slate-400">Log on to view your accounts.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-2 space-y-6">
          <div className="space-y-1 border-b border-slate-200">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#005db9]">Email</label>
            <input 
              required 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pb-3 bg-transparent outline-none transition-all text-base font-medium text-slate-800 placeholder:text-slate-300" 
              placeholder="Username"
            />
          </div>

          <div className="space-y-1 border-b border-slate-200">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#005db9]">Password</label>
            <input 
              required 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pb-3 bg-transparent outline-none transition-all text-base font-medium text-slate-800 placeholder:text-slate-300" 
              placeholder="Enter passcode"
            />
          </div>

          {error && <p className="text-rose-500 text-[10px] font-bold uppercase text-center">{error}</p>}

          <div className="pt-2">
            <button type="submit" className="w-full py-4 bg-[#005db9] text-white rounded-md font-bold text-sm tracking-wide hover:bg-[#004a99] transition-all uppercase">
              Sign In
            </button>
            <div className="mt-6 flex justify-between items-center text-[11px] font-bold text-[#005db9] uppercase tracking-wider">
              <button type="button">Forgot Password?</button>
              <button type="button">Sign Up</button>
            </div>
          </div>
        </form>
      </div>
      
      <div className="mt-10 text-white/60 text-[10px] font-medium uppercase tracking-[0.2em] text-center">
        Member FDIC © 2026 JPMorgan Chase & Co.
      </div>
    </div>
  );
}

function PinView({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pin === USER_DATA.pin) {
      onSuccess();
    } else {
      setError('Invalid PIN code');
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-[#005db9] flex flex-col items-center justify-center p-6 font-sans">
      <div className="mb-8 text-center text-white">
        <div className="w-10 h-10 mx-auto mb-6">
           <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <path d="M50 0 L85 15 L100 50 L85 85 L50 100 L15 85 L0 50 L15 15 Z M50 20 L27 30 L20 50 L27 70 L50 80 L73 70 L80 50 L73 30 Z" />
           </svg>
        </div>
        <h2 className="text-xl font-medium tracking-tight">Enter Your Security PIN</h2>
      </div>

      <div className="w-full max-w-[360px] bg-white rounded-lg shadow-2xl p-10 text-center">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center flex-col items-center gap-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Authenticating Signature</p>
            <input 
              required
              autoFocus
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full p-4 text-center text-4xl font-black tracking-[0.6em] bg-slate-50 border-b-4 border-[#005db9] outline-none transition-all text-slate-800 rounded-t-xl"
            />
          </div>

          {error && <p className="text-rose-500 text-[10px] font-bold uppercase">{error}</p>}

          <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-md font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all">
            Secure Verify
          </button>
        </form>
      </div>
    </div>
  );
}

function AccountDetailView({ onBack }: { onBack: () => void }) {
  const accountTransactions = [
    { name: "Transfer - 175920396482", date: "May  15, 2026 at 7:00 PM", amount: -150000.07, status: "Pending", icon: "shopping", bal: "30,000.00" },
    { name: "Purchase - Fuel Station", date: "Dec 18, 2025 at 10:30 AM", amount: -180.08, status: "Completed", icon: "transport", bal: "30,160.07" },
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans flex justify-center">
      <div className="w-full max-w-md flex flex-col bg-white">
        {/* Header from Screenshot */}
        <div className="bg-[#005db9] p-6 pt-10 text-white">
           <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
               <button onClick={onBack} className="p-1"><ChevronRight size={20} className="rotate-180" /></button>
               <span className="text-lg font-bold">JPM</span>
               <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Wallet size={16} /></div>
               <span className="text-sm">Hi, Annie Maibach Mary</span>
             </div>
             <div className="flex gap-4">
               <Bell size={20} className="text-white/80" />
               <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center font-bold text-xs">AM</div>
               <Plus size={20} className="text-white/80" />
             </div>
           </div>

           <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
             <div className="bg-white/10 rounded-2xl p-4 min-w-[150px] border border-white/20">
               <p className="text-[10px] opacity-60">All Accounts</p>
               <p className="text-[10px] opacity-40 uppercase">Overview</p>
               <h3 className="text-xl font-bold mt-2">$97,000.00</h3>
               <p className="text-[10px] text-emerald-300 flex items-center gap-1 mt-1"><div className="w-1.5 h-1.5 bg-emerald-300 rounded-full"/> Active</p>
             </div>
             <div className="bg-white rounded-2xl p-4 min-w-[150px] text-slate-900 border-2 border-blue-400">
               <p className="text-[10px] font-bold text-slate-800">CHASE SAVINGS</p>
               <p className="text-[10px] text-slate-400">**9346</p>
               <h3 className="text-xl font-bold mt-2">$865,700.00</h3>
               <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"/> Active</p>
             </div>
           </div>
        </div>

        {/* Balance Section */}
        <div className="p-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-50 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Balance</span>
              <span className="bg-blue-50 text-[#005db9] text-[10px] font-bold px-3 py-1 rounded-full">USD</span>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-800 tracking-tighter">$865700.00</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Account ending in **9346</p>
            
            <div className="space-y-4 pt-4 divide-y divide-slate-50">
              <div className="flex justify-between pt-4">
                <span className="text-xs text-slate-400">Account Number</span>
                <span className="text-xs font-bold text-[#005db9]">9513639346</span>
              </div>
              <div className="flex justify-between pt-4">
                <span className="text-xs text-slate-400">Routing Number</span>
                <span className="text-xs font-bold text-[#005db9]">021000021</span>
              </div>
              <div className="flex justify-between pt-4">
                <span className="text-xs text-slate-400">ACH Number</span>
                <span className="text-xs font-bold text-[#005db9]">9513639346</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History Heading */}
        <div className="px-6 flex items-center justify-between mb-4 mt-4">
          <h3 className="font-bold text-lg text-slate-800">Transaction History</h3>
          <div className="flex gap-2 bg-slate-100 p-1 rounded-full">
            <button className="bg-white text-blue-600 px-4 py-1 rounded-full text-xs font-bold shadow-sm">All</button>
            <button className="text-slate-400 px-4 py-1 rounded-full text-xs font-bold">In</button>
            <button className="text-slate-400 px-4 py-1 rounded-full text-xs font-bold">Out</button>
          </div>
        </div>

        {/* History List */}
        <div className="px-6 space-y-4 pb-20">
          {accountTransactions.map((tx, idx) => (
            <div key={idx} className="flex items-center gap-4 py-4 border-b border-slate-50 relative group">
              <div className="w-12 h-12 bg-rose-50 text-rose-400 rounded-2xl flex items-center justify-center shrink-0">
                <TrendingDown size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-800 truncate">{tx.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{tx.date} • {tx.status}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-rose-500">-{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                <p className="text-[10px] text-slate-300 mt-0.5">Bal: ${tx.bal}</p>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20"><CreditCard size={14} /></div>
            </div>
          ))}
        </div>

        {/* Bottom Sim Footer */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-100 p-4 flex justify-around items-center">
          <button className="flex flex-col items-center gap-1 text-blue-600">
            <Wallet size={20} />
            <span className="text-[9px] font-bold uppercase">Accounts</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-300">
            <ArrowRightLeft size={20} />
            <span className="text-[9px] font-bold uppercase">Pay & Collect</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-blue-600">
            <History size={20} />
            <span className="text-[9px] font-bold uppercase">Transactions</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileView({ onLogout, setShowRestrictionModal }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-5xl mx-auto"
    >
      <div className="bg-white rounded-[32px] p-12 shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-blue-50 to-indigo-50" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-10 mb-16">
            <div className="text-center md:text-left md:pb-4 flex-1">
              <h2 className="text-4xl font-bold tracking-tight mb-3 text-slate-800 uppercase">{USER_DATA.fullName}</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <span className="px-4 py-1.5 bg-blue-50 text-[#005db9] rounded-full text-[10px] font-bold uppercase tracking-widest">Premium Member</span>
                <span className="px-4 py-1.5 bg-slate-50 text-slate-400 rounded-full text-[10px] font-bold uppercase tracking-widest">{USER_DATA.occupation}</span>
              </div>
            </div>
            <div className="md:pb-4 flex gap-3">
              <button 
                onClick={onLogout}
                className="px-6 py-4 bg-slate-100 text-slate-600 rounded-[20px] font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
              >
                <LogOut size={18} /> Logout
              </button>
              <button 
                onClick={() => setShowRestrictionModal(true)}
                className="px-10 py-4 bg-[#005db9] text-white rounded-[20px] font-bold shadow-lg shadow-blue-100 hover:bg-[#004a99] transition-all"
              >
                Edit Persona
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-8">
            <div className="space-y-10">
              <h3 className="text-sm font-bold border-b pb-4 border-slate-100 uppercase tracking-widest text-slate-400">Personal Information</h3>
              <InfoRow label="Email Identity" value={USER_DATA.email} />
              <InfoRow label="Phone Identity" value="+1 (704) 555-0129" />
              <InfoRow label="Birth Chronology" value={USER_DATA.dob} />
              <InfoRow label="Global Location" value={`${USER_DATA.city}, ${USER_DATA.state}, ${USER_DATA.country}`} />
              <InfoRow label="Residential Address" value={USER_DATA.address} />
            </div>

            <div className="space-y-10">
              <h3 className="text-sm font-bold border-b pb-4 border-slate-100 uppercase tracking-widest text-slate-400">Banking Identity</h3>
              <div className="bg-slate-50 rounded-[32px] p-8 space-y-8">
                <div className="flex justify-between items-end">
                  <InfoRow label="Account ID" value={USER_DATA.accountNum} />
                  <button onClick={() => setShowRestrictionModal(true)} className="text-[10px] font-bold text-[#005db9] uppercase hover:underline">Edit</button>
                </div>
                <InfoRow label="System Routing" value={USER_DATA.routing} />
                <InfoRow label="Primary Branch" value="Charlotte Metropolitan Center" />
                <InfoRow label="Swift/BIC ID" value="ELITUS33XXX" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SettingsView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto space-y-12"
    >
      <div className="space-y-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-8">Security Controls</h3>
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200 divide-y divide-slate-50">
          <ToggleItem label="Two-Factor Authentication" description="Secure your account with mobile verification" checked={true} />
          <ToggleItem label="Biometric Activation" description="Use Face ID or Touch ID to login" checked={true} />
          <ToggleItem label="Invisible Mode" description="Hide your balance during navigation" checked={false} />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-8">System Preferences</h3>
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200 divide-y divide-slate-50">
          <SelectSetting label="Language Context" value="English (Global United States)" />
          <SelectSetting label="Currency Context" value="USD ($) United States Dollar" />
          <SelectSetting label="Update Frequency" value="Real-time Synchronization" />
        </div>
      </div>
    </motion.div>
  );
}

function ManagementItem({ icon: Icon, title, desc, color, onClick }: any) {
  const colors: any = {
    rose: 'bg-rose-50 text-rose-600',
    blue: 'bg-blue-50 text-[#005db9]',
    amber: 'bg-amber-50 text-amber-600',
  };
  return (
    <div onClick={onClick} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group cursor-pointer hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={20} />
        </div>
        <div>
          <h4 className="font-bold text-sm tracking-tight">{title}</h4>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      </div>
      <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
    </div>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">{label}</span>
      <span className="text-lg font-medium text-gray-900 truncate">{value}</span>
    </div>
  );
}

function ToggleItem({ label, description, checked }: any) {
  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <h4 className="font-bold text-sm">{label}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <div className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${checked ? 'bg-[#004a99]' : 'bg-gray-200'}`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${checked ? 'left-7' : 'left-1'}`} />
      </div>
    </div>
  );
}

function SelectSetting({ label, value }: any) {
  return (
    <div className="flex items-center justify-between p-4 group cursor-pointer hover:bg-gray-50 rounded-xl transition-colors">
      <div className="space-y-1">
        <h4 className="font-bold text-sm">{label}</h4>
        <p className="text-xs text-gray-500 font-medium">{value}</p>
      </div>
      <ChevronRight size={18} className="text-gray-400" />
    </div>
  );
}

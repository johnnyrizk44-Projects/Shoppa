import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { User, LogOut, Settings, CreditCard, Gift, ChevronRight, ShieldCheck, Mail } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, login, signup, logout, continueAsGuest } = useUser();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (authMode === 'login') {
      const success = login(email);
      if (!success) {
        setError('User not found. Please sign up or check your email.');
      }
    } else {
      if (!name || !email || !password) {
        setError('Please fill in all fields');
        return;
      }
      signup(name, email);
    }
  };

  // --- UNAUTHENTICATED VIEW ---
  if (!user) {
    return (
      <div className="flex flex-col min-h-full bg-white">
        <div className="flex-1 flex flex-col justify-center px-6 py-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-4xl shadow-lg mx-auto mb-6">
              S
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to ShopPA</h1>
            <p className="text-gray-500 mt-2">Compare prices, track health ratings, and save your shopping lists.</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-center mb-6 border-b border-gray-200">
              <button 
                className={`pb-2 px-4 font-medium text-sm ${authMode === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
                onClick={() => { setAuthMode('login'); setError(''); }}
              >
                Log In
              </button>
              <button 
                className={`pb-2 px-4 font-medium text-sm ${authMode === 'signup' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
                onClick={() => { setAuthMode('signup'); setError(''); }}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Jane Doe"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="jane@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-red-500 text-xs text-center">{error}</p>}

              <button 
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                {authMode === 'login' ? 'Log In' : 'Create Account'}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-xs mb-3">Or just want to browse?</p>
            <button 
              onClick={continueAsGuest}
              className="text-gray-600 font-medium text-sm px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- LOGGED IN / GUEST VIEW ---
  return (
    <div className="bg-gray-50 min-h-full pb-8">
      {/* Header Profile Card */}
      <div className="bg-white p-6 shadow-sm border-b border-gray-200">
         <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-sm ${user.isGuest ? 'bg-orange-400' : 'bg-blue-600'}`}>
               {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
               <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
               <p className="text-sm text-gray-500">{user.isGuest ? 'Guest Account' : user.email}</p>
               {!user.isGuest && (
                 <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                   {user.memberTier} Member
                 </div>
               )}
            </div>
         </div>

         {/* Guest Warning */}
         {user.isGuest && (
           <div className="mt-6 bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3">
             <ShieldCheck className="text-orange-500 shrink-0 mt-0.5" size={20} />
             <div>
               <h3 className="text-sm font-bold text-orange-900">Save your history</h3>
               <p className="text-xs text-orange-800 mt-1 mb-2">
                 You are using a temporary guest profile. Create an account to permanently save your shopping lists and preferences.
               </p>
               <button 
                 onClick={logout} // Logout effectively resets to login screen for guests
                 className="text-xs font-bold bg-white text-orange-600 px-3 py-1.5 rounded-lg border border-orange-200 shadow-sm"
               >
                 Create Account
               </button>
             </div>
           </div>
         )}
      </div>

      {/* Menu Options */}
      <div className="p-4 space-y-4">
        
        {/* Membership Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                 <CreditCard size={20} />
               </div>
               <span className="font-medium text-gray-900">Membership</span>
             </div>
             <span className="text-xs text-gray-400">Current: {user.memberTier}</span>
          </div>
          {!user.isGuest && (
             <div className="p-4 bg-gray-50">
               <div className="flex justify-between items-center">
                 <div>
                   <p className="text-sm font-bold text-gray-800">Unlock Premium</p>
                   <p className="text-xs text-gray-500">Get unlimited AI scans & history.</p>
                 </div>
                 <button className="bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg">
                   Coming Soon
                 </button>
               </div>
             </div>
          )}
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           <div className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50">
             <div className="flex items-center gap-3">
               <Settings size={20} className="text-gray-400" />
               <span className="font-medium text-gray-700">App Settings</span>
             </div>
             <ChevronRight size={18} className="text-gray-300" />
           </div>
           
           <div className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50">
             <div className="flex items-center gap-3">
               <Gift size={20} className="text-gray-400" />
               <span className="font-medium text-gray-700">Rewards</span>
             </div>
             <ChevronRight size={18} className="text-gray-300" />
           </div>

           <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
             <div className="flex items-center gap-3">
               <Mail size={20} className="text-gray-400" />
               <span className="font-medium text-gray-700">Support</span>
             </div>
             <ChevronRight size={18} className="text-gray-300" />
           </div>
        </div>

        {/* Logout */}
        <button 
          onClick={logout}
          className="w-full bg-white border border-red-100 text-red-500 font-medium p-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          {user.isGuest ? 'Exit Guest Mode' : 'Log Out'}
        </button>

        <p className="text-center text-xs text-gray-400 pt-4">
          ShopPA v1.0.2 MVP
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
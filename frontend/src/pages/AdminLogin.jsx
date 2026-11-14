import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import { Lock, Mail, ArrowRight, AlertCircle, KeyRound, Shield } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('admin@balajiconsultancy.com');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await login(email, password);
    if (res.success) {
      navigate('/admin');
    } else {
      setErrorMsg(res.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#e7ded2] shadow-xl shadow-amber-950/5 space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <Logo size="normal" asLink={false} />
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-[#1a1f26]">
            Consultancy Staff Portal
          </h2>
          <p className="text-xs text-[#6b7280]">
            Secure login for Balaji management to manage inventory, leads, and customer quotations.
          </p>
        </div>

        {/* Demo Credentials Helper Box */}
        <div className="p-3.5 bg-[#fef6e9] rounded-2xl border border-[#fbe5c5] text-xs text-[#92400e] space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <KeyRound className="w-3.5 h-3.5 text-[#b45309]" />
            Default Admin Credentials
          </div>
          <div className="text-[11px] text-[#92400e]">
            Email: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#fbe5c5]">admin@balajiconsultancy.com</code><br/>
            Password: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#fbe5c5]">admin123</code>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#374151] mb-1">Staff Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs bg-[#faf7f2] border border-[#e2d8ca] rounded-xl pl-9 pr-3.5 py-3 text-[#1a1f26] focus:outline-none focus:ring-2 focus:ring-[#c85a17]"
              />
              <Mail className="w-4 h-4 text-[#9ca3af] absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151] mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs bg-[#faf7f2] border border-[#e2d8ca] rounded-xl pl-9 pr-3.5 py-3 text-[#1a1f26] focus:outline-none focus:ring-2 focus:ring-[#c85a17]"
              />
              <Lock className="w-4 h-4 text-[#9ca3af] absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#c85a17] via-[#b84e11] to-[#d97706] hover:from-[#b84e11] hover:to-[#b45309] text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4 text-amber-200" />
            {loading ? 'Authenticating...' : 'Sign In to Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
};

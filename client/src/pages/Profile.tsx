import { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/services/api';
import { useSEO } from '@/hooks/useSEO';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '', city: user?.city || '', state: user?.state || '', pincode: user?.pincode || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [pwError, setPwError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  useSEO({ title: 'My Profile', description: 'Manage your account profile.' });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setProfileError(''); setProfileMsg(''); setSavingProfile(true);
    try { const res = await authAPI.updateProfile(form); updateUser(res.data.data as any); setProfileMsg('Profile updated successfully.'); }
    catch (err: any) { setProfileError(err.response?.data?.message || 'Failed to update profile.'); }
    finally { setSavingProfile(false); }
  };

  const handlePwSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setPwError(''); setPwMsg('');
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError('Passwords do not match.'); return; }
    if (pwForm.newPassword.length < 6) { setPwError('Password must be at least 6 characters.'); return; }
    setSavingPw(true);
    try { await authAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }); setPwMsg('Password changed successfully.'); setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }
    catch (err: any) { setPwError(err.response?.data?.message || 'Failed to change password.'); }
    finally { setSavingPw(false); }
  };

  if (!user) return <div className="max-w-3xl mx-auto px-4 py-20 text-center"><p className="text-brown-600">Please login to view your profile.</p></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif font-bold text-maroon-900 mb-6">My Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4 flex items-center gap-2"><User size={20} /> Profile Information</h2>
          {profileMsg && <p className="text-sm text-green-700 bg-green-50 rounded p-3 mb-4">{profileMsg}</p>}
          {profileError && <p className="text-sm text-red-600 bg-red-50 rounded p-3 mb-4">{profileError}</p>}
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div><label className="label">Full Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" /></div>
            <div><label className="label">Email (read-only)</label><input value={user.email} disabled className="input-field bg-cream-100" /></div>
            <div><label className="label">Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" /></div>
            <div><label className="label">Address</label><textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} className="input-field" /></div>
            <div className="grid grid-cols-2 gap-4"><div><label className="label">City</label><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" /></div><div><label className="label">State</label><input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-field" /></div></div>
            <div><label className="label">PIN Code</label><input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="input-field" /></div>
            <button type="submit" disabled={savingProfile} className="btn-primary w-full"><Save size={16} /> {savingProfile ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-serif font-bold text-maroon-900 mb-4 flex items-center gap-2"><Lock size={20} /> Change Password</h2>
          {pwMsg && <p className="text-sm text-green-700 bg-green-50 rounded p-3 mb-4">{pwMsg}</p>}
          {pwError && <p className="text-sm text-red-600 bg-red-50 rounded p-3 mb-4">{pwError}</p>}
          <form onSubmit={handlePwSubmit} className="space-y-4">
            <div><label className="label">Current Password</label><input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required className="input-field" /></div>
            <div><label className="label">New Password</label><input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required className="input-field" /></div>
            <div><label className="label">Confirm New Password</label><input type="password" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} required className="input-field" /></div>
            <button type="submit" disabled={savingPw} className="btn-primary w-full"><Lock size={16} /> {savingPw ? 'Changing...' : 'Change Password'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

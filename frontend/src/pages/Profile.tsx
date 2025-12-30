import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastContainer';
import Input from '../components/Input';
import Button from '../components/Button';
import { User, Mail, Shield } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const { showToast } = useToast();

  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      await updateProfile(profileData);
      showToast('Profile updated successfully', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoadingPassword(true);
    try {
      await changePassword(
        passwordData.old_password,
        passwordData.new_password
      );
      showToast('Password changed successfully', 'success');
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.full_name}</h2>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Mail size={14} /> {user?.email}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Shield size={14} /> {user?.role}
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Input
              label="Full Name"
              value={profileData.full_name}
              onChange={(e) =>
                setProfileData({ ...profileData, full_name: e.target.value })
              }
            />
            <Input
              label="Email"
              type="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData({ ...profileData, email: e.target.value })
              }
            />

            <Button type="submit" loading={loadingProfile}>
              Save Profile
            </Button>
          </form>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              label="Current Password"
              value={passwordData.old_password}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  old_password: e.target.value,
                })
              }
            />
            <Input
              type="password"
              label="New Password"
              value={passwordData.new_password}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  new_password: e.target.value,
                })
              }
            />
            <Input
              type="password"
              label="Confirm Password"
              value={passwordData.confirm_password}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirm_password: e.target.value,
                })
              }
            />

            <Button type="submit" loading={loadingPassword}>
              Change Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

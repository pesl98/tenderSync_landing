
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import EditProfileForm from '../components/auth/EditProfileForm';
import CPVCodesList from '../components/profile/CPVCodesList';

// Mock data for the dashboard
const mockTransactions = [
  { date: '2024-02-15', summary: 'Tender Analysis Report', score: 85 },
  { date: '2024-02-14', summary: 'Bid Evaluation Complete', score: 92 },
  { date: '2024-02-13', summary: 'Contract Review', score: 78 },
  { date: '2024-02-12', summary: 'Proposal Assessment', score: 88 },
  { date: '2024-02-11', summary: 'Documentation Check', score: 95 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        navigate('/login');
        return;
      }

      setUser(user);

      const { data: userProfile, error: profileError } = await supabase
        .from('t_user_profiles')
        .select('*')
        .eq('email', user.email)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        setError('Failed to load user profile');
      } else {
        setProfile(userProfile);
      }
    };

    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="text-xl font-bold text-blue-800">TenderSync</div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => setActiveTab('profile')}>
                Edit Profile
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {profile?.name || user.email}
          </h1>
          <p className="text-gray-600 mt-2">
            {profile?.company_name && `${profile.company_name} • `}
            Last login: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`${
                  activeTab === 'overview'
                    ? 'border-blue-800 text-blue-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`${
                  activeTab === 'profile'
                    ? 'border-blue-800 text-blue-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
              >
                Profile
              </button>
            </nav>
          </div>

          {activeTab === 'overview' ? (
            <div>
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Summary
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockTransactions.map((transaction, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.summary}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.score}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Profile Information</h2>
                <Button onClick={() => setActiveTab('edit')} variant="outline" size="sm">
                  Edit Profile
                </Button>
              </div>
              {activeTab === 'edit' ? (
                <EditProfileForm
                  initialData={{
                    name: profile?.name || '',
                    telephone: profile?.telephone || '',
                    company_name: profile?.company_name || '',
                    company_description: profile?.company_description || '',
                    source_app: profile?.source_app || '',
                    email: profile?.email || user.email
                  }}
                  onClose={() => setActiveTab('profile')}
                  onSuccess={() => {
                    // Refresh profile data
                    const getProfile = async () => {
                      const { data: userProfile, error: profileError } = await supabase
                        .from('t_user_profiles')
                        .select('*')
                        .eq('email', user.email)
                        .single();

                      if (profileError) {
                        console.error('Error fetching profile:', profileError);
                        setError('Failed to load user profile');
                      } else {
                        setProfile(userProfile);
                        setActiveTab('profile');
                      }
                    };
                    getProfile();
                  }}
                />
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{profile?.name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{profile?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <p className="mt-1 text-sm text-gray-900">{profile?.company_name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{profile?.telephone || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <p className="mt-1 text-sm text-gray-900">{profile?.country || 'Not set'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Company Description</label>
                    <p className="mt-1 text-sm text-gray-900">{profile?.company_description || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Source App</label>
                    <p className="mt-1 text-sm text-gray-900">{profile?.source_app || 'TenderSync'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">CPV Codes</label>
                    <CPVCodesList profileId={profile?.id} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

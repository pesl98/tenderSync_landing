import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import EditProfileForm from '../components/auth/EditProfileForm';
import CPVCodesList from '../components/profile/CPVCodesList';
import NoticeDetailsModal from '../components/NoticeDetailsModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [noticeSummaries, setNoticeSummaries] = useState([]);
  const [trialSubscription, setTrialSubscription] = useState(null);
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);

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
        
        // Fetch trial subscription
        const { data: trialData, error: trialError } = await supabase
          .from('t_trial_subscriptions')
          .select('*')
          .eq('email', user.email)
          .single();

        if (trialError) {
          console.error('Error fetching trial subscription:', trialError);
        } else if (trialData) {
          setTrialSubscription(trialData);
          if (trialData.end_date && new Date(trialData.end_date) <= new Date()) {
            setError(`Your trial has expired on ${new Date(trialData.end_date).toLocaleDateString()}. Please contact the sales team.`);
          }
        }

        // Fetch notice summaries for the user
        const fetchNoticeSummaries = async () => {
          try {
            // First get user's notice IDs
            const { data: userNotices, error: userNoticesError } = await supabase
              .from('user_notice_summaries')
              .select('notice_id')
              .eq('user_profile_id', userProfile.id);

            if (userNoticesError) throw userNoticesError;

            if (userNotices && userNotices.length > 0) {
              // Get full notice summaries
              const noticeIds = userNotices.map(notice => notice.notice_id);
              const { data: summaries, error: summariesError } = await supabase
                .from('notice_summaries')
                .select('created_at, notice_id, summary')
                .in('notice_id', noticeIds)
                .order('created_at', { ascending: false });

              if (summariesError) throw summariesError;
              setNoticeSummaries(summaries || []);
            }
          } catch (err) {
            console.error('Error fetching notice summaries:', err);
          }
        };

        fetchNoticeSummaries();
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
        {trialSubscription && (
          <p className="text-gray-600 mt-1">
            Trial period: {trialSubscription.start_date ? new Date(trialSubscription.start_date).toLocaleDateString() : 'Not started'} 
            {' - '} 
            {trialSubscription.end_date ? new Date(trialSubscription.end_date).toLocaleDateString() : 'Not set'}
          </p>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}
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
                        Notice ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Summary
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {noticeSummaries.map((summary, index) => (
                      <tr 
                        key={index}
                        onClick={() => setSelectedNoticeId(summary.notice_id)}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(summary.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {summary.notice_id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="line-clamp-3 max-h-[4.5em]">
                            {summary.summary}
                          </div>
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
                    email: profile?.email || user.email,
                    country: profile?.country || ''
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

      <NoticeDetailsModal
        isOpen={!!selectedNoticeId}
        onClose={() => setSelectedNoticeId(null)}
        noticeId={selectedNoticeId}
      />
    </div>
  );
};

export default Dashboard;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type UserProfile = {
  id: string;
  user_id: string;
  email: string;
  name: string | null;
  phone: string | null;
  company_name: string | null;
  company_description: string | null;
  created_at: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('Auth check:', { user: !!user, error: userError });

        if (userError) throw userError;
        if (!user) throw new Error('Not authenticated');

        // Get user profile from t_user_profile table
        const { data: userProfile, error: profileError } = await supabase
          .from('t_user_profile')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        console.log('Profile check:', { profile: !!userProfile, error: profileError });

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // Profile doesn't exist yet, create one
            const { data: newProfile, error: createError } = await supabase
              .from('t_user_profile')
              .insert([{ user_id: user.id, email: user.email }])
              .select()
              .single();
            
            if (createError) throw createError;
            setProfile(newProfile);
          } else {
            throw profileError;
          }
        } else {
          setProfile(userProfile);
        }
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        if (err.message === 'Not authenticated') {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h2>

            {profile ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <div className="mt-1 text-gray-900">{profile.email}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Name</label>
                    <div className="mt-1 text-gray-900">{profile.name || 'Not provided'}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Phone</label>
                    <div className="mt-1 text-gray-900">{profile.phone || 'Not provided'}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Company Name</label>
                    <div className="mt-1 text-gray-900">{profile.company_name || 'Not provided'}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Company Description</label>
                  <div className="mt-1 text-gray-900">{profile.company_description || 'Not provided'}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Member Since</label>
                  <div className="mt-1 text-gray-900">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-600">No profile information found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
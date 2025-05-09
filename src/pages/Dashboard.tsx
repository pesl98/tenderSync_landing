
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        navigate('/login');
        return;
      }

      setUser(user);

      // Fetch profile from t_user_profiles
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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-600 mb-4">Logged in as: {user.email}</p>
        
        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}
        
        {profile && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {profile.name || 'Not set'}</p>
              <p><span className="font-medium">Phone:</span> {profile.phone || 'Not set'}</p>
              <p><span className="font-medium">Company:</span> {profile.company_name || 'Not set'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

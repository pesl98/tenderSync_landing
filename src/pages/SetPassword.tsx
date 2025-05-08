import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import FormField from '../components/ui/Form';

const SetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleInviteLink = async () => {
      try {
        console.log('Processing invite link...');
        
        // Get the full URL including hash
        const fullUrl = window.location.href;
        console.log('Full URL:', fullUrl);
        
        // Try to extract the token from different parts of the URL
        const url = new URL(fullUrl);
        const hashParams = new URLSearchParams(url.hash.substring(1));
        const searchParams = new URLSearchParams(url.search);
        
        // Check hash parameters first
        let accessToken = hashParams.get('access_token');
        let refreshToken = hashParams.get('refresh_token');
        let type = hashParams.get('type');

        console.log('Hash params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });

        // If not in hash, check URL parameters
        if (!accessToken) {
          const token = searchParams.get('token');
          console.log('URL token found:', !!token);
          
          if (token) {
            try {
              // Try to decode base64 token
              const decodedToken = atob(token);
              console.log('Decoded token exists:', !!decodedToken);
              
              const tokenParams = new URLSearchParams(decodedToken);
              accessToken = tokenParams.get('access_token');
              refreshToken = tokenParams.get('refresh_token');
              type = tokenParams.get('type');
              
              console.log('Decoded params:', { 
                accessToken: !!accessToken, 
                refreshToken: !!refreshToken, 
                type 
              });
            } catch (e) {
              console.error('Token decode error:', e);
              throw new Error('Invalid token format');
            }
          }
        }

        if (!accessToken) {
          throw new Error('No access token found in URL');
        }

        // Verify the session immediately
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        console.log('Current user check:', { exists: !!currentUser, error: userError });

        if (userError || !currentUser) {
          console.log('No valid session, attempting to set session...');
          // Set the session with the tokens
          const { data: { session }, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (sessionError) {
            console.error('Session setup error:', sessionError);
            throw sessionError;
          }

          if (!session) {
            console.error('No session established after setSession');
            throw new Error('Failed to establish session');
          }

          console.log('Session successfully established');
        } else {
          console.log('Valid session already exists');
        }

      } catch (err) {
        console.error('Invite processing error:', err);
        setError(err instanceof Error ? err.message : 'Invalid or expired invite link');
        // Add a delay before redirect to show the error
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleInviteLink();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Attempting to update password...');
      
      const { data: { user }, error: updateError } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (updateError) {
        console.error('Password update error:', updateError);
        throw updateError;
      }

      if (!user) {
        console.error('No user returned after password update');
        throw new Error('Failed to update password');
      }

      console.log('Password successfully updated');
      navigate('/dashboard');
    } catch (err) {
      console.error('Password update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please set a password to access your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md p-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              id="password"
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your new password"
            />

            <FormField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your new password"
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Setting password...' : 'Set Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
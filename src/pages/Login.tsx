import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import { supabase } from '../lib/supabase'; // Assuming you have your supabase client initialized here

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <a href="/" className="font-medium text-blue-800 hover:text-blue-700">
            go back to homepage
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm onSuccess={async (user) => {
          // Fetch the user's email after successful login
          const userEmail = user?.email;

          if (!userEmail) {
            console.error("User email not found after login.");
            // Optionally display an error message to the user
            return;
          }

          // Query the t_trial_subscriptions table
          const { data, error } = await supabase
            .from('t_trial_subscriptions')
            .select('end_date')
            .eq('email', userEmail)
            .single();

          if (error) {
            console.error("Error fetching trial subscription:", error);
            // Handle the error, e.g., display an error message to the user
            return;
          }

          if (data) {
            const endDate = new Date(data.end_date);
            const currentDate = new Date();

            if (currentDate > endDate) {
              // Trial has expired
              alert("Your trial subscription has expired, please contact support for a subscription");
              // Prevent access to the application, e.g., redirect to a different page or sign out
              // For now, we'll just show the alert. You might want to implement a more robust
              // way to block access or sign the user out.
            } else {
              // Trial is still active, allow access
              // You would typically navigate the user to the dashboard or protected content here
            }
          }
        }} />
      </div>
    </div>
  );
};

export default LoginPage;
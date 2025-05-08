import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabase';

const LoginForm = () => {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#1e40af',
                brandAccent: '#1d51d8',
              },
            },
          },
        }}
        providers={[]}
        view="sign_in"
        showLinks={false}
        magicLink={false}
        redirectTo={`${window.location.origin}/dashboard`}
        onlyThirdPartyProviders={false}
      />
    </div>
  );
};

export default LoginForm
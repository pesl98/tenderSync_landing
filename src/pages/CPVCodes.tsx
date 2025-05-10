
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';

const CPVCodesPage = () => {
  const navigate = useNavigate();
  const [codes, setCodes] = useState([]);
  const [userCodes, setUserCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userProfileId, setUserProfileId] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
        // Get user profile ID
        const { data: profileData } = await supabase
          .from('t_user_profiles')
          .select('id')
          .eq('email', user.email)
          .single();
          
        if (profileData) {
          setUserProfileId(profileData.id);
          // Fetch user's CPV codes
          const { data: userCpvData } = await supabase
            .from('t_user_profile_cpv_codes')
            .select(`
              cpv_code,
              t_cpv_codes!inner(CODE, EN)
            `)
            .eq('user_profile_id', profileData.id);
            
          if (userCpvData) {
            setUserCodes(userCpvData);
          }
        }
      }
    };
    getUserData();
  }, []);

  const searchCPVCodes = async (term: string) => {
    if (term.length < 3) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('t_cpv_codes')
        .select('CODE, EN')
        .ilike('EN', `%${term}%`)
        .order('CODE')
        .limit(100);

      if (error) throw error;
      setCodes(data || []);
    } catch (err) {
      console.error('Error searching CPV codes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCode = async (code: string) => {
    try {
      // First get the user_profile_id
      const { data: profileData, error: profileError } = await supabase
        .from('t_user_profiles')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (profileError) throw profileError;
      if (!profileData) throw new Error('User profile not found');

      // Then insert the CPV code with the user_profile_id
      const { error } = await supabase
        .from('t_user_profile_cpv_codes')
        .insert([
          { 
            user_profile_id: profileData.id,
            cpv_code: code
          }
        ]);

      if (error) throw error;
      
      // Fetch updated user CPV codes
      const { data: userCpvData } = await supabase
        .from('t_user_profile_cpv_codes')
        .select(`
          cpv_code,
          t_cpv_codes!inner(CODE, EN)
        `)
        .eq('user_profile_id', profileData.id);
        
      if (userCpvData) {
        setUserCodes(userCpvData);
      }
      
      alert('CPV code added successfully');
    } catch (err) {
      console.error('Error adding CPV code:', err);
      alert('Failed to add CPV code');
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.length >= 3) {
        searchCPVCodes(searchTerm);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">CPV Codes</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
        >
          Return to Dashboard
        </Button>
      </div>

      {userCodes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Selected CPV Codes</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            {userCodes.map((code) => (
              <div key={code.cpv_code} className="mb-2 last:mb-0">
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                  {code.cpv_code}
                </span>
                <span className="text-gray-700">{code.t_cpv_codes.EN}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by description (min 3 characters)..."
          className="w-full px-3 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm.length > 0 && searchTerm.length < 3 && (
          <p className="text-red-500 text-sm mt-1">Please enter at least 3 characters</p>
        )}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Code</th>
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 text-center w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((code) => (
              <tr key={code.CODE} className="border-b hover:bg-gray-50">
                <td className="border p-2">{code.CODE}</td>
                <td className="border p-2">{code.EN}</td>
                <td className="border p-2 text-center">
                  <Button
                    onClick={() => handleAddCode(code.CODE)}
                    size="sm"
                  >
                    Add
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CPVCodesPage;

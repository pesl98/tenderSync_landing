
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';

const CPVCodesPage = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      }
    };
    getUserEmail();
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
      <h1 className="text-2xl font-bold mb-4">CPV Codes</h1>
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

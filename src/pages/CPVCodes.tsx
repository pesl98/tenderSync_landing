
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const CPVCodesPage = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const searchCPVCodes = async (term: string) => {
    if (term.length < 3) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('t_cpv_codes')
        .select('*')
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
            </tr>
          </thead>
          <tbody>
            {codes.map((code) => (
              <tr key={code.CODE} className="border-b hover:bg-gray-50">
                <td className="border p-2">{code.CODE}</td>
                <td className="border p-2">{code.EN}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CPVCodesPage;

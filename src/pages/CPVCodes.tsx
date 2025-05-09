
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const CPVCodesPage = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCPVCodes = async () => {
      try {
        const { data, error } = await supabase
          .from('t_cpv_codes')
          .select('*')
          .order('CODE');

        if (error) throw error;
        setCodes(data || []);
      } catch (err) {
        console.error('Error fetching CPV codes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCPVCodes();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">CPV Codes</h1>
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

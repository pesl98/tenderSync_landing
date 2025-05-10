
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const CPVCodesList = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCPVCodes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('t_cpv_codes')
          .select('CODE, EN')
          .ilike('EN', `%${searchTerm}%`)
          .limit(10);

        if (error) throw error;
        setCodes(data || []);
      } catch (err) {
        console.error('Error fetching CPV codes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCPVCodes();
  }, [searchTerm]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Available CPV Codes</h2>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by description..."
            className="w-full px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {codes.map((code) => (
                  <tr key={code.CODE}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{code.CODE}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{code.EN}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default CPVCodesList;

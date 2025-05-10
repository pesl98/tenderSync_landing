import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const CPVCodesList = () => {
  const [allCodes, setAllCodes] = useState([]);
  const [displayedCodes, setDisplayedCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCPVCodes = async () => {
      console.log('Fetching CPV codes...');
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('t_cpv_codes')
          .select('CODE, EN')
          .order('CODE');

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Fetched data:', data);
        setAllCodes(data || []);
        setDisplayedCodes(data || []);
      } catch (err) {
        console.error('Error fetching CPV codes:', err);
        setAllCodes([]);
        setDisplayedCodes([]);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchCPVCodes();
  }, []);

  // Handle search using cached data
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setDisplayedCodes(allCodes);
      return;
    }

    const searchResults = allCodes.filter(code => 
      code.EN.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.CODE.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedCodes(searchResults);
  }, [searchTerm, allCodes]);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse CPV Codes</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search through our database of Common Procurement Vocabulary codes
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="mb-8 relative">
            <input
              type="text"
              placeholder="Search by description..."
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl shadow-sm 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" 
                strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="divide-y divide-gray-200">
                {displayedCodes.map((code) => (
                  <div key={code.CODE} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-100 text-blue-800 text-sm font-medium">
                        {code.CODE}
                      </span>
                      <p className="text-gray-700 font-medium">{code.EN}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CPVCodesList;

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type CPVCodesListProps = {
  profileId: string;
};

const CPVCodesList = ({ profileId }: CPVCodesListProps) => {
  const [codes, setCodes] = useState<{ cpv_code: string; description: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCPVCodes = async () => {
      if (!profileId) return;
      
      try {
        const { data, error } = await supabase
          .from('t_user_profile_cpv_codes')
          .select(`
            cpv_code,
            t_cpv_codes!inner(EN)
          `)
          .eq('user_profile_id', profileId);

        if (error) throw error;

        const formattedCodes = data.map(item => ({
          cpv_code: item.cpv_code,
          description: item.t_cpv_codes.EN
        }));

        setCodes(formattedCodes);
      } catch (err) {
        console.error('Error fetching CPV codes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCPVCodes();
  }, [profileId]);

  if (loading) return <p className="mt-1 text-sm text-gray-500">Loading CPV codes...</p>;
  if (codes.length === 0) return <p className="mt-1 text-sm text-gray-500">No CPV codes added</p>;

  return (
    <div className="mt-1 space-y-2">
      {codes.map((code) => (
        <div key={code.cpv_code} className="text-sm">
          <span className="font-medium">{code.cpv_code}</span>
          <span className="text-gray-500 ml-2">- {code.description}</span>
        </div>
      ))}
    </div>
  );
};

export default CPVCodesList;

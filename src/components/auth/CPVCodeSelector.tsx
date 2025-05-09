import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';

type CPVCode = {
  code: string;
  EN: string;
};

type CPVCodeSelectorProps = {
  onClose: () => void;
  onSelect: (code: string) => void;
  currentCodes: string[];
};

import { useNavigate } from 'react-router-dom';

const CPVCodeSelector = ({ onClose, onSelect, currentCodes }: CPVCodeSelectorProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [codes, setCodes] = useState<CPVCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCPVCodes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('cpv_codes')
          .select('*');

        if (error) {
          console.error("Error fetching CPV codes:", error);
        }

        if (data) {
          setCodes(data);
        }
      } catch (err) {
        console.error("Unexpected error fetching CPV codes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCPVCodes();
  }, []);

  useEffect(() => {
    navigate('/cpv');
  }, [navigate]);

  const filteredCodes = codes.filter(code =>
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.EN.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col m-auto mt-20">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Select CPV Codes</h2>
          <input
            type="text"
            placeholder="Search codes..."
            className="w-full mt-2 px-3 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Code</th>
                  <th className="text-left p-2">Description</th>
                  <th className="p-2 w-24"></th>
                </tr>
              </thead>
              <tbody>
                {filteredCodes.map((code) => (
                  <tr key={code.code} className="border-b hover:bg-gray-50">
                    <td className="p-2">{code.code}</td>
                    <td className="p-2">{code.EN}</td>
                    <td className="p-2">
                      {!currentCodes.includes(code.code) && (
                        <Button
                          onClick={() => onSelect(code.code)}
                          size="sm"
                        >
                          Add
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CPVCodeSelector;
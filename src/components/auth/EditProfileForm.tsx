
import React, { useState, useEffect } from 'react';
import FormField from '../ui/Form';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabase';
import CPVCodeSelector from './CPVCodeSelector';

type CPVCode = {
  code: string;
  description: string;
};

type Profile = {
  name: string;
  telephone: string;
  company_name: string;
  company_description: string;
  source_app: string;
  email: string;
  country: string;
};

type EditProfileFormProps = {
  initialData: Profile;
  onClose: () => void;
  onSuccess: () => void;
};

const EditProfileForm = ({ initialData, onClose, onSuccess }: EditProfileFormProps) => {
  const [formData, setFormData] = useState<Profile>(initialData);
  const [cpvCodes, setCpvCodes] = useState<string[]>([]);
  const [availableCpvCodes, setAvailableCpvCodes] = useState<{ code: string; description: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCPVSelector, setShowCPVSelector] = useState(false);

  useEffect(() => {
    const fetchCPVCodes = async () => {
      // Fetch available CPV codes
      const { data: cpvCodesData, error: cpvError } = await supabase
        .from('t_cpv_codes')
        .select('CODE, EN');

      if (cpvError) {
        console.error('Error fetching CPV codes:', cpvError);
      } else {
        setAvailableCpvCodes(cpvCodesData?.map(code => ({
          code: code.CODE,
          description: code.EN
        })) || []);
      }

      // Fetch user's existing CPV codes
      const { data: userCpvCodes, error: userCpvError } = await supabase
        .from('t_user_profile_cpv_codes')
        .select('cpv_code')
        .eq('email', initialData.email);

      if (userCpvError) {
        console.error('Error fetching user CPV codes:', userCpvError);
      } else {
        setCpvCodes(userCpvCodes?.map(item => item.code) || []);
      }
    };

    fetchCPVCodes();
  }, [initialData.email]);

  const handleCPVCodeChange = (code: string) => {
    setCpvCodes(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Update profile
      const { error: updateError } = await supabase
        .from('t_user_profiles')
        .update({
          name: formData.name,
          telephone: formData.telephone,
          company_name: formData.company_name,
          company_description: formData.company_description,
          source_app: formData.source_app,
          country: formData.country,
        })
        .eq('email', initialData.email);

      if (updateError) throw updateError;

      // Delete existing CPV codes
      await supabase
        .from('t_user_profile_cpv_codes')
        .delete()
        .eq('email', initialData.email);

      // Insert new CPV codes
      if (cpvCodes.length > 0) {
        const cpvInserts = cpvCodes.map(code => ({
          email: initialData.email,
          code,
        }));

        const { error: cpvError } = await supabase
          .from('t_user_profile_cpv_codes')
          .insert(cpvInserts);

        if (cpvError) throw cpvError;
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>
      )}
      <FormField
        id="name"
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <div className="space-y-1">
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select a country</option>
          <option value="The Netherlands">The Netherlands</option>
          <option value="Belgium">Belgium</option>
          <option value="Germany">Germany</option>
        </select>
      </div>
      <FormField
        id="telephone"
        label="Telephone"
        value={formData.telephone}
        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
      />
      <FormField
        id="company_name"
        label="Company Name"
        value={formData.company_name}
        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
      />
      <FormField
        id="company_description"
        label="Company Description"
        type="textarea"
        value={formData.company_description}
        onChange={(e) => setFormData({ ...formData, company_description: e.target.value })}
      />
      <FormField
        id="source_app"
        label="Source App"
        value={formData.source_app}
        onChange={(e) => setFormData({ ...formData, source_app: e.target.value })}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">CPV Codes</label>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {cpvCodes.map((code) => (
              <div key={code} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                {code}
                <button
                  onClick={() => setCpvCodes(prev => prev.filter(c => c !== code))}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowCPVSelector(true)}
          >
            Select CPV Codes
          </Button>
        </div>
        {showCPVSelector && (
          <CPVCodeSelector
            onClose={() => setShowCPVSelector(false)}
            onSelect={(code) => {
              setCpvCodes(prev => [...prev, code]);
              setShowCPVSelector(false);
            }}
            currentCodes={cpvCodes}
          />
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default EditProfileForm;

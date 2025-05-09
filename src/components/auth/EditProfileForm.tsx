
import React, { useState, useEffect } from 'react';
import FormField from '../ui/Form';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabase';

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

  useEffect(() => {
    const fetchCPVCodes = async () => {
      // Fetch available CPV codes
      const { data: cpvCodesData, error: cpvError } = await supabase
        .from('t_cpv_codes')
        .select('code, description');

      if (cpvError) {
        console.error('Error fetching CPV codes:', cpvError);
      } else {
        setAvailableCpvCodes(cpvCodesData || []);
      }

      // Fetch user's existing CPV codes
      const { data: userCpvCodes, error: userCpvError } = await supabase
        .from('t_user_profile_cpv_codes')
        .select('code')
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
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={cpvCodes[0] || ''}
            onChange={(e) => setCpvCodes([e.target.value])}
          >
            <option value="">Select a CPV code</option>
            {availableCpvCodes.map((cpvCode) => (
              <option key={cpvCode.code} value={cpvCode.code}>
                {cpvCode.code} - {cpvCode.description}
              </option>
            ))}
          </select>
        </div>
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

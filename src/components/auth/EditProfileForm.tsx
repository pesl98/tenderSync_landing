
import React, { useState } from 'react';
import FormField from '../ui/Form';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabase';

type Profile = {
  name: string;
  telephone: string;
  company_name: string;
  company_description: string;
  source_app: string;
};

type EditProfileFormProps = {
  initialData: Profile;
  onClose: () => void;
  onSuccess: () => void;
};

const EditProfileForm = ({ initialData, onClose, onSuccess }: EditProfileFormProps) => {
  const [formData, setFormData] = useState<Profile>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
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

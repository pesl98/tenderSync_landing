
import React, { useEffect, useState } from 'react';
import Modal from './ui/Modal';
import { supabase } from '../lib/supabase';

type NoticeDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  noticeId: string | null;
};

type TEDManifest = {
  notice_id: string;
  doc_no: string;
  title: string;
  published_date: string;
  description: string;
  short_description: string;
  [key: string]: any;
};

const NoticeDetailsModal = ({ isOpen, onClose, noticeId }: NoticeDetailsModalProps) => {
  const [noticeDetails, setNoticeDetails] = useState<TEDManifest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoticeDetails = async () => {
      if (!noticeId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('ted_manifest')
          .select('*')
          .eq('notice_id', noticeId)
          .single();

        if (error) throw error;
        setNoticeDetails(data);
      } catch (error) {
        console.error('Error fetching notice details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticeDetails();
  }, [noticeId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Notice Details - ${noticeId}`} size="lg">
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : noticeDetails ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Document Number</h3>
              <p className="mt-1">{noticeDetails.doc_no}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Title</h3>
              <p className="mt-1">{noticeDetails.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Published Date</h3>
              <p className="mt-1">{new Date(noticeDetails.published_date).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1 whitespace-pre-wrap">{noticeDetails.description}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Short Description</h3>
              <p className="mt-1">{noticeDetails.short_description}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">No details found for this notice.</div>
        )}
      </div>
    </Modal>
  );
};

export default NoticeDetailsModal;


import React, { useEffect, useState } from 'react';
import Modal from './ui/Modal';
import { supabase } from '../lib/supabase';

type NoticeDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  noticeId: string | null;
};

type NoticeDetails = {
  created_at: string;
  notice_id: string;
  summary: string;
  storage_path: string;
  pdf_path: string;
  cpv_prefix: string;
};

const NoticeDetailsModal = ({ isOpen, onClose, noticeId }: NoticeDetailsModalProps) => {
  const [noticeDetails, setNoticeDetails] = useState<NoticeDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoticeDetails = async () => {
      if (!noticeId) return;
      
      setLoading(true);
      try {
        // Fetch from notice_summaries
        const { data: summaryData, error: summaryError } = await supabase
          .from('notice_summaries')
          .select('created_at, notice_id, summary')
          .eq('notice_id', noticeId)
          .single();

        if (summaryError) throw summaryError;

        // Fetch from ted_manifest
        const { data: manifestData, error: manifestError } = await supabase
          .from('ted_manifest')
          .select('storage_path, pdf_path, cpv_prefix')
          .eq('notice_id', noticeId)
          .single();

        if (manifestError) throw manifestError;

        // Combine the data
        setNoticeDetails({
          ...summaryData,
          ...manifestData,
        });
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
              <h3 className="text-sm font-medium text-gray-500">Creation Date</h3>
              <p className="mt-1">{new Date(noticeDetails.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Notice ID</h3>
              <p className="mt-1">{noticeDetails.notice_id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Summary</h3>
              <p className="mt-1 whitespace-pre-wrap">{noticeDetails.summary}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Storage Path</h3>
              <p className="mt-1">{noticeDetails.storage_path}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">PDF Path</h3>
              <p className="mt-1">{noticeDetails.pdf_path}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">CPV Prefix</h3>
              <p className="mt-1">{noticeDetails.cpv_prefix}</p>
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

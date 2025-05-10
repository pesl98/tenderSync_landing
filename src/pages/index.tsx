import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Hero from '../components/layout/Hero';
import Benefits from '../components/layout/Benefits';
import CustomerLogos from '../components/layout/CustomerLogos';
import CPVCodesList from '../components/layout/CPVCodesList';
import FAQ from '../components/layout/FAQ';
import Footer from '../components/layout/Footer';
import Modal from '../components/ui/Modal';
import TrialForm from '../components/TrialForm';
import ThankYouMessage from '../components/ThankYouMessage';
import useModal from '../hooks/useModal';

const LandingPage = () => {
  const { modalState, openModal, closeModal } = useModal();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleOpenTrialForm = () => {
    openModal('trial-form');
    setFormSubmitted(false);
  };

  const handleFormSuccess = () => {
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenTrialForm={handleOpenTrialForm} />
      
      <main className="flex-grow">
        <Hero onOpenModal={handleOpenTrialForm} />
        <Benefits />
        <CustomerLogos />
        <CPVCodesList />
        <FAQ />
      </main>
      
      <Footer />
      
      {/* Trial Form Modal */}
      <Modal
        isOpen={modalState.isOpen && modalState.type === 'trial-form'}
        onClose={closeModal}
        title={formSubmitted ? "Request Received" : "Start Your Free Trial"}
        size="lg"
      >
        {formSubmitted ? (
          <ThankYouMessage companyName="TenderSync" />
        ) : (
          <TrialForm onSuccess={handleFormSuccess} />
        )}
      </Modal>
    </div>
  );
};

export default LandingPage;
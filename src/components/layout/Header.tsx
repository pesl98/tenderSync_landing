import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
  onOpenTrialForm?: () => void;
};

const Header = ({ onOpenTrialForm }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      // Force clear the session even if the signOut request fails
      setUser(null);
      navigate('/');
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        
        if (error || !currentUser) {
          // If there's an error or no user, clear the session
          await handleLogout();
          return;
        }
        
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking session:', error);
        await handleLogout();
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null);
        navigate('/');
        return;
      }

      try {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        if (error || !currentUser) {
          await handleLogout();
          return;
        }
        setUser(currentUser);
      } catch (error) {
        console.error('Error during auth state change:', error);
        await handleLogout();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <header
      className={`fixed w-full z-30 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="text-blue-800 font-bold text-xl flex items-center">
              <span className="text-2xl mr-2">TenderSync</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#benefits" className="text-gray-700 hover:text-blue-800 font-medium">
              Benefits
            </a>
            <a href="#customers" className="text-gray-700 hover:text-blue-800 font-medium">
              Customers
            </a>
            <a href="#faq" className="text-gray-700 hover:text-blue-800 font-medium">
              FAQ
            </a>
            {user ? (
              <>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Log Out
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleLogin}>
                  Log In
                </Button>
                <Button variant="primary" size="sm" onClick={onOpenTrialForm}>
                  Start Free Trial
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-white shadow-md py-4 px-4 transition-all">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#benefits" 
                className="text-gray-700 hover:text-blue-800 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Benefits
              </a>
              <a 
                href="#customers" 
                className="text-gray-700 hover:text-blue-800 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Customers
              </a>
              <a 
                href="#faq" 
                className="text-gray-700 hover:text-blue-800 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </a>
              <div className="flex flex-col space-y-2 pt-2">
                {user ? (
                  <>
                    <Button variant="outline" fullWidth onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}>
                      Log Out
                    </Button>
                    <Button variant="primary" fullWidth onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/dashboard');
                    }}>
                      Dashboard
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" fullWidth onClick={() => {
                      setIsMenuOpen(false);
                      handleLogin();
                    }}>
                      Log In
                    </Button>
                    <Button 
                      variant="primary" 
                      fullWidth 
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenTrialForm?.();
                      }}
                    >
                      Start Free Trial
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { info } from '../data';

interface HeaderProps {
  onSectionChange?: (section: 'works' | 'about' | 'contact') => void;
}

const Header = ({ onSectionChange }: HeaderProps) => {
  const [currentTime, setCurrentTime] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hoursNum = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hoursNum >= 12 ? 'PM' : 'AM';
      const displayHours = hoursNum > 12 ? hoursNum - 12 : hoursNum === 0 ? 12 : hoursNum;
      setCurrentTime(`${displayHours}:${minutes} ${ampm}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200"
    >
      <nav className="w-full mx-auto px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <motion.a
            href="#"
            className="text-lg font-normal tracking-widest"
            whileHover={{ opacity: 0.7 }}
            style={{ letterSpacing: '0.3em' }}
          >
            {info.name}
          </motion.a>
          
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="#works" 
              className="text-sm hover:opacity-70 transition-opacity cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                onSectionChange?.('works');
              }}
            >
              작업물
            </a>
            <a 
              href="#about" 
              className="text-sm hover:opacity-70 transition-opacity cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                onSectionChange?.('about');
              }}
            >
              나에 대하여
            </a>
            <a 
              href="#contact" 
              className="text-sm hover:opacity-70 transition-opacity cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                onSectionChange?.('contact');
              }}
            >
              연락주세요
            </a>
          </div>

          <div className="text-sm font-normal">
            {currentTime}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-0.5 w-full bg-black transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 w-full bg-black transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-full bg-black transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 pb-4 space-y-4"
          >
            <a 
              href="#works" 
              className="block text-sm hover:opacity-70 transition-opacity cursor-pointer" 
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                onSectionChange?.('works');
              }}
            >
              작업물
            </a>
            <a 
              href="#about" 
              className="block text-sm hover:opacity-70 transition-opacity cursor-pointer" 
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                onSectionChange?.('about');
              }}
            >
              나에 대하여
            </a>
            <a 
              href="#contact" 
              className="block text-sm hover:opacity-70 transition-opacity cursor-pointer" 
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                onSectionChange?.('contact');
              }}
            >
              연락주세요
            </a>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

export default Header;


import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';

const PASSWORD = '0515';

interface PasswordProtectionProps {
  onAuthenticated: () => void;
  projects?: Project[];
}

const PasswordProtection = ({ onAuthenticated, projects = [] }: PasswordProtectionProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // 비밀번호 화면에서 모든 프로젝트 소스(영상·썸네일·이미지) 프리로드
  useEffect(() => {
    if (projects.length === 0) return;
    projects.forEach((project) => {
      if (project.thumbnail) {
        const img = new Image();
        img.src = project.thumbnail;
      }
      if (project.image) {
        const img = new Image();
        img.src = project.image;
      }
      if (project.video) {
        const video = document.createElement('video');
        video.preload = 'auto';
        video.src = project.video;
        video.load();
      }
    });
  }, [projects]);

  // 로컬 스토리지에서 인증 상태 확인
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('portfolio_authenticated');
    if (isAuthenticated === 'true') {
      onAuthenticated();
    }
  }, [onAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setError(false);

    // 약간의 딜레이로 자연스러운 UX
    setTimeout(() => {
      if (password === PASSWORD) {
        localStorage.setItem('portfolio_authenticated', 'true');
        onAuthenticated();
      } else {
        setError(true);
        setPassword('');
        setIsChecking(false);
      }
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[200] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm px-6"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-normal mb-2 tracking-widest" style={{ letterSpacing: '0.3em' }}>
            PORTFOLIO
          </h1>
          <p className="text-sm text-gray-500 font-light">비밀번호를 입력하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              onKeyPress={handleKeyPress}
              placeholder="비밀번호"
              className="w-full px-4 py-3 text-center text-lg border border-gray-300 focus:outline-none focus:border-black transition-colors"
              autoFocus
              disabled={isChecking}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 mt-2 text-center"
              >
                비밀번호가 올바르지 않습니다
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            disabled={isChecking || !password}
            className="w-full py-3 bg-black text-white text-sm font-normal hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChecking ? '확인 중...' : '확인'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default PasswordProtection;

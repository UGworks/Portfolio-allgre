import { useEffect, useState } from 'react';
import Header from './components/Header';
import PortfolioLayout from './components/PortfolioLayout';
import GeneralInfoPanel from './components/GeneralInfoPanel';
import AboutPage from './components/AboutPage';
import PasswordProtection from './components/PasswordProtection';
import { projects } from './data';
import { Project } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeSection, setActiveSection] = useState<'works' | 'about' | 'contact'>('works');
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);
  const [isWheeling, setIsWheeling] = useState(false);
  const introHeaderDelayMs = 0;
  const introSidebarDelayMs = 600;
  const introMaskDelayMs = 1200;
  const introMaskDurationMs = 2000;
  const introInfoDelayMs = introMaskDelayMs + introMaskDurationMs;
  const introContentDelayMs = introMaskDelayMs + introMaskDurationMs;
  const introTotalMs = introContentDelayMs + 400;

  // 섹션이 변경될 때 인트로 상태 초기화
  useEffect(() => {
    if (activeSection === 'works') {
      setHasPlayedIntro(false);
      const timer = setTimeout(() => {
        setHasPlayedIntro(true);
      }, introTotalMs);
      return () => clearTimeout(timer);
    } else {
      // 다른 섹션으로 갈 때는 즉시 인트로 완료 상태로
      setHasPlayedIntro(true);
    }
  }, [activeSection, introTotalMs]);

  // 인증되지 않은 경우 비밀번호 입력 화면 표시
  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        onSectionChange={setActiveSection}
        isIntro={!hasPlayedIntro}
        introDelayMs={introHeaderDelayMs}
      />
      {activeSection === 'works' && (
        <>
          <PortfolioLayout 
            projects={projects} 
            onProjectChange={setActiveProject}
            onWheelingChange={setIsWheeling}
            isIntro={!hasPlayedIntro}
            introMaskDelayMs={introMaskDelayMs}
            introSidebarDelayMs={introSidebarDelayMs}
          />
          <GeneralInfoPanel
            activeProject={activeProject}
            isIntro={!hasPlayedIntro}
            introDelayMs={introInfoDelayMs}
            isWheeling={isWheeling}
          />
        </>
      )}
      {activeSection === 'about' && <AboutPage />}
      {activeSection === 'contact' && (
        <div className="fixed top-16 right-0 w-96 h-[calc(100vh-4rem)] overflow-y-auto bg-white z-40 border-l border-gray-200 p-8">
          <h1 className="text-3xl font-bold mb-4">연락주세요</h1>
          <p className="text-sm font-light mb-6 text-gray-600">Get in touch</p>

          <div className="space-y-4 text-sm font-normal text-gray-800">
            <div>
              <p className="text-xs text-gray-500 mb-1">E-MAIL</p>
              <a
                href="mailto:huuuuun@kakao.com"
                className="text-base hover:opacity-70 transition-opacity"
              >
                huuuuun@kakao.com
              </a>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">MOBILE</p>
              <p className="text-base">010-3890-7954</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">NAME</p>
              <p className="text-base">이성훈</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


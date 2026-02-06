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
  // 인증 후 오프닝 순서: 1) 콘텐츠 프레임 아래→위 마스킹 2) 썸네일 등장 3) 상세설명 등장 (PC·모바일 동일)
  const introHeaderDelayMs = 0;
  const introMaskDelayMs = 0;
  const introMaskDurationMs = 2000;
  const introSidebarDelayMs = 800;
  const introInfoDelayMs = introMaskDelayMs + introMaskDurationMs + 300;
  const introContentDelayMs = introMaskDelayMs + introMaskDurationMs;
  const introTotalMs = introContentDelayMs + 500;

  // 인증 후 works 진입 시에만 인트로 실행 (비번 화면에서는 타이머 미실행)
  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeSection === 'works') {
      setHasPlayedIntro(false);
      const timer = setTimeout(() => setHasPlayedIntro(true), introTotalMs);
      return () => clearTimeout(timer);
    } else {
      setHasPlayedIntro(true);
    }
  }, [activeSection, introTotalMs, isAuthenticated]);

  // 우클릭(컨텍스트 메뉴) 방지
  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', preventContextMenu);
    return () => document.removeEventListener('contextmenu', preventContextMenu);
  }, []);

  // 소스 보기·개발자 도구 단축키 방지 (F12, Ctrl+U, Ctrl+Shift+I, Ctrl+Shift+J)
  useEffect(() => {
    const preventDevShortcuts = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault();
        return;
      }
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return;
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) {
        e.preventDefault();
        return;
      }
    };
    document.addEventListener('keydown', preventDevShortcuts);
    return () => document.removeEventListener('keydown', preventDevShortcuts);
  }, []);

  // 인증되지 않은 경우 비밀번호 입력 화면 표시 (이때 프로젝트 소스 프리로드)
  if (!isAuthenticated) {
    return (
      <PasswordProtection
        onAuthenticated={() => setIsAuthenticated(true)}
        projects={projects}
      />
    );
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
            isIntro={!hasPlayedIntro}
            introMaskDelayMs={introMaskDelayMs}
            introMaskDurationMs={introMaskDurationMs}
            introSidebarDelayMs={introSidebarDelayMs}
          />
          <GeneralInfoPanel
            activeProject={activeProject}
            isIntro={!hasPlayedIntro}
            introDelayMs={introInfoDelayMs}
          />
        </>
      )}
      {activeSection === 'about' && <AboutPage />}
      {activeSection === 'contact' && (
        <div className="fixed top-16 right-0 w-96 h-[calc(100vh-4rem)] overflow-y-auto bg-white z-40 border-l border-gray-200 p-8">
          <h1 className="text-3xl font-bold mb-4">이성훈</h1>

          <div className="space-y-4 text-sm font-normal text-gray-800">
            <div>
              <p className="text-xs text-gray-500 mb-1">연락처</p>
              <p className="text-base">010-3890-7954</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">이메일</p>
              <a
                href="mailto:huuuuun@kakao.com"
                className="text-base hover:opacity-70 transition-opacity"
              >
                huuuuun@kakao.com
              </a>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">거주지</p>
              <p className="text-base">서울시 동작구</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


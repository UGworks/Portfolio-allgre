import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { info } from '../data';
import { Project } from '../types';

interface GeneralInfoPanelProps {
  activeProject: Project | null;
  isIntro?: boolean;
  introDelayMs?: number;
  isWheeling?: boolean;
}

const GeneralInfoPanel = ({
  activeProject,
  isIntro = false,
  introDelayMs = 0,
  isWheeling = false,
}: GeneralInfoPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // 모바일 여부 확인
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 패널에서 휠 이벤트를 막아서 전체 페이지 휠 이벤트만 작동하도록
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const handlePanelWheel = (e: WheelEvent) => {
      // 패널의 기본 스크롤 방지 - 전체 페이지 휠 이벤트가 처리하도록
      e.preventDefault();
      e.stopPropagation();
    };

    panel.addEventListener('wheel', handlePanelWheel, { passive: false, capture: true });

    return () => {
      panel.removeEventListener('wheel', handlePanelWheel, { capture: true } as EventListenerOptions);
    };
  }, []);

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isWheeling ? 0.3 : 1, y: 0 }}
      transition={{ duration: 0.3, delay: isIntro ? introDelayMs / 1000 : 0 }}
      className={`fixed bg-white z-30 overflow-y-auto p-4 md:p-8
                 ${isMobile 
                   ? 'left-0 right-0 w-full border-t border-gray-200' 
                   : 'md:top-16 md:left-auto md:right-0 md:w-96 md:border-l md:border-gray-200 md:h-[calc(100vh-4rem)]'
                 }`}
      style={{
        top: isMobile ? 'calc(4rem + 20px + 80px + 100vw)' : undefined, // 모바일: 헤더 + 썸네일 + 80px + 1:1 영상 영역 아래
        bottom: isMobile ? 0 : undefined,
        height: isMobile ? 'auto' : undefined,
        maxHeight: isMobile ? 'calc(100vh - 4rem - 20px - 80px - 100vw)' : undefined
      }}
    >
      <AnimatePresence mode="wait">
        {activeProject ? (
          <motion.div
            key={activeProject.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className={`${isMobile ? 'text-2xl' : 'text-xl'} font-semibold ${isMobile ? 'mb-2' : 'mb-4'}`}>
              {activeProject.title}
            </h2>
            <p
              className={`${
                isMobile ? 'text-sm font-medium' : 'text-xs font-light'
              } text-gray-600 ${isMobile ? 'mb-2' : 'mb-4'}`}
            >
              {activeProject.category}
            </p>
            
            {/* 소제목 (description의 첫 줄) */}
            {activeProject.description && (
              <p className={`${isMobile ? 'text-base' : 'text-sm'} text-gray-800 font-normal ${isMobile ? 'mb-3' : 'mb-4'} leading-snug`}>
                {activeProject.description.split('\n\n')[0].trim()}
              </p>
            )}
            
            {/* 참여도 막대그래프 */}
            <div className={`${isMobile ? 'mb-3' : 'mb-4'}`}>
              <p className={`${isMobile ? 'text-sm' : 'text-xs'} text-gray-700 font-medium mb-2`}>참여도</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-200 relative overflow-hidden">
                  <motion.div
                    className="h-full bg-black"
                    initial={{ width: 0 }}
                    animate={{ width: `${activeProject.participation ?? 85}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                  />
                </div>
                <span className={`${isMobile ? 'text-sm' : 'text-xs'} text-gray-700 font-normal whitespace-nowrap`}>
                  {activeProject.participation ?? 85}%
                </span>
              </div>
            </div>
            
            {/* 키워드 라운드박스 */}
            {activeProject.keywords && activeProject.keywords.length > 0 && (
              <div className={`flex flex-wrap gap-2 ${isMobile ? 'mb-3' : 'mb-6'}`}>
                {activeProject.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-normal text-gray-600 bg-gray-100 border border-gray-200 rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
            
            {/* PC: 전체 설명 표시 (소제목 제외, 두 번째 문단부터) */}
            {!isMobile && (
              <div className="space-y-4 text-sm font-light leading-relaxed">
                {activeProject.description ? (
                  activeProject.description.split('\n\n').slice(1).map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="text-gray-700">
                        {paragraph.trim()}
                      </p>
                    )
                  ))
                ) : (
                  <>
                    <p className="text-gray-700">
                      This project represents a comprehensive exploration of {activeProject.category.toLowerCase()}, combining innovative design principles with meticulous attention to detail. The work demonstrates a deep understanding of visual communication and user experience, creating a cohesive narrative that resonates with the target audience.
                    </p>
                    
                    <p className="text-gray-700">
                      Through careful consideration of form, function, and aesthetic harmony, this project showcases the intersection of creative vision and technical excellence. Each element has been thoughtfully crafted to contribute to an overall experience that is both engaging and meaningful.
                    </p>
                  </>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="general"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-medium mb-6">General Info</h2>
            
            <div className="space-y-6 text-sm font-light leading-relaxed">
              <p className="text-gray-700">
                {info.description}
              </p>
              
              {info.clients.length > 0 && (
                <div>
                  <p className="mb-4 font-normal">Notable clients include:</p>
                  <ul className="list-none space-y-2">
                    {info.clients.map((client, index) => (
                      <li key={index} className="text-gray-700">
                        {client}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-6 border-t border-gray-200">
                <p className="mb-2 font-normal">For inquiries:</p>
                <a
                  href={`mailto:${info.email}`}
                  className="text-base hover:opacity-70 transition-opacity"
                >
                  {info.email}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GeneralInfoPanel;


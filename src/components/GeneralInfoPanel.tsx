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

const GeneralInfoPanel = ({ activeProject, isIntro = false, introDelayMs = 0, isWheeling = false }: GeneralInfoPanelProps) => {
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
      className="fixed left-0 right-0 w-full border-t border-gray-200
                 md:top-16 md:left-auto md:right-0 md:w-96 md:border-t-0 md:border-l md:border-gray-200
                 p-4 md:p-8 bg-white z-30 overflow-y-auto
                 md:h-[calc(100vh-4rem)]"
      style={{
        top: isMobile ? 'calc(4rem + 20px + 100vw)' : undefined, // 모바일: 헤더 + 썸네일 + 1:1 영상 영역 아래
        bottom: isMobile ? 0 : undefined,
        height: isMobile ? 'auto' : undefined,
        maxHeight: isMobile ? 'calc(100vh - 4rem - 20px - 100vw)' : undefined
      }}
    >
      <AnimatePresence mode="wait">
        {activeProject ? (
          <motion.div
            key={activeProject.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-medium mb-4">{activeProject.title}</h2>
            <p className="text-xs text-gray-500 font-light mb-6">{activeProject.category}</p>
            
            <div className="space-y-4 text-sm font-light leading-relaxed">
              {activeProject.description ? (
                activeProject.description.split('\n\n').map((paragraph, index) => (
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
          </motion.div>
        ) : (
          <motion.div
            key="general"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
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


import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';

interface ProjectSidebarProps {
  projects: Project[];
  activeIndex: number;
  onProjectClick: (index: number) => void;
  scrollProgress?: number;
  isIntro?: boolean;
  introDelayMs?: number;
}

const ProjectSidebar = ({
  projects,
  activeIndex,
  onProjectClick,
  scrollProgress = 0,
  isIntro = false,
  introDelayMs = 0,
}: ProjectSidebarProps) => {
  const loopCount = 3;
  const sidebarRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevActiveIndexRef = useRef(activeIndex);
  const animationFrameRef = useRef<number | null>(null);
  const [magnetOffset, setMagnetOffset] = useState(0);

  // 커스텀 easing 함수 (ease-in-out)
  const easeInOut = (t: number): number => {
    return t < 0.5 
      ? 2 * t * t 
      : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };

  // 커스텀 스크롤 애니메이션 (ease-in-out, 빠르고 부드럽게)
  const smoothScrollTo = (target: number, duration: number = 600) => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const start = sidebar.scrollTop;
    const distance = target - start;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // ease-in-out
      const eased = easeInOut(progress);
      
      sidebar.scrollTop = start + distance * eased;

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = null;
      }
    };

    // 기존 애니메이션 취소
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // 마그넷 효과 계산 (스크롤 진행도에 따라)
  useEffect(() => {
    const calculateMagnetEffect = () => {
      if (projects.length === 0) return;
      
      const sectionSize = 1 / projects.length;
      const targetSection = activeIndex;
      const currentSectionProgress = scrollProgress / sectionSize;
      const distanceFromTarget = Math.abs(currentSectionProgress - targetSection);
      
      // 타겟 섹션에 가까울수록 강한 마그넷 효과
      // 거리가 멀수록 효과 감소 (최대 거리: 2 섹션)
      const maxDistance = 2;
      const magnetStrength = Math.max(0, 1 - distanceFromTarget / maxDistance);
      
      // 스크롤 방향에 따라 마그넷 효과 방향 결정
      let offset = 0;
      if (currentSectionProgress < targetSection) {
        // 아래로 스크롤 중 - 위로 끌림 (음수)
        offset = -12 * magnetStrength;
      } else if (currentSectionProgress > targetSection) {
        // 위로 스크롤 중 - 아래로 끌림 (양수)
        offset = 12 * magnetStrength;
      }
      
      setMagnetOffset(offset);
    };
    
    calculateMagnetEffect();
  }, [scrollProgress, activeIndex, projects.length]);

  // activeIndex가 변경될 때 해당 썸네일이 항상 중앙에 위치하도록 스크롤
  useEffect(() => {
    const activeItem = itemRefs.current[activeIndex];
    const sidebar = sidebarRef.current;
    
    if (activeItem && sidebar && !isIntro) {
      const itemTop = activeItem.offsetTop;
      const itemHeight = activeItem.offsetHeight;
      const sidebarHeight = sidebar.clientHeight;
      
      // 썸네일이 정확히 중앙에 오도록 계산
      const targetScroll = itemTop - (sidebarHeight / 2) + (itemHeight / 2);
      
      // 항상 중앙에 위치시키기 위해 스크롤
      smoothScrollTo(targetScroll, 400);
      
      prevActiveIndexRef.current = activeIndex;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeIndex, isIntro]);

  // 무한 루핑 스크롤 설정 (중앙에서 시작하고 끝에 도달하면 점프)
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar || projects.length === 0) return;

    const setInitialPosition = () => {
      const listHeight = sidebar.scrollHeight / loopCount;
      if (listHeight > 0) {
        sidebar.scrollTop = listHeight;
      }
    };

    const handleLoopScroll = () => {
      const listHeight = sidebar.scrollHeight / loopCount;
      if (listHeight <= 0) return;

      if (sidebar.scrollTop <= listHeight * 0.25) {
        sidebar.scrollTop += listHeight;
      } else if (sidebar.scrollTop >= listHeight * 1.75) {
        sidebar.scrollTop -= listHeight;
      }
    };

    const rafId = requestAnimationFrame(setInitialPosition);
    sidebar.addEventListener('scroll', handleLoopScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      sidebar.removeEventListener('scroll', handleLoopScroll);
    };
  }, [projects.length]);

  const loopedProjects = Array.from({ length: loopCount }, (_, loopIndex) =>
    projects.map((project, index) => ({ project, index, loopIndex }))
  ).flat();

  // 사이드바에서 휠 이벤트를 막아서 전체 페이지 휠 이벤트만 작동하도록
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleSidebarWheel = (e: WheelEvent) => {
      // 사이드바의 기본 스크롤 방지 - 전체 페이지 휠 이벤트가 처리하도록
      e.preventDefault();
      e.stopPropagation();
    };

    sidebar.addEventListener('wheel', handleSidebarWheel, { passive: false, capture: true });

    return () => {
      sidebar.removeEventListener('wheel', handleSidebarWheel, { capture: true } as EventListenerOptions);
    };
  }, []);

  return (
    <motion.div 
      ref={sidebarRef}
      initial={isIntro ? { x: '-100%' } : false}
      animate={{ x: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut', delay: isIntro ? introDelayMs / 1000 : 0 }}
      className="fixed left-0 top-16 bottom-0 w-80 overflow-y-auto bg-white z-30 border-r border-gray-200"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <div className="p-6 space-y-20">
        {loopedProjects.map(({ project, index, loopIndex }) => {
          const isActive = index === activeIndex && !isIntro;
          const shouldAssignRef = loopIndex === 1;
          return (
          <motion.div
            key={`${project.id}-${loopIndex}-${index}`}
            ref={(el) => {
              if (shouldAssignRef) {
                itemRefs.current[index] = el;
              }
            }}
            onClick={() => onProjectClick(index)}
            className={`cursor-pointer group flex items-start gap-3 ${
              isActive ? 'opacity-100' : 'opacity-60 hover:opacity-80'
            } transition-opacity`}
            whileHover={{ x: 4 }}
            animate={{
              y: isActive ? -8 + magnetOffset : 0,
              scale: isActive ? 0.95 : 1,
              x: isActive ? magnetOffset * 0.3 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8
            }}
          >
            {/* 정방형 썸네일 */}
            <motion.div 
              className="relative overflow-hidden bg-gray-100 flex-shrink-0"
              style={{ width: '60px', height: '60px' }}
              animate={{
                scale: isActive ? 0.92 : 1,
              }}
              transition={{
                duration: 0.4,
                ease: 'easeInOut'
              }}
            >
              {project.video ? (
                <video
                  src={project.video}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  onMouseEnter={(e) => {
                    const video = e.currentTarget;
                    video.currentTime = 0;
                    video.play();
                  }}
                  onMouseLeave={(e) => {
                    const video = e.currentTarget;
                    video.pause();
                    video.currentTime = 0;
                  }}
                />
              ) : (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              )}
              {/* 선택된 썸네일 마스킹 효과 */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 border-2 border-black"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />
              )}
            </motion.div>
            {/* 프로젝트 정보 텍스트 - 선택된 썸네일에만 표시 (페이드 효과) */}
            <AnimatePresence mode="wait">
              {isActive && (
                <motion.div
                  key={`info-${activeIndex}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ 
                    duration: 0.3, 
                    ease: 'easeInOut' 
                  }}
                  className="flex-1 min-w-0 pt-1"
                >
                  <h3 className="text-sm font-normal mb-0.5 leading-tight">{project.title}</h3>
                  <p className="text-xs text-gray-500 font-light leading-tight">{project.category}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
        })}
      </div>
    </motion.div>
  );
};

export default ProjectSidebar;


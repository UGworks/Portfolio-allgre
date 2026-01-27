import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';

interface ProjectSidebarProps {
  projects: Project[];
  activeIndex: number;
  onProjectClick: (index: number) => void;
  isIntro?: boolean;
  introDelayMs?: number;
}

const ProjectSidebar = ({
  projects,
  activeIndex,
  onProjectClick,
  isIntro = false,
  introDelayMs = 0,
}: ProjectSidebarProps) => {
  const loopCount = 3;
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mobileSidebarRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevActiveIndexRef = useRef(activeIndex);
  const animationFrameRef = useRef<number | null>(null);
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

  // activeIndex가 변경될 때 해당 썸네일이 항상 중앙에 위치하도록 스크롤 (PC: 세로 스크롤)
  useEffect(() => {
    if (isMobile) return; // 모바일은 별도 처리
    
    const activeItem = itemRefs.current[activeIndex];
    const sidebar = sidebarRef.current;
    
    if (activeItem && sidebar && !isIntro) {
      const listHeight = sidebar.scrollHeight / loopCount;
      const itemHeight = activeItem.offsetHeight;
      const sidebarHeight = sidebar.clientHeight;
      const currentScrollTop = sidebar.scrollTop;
      
      // 중앙 루프에서의 타겟 스크롤 위치
      const targetInCenterLoop = activeItem.offsetTop - (sidebarHeight / 2) + (itemHeight / 2);
      
      // 현재 위치에서 가장 가까운 루프의 타겟 위치 계산
      let targetScroll = targetInCenterLoop;
      const distanceToCenter = Math.abs(currentScrollTop - targetInCenterLoop);
      const distanceToUpper = Math.abs(currentScrollTop - (targetInCenterLoop - listHeight));
      const distanceToLower = Math.abs(currentScrollTop - (targetInCenterLoop + listHeight));
      
      // 가장 가까운 루프 선택
      if (distanceToUpper < distanceToCenter && distanceToUpper < distanceToLower) {
        targetScroll = targetInCenterLoop - listHeight;
      } else if (distanceToLower < distanceToCenter && distanceToLower < distanceToUpper) {
        targetScroll = targetInCenterLoop + listHeight;
      }
      
      // 가장 가까운 경로로 스크롤
      smoothScrollTo(targetScroll, 400);
      
      prevActiveIndexRef.current = activeIndex;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeIndex, isIntro, projects.length, isMobile]);

  // 모바일: activeIndex가 변경될 때 가로 스크롤 중앙 정렬
  useEffect(() => {
    if (!isMobile) return;
    
    const activeItem = mobileItemRefs.current[activeIndex];
    const sidebar = mobileSidebarRef.current;
    
    if (activeItem && sidebar && !isIntro) {
      const itemWidth = activeItem.offsetWidth;
      const sidebarWidth = sidebar.clientWidth;
      const targetScrollLeft = activeItem.offsetLeft - (sidebarWidth / 2) + (itemWidth / 2);
      
      sidebar.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
    }
  }, [activeIndex, isIntro, projects.length, isMobile]);

  // 무한 루핑 스크롤 설정 (중앙에서 시작하고 끝에 도달하면 점프) - PC만 적용
  useEffect(() => {
    if (isMobile) return;
    
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
  }, [projects.length, isMobile]);

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

  // PC 사이드바 렌더링
  const renderThumbnail = (project: Project, index: number, loopIndex: number, isMobile: boolean) => {
    const isActive = index === activeIndex && !isIntro;
    const shouldAssignRef = loopIndex === 1;
    const refs = isMobile ? mobileItemRefs : itemRefs;
    
    return (
      <motion.div
        key={`${project.id}-${loopIndex}-${index}`}
        ref={(el) => {
          if (shouldAssignRef) {
            refs.current[index] = el;
          }
        }}
        onClick={() => onProjectClick(index)}
        className="cursor-pointer group flex items-start gap-3 flex-shrink-0"
      >
        {/* 정방형 썸네일 */}
        <motion.div 
          className="relative overflow-hidden bg-gray-100 flex-shrink-0"
          style={{ 
            width: '60px', 
            height: '60px',
            boxShadow: isActive ? 'inset 0 0 20px rgba(0, 0, 0, 0.3)' : 'none'
          }}
          animate={{
            clipPath: isActive ? 'inset(8% 8% 8% 8%)' : 'inset(0% 0% 0% 0%)',
          }}
          transition={{
            duration: 0.4,
            ease: 'easeInOut'
          }}
        >
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : project.video ? (
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
        </motion.div>
        {/* 프로젝트 정보 텍스트 - 선택된 썸네일에만 표시 (페이드 효과), 모바일에서는 숨김 */}
        {!isMobile && (
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
                <h3 className="text-xs font-normal mb-0.5 leading-tight">{project.title}</h3>
                <p className="text-[10px] text-gray-500 font-light leading-tight">{project.category}</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    );
  };

  return (
    <>
      {/* PC: 왼쪽 세로 사이드바 */}
      <motion.div 
        ref={sidebarRef}
        initial={isIntro ? { x: '-100%' } : false}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut', delay: isIntro ? introDelayMs / 1000 : 0 }}
        className="hidden md:block fixed left-0 top-16 bottom-0 w-80 overflow-y-auto bg-white z-30 border-r border-gray-200"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="p-6 space-y-20">
          {loopedProjects.map(({ project, index, loopIndex }) => 
            renderThumbnail(project, index, loopIndex, false)
          )}
        </div>
      </motion.div>

      {/* 모바일: 상단 가로 스크롤 */}
      <motion.div
        ref={mobileSidebarRef}
        initial={isIntro ? { y: -100 } : false}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut', delay: isIntro ? introDelayMs / 1000 : 0 }}
        className="md:hidden fixed top-16 left-0 right-0 h-20 overflow-x-auto overflow-y-hidden border-b border-gray-200 bg-white z-30"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="p-4 flex flex-row gap-4 h-full items-center">
          {loopedProjects.map(({ project, index, loopIndex }) => 
            renderThumbnail(project, index, loopIndex, true)
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ProjectSidebar;

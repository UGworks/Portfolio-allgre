import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';

interface ProjectSidebarProps {
  projects: Project[];
  activeIndex: number;
  onProjectClick: (index: number) => void;
  scrollProgress?: number;
}

const ProjectSidebar = ({ projects, activeIndex, onProjectClick, scrollProgress = 0 }: ProjectSidebarProps) => {
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

  // activeIndex가 변경될 때 해당 썸네일이 보이도록 스크롤
  useEffect(() => {
    const activeItem = itemRefs.current[activeIndex];
    const sidebar = sidebarRef.current;
    const prevIndex = prevActiveIndexRef.current;
    
    if (activeItem && sidebar) {
      const itemTop = activeItem.offsetTop;
      const itemHeight = activeItem.offsetHeight;
      const sidebarTop = sidebar.scrollTop;
      const sidebarHeight = sidebar.clientHeight;
      const targetScroll = itemTop - sidebar.clientHeight / 2 + itemHeight / 2;
      
      // 점프 거리 계산 (이전 인덱스와의 차이)
      const jumpDistance = Math.abs(activeIndex - prevIndex);
      
      // 썸네일이 보이지 않거나 점프가 큰 경우 커스텀 스크롤 사용
      const needsScroll = itemTop < sidebarTop || itemTop + itemHeight > sidebarTop + sidebarHeight;
      
      if (needsScroll || jumpDistance > 1) {
        // 점프 거리에 따라 애니메이션 시간 조정 (더 빠르게, ease-in-out)
        const scrollDuration = Math.min(300 + jumpDistance * 50, 600);
        smoothScrollTo(targetScroll, scrollDuration);
      }
      
      prevActiveIndexRef.current = activeIndex;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeIndex]);

  return (
    <div 
      ref={sidebarRef}
      className="fixed left-0 top-16 bottom-0 w-80 overflow-y-auto bg-white z-30 border-r border-gray-200"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <div className="p-6 space-y-20">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            ref={(el) => { itemRefs.current[index] = el; }}
            onClick={() => onProjectClick(index)}
            className={`cursor-pointer group flex items-start gap-3 ${
              index === activeIndex ? 'opacity-100' : 'opacity-60 hover:opacity-80'
            } transition-opacity`}
            whileHover={{ x: 4 }}
            animate={{
              y: index === activeIndex ? -8 + magnetOffset : 0,
              scale: index === activeIndex ? 0.95 : 1,
              x: index === activeIndex ? magnetOffset * 0.3 : 0,
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
                scale: index === activeIndex ? 0.92 : 1,
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
              {index === activeIndex && (
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
              {index === activeIndex && (
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
        ))}
      </div>
    </div>
  );
};

export default ProjectSidebar;


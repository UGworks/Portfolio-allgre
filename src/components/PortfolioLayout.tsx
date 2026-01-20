import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import ProjectSidebar from './ProjectSidebar';
import MainDisplay from './MainDisplay';

interface PortfolioLayoutProps {
  projects: Project[];
  onProjectChange?: (project: Project | null) => void;
  onWheelingChange?: (isWheeling: boolean) => void;
  isIntro?: boolean;
  introContentDelayMs?: number;
  introMaskDelayMs?: number;
  introSidebarDelayMs?: number;
}

const PortfolioLayout = ({
  projects,
  onProjectChange,
  onWheelingChange,
  isIntro = false,
  introContentDelayMs = 0,
  introMaskDelayMs = 0,
  introSidebarDelayMs = 0,
}: PortfolioLayoutProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isWheeling, setIsWheeling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainDisplayRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const lastWheelTimeRef = useRef(0);
  const wheelStopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imageAutoTransitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAutoTransitioningRef = useRef(false);
  const onProjectChangeRef = useRef(onProjectChange);

  // onProjectChange ref 업데이트
  useEffect(() => {
    onProjectChangeRef.current = onProjectChange;
  }, [onProjectChange]);

  // activeIndex가 변경될 때 ref 업데이트
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // isWheeling 상태 변경 시 콜백 호출
  useEffect(() => {
    if (onWheelingChange) {
      onWheelingChange(isWheeling);
    }
  }, [isWheeling, onWheelingChange]);

  // 이미지만 있는 프로젝트는 1.5초 후 자동으로 다음 프로젝트로 전환 (애니메이션 시간 고려)
  useEffect(() => {
    if (projects.length === 0) return;

    // 기존 타이머가 있으면 먼저 취소
    if (imageAutoTransitionRef.current) {
      clearTimeout(imageAutoTransitionRef.current);
      imageAutoTransitionRef.current = null;
    }

    const currentProject = projects[activeIndex];
    const isImageOnly = currentProject && !currentProject.video && currentProject.image;

    // 자동 전환은 isScrollingRef 체크를 건너뛰고, isAutoTransitioningRef만 체크
    if (isImageOnly && activeIndex < projects.length - 1 && !isAutoTransitioningRef.current) {
      isAutoTransitioningRef.current = true;
      
      imageAutoTransitionRef.current = setTimeout(() => {
        // 현재 인덱스가 변경되지 않았을 때만 전환
        if (activeIndexRef.current === activeIndex) {
          const nextIndex = activeIndex + 1;
          
          // 프로그래밍 방식 스크롤 플래그 설정
          isProgrammaticScrollRef.current = true;
          
          activeIndexRef.current = nextIndex;
          setActiveIndex(nextIndex);
          
          if (onProjectChangeRef.current) {
            onProjectChangeRef.current(projects[nextIndex]);
          }
          
          // 스크롤 위치 업데이트
          const scrollTo = (nextIndex / projects.length) * (document.documentElement.scrollHeight - window.innerHeight);
          window.scrollTo({ top: scrollTo, behavior: 'smooth' });
          
          // 자동 전환 플래그는 즉시 해제하여 다음 전환이 가능하도록
          // 스크롤 플래그만 짧게 유지
          isAutoTransitioningRef.current = false;
          
          setTimeout(() => {
            isProgrammaticScrollRef.current = false;
          }, 400);
        } else {
          isAutoTransitioningRef.current = false;
        }
        imageAutoTransitionRef.current = null;
      }, 1500);
    } else if (!isImageOnly) {
      // 이미지가 아니면 플래그 해제
      isAutoTransitioningRef.current = false;
    }

    return () => {
      if (imageAutoTransitionRef.current) {
        clearTimeout(imageAutoTransitionRef.current);
        imageAutoTransitionRef.current = null;
      }
    };
  }, [activeIndex, projects.length]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // 기본 스크롤 동작 방지
      e.preventDefault();
      e.stopPropagation();
      
      const now = Date.now();
      const delta = e.deltaY;
      const absDelta = Math.abs(delta);
      
      // 휠 속도 계산 (가속 적용)
      const timeDelta = now - lastWheelTimeRef.current;
      const velocity = timeDelta > 0 && timeDelta < 100 ? absDelta / timeDelta : 0;
      
      // 휠 멈춤 타이머 리셋
      if (wheelStopTimeoutRef.current) {
        clearTimeout(wheelStopTimeoutRef.current);
      }
      
      setIsWheeling(true);
      wheelStopTimeoutRef.current = setTimeout(() => {
        setIsWheeling(false);
        wheelStopTimeoutRef.current = null;
      }, 150);
      
      // 기존 이미지 자동 전환 타이머 취소
      if (imageAutoTransitionRef.current) {
        clearTimeout(imageAutoTransitionRef.current);
        imageAutoTransitionRef.current = null;
        isAutoTransitioningRef.current = false;
      }
      
      // 휠 민감도
      const threshold = 5;
      
      if (absDelta > threshold) {
        lastWheelTimeRef.current = now;
        
        // 가속도에 따라 여러 단계 건너뛰기 (brunoarizio.com 스타일)
        const speedMultiplier = velocity > 10 ? Math.min(Math.floor(velocity / 5), 3) : 1;
        const step = speedMultiplier;
        
        const currentIndex = activeIndexRef.current;
        let newIndex: number;
        
        if (delta > 0) {
          // 아래로 스크롤 - 다음 프로젝트 (순환)
          newIndex = (currentIndex + step) % projects.length;
        } else {
          // 위로 스크롤 - 이전 프로젝트 (순환)
          newIndex = (currentIndex - step + projects.length) % projects.length;
        }
        
        // 즉시 전환
        activeIndexRef.current = newIndex;
        setActiveIndex(newIndex);
        if (onProjectChangeRef.current) {
          onProjectChangeRef.current(projects[newIndex]);
        }
        
        // 스크롤 위치 동기화 (순환 고려)
        const scrollTo = (newIndex / projects.length) * (document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo({ top: scrollTo, behavior: 'auto' });
      }
    };

    // 스크롤 진행도만 업데이트 (인덱스 변경은 휠 이벤트에서만)
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableHeight = documentHeight - windowHeight;

      if (scrollableHeight > 0) {
        const progress = Math.min(scrollTop / scrollableHeight, 1);
        setScrollProgress(progress);
      }
    };

    // 휠 이벤트 리스너
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 초기 실행

    return () => {
      document.removeEventListener('wheel', handleWheel, { capture: true } as EventListenerOptions);
      window.removeEventListener('scroll', handleScroll);
      if (wheelStopTimeoutRef.current) {
        clearTimeout(wheelStopTimeoutRef.current);
      }
    };
  }, [projects.length]);

  const handleProjectClick = (index: number) => {
    // 기존 이미지 자동 전환 타이머 취소
    if (imageAutoTransitionRef.current) {
      clearTimeout(imageAutoTransitionRef.current);
      imageAutoTransitionRef.current = null;
      isAutoTransitioningRef.current = false;
    }
    
    // 즉시 전환
    activeIndexRef.current = index;
    setActiveIndex(index);
    if (onProjectChangeRef.current) {
      onProjectChangeRef.current(projects[index]);
    }
    
    // 해당 프로젝트로 스크롤
    const scrollTo = (index / projects.length) * (document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({ top: scrollTo, behavior: 'auto' });
  };

  // 초기 프로젝트 설정 및 인덱스 초기화
  useEffect(() => {
    if (projects.length > 0) {
      // 상태 초기화
      activeIndexRef.current = 0;
      setActiveIndex(0);
      setScrollProgress(0);
      isAutoTransitioningRef.current = false;
      setIsWheeling(false);
      
      // 기존 타이머들 정리
      if (imageAutoTransitionRef.current) {
        clearTimeout(imageAutoTransitionRef.current);
        imageAutoTransitionRef.current = null;
      }
      if (wheelStopTimeoutRef.current) {
        clearTimeout(wheelStopTimeoutRef.current);
        wheelStopTimeoutRef.current = null;
      }
      
      // 프로젝트 변경 콜백
      if (onProjectChange) {
        onProjectChange(projects[0]);
      }
      
      // 스크롤 위치 초기화
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects.length]);

  return (
    <div className="min-h-screen bg-white" ref={containerRef}>
      {/* 왼쪽 사이드바 */}
      <ProjectSidebar
        projects={projects}
        activeIndex={activeIndex}
        onProjectClick={handleProjectClick}
        scrollProgress={scrollProgress}
        isIntro={isIntro}
        introDelayMs={introSidebarDelayMs}
      />

      {/* 오른쪽 메인 영역 */}
      <div className="ml-80 min-h-screen relative">
        {/* 오른쪽 하단 메인 디스플레이 영역 (검은색 배경) */}
        <motion.div
          ref={mainDisplayRef}
          className="fixed bottom-0 bg-black z-20"
          initial={isIntro ? { clipPath: 'inset(100% 0 0 0)' } : false}
          animate={{ clipPath: 'inset(0 0 0 0)' }}
          transition={
            isIntro
              ? { duration: 2, ease: 'easeInOut', delay: introMaskDelayMs / 1000 }
              : { duration: 0 }
          }
          style={{ 
            left: '20rem', // 사이드바 너비 (80 = 20rem)
            right: '24rem', // General Info Panel 너비 (96 = 24rem)
            height: 'calc(100vh - 4rem)',
            top: '4rem',
            overflow: 'hidden',
            clipPath: 'inset(0 0 0 0)'
          }}
        >
          {projects[activeIndex] && (
            <MainDisplay
              project={projects[activeIndex]}
              isVisible={true}
              isIntro={isIntro}
              introDelayMs={introContentDelayMs}
              isWheeling={isWheeling}
            />
          )}
        </motion.div>

        {/* 스크롤을 위한 더미 컨텐츠 - 각 프로젝트마다 화면 높이만큼 공간 확보 */}
        <div className="bg-white" style={{ height: `${projects.length * 100}vh`, minHeight: '100vh' }}>
          {/* 각 프로젝트마다 섹션 생성하여 스크롤 감지 */}
          {projects.map((project) => (
            <div
              key={project.id}
              className="h-screen"
              style={{
                pointerEvents: 'none',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioLayout;


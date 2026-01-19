import { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import ProjectSidebar from './ProjectSidebar';
import MainDisplay from './MainDisplay';

interface PortfolioLayoutProps {
  projects: Project[];
  onProjectChange?: (project: Project | null) => void;
}

const PortfolioLayout = ({ projects, onProjectChange }: PortfolioLayoutProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainDisplayRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const isScrollingRef = useRef(false);
  const lastWheelTimeRef = useRef(0);
  const imageAutoTransitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAutoTransitioningRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const onProjectChangeRef = useRef(onProjectChange);

  // onProjectChange ref 업데이트
  useEffect(() => {
    onProjectChangeRef.current = onProjectChange;
  }, [onProjectChange]);

  // activeIndex가 변경될 때 ref 업데이트
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

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
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleWheel = (e: WheelEvent) => {
      // 기본 스크롤 동작 방지
      e.preventDefault();
      e.stopPropagation();
      
      // 자동 전환 중이면 무시
      if (isAutoTransitioningRef.current) return;
      
      const now = Date.now();
      // 너무 빠른 연속 휠 이벤트 방지 (최소 300ms 간격)
      if (now - lastWheelTimeRef.current < 300) {
        return;
      }
      
      if (isScrollingRef.current) return;
      
      const delta = e.deltaY;
      const threshold = 10; // 휠 민감도 낮춤
      
      if (Math.abs(delta) > threshold) {
        // 기존 이미지 자동 전환 타이머 취소
        if (imageAutoTransitionRef.current) {
          clearTimeout(imageAutoTransitionRef.current);
          imageAutoTransitionRef.current = null;
          isAutoTransitioningRef.current = false;
        }
        
        isScrollingRef.current = true;
        isProgrammaticScrollRef.current = true;
        lastWheelTimeRef.current = now;
        
        const currentIndex = activeIndexRef.current;
        
        if (delta > 0) {
          // 아래로 스크롤 - 다음 썸네일
          if (currentIndex < projects.length - 1) {
            const nextIndex = currentIndex + 1;
            activeIndexRef.current = nextIndex;
            setActiveIndex(nextIndex);
            if (onProjectChangeRef.current) {
              onProjectChangeRef.current(projects[nextIndex]);
            }
            // 스크롤 위치 업데이트
            const scrollTo = (nextIndex / projects.length) * (document.documentElement.scrollHeight - window.innerHeight);
            window.scrollTo({ top: scrollTo, behavior: 'smooth' });
          }
        } else {
          // 위로 스크롤 - 이전 썸네일
          if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            activeIndexRef.current = prevIndex;
            setActiveIndex(prevIndex);
            if (onProjectChangeRef.current) {
              onProjectChangeRef.current(projects[prevIndex]);
            }
            // 스크롤 위치 업데이트
            const scrollTo = (prevIndex / projects.length) * (document.documentElement.scrollHeight - window.innerHeight);
            window.scrollTo({ top: scrollTo, behavior: 'smooth' });
          }
        }
        
        // 스크롤 완료 후 잠금 해제
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isScrollingRef.current = false;
          isProgrammaticScrollRef.current = false;
        }, 800);
      }
    };

    const handleScroll = () => {
      // 프로그래밍 방식 스크롤이나 휠 이벤트로 인한 스크롤은 무시
      if (isProgrammaticScrollRef.current || isScrollingRef.current) return;
      
      // 자동 전환 중이면 무시
      if (isAutoTransitioningRef.current) return;
      
      if (!containerRef.current) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableHeight = documentHeight - windowHeight;

      if (scrollableHeight > 0) {
        const progress = Math.min(scrollTop / scrollableHeight, 1);
        setScrollProgress(progress);

        // 각 프로젝트 섹션의 중간 지점을 기준으로 전환
        const sectionSize = 1 / projects.length;
        const newIndex = Math.min(
          Math.floor(progress / sectionSize),
          projects.length - 1
        );
        
        const currentIndex = activeIndexRef.current;
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < projects.length) {
          // 기존 이미지 자동 전환 타이머 취소
          if (imageAutoTransitionRef.current) {
            clearTimeout(imageAutoTransitionRef.current);
            imageAutoTransitionRef.current = null;
            isAutoTransitioningRef.current = false;
          }
          
          activeIndexRef.current = newIndex;
          setActiveIndex(newIndex);
          if (onProjectChangeRef.current) {
            onProjectChangeRef.current(projects[newIndex]);
          }
        }
      }
    };

    // 휠 이벤트 리스너 (passive: false로 설정하여 preventDefault 사용 가능)
    // document에 직접 추가하여 전체 페이지에서 작동
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 초기 실행

    return () => {
      document.removeEventListener('wheel', handleWheel, { capture: true } as EventListenerOptions);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [projects.length]);

  const handleProjectClick = (index: number) => {
    // 기존 이미지 자동 전환 타이머 취소
    if (imageAutoTransitionRef.current) {
      clearTimeout(imageAutoTransitionRef.current);
      imageAutoTransitionRef.current = null;
      isAutoTransitioningRef.current = false;
    }
    
    // 프로그래밍 방식 스크롤 플래그 설정
    isProgrammaticScrollRef.current = true;
    isScrollingRef.current = true;
    
    activeIndexRef.current = index;
    setActiveIndex(index);
    if (onProjectChangeRef.current) {
      onProjectChangeRef.current(projects[index]);
    }
    
    // 해당 프로젝트로 스크롤
    const scrollTo = (index / projects.length) * (document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({ top: scrollTo, behavior: 'smooth' });
    
    // 스크롤 완료 후 플래그 해제
    setTimeout(() => {
      isProgrammaticScrollRef.current = false;
      isScrollingRef.current = false;
    }, 800);
  };

  // 초기 프로젝트 설정
  useEffect(() => {
    if (onProjectChange && projects.length > 0) {
      onProjectChange(projects[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-white" ref={containerRef}>
      {/* 왼쪽 사이드바 */}
      <ProjectSidebar
        projects={projects}
        activeIndex={activeIndex}
        onProjectClick={handleProjectClick}
        scrollProgress={scrollProgress}
      />

      {/* 오른쪽 메인 영역 */}
      <div className="ml-80 min-h-screen relative">
        {/* 오른쪽 하단 메인 디스플레이 영역 (검은색 배경) */}
        <div
          ref={mainDisplayRef}
          className="fixed bottom-0 bg-black z-20"
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
            />
          )}
        </div>

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


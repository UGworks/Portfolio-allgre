import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';

interface MainDisplayProps {
  project: Project | null;
  isVisible: boolean;
  isIntro?: boolean;
  introDelayMs?: number;
  isWheeling?: boolean;
  onVideoEnd?: () => void;
}

const MainDisplay = ({ project, isVisible, isIntro = false, introDelayMs = 0, isWheeling = false, onVideoEnd }: MainDisplayProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoOpacity, setVideoOpacity] = useState(1);
  const prevProjectIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (videoRef.current && project?.video && isVisible) {
      const video = videoRef.current;
      const projectChanged = prevProjectIdRef.current !== project.id;
      prevProjectIdRef.current = project.id;
      
      // 프로젝트가 변경되면 비디오 리로드
      if (projectChanged) {
        video.pause();
        video.currentTime = 0;
        setVideoOpacity(1);
        video.load();
      }
      
      // 인트로 중이면 일시정지
      if (isIntro) {
        video.pause();
        return;
      }
      
      // 비디오가 끝나기 전에 페이드아웃
      const handleTimeUpdate = () => {
        if (video.duration && video.currentTime >= video.duration - 0.5) {
          const fadeProgress = (video.duration - video.currentTime) / 0.5;
          setVideoOpacity(Math.max(0, fadeProgress));
        }
      };
      
      // 비디오 재생 함수
      const playVideo = async () => {
        try {
          video.currentTime = 0;
          setVideoOpacity(1);
          await video.play();
        } catch (error) {
          // 재생 실패 시 무시
          console.log('Video play failed:', error);
        }
      };
      
      // 휠 중이면 일시정지
      if (isWheeling) {
        video.pause();
        return;
      }
      
      // 비디오 로드 및 재생
      const handleCanPlay = async () => {
        if (!isWheeling && !isIntro && isVisible) {
          await playVideo();
        }
      };
      
      const handleCanPlayThrough = async () => {
        if (!isWheeling && !isIntro && isVisible) {
          await playVideo();
        }
      };
      
      const handleLoadedData = async () => {
        // 데이터가 로드되면 재생 시도
        if (video.readyState >= 2 && !isWheeling && !isIntro && isVisible) {
          await playVideo();
        }
      };
      
      // 이벤트 리스너 추가
      video.addEventListener('canplay', handleCanPlay, { once: true });
      video.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });
      video.addEventListener('loadeddata', handleLoadedData, { once: true });
      video.addEventListener('timeupdate', handleTimeUpdate);
      
      // 비디오가 이미 충분히 로드되어 있으면 바로 재생
      if (video.readyState >= 3) {
        // HAVE_FUTURE_DATA 이상이면 바로 재생
        playVideo();
      } else if (video.readyState >= 2) {
        // HAVE_CURRENT_DATA 이상이면 재생 시도
        playVideo();
      }
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('canplaythrough', handleCanPlayThrough);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    } else if (videoRef.current && !isVisible) {
      videoRef.current.pause();
    }
  }, [project?.id, project?.video, isVisible, isWheeling, isIntro]);

  // 프로젝트가 변경될 때 상태 리셋
  useEffect(() => {
    if (project?.image) {
      setImageLoaded(false);
    }
    if (project?.video) {
      setVideoOpacity(1);
    }
  }, [project?.id]);

  if (!project) {
    return (
      <div className="absolute inset-0 bg-black flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center p-4 md:p-8" style={{ overflow: 'hidden' }}>
      {isVisible && (
        <motion.div 
          key={project.id}
          className="w-full h-full flex items-center justify-center"
          initial={isIntro ? { scale: 1.3 } : false}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 2,
            ease: 'easeOut',
            delay: isIntro ? introDelayMs / 1000 : 0
          }}
        >
          {project.video ? (
            <video
              ref={videoRef}
              src={project.video}
              className="max-w-full max-h-full w-auto h-auto object-contain"
              style={{ 
                aspectRatio: 'auto',
                display: 'block',
                opacity: videoOpacity,
                transition: 'opacity 0.3s ease-out'
              }}
              muted
              playsInline
              onEnded={() => {
                if (onVideoEnd && !isWheeling) {
                  setVideoOpacity(0);
                  setTimeout(() => {
                    onVideoEnd();
                  }, 300);
                }
              }}
            />
          ) : (
            <img
              src={project.image}
              alt={project.title}
              className="max-w-full max-h-full w-auto h-auto object-contain"
              style={{ 
                aspectRatio: 'auto',
                display: 'block',
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.2s ease-in-out'
              }}
              onLoad={() => setImageLoaded(true)}
            />
          )}
        </motion.div>
      )}
    </div>
  );
};

export default MainDisplay;


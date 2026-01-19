import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';

interface MainDisplayProps {
  project: Project | null;
  isVisible: boolean;
}

const MainDisplay = ({ project, isVisible }: MainDisplayProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current && project?.video && isVisible) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // 재생 실패 시 무시
      });
    } else if (videoRef.current && !isVisible) {
      videoRef.current.pause();
    }
  }, [project, isVisible]);

  // 이미지가 변경될 때 로드 상태 리셋
  useEffect(() => {
    if (project?.image) {
      setImageLoaded(false);
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
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={project.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: project.video ? 0.4 : 0.2, 
            ease: 'easeInOut' 
          }}
          className="absolute inset-0 bg-black flex items-center justify-center p-8"
          style={{ overflow: 'hidden' }}
        >
          <div className="w-full h-full flex items-center justify-center">
            {project.video ? (
              <video
                ref={videoRef}
                src={project.video}
                className="max-w-full max-h-full w-auto h-auto object-contain"
                style={{ 
                  aspectRatio: 'auto',
                  display: 'block'
                }}
                loop
                muted
                playsInline
                autoPlay
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MainDisplay;


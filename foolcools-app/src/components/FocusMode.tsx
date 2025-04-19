import { useState, useEffect, useCallback } from 'react';
import './FocusMode.css';

interface FocusModeProps {
  duration: number; // Duration in minutes
  onComplete: (breathCount: number) => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [isPaused, setIsPaused] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState(0);

  // Set window to always-on-top when component mounts
  useEffect(() => {
    const setupWindow = async () => {
      try {
        // We'll handle the always-on-top feature in the future
        // For now, we just log that we'd like this feature
        console.log("Would set window to always-on-top if supported");
      } catch (e) {
        console.error("Failed to set window always-on-top:", e);
      }
    };

    setupWindow();

    return () => {
      // Clean up function
      console.log("Would restore window settings if supported");
    };
  }, []);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle breathing animation cycle
  useEffect(() => {
    if (isPaused) return;

    const breathCycle = () => {
      if (breathPhase === 'inhale') {
        setTimeout(() => setBreathPhase('hold'), 4000); // 4 seconds to inhale
      } else if (breathPhase === 'hold') {
        setTimeout(() => setBreathPhase('exhale'), 2000); // 2 seconds to hold
      } else {
        setTimeout(() => {
          setBreathPhase('inhale');
          setBreathCount(prev => prev + 1);
        }, 4000); // 4 seconds to exhale
      }
    };

    const timer = setTimeout(breathCycle, 100);
    return () => clearTimeout(timer);
  }, [breathPhase, isPaused]);

  // Handle countdown timer
  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onComplete(breathCount);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isPaused, onComplete, breathCount]);

  // Toggle pause state
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // End session early
  const endSession = useCallback(() => {
    onComplete(breathCount);
  }, [onComplete, breathCount]);

  return (
    <div className="focus-mode-container">
      <div className={`breathing-circle ${breathPhase}`}>
        <div className="inner-circle">
          <div className="timer">{formatTime(timeLeft)}</div>
          <div className="breath-instruction">
            {breathPhase === 'inhale' && '吸气...'}
            {breathPhase === 'hold' && '屏住...'}
            {breathPhase === 'exhale' && '呼气...'}
          </div>
          <div className="breath-count">
            完成呼吸: {breathCount}
          </div>
        </div>
      </div>

      <div className="focus-controls">
        <button className="control-button" onClick={togglePause}>
          {isPaused ? '继续' : '暂停'}
        </button>
        <button className="control-button end-button" onClick={endSession}>
          结束
        </button>
      </div>

      <div className="focus-tips">
        <p>呼吸节奏能帮助促进多巴胺分泌，提升专注力</p>
        <p>眨眼节奏与呼吸同步，可加强注意力"眨眼"控制</p>
      </div>
    </div>
  );
};

export default FocusMode; 
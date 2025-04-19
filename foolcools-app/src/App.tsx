import { useState, useEffect } from 'react'
import './App.css'

// Define prop types for FocusOverlay
interface FocusOverlayProps {
  duration: number;
  onComplete: () => void;
}

function App() {
  const [stage, setStage] = useState<'ready' | 'focus'>('ready');
  const [focusTime, setFocusTime] = useState(17); // Default 17 minutes (based on research)
  const [isBreathing, setIsBreathing] = useState(false);
  
  // Start focus session
  const startFocus = () => {
    setStage('focus');
  };
  
  // End focus session
  const endFocus = () => {
    setStage('ready');
  };

  return (
    <div className="app-container">
      {stage === 'ready' && (
        <div className="welcome-screen">
          <div className="app-header">
            <h1>FoolCools</h1>
            <p className="tagline">基于科学研究的专注力提升工具</p>
          </div>
          
          <div className="research-summary">
            <p className="research-fact">研究表明：眨眼增加可促进多巴胺释放，提升时间感知与专注力</p>
            <p className="research-fact">仅需17分钟的内感知训练，即可显著减少"注意力眨眼"现象</p>
          </div>
          
          <div className="time-selector-container">
            <label className="time-label">
              专注时长 (分钟)
              <div className="time-buttons">
                <button 
                  className={focusTime === 5 ? 'time-button active' : 'time-button'} 
                  onClick={() => setFocusTime(5)}
                >5</button>
                <button 
                  className={focusTime === 17 ? 'time-button active' : 'time-button'} 
                  onClick={() => setFocusTime(17)}
                >17</button>
                <button 
                  className={focusTime === 25 ? 'time-button active' : 'time-button'} 
                  onClick={() => setFocusTime(25)}
                >25</button>
                <button 
                  className={focusTime === 50 ? 'time-button active' : 'time-button'} 
                  onClick={() => setFocusTime(50)}
                >50</button>
              </div>
            </label>
          </div>
          
          <button className="start-button" onClick={startFocus}>
            开始专注练习
          </button>
          
          <div className="science-citation">
            <p>基于 Current Biology 发表的专注力与眨眼研究</p>
          </div>
        </div>
      )}
      
      {stage === 'focus' && (
        <FocusOverlay 
          duration={focusTime} 
          onComplete={endFocus} 
        />
      )}
    </div>
  )
}

// Focus Overlay Component
const FocusOverlay: React.FC<FocusOverlayProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [blinkCount, setBlinkCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
          setBlinkCount(prev => prev + 1);
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
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isPaused, onComplete]);

  // Toggle pause state
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  return (
    <div className={`focus-overlay ${breathPhase}`}>
      <div className="focus-content">
        <div className="focus-timer">{formatTime(timeLeft)}</div>
        
        <div className="breath-indicator">
          <div className="breath-circle">
            <div className="breath-text">
              {breathPhase === 'inhale' && '吸气...'}
              {breathPhase === 'hold' && '屏息...'}
              {breathPhase === 'exhale' && '呼气...'}
            </div>
            <div className="blink-reminder">请跟随呼吸节奏眨眼</div>
          </div>
        </div>
        
        <div className="focus-stats">
          <div className="stat">
            <span className="stat-value">{blinkCount}</span>
            <span className="stat-label">次眨眼</span>
          </div>
        </div>
        
        <div className="focus-controls">
          <button className="control-btn" onClick={togglePause}>
            {isPaused ? '继续' : '暂停'}
          </button>
          <button className="control-btn" onClick={onComplete}>
            结束
          </button>
        </div>
      </div>
      
      <div className="focus-tip">
        眨眼会促进多巴胺释放，增强专注力和时间感知
      </div>
    </div>
  );
};

export default App

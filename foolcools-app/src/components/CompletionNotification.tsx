import { useEffect, useState } from 'react';
import './CompletionNotification.css';

interface CompletionNotificationProps {
  duration: number; // Focus duration in minutes
  breathCount: number; // Number of complete breath cycles
  onDismiss: () => void;
}

const CompletionNotification: React.FC<CompletionNotificationProps> = ({
  duration,
  breathCount,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in animation
    setIsVisible(true);
    
    // Auto dismiss after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 500); // Wait for fade out animation
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`completion-notification ${isVisible ? 'visible' : ''}`}>
      <div className="notification-content">
        <div className="success-icon">✓</div>
        <h2>恭喜完成专注!</h2>
        
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">专注时长</span>
            <span className="stat-value">{duration} 分钟</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">呼吸次数</span>
            <span className="stat-value">{breathCount} 次</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">多巴胺释放</span>
            <span className="stat-value">🧠 ⬆️</span>
          </div>
        </div>
        
        <p className="science-note">
          科学表明，规律的深呼吸和注意力"眨眼"训练能有效提升专注力和学习效率
        </p>
        
        <button className="dismiss-button" onClick={onDismiss}>
          返回首页
        </button>
      </div>
    </div>
  );
};

export default CompletionNotification; 
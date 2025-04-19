import { useState, useEffect } from 'react';
import './SearchTask.css';

interface SearchTaskProps {
  onComplete: () => void;
  targetLetters: string[]; // Letters to find (e.g., ["f", "c"])
}

// Generate random string of characters
const generateRandomString = (length: number, targetLetters: string[]) => {
  const characters = 'abdeghijklmnopqrstuvwxyz0123456789'; // Excluding f and c for control
  let result = '';
  
  // First generate a string without target letters
  for (let i = 0; i < length - targetLetters.length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  // Now insert each target letter exactly once at random positions
  for (const letter of targetLetters) {
    const position = Math.floor(Math.random() * result.length);
    result = result.slice(0, position) + letter + result.slice(position);
  }
  
  return result;
};

// Split long random string into a grid
const formatStringAsGrid = (str: string, rowLength: number) => {
  const rows = [];
  for (let i = 0; i < str.length; i += rowLength) {
    rows.push(str.slice(i, i + rowLength));
  }
  return rows;
};

const SearchTask: React.FC<SearchTaskProps> = ({ onComplete, targetLetters }) => {
  const [randomStrings, setRandomStrings] = useState<string[]>([]);
  const [selectedCharIndices, setSelectedCharIndices] = useState<Set<string>>(new Set());
  const [correctCount, setCorrectCount] = useState(0);
  const [totalTargetCount, setTotalTargetCount] = useState(targetLetters.length);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Generate new random string grid when component mounts
  useEffect(() => {
    const gridString = generateRandomString(150, targetLetters);
    const grid = formatStringAsGrid(gridString, 15); // 15 characters per row
    setRandomStrings(grid);
    setTotalTargetCount(targetLetters.length); // Exactly one of each target letter
  }, [targetLetters]);
  
  const handleCharClick = (rowIndex: number, charIndex: number, char: string) => {
    const key = `${rowIndex}-${charIndex}`;
    const newSelectedIndices = new Set(selectedCharIndices);
    
    if (newSelectedIndices.has(key)) {
      newSelectedIndices.delete(key);
      if (targetLetters.includes(char)) {
        setCorrectCount(prevCount => prevCount - 1);
      }
    } else {
      newSelectedIndices.add(key);
      if (targetLetters.includes(char)) {
        const newCorrectCount = correctCount + 1;
        setCorrectCount(newCorrectCount);
        
        // If all targets found, mark task as complete
        if (newCorrectCount >= totalTargetCount) {
          setIsCompleted(true);
        }
      }
    }
    
    setSelectedCharIndices(newSelectedIndices);
  };
  
  return (
    <div className="search-task-container">
      <div className="search-instructions">
        <h3>寻找字母任务</h3>
        <p>
          请在下面的字符网格中找出
          {targetLetters.map((letter, index) => (
            <span key={index} className="target-letter">"{letter}"{index < targetLetters.length - 1 ? ' 和 ' : ''}</span>
          ))}
          字母。每个字母只出现一次。
        </p>
        <div className="progress">
          已找到: {correctCount} / {totalTargetCount}
        </div>
      </div>
      
      <div className="character-grid">
        {randomStrings.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {Array.from(row).map((char, charIndex) => {
              const key = `${rowIndex}-${charIndex}`;
              const isSelected = selectedCharIndices.has(key);
              const isTarget = targetLetters.includes(char);
              
              return (
                <span
                  key={key}
                  className={`grid-char ${isSelected ? 'selected' : ''} ${isSelected && isTarget ? 'correct' : ''} ${isSelected && !isTarget ? 'incorrect' : ''}`}
                  onClick={() => handleCharClick(rowIndex, charIndex, char)}
                >
                  {char}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      
      {isCompleted && (
        <div className="completion-message">
          <h3>很棒！你找到了所有目标字母！</h3>
          <p>这个练习可以帮助激活你的大脑并提高专注力。</p>
          <button onClick={onComplete}>开始专注</button>
        </div>
      )}
    </div>
  );
};

export default SearchTask; 
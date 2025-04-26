import { useState, FC } from 'react';
import styles from '../styles/Counter.module.css';

interface CounterProps {
  initialCount?: number;
  step?: number;
}

const Counter: FC<CounterProps> = ({ initialCount = 0, step = 1 }) => {
  const [count, setCount] = useState<number>(initialCount);

  const increment = (): void => {
    setCount((prevCount) => prevCount + step);
  };

  const decrement = (): void => {
    setCount((prevCount) => prevCount - step);
  };

  const reset = (): void => {
    setCount(initialCount);
  };

  return (
    <div className={styles.counter}>
      <h3>TypeScript Counter</h3>
      <p>Count: {count}</p>
      <div className={styles.buttons}>
        <button 
          className={styles.button} 
          onClick={increment}
          aria-label="Increment"
        >
          +
        </button>
        <button 
          className={styles.button} 
          onClick={decrement}
          aria-label="Decrement"
        >
          -
        </button>
        <button 
          className={styles.resetButton} 
          onClick={reset}
          aria-label="Reset"
        >
          Reset
        </button>
      </div>
      <div className={styles.info}>
        <p>Initial: {initialCount}</p>
        <p>Step: {step}</p>
      </div>
    </div>
  );
};

export default Counter;

import { useState } from 'react';
import styles from '../styles/Counter.module.css';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.counter}>
      <h3>Component Counter</h3>
      <p>Count: {count}</p>
      <div className={styles.buttons}>
        <button 
          className={styles.button} 
          onClick={() => setCount(count + 1)}
        >
          +
        </button>
        <button 
          className={styles.button} 
          onClick={() => setCount(count - 1)}
        >
          -
        </button>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTodos, 
  addTodo, 
  toggleTodo, 
  removeTodo, 
  selectTodos, 
  selectTodosStatus, 
  selectTodosError 
} from '../store/slices/todosSlice';
import styles from './TodoList.module.css';

export function TodoList() {
  const dispatch = useDispatch();
  const todos = useSelector(selectTodos);
  const status = useSelector(selectTodosStatus);
  const error = useSelector(selectTodosError);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch(addTodo(newTodo));
      setNewTodo('');
    }
  };

  let content;

  if (status === 'loading') {
    content = <div className={styles.loading}>Loading...</div>;
  } else if (status === 'failed') {
    content = <div className={styles.error}>{error}</div>;
  } else {
    content = (
      <ul className={styles.list}>
        {todos.map((todo) => (
          <li key={todo.id} className={styles.item}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch(toggleTodo(todo.id))}
              className={styles.checkbox}
            />
            <span className={todo.completed ? styles.completed : ''}>
              {todo.text}
            </span>
            <button
              onClick={() => dispatch(removeTodo(todo.id))}
              className={styles.removeButton}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={styles.todoList}>
      <h2 className={styles.title}>Todo List</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className={styles.input}
        />
        <button type="submit" className={styles.addButton}>
          Add
        </button>
      </form>
      
      {content}
    </div>
  );
}

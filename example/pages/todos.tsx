import React, { useState, useEffect } from 'react';
import { useRouter } from '../router';
import styles from './todos.module.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodosPage() {
  const { navigate } = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const response = await fetch('/api/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodo })
      });
      const todo = await response.json();
      setTodos(prev => [...prev, todo]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  }

  async function toggleTodo(todo: Todo) {
    try {
      const response = await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: todo.id, completed: !todo.completed })
      });
      const updatedTodo = await response.json();
      setTodos(prev => prev.map(t => t.id === todo.id ? updatedTodo : t));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  }

  async function deleteTodo(id: number) {
    try {
      await fetch(`/api/todos?id=${id}`, { method: 'DELETE' });
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Todo List</h1>
        <p className={styles.description}>
          A simple todo list using Next-Lite's API routes
        </p>

        <form onSubmit={addTodo} className={styles.todoForm}>
          <input
            type="text"
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Add Todo</button>
        </form>

        {loading ? (
          <p className={styles.description}>Loading todos...</p>
        ) : (
          <ul className={styles.todoList}>
            {todos.map(todo => (
              <li key={todo.id} className={styles.todoItem}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                  className={styles.checkbox}
                />
                <span className={`${styles.todoText} ${todo.completed ? styles.completed : ''}`}>
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.navigation}>
          <button onClick={() => navigate('/')} className={styles.button}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

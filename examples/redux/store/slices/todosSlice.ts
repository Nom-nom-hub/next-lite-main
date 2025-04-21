import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Define the Todo type
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// Define the state type
interface TodosState {
  items: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Define the initial state
const initialState: TodosState = {
  items: [],
  status: 'idle',
  error: null,
};

// Create async thunk for fetching todos
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
  const data = await response.json();
  return data.map((todo: any) => ({
    id: todo.id,
    text: todo.title,
    completed: todo.completed,
  }));
});

// Create async thunk for adding a todo
export const addTodoAsync = createAsyncThunk(
  'todos/addTodo',
  async (text: string) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: text,
        completed: false,
        userId: 1,
      }),
    });
    const data = await response.json();
    return {
      id: data.id,
      text: data.title,
      completed: data.completed,
    };
  }
);

// Create the slice
export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: Date.now(),
        text: action.payload,
        completed: false,
      };
      state.items.push(newTodo);
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.items.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    removeTodo: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(todo => todo.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch todos';
      })
      .addCase(addTodoAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

// Export actions
export const { addTodo, toggleTodo, removeTodo } = todosSlice.actions;

// Export selectors
export const selectTodos = (state: RootState) => state.todos.items;
export const selectTodosStatus = (state: RootState) => state.todos.status;
export const selectTodosError = (state: RootState) => state.todos.error;

// Export reducer
export default todosSlice.reducer;

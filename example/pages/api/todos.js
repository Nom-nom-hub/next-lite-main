// In-memory storage for todos
let todos = [
  { id: 1, text: 'Learn Next-Lite', completed: false },
  { id: 2, text: 'Build an app', completed: false },
];

module.exports = {
  get(req, res) {
    res.json(todos);
  },

  post(req, res) {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const newTodo = {
      id: todos.length + 1,
      text,
      completed: false
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
  },

  put(req, res) {
    const { id, completed } = req.body;
    
    if (typeof id !== 'number' || typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const todo = todos.find(t => t.id === id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todo.completed = completed;
    res.json(todo);
  },

  del(req, res) {
    const id = parseInt(req.query.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const initialLength = todos.length;
    todos = todos.filter(t => t.id !== id);

    if (todos.length === initialLength) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(204).send('');
  }
};

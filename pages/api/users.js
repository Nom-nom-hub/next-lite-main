// Sample users data
const users = [
  {
    id: 1,
    username: "johndoe",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: 2,
    username: "janedoe",
    name: "Jane Doe",
    email: "jane@example.com",
    role: "user",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    id: 3,
    username: "bobsmith",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "editor",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg"
  }
];

// Simulated authentication data
const authData = {
  validCredentials: [
    { username: "johndoe", password: "password123" },
    { username: "janedoe", password: "password123" },
    { username: "bobsmith", password: "password123" }
  ]
};

// API handler
module.exports = (req, res) => {
  const { method, query, body } = req;
  
  // GET user by ID or username
  if (method === 'GET') {
    // If id is provided, return a single user
    if (query.id) {
      const user = users.find(u => u.id === parseInt(query.id));
      
      if (user) {
        // Don't return sensitive information
        const { password, ...safeUser } = user;
        return res.json(safeUser);
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    }
    
    // If username is provided, return a single user
    if (query.username) {
      const user = users.find(u => u.username === query.username);
      
      if (user) {
        // Don't return sensitive information
        const { password, ...safeUser } = user;
        return res.json(safeUser);
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    }
    
    // Return all users (with limited information)
    const safeUsers = users.map(({ id, username, name, role, avatar }) => ({
      id, username, name, role, avatar
    }));
    
    return res.json(safeUsers);
  }
  
  // POST for login
  if (method === 'POST' && query.action === 'login') {
    const { username, password } = body;
    
    // Check if credentials are valid
    const isValid = authData.validCredentials.some(
      cred => cred.username === username && cred.password === password
    );
    
    if (isValid) {
      const user = users.find(u => u.username === username);
      const { password, ...safeUser } = user;
      
      return res.json({
        success: true,
        user: safeUser,
        token: `simulated-jwt-token-${username}-${Date.now()}`
      });
    } else {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
};

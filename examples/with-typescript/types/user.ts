export interface User {
  name: string;
  role: 'admin' | 'user' | 'visitor';
  isLoggedIn: boolean;
  lastLogin?: Date;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'visitor';
}

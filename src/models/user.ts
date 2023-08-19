import knexInstance from '../services/database';

export interface User {
  userId: number;
  name: string;
  age: number;
  active: boolean;
  email: string | null;
}

export const Users = () => knexInstance<User>('users');

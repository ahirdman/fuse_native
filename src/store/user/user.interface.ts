export interface UserState {
  user: User | null;
}

export interface User {
  email: string;
  name: string;
}

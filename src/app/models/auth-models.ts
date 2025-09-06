export interface User {
  id?: string;  
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
  password?: String;
}

export interface UserProfile{
  id?: string;  
  name: string;
  email: string;
  role: string;  
  isActive: boolean;
  createdAt: Date;
  updatedAt:  Date;
}


export interface PagedResult<T> {
  items: T[];
  totalItems: number;
  page: number;
  size: number;
  total: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;

}

export interface AuthResponse {
  user: User;
  token: string;
}

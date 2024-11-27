export interface AuthtokenResult {
  id: string;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

export interface Authtoken {
  id: string;
  username: string;
  email: string;
  isExpired: boolean;
}

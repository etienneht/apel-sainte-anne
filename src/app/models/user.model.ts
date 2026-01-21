export type UserRole = 'admin' | 'user';

export interface AppUser {
  uid: string;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  totalHours: number;
  phoneNumber?: string;
  createdAt: Date;
}

export interface IAdmin {
  _id: string;
  name: string;
  email: string;
  passwordHash?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AdminLoginDto {
  email: string;
  password: string;
}

export class Account {
  id!: string;
  title!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  role!: string;
  jwtToken!: string;
  isVerified?: boolean;
  created?: string;
  updated?: string;

  // used only in the frontend accounts table
  isDeleting?: boolean;
}
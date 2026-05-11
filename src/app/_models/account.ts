export class Account {
  id!: string;
  title!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  role!: string;
  jwtToken?: string;
  isVerified?: boolean;
  acceptTerms?: boolean | number;
}
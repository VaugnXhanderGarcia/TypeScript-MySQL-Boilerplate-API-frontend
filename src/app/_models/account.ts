export class Account {
  id!: string;
  title!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  role!: string;
  jwtToken?: string;
  verified?: Date;
  acceptTerms?: boolean | number;
  isDeleting?: boolean;
}
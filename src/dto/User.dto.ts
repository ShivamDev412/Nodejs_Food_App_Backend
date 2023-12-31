import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateCustomerInput {
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: "Phone number is required" })
  @Length(11, 11, { message: "Phone number must be 11 digits" })
  phone: string;

  @IsNotEmpty({ message: "Password is required" })
  @Length(6, 20)
  password: string;

  @IsNotEmpty({ message: "First name is required" })
  @Length(1, 12, { message: "First name must be between 1 and 12 characters" })
  firstName: string;

  @IsNotEmpty({ message: "Last name is required" })
  @Length(1, 12, { message: "Last name must be between 1 and 12 characters" })
  lastName: string;
}
export class LoginCustomerInput {
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  @Length(6, 20)
  password: string;
}
export interface ResendOtpInput {
  email: string;
  phone: string;
}
export interface EditCustomerInput {
  firstName: string;
  lastName: string;
  address: string;
}
export interface  OrderInputs {
  _id: string;
  unit: number;
}
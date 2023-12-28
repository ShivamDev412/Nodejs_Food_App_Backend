import mongoose, { Schema, Model, Document } from "mongoose";

interface UserType extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  salt: string;
  phone: string;
  address: string;
  verified: boolean;
  otp: number;
  otp_expiry: Date;
  lat: number;
  lng: number;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String, required: true },
    salt: { type: String, required: true },
    address: { type: String },
    verified: { type: Boolean, required: true },
    otp: { type: Number, required: true },
    otp_expiry: { type: Date, required: true },
    lat: { type: Number },
    lng: { type: Number },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret, options) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  }
);

const UserModel: Model<UserType> = mongoose.model<UserType>("User", UserSchema);
export default UserModel;

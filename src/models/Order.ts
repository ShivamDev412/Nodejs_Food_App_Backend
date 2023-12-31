import mongoose, { Document, Schema } from "mongoose";
export interface OrderType extends Document {
  orderId: string;
  items: [any];
  totalAmount: number;
  orderDate: Date;
  paidThrough: string;
  paymentResponse: string;
  orderStatus: string;
}
const OrderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    items: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "food",
        },
        unit: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    orderDate: {
      type: Date,
    },
    paidThrough: {
      type: String,
    },
    paymentResponse: {
      type: String,
    },
    orderStatus: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v, delete ret.createdAt, delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);
const OrderModel = mongoose.model<OrderType>("order", OrderSchema);
export default OrderModel;

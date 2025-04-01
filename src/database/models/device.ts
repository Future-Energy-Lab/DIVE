import mongoose from "mongoose";

const DeviceSchema = new mongoose.Schema(
  {
    didUrl: String,
  },
  {
    strict: false,
    toObject: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const DeviceModel = mongoose.model("Device", DeviceSchema);

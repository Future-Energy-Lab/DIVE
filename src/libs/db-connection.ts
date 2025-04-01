import mongoose from "mongoose";

export type DbOptions = {
  DATABASE_URL: string;
};

type Mongoose = typeof mongoose;
let _mongo: Mongoose;
export async function connect(options: DbOptions): Promise<Mongoose> {
  _mongo = await mongoose.connect(options.DATABASE_URL);
  return _mongo;
}

export async function close(): Promise<void> {
  await _mongo?.connection.close();
}

export function getConnection(): Mongoose {
  if (!_mongo) throw new Error("Mongo is not connected");
  return _mongo;
}

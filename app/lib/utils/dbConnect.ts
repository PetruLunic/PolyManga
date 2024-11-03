import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

let cached: { conn?: typeof mongoose; promise?: Promise<typeof mongoose> | null } = {}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Successfully connected to the DB!");
      console.log("MONGODB_URI: ", MONGODB_URI);
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
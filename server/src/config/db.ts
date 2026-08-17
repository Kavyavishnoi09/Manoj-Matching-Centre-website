import mongoose from 'mongoose';
import { config } from './index.js';

let memoryServer: { start: () => Promise<void>; getUri: () => string } | null = null;

export async function connectDB(): Promise<void> {
  let uri = config.mongoUri;

  if (!uri) {
    if (!memoryServer) {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      console.log('No MONGO_URI found — starting in-memory MongoDB for development...');
      const opts: Record<string, unknown> = { timeoutMs: 30000 };
      if (process.env.MONGOMS_SYSTEM_BINARY) opts.binary = { systemBinary: process.env.MONGOMS_SYSTEM_BINARY };
      const instance = await MongoMemoryServer.create(opts);
      uri = instance.getUri();
      memoryServer = {
        start: async () => {},
        getUri: () => instance.getUri(),
      };
    } else {
      uri = memoryServer.getUri();
    }
  }

  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected: ${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}

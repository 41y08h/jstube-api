import IUser from "../interfaces/User";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: "development" | "production";
      AUTH_REDIRECT_URL: string;
      JWT_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      MONGO_URI: string;
      CLIENT_URL: string;
    }
  }
  namespace Express {
    interface Response {
      clientError(message: string, code?: number): Error;
    }
    interface Request {
      currentUser: IUser | undefined;
    }
  }
}

export {};

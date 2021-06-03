import IUser from "../interfaces/IUser";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: "development" | "production";
      AUTH_REDIRECT_URL: string;
      JWT_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      CLIENT_URL: string;
    }
  }
  namespace Express {
    interface Response {
      clientError(message: string, code?: number): Error;
    }
    interface Request {
      currentUser?: IUser;
    }
  }
  namespace passport {
    interface Profile {
      _json: {
        sub: string;
        name: string;
        given_name: string;
        picture: string;
        email: string;
        email_verified: boolean;
        locale: string;
      };
    }
  }
}

export {};

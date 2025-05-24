declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
      };
    }
  }
}

// This export is needed to make the file a module
export {};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string | null;
      role: string; // ✅ Add the role property
      image: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role: string; // ✅ Add the role property
  }
}

// console.log(NextAuth);

// @ts-nocheck
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/api$/, '') + "/api/auth",
});

export const { signIn, signUp, signOut, useSession, forgetPassword, resetPassword } = authClient;

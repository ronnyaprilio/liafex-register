import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "./app/lib/mongodb";
import User from "./app/lib/models/User";
import bcrypt from "bcryptjs";
import { checkRateLimit } from "./app/lib/rate-limit";
import axios from "axios";

class RateLimitError extends CredentialsSignin {
  constructor() {
    super();
    this.code = "RATE_LIMIT";
  }
}

async function verifyRecaptcha(token: string | undefined) {
  if (!token) return false;
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) throw new Error("RECAPTCHA_SECRET_KEY not set");

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: { secret, response: token },
      }
    );
    const data = response.data as { success: boolean; score: number };
    return data.success && data.score >= 0.5;
  } catch (err) {
    console.error("reCAPTCHA verify error:", err);
    return false;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as typeof user & { id: string; email: string; emailVerified: null };
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as typeof session.user;
      }
      return session;
    },
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { type: "text", placeholder: "Username" },
        password: { type: "password", placeholder: "Password" },
        recaptchaToken: { type: "text" },
      },
      async authorize(credentials, request) {
        await connectDB();

        const ip = request?.headers?.get("x-forwarded-for") || "unknown";
        const { allowed } = checkRateLimit(ip);
        if (!allowed) throw new RateLimitError();

        const recaptchaToken = String(credentials?.recaptchaToken || "");
        const recaptchaValid = await verifyRecaptcha(recaptchaToken);
        if (!recaptchaValid) throw new Error("reCAPTCHA verification failed");

        const username = String(credentials?.username || "");
        const password = String(credentials?.password || "");

        if (!username || !password) return null;

        const user = await User.findOne({ username });
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        return { id: user._id.toString(), 
          name: user.username,
          email: user.email || `${user.username}@example.com`,
          emailVerified: null, };
      },
    }),
  ],
});
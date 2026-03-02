import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { CredentialsSignin } from "next-auth";
import { connectDB } from "./app/lib/mongodb";
import User from "./app/lib/models/User";
import bcrypt from "bcryptjs";
import { checkRateLimit } from "./app/lib/rate-limit";

class RateLimitError extends CredentialsSignin {
  constructor() {
    super();
    this.code = "RATE_LIMIT";
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },

      async authorize(credentials, request) {
        await connectDB();

        const ip =
          request?.headers?.get("x-forwarded-for") ||
          "unknown";

        const { allowed } = checkRateLimit(ip);

        if (!allowed) {
          throw new RateLimitError();
        }

        if (
          !credentials ||
          typeof credentials.username !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        const user = await User.findOne({
          username: credentials.username,
        });

        if (!user) return null;

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isMatch) return null;

        return {
          id: user._id.toString(),
          name: user.username,
        };
      },
    }),
  ],
});
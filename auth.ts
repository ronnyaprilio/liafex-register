import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {}
      },
      async authorize(credentials) {
        if (
          credentials?.username === process.env.USERNAME &&
          credentials?.password === process.env.PASSWORD
        ) {
          return { id: "1", name: "Admin" }
        }
        return null
      }
    })
  ]
})
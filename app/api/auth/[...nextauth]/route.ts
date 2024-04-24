import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"

export const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID!,
      clientSecret: process.env.FACEBOOK_SECRET!
    }),
    Credentials({
      credentials: {
        email: {
          label: "email",
          type: "email",
          required: true
        },
        username: {
          label: "username",
          type: "text",
          required: true
        },
        password: {
          label: "password",
          type: "password",
          required: true
        }

      },
      async authorize(credentials) {
        return null;
      }
    })
  ],
});

export { handler as GET, handler as POST }
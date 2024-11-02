import NextAuth, {DefaultSession, Session} from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"
import User from "@/app/lib/models/User";
import {User as IUser, UserPreferences} from "@/app/lib/graphql/schema"
import dbConnect from "@/app/lib/utils/dbConnect";
import {nanoid} from "nanoid";
import {UserRole, UserSession} from "@/app/types";
import {AdapterUser} from "@auth/core/adapters";

const AUTH_PATH = "/api/auth";

// Extending User, Session interfaces
declare module 'next-auth' {
  interface Session {
    user: UserSession & DefaultSession['user'];
  }

  interface User extends UserSession {}
}

// const getJwtMaxAge = (role: UserRole): number => {
//   switch (role) {
//     case 'ADMIN':
//       return 24 * 60 * 60; // 1 day
//     case 'MODERATOR':
//       return 2 * 24 * 60 * 60; // 2 days
//     case 'USER':
//     default:
//       return 20 * 24 * 60 * 60; // 20 days
//   }
// };
//
// const INACTIVITY_LIMIT = 2 * 24 * 60 * 60; // 2 days

export const { handlers, signIn, auth } = NextAuth({
  basePath: AUTH_PATH,
  trustHost: true,
  pages: {
    signIn: "/unauthorized",
    signOut: "/"
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      async profile(profile) {
        await dbConnect();

        const user: IUser | null = await User.findOne({ email: profile.email }, "id name email image role preferences").lean();

        if (!user) {
          const name = `${profile.name}_${nanoid()}`;

          const newUser = new User({
            name,
            email: profile.email,
            image: profile.picture,
            provider: "GOOGLE",
            emailVerified: true
          });

          await newUser.save();

          return {
            userId: newUser.id,
            name: newUser.name,
            email: newUser.email,
            image: newUser.image,
            role: newUser.role,
            preferences: newUser.preferences,
          };
        }

        return {userId: user.id, ...user};
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID!,
      clientSecret: process.env.FACEBOOK_SECRET!,
      async profile(profile) {
        await dbConnect();

        const user: IUser | null = await User.findOne({ email: profile.email }, "id name email image role preferences").lean();

        if (!user) {
          const name = `${profile.name}_${nanoid()}`;

          const newUser = new User({
            name,
            email: profile.email,
            image: profile.picture.data.url,
            provider: "FACEBOOK",
            emailVerified: true
          });

          await newUser.save();

          return {
            userId: newUser.id,
            name: newUser.name,
            email: newUser.email,
            image: newUser.image,
            role: newUser.role,
            preferences: newUser.preferences,
          };
        }

        return {userId: user.id, ...user};
      }
    }),
    Credentials({
      credentials: {
        id: {
          label: "id",
          type: "text",
          required: true
        },
        email: {
          label: "email",
          type: "email",
          required: true
        },
        name: {
          label: "username",
          type: "text",
          required: true
        },
        image: {
          label: "image",
          type: "text",
          required: false
        },
        role: {
          label: "role",
          type: "text",
          required: true
        },
        preferences: {
          label: "preferences",
          type: "text",
          required: false
        }
      },
      async authorize(credentials) {
        
        return {
          userId: credentials.id as string,
          name: credentials.name as string,
          email: credentials.email as string,
          role: credentials.role as UserRole,
          image: credentials.image as string,
          preferences: JSON.parse(credentials.preferences as string) as UserPreferences,
        };
      }
    })
  ],
  session: {
    maxAge: 10 * 24 * 60 * 60, // 10 days in seconds
  },
  callbacks: {
    async jwt({ token, account, user, trigger, session }) {

      if (trigger === "signIn" && user) {
        token.user = {...user,
          id: user.userId
        };
      }

      // On session update
      if (trigger === "update" && session) {
        token = {...token, user: session.user};
      }

      return token;
    },
    async session({ session, token, trigger }) {
      // console.log('Session Callback - Trigger:', trigger, 'Token:', token, 'Session:', session);
      if (token) {
        session.user = token.user as (UserSession & AdapterUser)
      }

      return session;
    }
  }
});
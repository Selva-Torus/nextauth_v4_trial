import axios from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";

export const authOptions :NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
      CredentialsProvider({
        name: "Torus",
        credentials: {
          username: { label: "Username", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials: any, req) {
          const { username, password } = credentials;
          // Add logic here to look up the user from the credentials supplied
  
          const res = await axios.post(
            "https://torus9xnestjs.gsstvl.com:3443/tp/signin",
            {
              username: username,
              password: password,
              client: "ABC",
              role: "seniordev",
              type: "c",
            }
          );
          if (res.status == 201) {
            return res.data;
          } else {
            return null;
          }
        },
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_ID as string,
        clientSecret: process.env.GOOGLE_SECRET as string,
      }),
      GitHub({
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      }),
      // ...add more providers here
    ], secret: process.env.NEXTAUTH_SECRET,
    jwt: {
      secret: process.env.NEXTAUTH_SECRET,
    },
    callbacks: {
      async signIn({ user, account }) {
        if (account?.type == "credentials") {
          return true; //false;
        } else {
          // await registerIdentityProviderUser(user, account);
          return true;
        }
      },
  
      async jwt({ token, user }:{token:any , user:any}) {
        if (token) {
          // Check if token exists
          if (user) {
            token.user = user;
            if (user.image) {
              const payload = {
                loginId: token?.name ?? "",
                firstName: token?.name ?? "",
                lastName: token?.name ?? "",
                email: token?.email ?? "",
                mobile: "",
                "2FAFlag": "N",
                role: "dhd",
                client: "djfdj",
                scope: "social profile",
              };
  
              const updatedToken = {
                ...token,
                ...payload,
              };
              const access_token = sign(
                updatedToken,
                process.env.NEXTAUTH_SECRET as string,
                {
                  expiresIn: "10m",
                }
              );
              token.acc = access_token;
              cookies().set("access_token", access_token);
            } else {
              cookies().set("access_token", user?.token);
            }
          }
        }
        return token;
      },
      async session({ session, token }: any) {
        if (token && token.user) {
          // Check if token and user exist
          session.user = token.user;
          if (token.user.image) {
            session.user.token = token.acc;
          }
        }
  
        return session;
      },
    },
  };
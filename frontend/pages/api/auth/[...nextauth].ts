import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import IAccount from "types/account";
import iToken from "types/token";
import IUser from "types/user";
import ISession from "types/session";

const DEBUG = true;

const options = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Providers.Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      id: "credentials", // <- add this line
      // name: 'credentials', // <- remove this one apparently
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        // const user = { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        if (DEBUG){
          console.log(`authorize:credentials`)
          console.log(credentials)
        }
        try{
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/local`, {
            method: 'POST',
            body: JSON.stringify({
              identifier: credentials.username,
              password: credentials.password
            })
          })
          if (DEBUG){
            console.log(`authorize:res`)
            console.log(res)
          }
          const { data: {jwt}, data: {user}} = res.json();
          
          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return Promise.resolve({...user, jwt})
          } else {
            // If you return null or false then the credentials will be rejected
            return null
            // You can also Reject this callback with an Error or with a URL:
            // throw new Error('error message') // Redirect to error page
            // throw '/path/to/redirect'        // Redirect to a URL
          }
        } catch(err) {
            // OPTION 1: Unhandled rejection
            if (DEBUG){
              console.error(`authorize:err.response.data`)
              console.error(JSON.stringify(err.response.data))
            }
            return null
            // --- --- --- --- --- --- --- --- --- --- --- --- //
            // // OPTION 2: Handled rejection
            // // If we reject with error we do redirection
            // // which we do not want to do, because we want to
            // // show errors on the same login page.
            // return Promise.reject(new Error('Error logging in'));
        }
      }, 
    })
  ],
  database: process.env.NEXT_PUBLIC_DATABASE_URL,
  session: {
    jwt: true,
  },
  debug: true,
  callbacks: {
    session: async (session: ISession, user: IUser) => {
      session.jwt = user.jwt;
      session.id = user.id;

      return Promise.resolve(session);
    },
    jwt: async (token: iToken, user: IUser, account: IAccount) => {
      const isSignIn = user ? true : false;

      if (isSignIn) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/${account.provider}/callback?access_token=${account?.accessToken}`
        );

        const data = await response.json();

        token.jwt = data.jwt;
        token.id = data.user.id;
      }

      return Promise.resolve(token);
    },
  },
};

const Auth = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);

export default Auth;

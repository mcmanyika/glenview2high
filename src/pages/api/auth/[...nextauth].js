import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import Auth0Provider from "next-auth/providers/auth0";
import CredentialsProvider from 'next-auth/providers/credentials';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../../utils/firebaseConfig'; // Adjust import to your file structure

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER, 
      
    }),
 
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          return {
            id: user.uid,
            email: user.email,
            name: user.displayName || email, // Use email if displayName is not available
          };
        } catch (error) {
          throw new Error('Invalid email or password');
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id; // Add user ID to the session object
      session.user.email = token.email; // Ensure email is added to the session
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Assign the user ID to the token
        token.email = user.email; // Assign the user email to the token
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);

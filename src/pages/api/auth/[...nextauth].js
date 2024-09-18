import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from './auth'; // Utility to verify passwords (bcrypt)
import { getUserByEmail } from '../../../../utils/firebaseConfig'; // Fetch user by email

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your-email@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Fetch user by email from the database
        const user = await getUserByEmail(credentials.email);

        // If no user found, return null
        if (!user) {
          throw new Error('No user found with this email');
        }

        // Verify password using bcrypt
        const isValid = await verifyPassword(credentials.password, user.passwordHash);

        // If password doesn't match, throw an error
        if (!isValid) {
          throw new Error('Invalid password');
        }

        // If everything is fine, return user object
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/admin/login', // Optional: Custom sign-in page
  },
  callbacks: {
    async session({ session, token, user }) {
      session.user.id = token.sub;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);

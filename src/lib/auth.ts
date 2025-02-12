import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./prisma";


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google,
    Credentials({
      
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null
 
        
        const pwHash = saltAndHashPassword(credentials.password)
 
        
        user = await getUserFromDb(credentials.email, pwHash)
 
        if (!user) {
         
          throw new Error("Invalid credentials.")
        }
 
        
        return user
      },
    }),
  ],
})

function saltAndHashPassword(password: unknown) {
  if (typeof password !== 'string') {
    throw new Error("Password must be a string.")
  }
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
}

async function getUserFromDb(email: unknown, pwHash: any): Promise<any> {
  if (typeof email !== 'string') {
    throw new Error("Email must be a string.");
  }

  
  const user = await fakeDbQuery(email);

  if (user && bcrypt.compareSync(pwHash, user.passwordHash)) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      
    };
  }

  return null;
}

// Fake database query function for demonstration purposes
async function fakeDbQuery(email: string): Promise<any> {
  // Simulate a user record from the database
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      passwordHash: bcrypt.hashSync("password123", 10), // Example hashed password
    },
  ];

  return users.find(user => user.email === email) || null;
}


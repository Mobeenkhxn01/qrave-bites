import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';


export async function POST(req : Request) {
  const body = await req.json();
  const pass = body.password;

  if (!pass?.length || pass.length < 5) {
    throw new Error('Password must be at least 5 characters');
  }

  const salt = bcrypt.genSaltSync(10);
  body.password = bcrypt.hashSync(pass, salt);

  const createdUser = await prisma.user.create({
    data: {
      ...body,
    },
  });

  return new Response(JSON.stringify(createdUser), {
    headers: { 'Content-Type': 'application/json' },
  });
}

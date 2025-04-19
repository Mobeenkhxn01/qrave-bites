import React, { use } from 'react';
import  Link  from 'next/link';
import UserTabs from '@/components/layout/UserTabs';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';


export default async function UsersPage() {
    const session = await auth();
    
      const data = await prisma.user.findMany({
        where: {
            id: session?.user.id,
        },
      });
    return (
    <section className=" py-8 relative bottom-0 mb-0 bg-white">
        
      <UserTabs />
      
      <div className="mt-8">
        {data?.length > 0 && data.map(user => (
          <div
            key={user.id}
            className="bg-gray-100 rounded-lg mb-2 p-1 px-4 flex items-center gap-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 grow">
              <div className="text-gray-900">
                {!!user.name && (<span>{user.name}</span>)}
                {!user.name && (<span className="italic">No name</span>)}
              </div>
              <span className="text-gray-500">{user.email}</span>
            </div>
            <div>
              <Link className="button" href={'/users/'+user.id}>
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>

    </section>
    );
}
'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { MenuItem } from '@prisma/client'
import { MenuItemCard } from '@/components/menu/MenuItemCard'
import { toast } from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'

export default function Menu() {
  const searchParams = useSearchParams()

  const { data: menuItems, isLoading } = useQuery<MenuItem[]>({
    queryKey: ['menuItems'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/menu-items')
        return response.data
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to load menu items')
        throw new Error('Error loading menu items')
      }
    },
    staleTime: 60 * 1000
  })

  if (isLoading)
    return (
      <div className="w-full flex justify-center py-10 text-lg text-gray-600">
        Loading menu...
      </div>
    )

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8">
      <div
        className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        xl:grid-cols-4
        gap-6 
        max-w-7xl 
        w-full
      "
      >
        {menuItems?.length ? (
          menuItems.map((item) => (
            <MenuItemCard 
              key={item.id} 
              item={item}  
              tableId={searchParams.get("table")}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No menu items available
          </div>
        )}
      </div>
    </div>
  )
}

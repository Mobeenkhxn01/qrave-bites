'use client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { MenuItem } from '@prisma/client'
import { MenuItemCard } from '@/components/menu/MenuItemCard'

export default function Menu() {
  const { data: menuItems, isLoading, isError } = useQuery<MenuItem[]>({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const response = await axios.get('/api/menu-items')
      return response.data
    },
    staleTime: 60 * 1000 // 1 minute cache
  })

  if (isLoading) return <div className="w-full flex justify-center py-8">Loading menu...</div>
  if (isError) return <div className="w-full flex justify-center py-8">Error loading menu</div>

  return (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 max-w-7xl">
        {menuItems?.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
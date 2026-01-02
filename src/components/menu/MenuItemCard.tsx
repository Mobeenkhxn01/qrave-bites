'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import { AddToCartButton } from './AddToCartButton'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

type MenuItemType = {
  id: string
  name: string
  description: string | null
  image: string | null
  price: number
  available: boolean
}

export function MenuItemCard({
  item,
  tableId
}: {
  item: MenuItemType
  tableId: string | null
}) {
  const handleClickUnavailable = () => {
    toast.error('This item is currently unavailable')
  }

  return (
    <Card
      className={`overflow-hidden transition-all rounded-xl shadow-sm hover:shadow-md ${
        !item.available ? 'opacity-60' : ''
      }`}
    >
      <CardHeader className="p-0 relative">
        <Image
          src={item.image || '/placeholder-food.jpg'}
          alt={item.name}
          width={500}
          height={350}
          className="w-full h-48 sm:h-56 object-cover"
        />

        {!item.available && (
          <Badge
            variant="destructive"
            className="absolute top-2 right-2 text-xs font-semibold"
          >
            Unavailable
          </Badge>
        )}
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg">{item.name}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {item.description}
        </p>

        <p className="font-bold mt-3 text-[#eb0029] text-lg">
          ₹{item.price.toFixed(2)}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {item.available ? (
          <AddToCartButton
            menuItemId={item.id}
            tableId={tableId}
            available={item.available}
          />
        ) : (
          <button
            onClick={handleClickUnavailable}
            className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg cursor-not-allowed"
          >
            Not Available
          </button>
        )}
      </CardFooter>
    </Card>
  )
}

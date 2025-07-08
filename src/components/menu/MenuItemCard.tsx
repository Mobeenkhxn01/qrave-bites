'use client'
import { MenuItem } from '@prisma/client'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import { AddToCartButton } from './AddToCartButton'

export function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Image
          src={item.image}
          alt={item.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg">{item.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
        <p className="font-bold mt-2">${item.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <AddToCartButton menuItemId={item.id} />
      </CardFooter>
    </Card>
  )
}
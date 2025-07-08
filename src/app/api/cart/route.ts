import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {prisma} from '@/lib/prisma'

export async function GET() {
  const session=await auth();
  if (!session?.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const cart = await prisma.cart.findFirst({
      where: { userId:session.user.id },
      include: {
        cartItems: {
          include: {
            menuItem: true
          }
        }
      }
    })

    return NextResponse.json(cart || { cartItems: [] })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const session=await auth();
  const { menuItemId } = await req.json()

  if (!session?.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Find or create cart for user
    let cart = await prisma.cart.findFirst({
      where: { userId:session.user.id }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId:session.user.id }
      })
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        menuItemId
      }
    })

    if (existingCartItem) {
      // Increment quantity if item exists
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 }
      })

      return NextResponse.json(updatedCartItem)
    } else {
      // Add new item to cart
      const newCartItem = await prisma.cartItem.create({
        data: {
          menuItemId,
          cartId: cart.id,
          quantity: 1
        },
        include: {
          menuItem: true
        }
      })

      return NextResponse.json(newCartItem)
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  
  // Validate session and user
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized - Please log in' }, 
      { status: 401 }
    );
  }

  try {
    // Validate request body
    const { menuItemId, removeAll } = await req.json();
    
    if (!menuItemId) {
      return NextResponse.json(
        { error: 'menuItemId is required' },
        { status: 400 }
      );
    }

    // Find user's cart
    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: { cartItems: true }
    });

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' }, 
        { status: 404 }
      );
    }

    // Find the specific cart item
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        menuItemId
      },
      include: {
        menuItem: true
      }
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Item not found in cart' }, 
        { status: 404 }
      );
    }

    // Handle different removal cases
    if (removeAll) {
      // Remove all quantities of this item
      await prisma.cartItem.delete({
        where: { id: cartItem.id }
      });
      
      return NextResponse.json({
        message: 'All quantities removed from cart',
        remainingItems: cart.cartItems.length - 1
      });
    } else if (cartItem.quantity > 1) {
      // Decrement quantity
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity - 1 },
        include: {
          menuItem: true
        }
      });

      return NextResponse.json({
        message: 'Quantity decreased',
        cartItem: updatedCartItem,
        newQuantity: updatedCartItem.quantity
      });
    } else {
      // Remove the item completely when quantity is 1
      await prisma.cartItem.delete({
        where: { id: cartItem.id }
      });

      return NextResponse.json({
        message: 'Item removed from cart',
        remainingItems: cart.cartItems.length - 1
      });
    }
  } catch (error) {
    console.error('Cart deletion error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to update cart',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
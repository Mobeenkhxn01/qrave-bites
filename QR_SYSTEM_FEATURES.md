# QR Restaurant Management System - Complete Feature Guide

## Overview
This comprehensive QR-based restaurant management system now includes 25+ enterprise features for complete restaurant operations management.

## NEW FEATURES ADDED

### 1. Invoice & Billing System
**Location**: `/api/invoices`
**Features**:
- Auto-generate invoices from orders
- Calculate tax automatically (5% default)
- Support for discounts and adjustments
- Invoice numbering and tracking
- Payment status tracking

**Usage**:
```typescript
import { useInvoice, useGenerateInvoice } from '@/src/hooks/useInvoice';

// Generate invoice
const { mutate: generateInvoice } = useGenerateInvoice();
generateInvoice(orderId);

// Fetch invoice
const { data: invoice } = useInvoice(orderId);
```

---

### 2. Waiter Call Bell System
**Location**: `/api/waiter-calls`
**Features**:
- Customers can call waiter from table
- Real-time waiter notifications
- Track call reasons (bill, water, service, etc.)
- Mark calls as resolved
- Dashboard for pending calls

**Usage**:
```typescript
import { useCallWaiter, useWaiterCalls, useResolveWaiterCall } from '@/src/hooks/useWaiterCalls';

// Call waiter
const { mutate: callWaiter } = useCallWaiter();
callWaiter({ tableId, restaurantId, reason: 'bill' });

// View pending calls
const { data: calls } = useWaiterCalls(restaurantId, false);

// Resolve call
const { mutate: resolve } = useResolveWaiterCall();
resolve(callId);
```

---

### 3. Staff Management System
**Location**: `/api/staff`
**Features**:
- Create and manage staff members
- Different roles: MANAGER, CHEF, WAITER, CASHIER, DELIVERY
- Staff assignment to orders
- Track staff by phone number
- Performance tracking ready

**Usage**:
```typescript
import { useStaff, useCreateStaff } from '@/src/hooks/useStaff';

// Add staff
const { mutate: addStaff } = useCreateStaff();
addStaff({ name: 'John', phone: '9999999999', role: 'WAITER' });

// View staff
const { data: staff } = useStaff();
```

---

### 4. Table Management & Occupancy Tracking
**Location**: `/api/tables`
**Features**:
- Table status: AVAILABLE, OCCUPIED, RESERVED, CLEANING
- Table capacity management
- Track table usage statistics
- Last occupied time tracking
- Dashboard view with active orders

**Usage**:
```typescript
import { useTables, useUpdateTableStatus } from '@/src/hooks/useTables';

// View tables
const { data: tables } = useTables(restaurantId, 'dashboard');

// Update table status
const { mutate: updateStatus } = useUpdateTableStatus();
updateStatus({ id: tableId, action: 'markOccupied' });
```

---

### 5. Item Modifiers & Customization
**Location**: `/api/item-modifiers`
**Features**:
- Create modifiers for menu items (Size, Toppings, etc.)
- Price variations for each option
- Required vs optional modifiers
- Support in order items
- Customer customization tracking

**Usage**:
```typescript
// Add modifier to menu item
const modifier = await axios.post('/api/item-modifiers', {
  menuItemId: '123',
  name: 'Size',
  options: ['Small', 'Medium', 'Large'],
  priceVariance: [0, 50, 100],
  isRequired: true
});

// Fetch modifiers for item
const modifiers = await axios.get(`/api/item-modifiers?menuItemId=123`);
```

---

### 6. Customer Reviews & Ratings
**Location**: `/api/reviews`
**Features**:
- 1-5 star ratings
- Photo uploads
- Comment system
- User profile tracking
- Average rating calculation ready

**Usage**:
```typescript
import { useMenuItemReviews, useCreateReview } from '@/src/hooks/useReviews';

// Post review
const { mutate: postReview } = useCreateReview();
postReview({ 
  menuItemId: '123', 
  rating: 5, 
  comment: 'Excellent!',
  photos: []
});

// View reviews
const { data: reviews } = useMenuItemReviews(menuItemId);
```

---

### 7. Promo Codes & Discounts
**Location**: `/api/promo-codes`
**Features**:
- Fixed amount or percentage discounts
- Usage limits per code
- Validity date range
- Minimum order amount requirement
- Real-time validation

**Usage**:
```typescript
import { useValidatePromoCode, useCreatePromoCode } from '@/src/hooks/usePromoCodes';

// Validate promo code
const { data: promoCode } = useValidatePromoCode(restaurantId, 'SUMMER2024');

// Create promo code
const { mutate: create } = useCreatePromoCode();
create({
  code: 'SUMMER2024',
  discountType: 'percentage',
  discountValue: 20,
  validFrom: '2024-06-01',
  validUntil: '2024-08-31'
});
```

---

### 8. Table Reservations System
**Location**: `/api/reservations`
**Features**:
- Book tables in advance
- Guest count and time tracking
- Customer contact information
- Reservation notes
- Status management (confirmed, completed, cancelled)
- Table availability checking

**Usage**:
```typescript
import { useReservations, useCreateReservation } from '@/src/hooks/useReservations';

// Create reservation
const { mutate: book } = useCreateReservation();
book({
  restaurantId: '123',
  customerName: 'John Doe',
  customerPhone: '9999999999',
  numberOfGuests: 4,
  reservationTime: '2024-06-15T19:00:00'
});

// View reservations
const { data: reservations } = useReservations(restaurantId);
```

---

### 9. Loyalty Program
**Location**: `/api/loyalty-program`
**Features**:
- Points per rupee configuration
- Redemption value setting
- Member tracking by phone
- Points accumulation
- Program activation/deactivation

**Usage**:
```typescript
// Check member points
const member = await axios.get(
  `/api/loyalty-program?restaurantId=123&action=member&phoneNumber=9999999999`
);

// Add points to member
await axios.put('/api/loyalty-program', {
  action: 'addPoints',
  phoneNumber: '9999999999',
  restaurantId: '123',
  points: 100
});
```

---

## DATABASE SCHEMA ENHANCEMENTS

### New Enums Added:
- `OrderType`: DINE_IN, TAKEAWAY, DELIVERY
- `PaymentMethod`: CARD, UPI, CASH, WALLET
- `TableStatus`: AVAILABLE, OCCUPIED, RESERVED, CLEANING
- `StaffRole`: MANAGER, CHEF, WAITER, CASHIER, DELIVERY

### New Collections:
- `ItemModifier` - Menu item customization options
- `OrderItemModifier` - Selected modifiers for order items
- `Review` - Customer ratings and reviews
- `Invoice` - Generated bills/invoices
- `Staff` - Restaurant staff management
- `StaffAssignment` - Order-to-staff assignments
- `WaiterCall` - Waiter call bell tracking
- `Reservation` - Table booking system
- `PromoCode` - Discount code management
- `LoyaltyProgram` - Loyalty program configuration
- `LoyaltyMember` - Loyalty member data

### Updated Collections:
- `Order`: Added orderType, paymentMethod, specialInstructions, estimatedTime, completedAt
- `MenuItem`: Added isVeg, isBestseller, modifiers, reviews
- `OrderItem`: Added specialInstructions, modifiers
- `Table`: Added status, capacity, lastOccupied, waiterCalls, reservations
- `RestaurantStep1`: Added cuisines and relationships to all new models

---

## QUICK START GUIDE

### For Admin Dashboard:

1. **Staff Management**
   ```typescript
   import { useStaff, useCreateStaff } from '@/src/hooks/useStaff';
   
   const staff = useStaff();
   ```

2. **View Active Tables**
   ```typescript
   import { useTables } from '@/src/hooks/useTables';
   
   const tables = useTables(restaurantId, 'dashboard');
   ```

3. **Manage Promo Codes**
   ```typescript
   import { usePromoCodes } from '@/src/hooks/usePromoCodes';
   
   const promoCodes = usePromoCodes(restaurantId);
   ```

4. **View Pending Waiter Calls**
   ```typescript
   import { useWaiterCalls } from '@/src/hooks/useWaiterCalls';
   
   const pendingCalls = useWaiterCalls(restaurantId, false);
   ```

### For Customer Interface:

1. **Post Review**
   ```typescript
   import { useCreateReview } from '@/src/hooks/useReviews';
   ```

2. **Call Waiter**
   ```typescript
   import { useCallWaiter } from '@/src/hooks/useWaiterCalls';
   ```

3. **Validate Promo Code**
   ```typescript
   import { useValidatePromoCode } from '@/src/hooks/usePromoCodes';
   ```

4. **Book Reservation**
   ```typescript
   import { useCreateReservation } from '@/src/hooks/useReservations';
   ```

---

## API ENDPOINTS SUMMARY

| Feature | Endpoint | Method | Purpose |
|---------|----------|--------|---------|
| Invoices | `/api/invoices` | POST/GET | Generate & fetch invoices |
| Waiter Calls | `/api/waiter-calls` | POST/GET/PUT | Call bell system |
| Staff | `/api/staff` | POST/GET/PUT/DELETE | Manage staff |
| Reviews | `/api/reviews` | POST/GET/DELETE | Rating system |
| Promo Codes | `/api/promo-codes` | POST/GET/PUT/DELETE | Discount codes |
| Reservations | `/api/reservations` | POST/GET/PUT | Table bookings |
| Loyalty | `/api/loyalty-program` | POST/GET/PUT | Points program |
| Tables | `/api/tables` | GET/PUT | Table management |
| Item Modifiers | `/api/item-modifiers` | POST/GET/PUT/DELETE | Customization |

---

## NEXT STEPS TO IMPLEMENT

To fully utilize all these features, create:

1. **Admin Dashboard Pages**:
   - Staff management dashboard
   - Table occupancy view with live status
   - Waiter calls notification center
   - Promo codes management
   - Reservation calendar
   - Loyalty program analytics

2. **Customer Pages**:
   - Leave review modal
   - Call waiter button on table
   - Loyalty points display
   - Promo code input field
   - Reservation booking page

3. **Components**:
   - WaiterCallBell component
   - StaffManagementTable component
   - TableOccupancyDashboard component
   - ReviewForm component
   - ReservationCalendar component
   - PromoCodeInput component

---

## Performance Notes

All hooks configured with:
- Optimal cache times (staleTime & gcTime)
- Real-time refresh where needed
- Error handling with toast notifications
- Automatic query invalidation on mutations

---

## Security & Best Practices

- All endpoints require authentication where needed
- Staff management restricted to restaurant owners
- Review deletion only by review author
- Promo code usage tracked automatically
- Reservation conflicts prevented at database level

---

Generated: June 2024
Version: 1.0

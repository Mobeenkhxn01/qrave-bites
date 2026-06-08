"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BadgeIndianRupee,
  Bell,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Percent,
  Plus,
  Receipt,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useGenerateInvoice, useRestaurantInvoices } from "@/hooks/useInvoice";
import {
  PromoCode,
  useCreatePromoCode,
  useDeletePromoCode,
  usePromoCodes,
  useUpdatePromoCode,
} from "@/hooks/usePromoCodes";
import {
  Reservation,
  useCreateReservation,
  useReservations,
  useUpdateReservation,
} from "@/hooks/useReservations";
import {
  Staff,
  useCreateStaff,
  useDeleteStaff,
  useStaff,
} from "@/hooks/useStaff";
import {
  Table,
  useTables,
  useUpdateTableStatus,
} from "@/hooks/useTables";
import {
  WaiterCall,
  useResolveWaiterCall,
  useWaiterCalls,
} from "@/hooks/useWaiterCalls";

type Order = {
  id: string;
  orderNumber: number;
  tableNumber?: number | null;
  totalAmount: number;
  status: string;
  paid: boolean;
  createdAt: string;
};

type LoyaltyProgram = {
  id: string;
  name: string;
  pointsPerRupee: number;
  redeemValue: number;
  isActive: boolean;
  members?: Array<{ id: string; phoneNumber: string; totalPoints: number }>;
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  tax: number;
  isPaid: boolean;
};

const tableStatuses = ["AVAILABLE", "OCCUPIED", "RESERVED", "CLEANING"];
const staffRoles = ["MANAGER", "CHEF", "WAITER", "CASHIER", "DELIVERY"];
const reservationStatuses = ["confirmed", "completed", "cancelled"];

export default function ManagementPage() {
  const params = useSearchParams();
  const requestedTab = params.get("tab") || "floor";
  const [tab, setTab] = useState(requestedTab);

  const { data: restaurant } = useQuery({
    queryKey: ["restaurant-me"],
    queryFn: async () => {
      const res = await axios.get("/api/restaurant/me");
      return res.data as { restaurantId: string | null };
    },
  });

  const restaurantId = restaurant?.restaurantId || "";

  if (!restaurantId) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Restaurant setup required</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Complete restaurant onboarding before using management tools.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold">Restaurant Management</h2>
          <p className="text-muted-foreground">
            Run the dining floor, bookings, staff, offers, loyalty, and billing.
          </p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="floor">Floor</TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="promos">Promos</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="floor">
          <FloorService restaurantId={restaurantId} />
        </TabsContent>
        <TabsContent value="reservations">
          <ReservationsPanel restaurantId={restaurantId} />
        </TabsContent>
        <TabsContent value="staff">
          <StaffPanel />
        </TabsContent>
        <TabsContent value="promos">
          <PromosPanel restaurantId={restaurantId} />
        </TabsContent>
        <TabsContent value="loyalty">
          <LoyaltyPanel restaurantId={restaurantId} />
        </TabsContent>
        <TabsContent value="invoices">
          <InvoicesPanel restaurantId={restaurantId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FloorService({ restaurantId }: { restaurantId: string }) {
  const { data: tables = [], isLoading } = useTables(restaurantId, "dashboard");
  const { data: calls = [] } = useWaiterCalls(restaurantId, false);
  const updateTable = useUpdateTableStatus();
  const resolveCall = useResolveWaiterCall();

  const metrics = useMemo(() => {
    return {
      available: tables.filter((table) => table.status === "AVAILABLE").length,
      occupied: tables.filter((table) => table.status === "OCCUPIED").length,
      serviceCalls: calls.length,
    };
  }, [calls.length, tables]);

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard icon={ClipboardList} label="Available tables" value={metrics.available} />
          <MetricCard icon={Users} label="Occupied tables" value={metrics.occupied} />
          <MetricCard icon={Bell} label="Open waiter calls" value={metrics.serviceCalls} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <Card><CardContent className="p-6">Loading tables...</CardContent></Card>
          ) : (
            tables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                onStatus={(status) => updateTable.mutate({ id: table.id, status })}
              />
            ))
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4" />
            Service Queue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {calls.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active waiter calls.</p>
          ) : (
            calls.map((call: WaiterCall) => (
              <div key={call.id} className="rounded-md border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">Table {call.table?.number ?? "-"}</div>
                    <div className="text-sm text-muted-foreground">
                      {call.reason || "Service"} - {new Date(call.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => resolveCall.mutate(call.id)}>
                    Resolve
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TableCard({
  table,
  onStatus,
}: {
  table: Table;
  onStatus: (status: string) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">Table {table.number}</CardTitle>
        <StatusBadge status={table.status} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-sm">
          <InfoCell label="Seats" value={table.capacity} />
          <InfoCell label="Scans" value={table.scan} />
          <InfoCell label="Orders" value={table.orders?.length || 0} />
        </div>
        <Select value={table.status} onValueChange={onStatus}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {tableStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}

function ReservationsPanel({ restaurantId }: { restaurantId: string }) {
  const { data: reservations = [] } = useReservations(restaurantId);
  const { data: tables = [] } = useTables(restaurantId, "all");
  const createReservation = useCreateReservation();
  const updateReservation = useUpdateReservation();
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    numberOfGuests: "2",
    reservationTime: "",
    tableId: "",
    notes: "",
  });

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="h-4 w-4" />
            New Reservation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              createReservation.mutate({
                restaurantId,
                customerName: form.customerName,
                customerPhone: form.customerPhone,
                customerEmail: form.customerEmail || undefined,
                numberOfGuests: Number(form.numberOfGuests),
                reservationTime: form.reservationTime,
                tableId: form.tableId || undefined,
                notes: form.notes || undefined,
              });
              setForm((current) => ({ ...current, customerName: "", customerPhone: "", notes: "" }));
            }}
          >
            <Field label="Name"><Input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} /></Field>
            <Field label="Phone"><Input required value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} /></Field>
            <Field label="Email"><Input type="email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Guests"><Input min="1" type="number" required value={form.numberOfGuests} onChange={(e) => setForm({ ...form, numberOfGuests: e.target.value })} /></Field>
              <Field label="Table">
                <Select value={form.tableId || "unassigned"} onValueChange={(value) => setForm({ ...form, tableId: value === "unassigned" ? "" : value })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {tables.map((table) => <SelectItem key={table.id} value={table.id}>Table {table.number}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Time"><Input type="datetime-local" required value={form.reservationTime} onChange={(e) => setForm({ ...form, reservationTime: e.target.value })} /></Field>
            <Field label="Notes"><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
            <Button className="w-full" type="submit"><Plus className="mr-2 h-4 w-4" />Add reservation</Button>
          </form>
        </CardContent>
      </Card>

      <ListCard title="Upcoming Reservations">
        {reservations.map((reservation: Reservation) => (
          <div key={reservation.id} className="rounded-md border p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-medium">{reservation.customerName}</div>
                <div className="text-sm text-muted-foreground">
                  {reservation.numberOfGuests} guests - {new Date(reservation.reservationTime).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {reservation.customerPhone} {reservation.table ? `- Table ${reservation.table.number}` : ""}
                </div>
              </div>
              <Select value={reservation.status} onValueChange={(status) => updateReservation.mutate({ id: reservation.id, status })}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {reservationStatuses.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </ListCard>
    </div>
  );
}

function StaffPanel() {
  const { data: staff = [] } = useStaff();
  const createStaff = useCreateStaff();
  const deleteStaff = useDeleteStaff();
  const [form, setForm] = useState({ name: "", phone: "", email: "", role: "WAITER" });

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader><CardTitle className="text-base">Add Staff</CardTitle></CardHeader>
        <CardContent>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              createStaff.mutate({ ...form, email: form.email || undefined });
              setForm({ name: "", phone: "", email: "", role: "WAITER" });
            }}
          >
            <Field label="Name"><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Phone"><Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Role">
              <Select value={form.role} onValueChange={(role) => setForm({ ...form, role })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{staffRoles.map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Button className="w-full" type="submit"><Plus className="mr-2 h-4 w-4" />Add staff</Button>
          </form>
        </CardContent>
      </Card>

      <ListCard title="Team">
        <div className="grid gap-3 md:grid-cols-2">
          {staff.map((person: Staff) => (
            <div key={person.id} className="rounded-md border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{person.name}</div>
                  <div className="text-sm text-muted-foreground">{person.phone}</div>
                  <Badge className="mt-2">{person.role}</Badge>
                </div>
                <Button size="icon" variant="outline" onClick={() => deleteStaff.mutate(person.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ListCard>
    </div>
  );
}

function PromosPanel({ restaurantId }: { restaurantId: string }) {
  const { data: promos = [] } = usePromoCodes(restaurantId);
  const createPromo = useCreatePromoCode();
  const updatePromo = useUpdatePromoCode();
  const deletePromo = useDeletePromoCode();
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "fixed" | "percentage",
    discountValue: "10",
    maxUses: "",
    validFrom: "",
    validUntil: "",
    minOrderAmount: "",
  });

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Percent className="h-4 w-4" />Create Promo</CardTitle></CardHeader>
        <CardContent>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              createPromo.mutate({
                code: form.code,
                description: form.description || undefined,
                discountType: form.discountType,
                discountValue: Number(form.discountValue),
                maxUses: form.maxUses ? Number(form.maxUses) : undefined,
                validFrom: form.validFrom,
                validUntil: form.validUntil,
                minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : undefined,
              });
              setForm((current) => ({ ...current, code: "", description: "" }));
            }}
          >
            <Field label="Code"><Input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></Field>
            <Field label="Description"><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Type">
                <Select value={form.discountType} onValueChange={(discountType: "fixed" | "percentage") => setForm({ ...form, discountType })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="percentage">Percentage</SelectItem><SelectItem value="fixed">Fixed</SelectItem></SelectContent>
                </Select>
              </Field>
              <Field label="Value"><Input min="1" type="number" required value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Max uses"><Input min="1" type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} /></Field>
              <Field label="Min order"><Input min="0" type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} /></Field>
            </div>
            <Field label="Valid from"><Input type="datetime-local" required value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} /></Field>
            <Field label="Valid until"><Input type="datetime-local" required value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} /></Field>
            <Button className="w-full" type="submit"><Plus className="mr-2 h-4 w-4" />Create promo</Button>
          </form>
        </CardContent>
      </Card>

      <ListCard title="Promo Codes">
        {promos.map((promo: PromoCode) => (
          <div key={promo.id} className="rounded-md border p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-medium">{promo.code}</div>
                <div className="text-sm text-muted-foreground">{promo.description || "No description"}</div>
                <div className="text-sm text-muted-foreground">
                  {promo.discountType === "percentage" ? `${promo.discountValue}%` : `Rs. ${promo.discountValue}`} off - {promo.currentUses}/{promo.maxUses || "unlimited"} uses
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => updatePromo.mutate({ id: promo.id, isActive: !promo.isActive })}>
                  {promo.isActive ? "Disable" : "Enable"}
                </Button>
                <Button variant="outline" size="icon" onClick={() => deletePromo.mutate(promo.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </ListCard>
    </div>
  );
}

function LoyaltyPanel({ restaurantId }: { restaurantId: string }) {
  const queryClient = useQueryClient();
  const [programForm, setProgramForm] = useState({ name: "Qrave Rewards", pointsPerRupee: "1", redeemValue: "0.5" });
  const [memberForm, setMemberForm] = useState({ phoneNumber: "", points: "100" });

  const { data: programs = [] } = useQuery<LoyaltyProgram[]>({
    queryKey: ["loyalty-programs", restaurantId],
    queryFn: async () => {
      const res = await axios.get(`/api/loyalty-program?restaurantId=${restaurantId}`);
      return res.data;
    },
    enabled: !!restaurantId,
  });

  const createProgram = useMutation({
    mutationFn: async () => axios.post("/api/loyalty-program", {
      name: programForm.name,
      pointsPerRupee: Number(programForm.pointsPerRupee),
      redeemValue: Number(programForm.redeemValue),
    }),
    onSuccess: () => {
      toast.success("Loyalty program created");
      queryClient.invalidateQueries({ queryKey: ["loyalty-programs"] });
    },
    onError: () => toast.error("Failed to create loyalty program"),
  });

  const addPoints = useMutation({
    mutationFn: async () => axios.put("/api/loyalty-program", {
      action: "addPoints",
      restaurantId,
      phoneNumber: memberForm.phoneNumber,
      points: Number(memberForm.points),
    }),
    onSuccess: () => {
      toast.success("Points added");
      queryClient.invalidateQueries({ queryKey: ["loyalty-programs"] });
      setMemberForm({ phoneNumber: "", points: "100" });
    },
    onError: () => toast.error("Failed to add points"),
  });

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BadgeIndianRupee className="h-4 w-4" />Loyalty Setup</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); createProgram.mutate(); }}>
            <Field label="Program name"><Input required value={programForm.name} onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })} /></Field>
            <Field label="Points per rupee"><Input min="0" step="0.1" type="number" required value={programForm.pointsPerRupee} onChange={(e) => setProgramForm({ ...programForm, pointsPerRupee: e.target.value })} /></Field>
            <Field label="Redeem value"><Input min="0" step="0.1" type="number" required value={programForm.redeemValue} onChange={(e) => setProgramForm({ ...programForm, redeemValue: e.target.value })} /></Field>
            <Button className="w-full" type="submit">Create program</Button>
          </form>
          <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); addPoints.mutate(); }}>
            <Field label="Member phone"><Input required value={memberForm.phoneNumber} onChange={(e) => setMemberForm({ ...memberForm, phoneNumber: e.target.value })} /></Field>
            <Field label="Points"><Input min="1" type="number" required value={memberForm.points} onChange={(e) => setMemberForm({ ...memberForm, points: e.target.value })} /></Field>
            <Button className="w-full" type="submit" variant="outline">Add points</Button>
          </form>
        </CardContent>
      </Card>

      <ListCard title="Programs">
        {programs.map((program) => (
          <div key={program.id} className="rounded-md border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{program.name}</div>
                <div className="text-sm text-muted-foreground">
                  {program.pointsPerRupee} points/Rs. - Rs. {program.redeemValue} per point
                </div>
              </div>
              <StatusBadge status={program.isActive ? "ACTIVE" : "INACTIVE"} />
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {(program.members || []).map((member) => (
                <div key={member.id} className="rounded border p-2 text-sm">
                  {member.phoneNumber} - {member.totalPoints} points
                </div>
              ))}
            </div>
          </div>
        ))}
      </ListCard>
    </div>
  );
}

function InvoicesPanel({ restaurantId }: { restaurantId: string }) {
  const queryClient = useQueryClient();
  const { data: invoices = [] } = useRestaurantInvoices(restaurantId);
  const generateInvoice = useGenerateInvoice();

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axios.get("/api/orders");
      return res.data || [];
    },
  });

  return (
    <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
      <ListCard title="Create Invoices">
        {orders.slice(0, 12).map((order) => (
          <div key={order.id} className="rounded-md border p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">Order #{order.orderNumber}</div>
                <div className="text-sm text-muted-foreground">
                  Table {order.tableNumber ?? "-"} - Rs. {order.totalAmount}
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  generateInvoice.mutate(order.id, {
                    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoices"] }),
                  });
                }}
              >
                <Receipt className="mr-2 h-4 w-4" />
                Generate
              </Button>
            </div>
          </div>
        ))}
      </ListCard>

      <ListCard title="Invoices">
        {(invoices as Invoice[]).map((invoice) => (
          <div key={invoice.id} className="rounded-md border p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-medium">{invoice.invoiceNumber}</div>
                <div className="text-sm text-muted-foreground">
                  Rs. {invoice.totalAmount} - Tax Rs. {invoice.tax}
                </div>
              </div>
              <Badge className={invoice.isPaid ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700"}>
                {invoice.isPaid ? "Paid" : "Unpaid"}
              </Badge>
            </div>
          </div>
        ))}
      </ListCard>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardContent>
    </Card>
  );
}

function InfoCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ListCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        <RefreshCw className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-3">
        {children || <p className="text-sm text-muted-foreground">No records found.</p>}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      className={cn(
        "capitalize",
        ["AVAILABLE", "ACTIVE", "completed"].includes(status) && "bg-emerald-500/10 text-emerald-700",
        ["OCCUPIED", "RESERVED", "confirmed"].includes(status) && "bg-blue-500/10 text-blue-700",
        ["CLEANING", "INACTIVE"].includes(status) && "bg-amber-500/10 text-amber-700",
        ["cancelled"].includes(status) && "bg-red-500/10 text-red-700"
      )}
    >
      {status.replace("_", " ").toLowerCase()}
      {status === "completed" && <CheckCircle2 className="ml-1 h-3 w-3" />}
    </Badge>
  );
}

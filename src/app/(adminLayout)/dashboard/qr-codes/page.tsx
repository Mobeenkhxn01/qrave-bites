import { DownloadIcon, PlusIcon, QrCodeIcon, RefreshCwIcon } from "lucide-react"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/shadcn-components/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { AppSidebar } from "@/components/shadcn-components/app-sidebar"

export default function QRCodesPage() {
  return (
    <div className="flex flex-col">
      <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">QR Code Management</h2>
            <p className="text-muted-foreground">Manage QR codes for your tables and track their performance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Regenerate All
            </Button>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Generate QR Codes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="tables" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tables">Table QR Codes</TabsTrigger>
            <TabsTrigger value="analytics">QR Analytics</TabsTrigger>
            <TabsTrigger value="settings">QR Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="tables" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((tableNumber) => (
                <QRCodeCard key={tableNumber} tableNumber={tableNumber} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Scans Today</CardTitle>
                  <QrCodeIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">247</div>
                  <p className="text-xs text-muted-foreground">+12.5% from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <QrCodeIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68.4%</div>
                  <p className="text-xs text-muted-foreground">+5.2% from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Most Scanned Table</CardTitle>
                  <QrCodeIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Table 7</div>
                  <p className="text-xs text-muted-foreground">34 scans today</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                  <QrCodeIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$32.15</div>
                  <p className="text-xs text-muted-foreground">+8.1% from yesterday</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Settings</CardTitle>
                <CardDescription>
                  Configure how your QR codes work and what customers see when they scan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Landing Page URL</label>
                    <div className="text-sm text-muted-foreground">https://qrave-bites.com/menu/bella-vista</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">QR Code Style</label>
                    <div className="text-sm text-muted-foreground">Standard Black & White</div>
                  </div>
                </div>
                <Button>Update Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      </SidebarInset>
    </SidebarProvider>
    </div>
  )
}

function QRCodeCard({ tableNumber }: { tableNumber: number }) {
  const scans = Math.floor(Math.random() * 50) + 10
  const isActive = Math.random() > 0.2

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-24 w-24 items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <QrCodeIcon className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardTitle className="text-lg">Table {tableNumber}</CardTitle>
        <CardDescription>
          <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Active" : "Inactive"}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-3">
        <div className="text-sm text-muted-foreground">{scans} scans today</div>
        <div className="flex gap-2 justify-center">
          <Button size="sm" variant="outline">
            <DownloadIcon className="mr-1 h-3 w-3" />
            Download
          </Button>
          <Button size="sm" variant="outline">
            <RefreshCwIcon className="mr-1 h-3 w-3" />
            Regenerate
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

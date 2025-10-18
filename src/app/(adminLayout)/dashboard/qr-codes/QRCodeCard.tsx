import { DownloadIcon, RefreshCwIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
interface TableQR {
  id: string;
  number: number;
  scan:number;
  qrCodeUrl: string;
  createdAt: string;
}
export default function QRCodeCard({ item }: { item: TableQR }) {
  const isActive = Math.random() > 0.2;

  return (
    <Card>
      <div>
        <div key={item.id} className="p-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-24 w-24 items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <Image
                src={item.qrCodeUrl || "/placeholder-qrcode.png"}
                alt={`QR ${item.number}`}
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
            <CardTitle className="text-lg">Table {item.number}</CardTitle>
            <CardDescription>
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-3">
            <div className="text-sm text-muted-foreground">
              {item.scan} scans today
            </div>
            <div className="flex gap-2 justify-center">
              <Link
                href={item.qrCodeUrl}
                target="_blank"
                download={`qrcode-${item.number}.png`}
              >
                <Button size="sm" variant="outline">
                  <DownloadIcon className="mr-1 h-3 w-3" />
                  Download
                </Button>
              </Link>
              <Button size="sm" variant="outline">
                <RefreshCwIcon className="mr-1 h-3 w-3" />
                Regenerate
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

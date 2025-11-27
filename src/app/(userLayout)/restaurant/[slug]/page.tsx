import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export default async function RestaurantPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const step1 = await prisma.restaurantStep1.findUnique({
    where: { slug: decodeURIComponent(slug) }
  });

  if (!step1) return notFound();

  const [step2, step3, step4] = await Promise.all([
    prisma.restaurantStep2.findFirst({ where: { id: step1.userId } }),
    prisma.restaurantStep3.findFirst({ where: { userId: step1.userId } }),
    prisma.restaurantStep4.findFirst({ where: { userId: step1.userId } })
  ]);

  const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/restaurant/${step1.slug}`;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold font-serif">
          {step1.restaurantName}
        </h1>
        <ShareButton url={fullUrl} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-3">Owner & Contact</h2>
          <p><strong>Owner:</strong> {step1.ownerName}</p>
          <p><strong>Email:</strong> {step1.email}</p>
          <p><strong>Phone:</strong> {step1.phone}</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">Location</h2>
          <p>{step1.address || `${step1.area}, ${step1.city}`}</p>
          {step1.landmark && (
            <p><strong>Landmark:</strong> {step1.landmark}</p>
          )}
          <p>
            <strong>Coordinates:</strong> {step1.latitude}, {step1.longitude}
          </p>
        </div>
      </div>

      {step2 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Gallery & Hours</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[step2.restaurantImageUrl, step2.foodImageUrl, step2.deliveryImageUrl]
              .filter(Boolean)
              .map((url, i) => (
                <Image
                  key={i}
                  src={url!}
                  width={600}
                  height={400}
                  alt="Restaurant Image"
                  className="rounded-xl w-full h-60 object-cover"
                />
            ))}
          </div>

          <p><strong>Cuisines:</strong> {step2.cuisine.join(", ")}</p>
          <p><strong>Working Days:</strong> {step2.days.join(", ")}</p>
          <p><strong>Hours:</strong> {step2.openingTime} – {step2.closingTime}</p>
        </div>
      )}

      {step3 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Verification & Payments</h2>
          <p><strong>PAN:</strong> {step3.panNumber}</p>
          <p><strong>Bank Account:</strong> {step3.accountNumber}</p>
          <p><strong>IFSC:</strong> {step3.ifscCode}</p>
          <p><strong>UPI:</strong> {step3.upiId || "N/A"}</p>
        </div>
      )}

      {step4 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Agreement</h2>
          <p>Status: {step4.agreement ? "✅ Accepted" : "❌ Not Accepted"}</p>
        </div>
      )}
    </div>
  );
}

function ShareButton({ url }: { url: string }) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    } catch {
      toast.error("Failed to copy!");
    }
  };

  return (
    <Button
      onClick={copyToClipboard}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Copy className="w-4 h-4" />
      Share
    </Button>
  );
}

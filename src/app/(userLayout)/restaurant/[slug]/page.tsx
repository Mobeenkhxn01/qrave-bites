import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  params: { slug: string };
}

export default async function RestaurantPage({ params }: Props) {
  const step1 = await prisma.restaurantStep1.findUnique({
    where: { slug: params.slug },
  });

  if (!step1) return notFound();

  const [step2, step3, step4] = await Promise.all([
    prisma.restaurantStep2.findFirst({ where: { userId: step1.userId } }),
    prisma.restaurantStep3.findFirst({ where: { userId: step1.userId } }),
    prisma.restaurantStep4.findFirst({ where: { userId: step1.userId } }),
  ]);

  const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/restaurant/${step1.slug}`;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-10">
      {/* Title + Share */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold font-serif">{step1.restaurantName}</h1>
        <ShareButton url={fullUrl} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Owner & Contact</h2>
          <p><strong>Owner:</strong> {step1.ownerName}</p>
          <p><strong>Email:</strong> {step1.email}</p>
          <p><strong>Phone:</strong> {step1.phone}</p>
        </div>

        {/* Location */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Location</h2>
          <p>{step1.address || `${step1.area}, ${step1.city}`}</p>
          {step1.landmark && <p><strong>Landmark:</strong> {step1.landmark}</p>}
          <p><strong>Coordinates:</strong> {step1.latitude}, {step1.longitude}</p>
        </div>
      </div>

      {/* Images & Details */}
      {step2 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Gallery & Hours</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[step2.restaurantImageUrl, step2.foodImageUrl, step2.deliveryImageUrl].map((url, i) => (
              <img key={i} src={url} className="rounded-xl h-60 w-full object-cover" alt="Restaurant Image" />
            ))}
          </div>
          <p><strong>Cuisines:</strong> {step2.cuisine.join(", ")}</p>
          <p><strong>Working Days:</strong> {step2.days.join(", ")}</p>
          <p><strong>Hours:</strong> {step2.openingTime} – {step2.closingTime}</p>
        </div>
      )}

      {/* PAN + Bank Details */}
      {step3 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Verification & Payments</h2>
          <p><strong>PAN:</strong> {step3.panNumber}</p>
          <p><strong>Bank Account:</strong> {step3.accountNumber}</p>
          <p><strong>IFSC:</strong> {step3.ifscCode}</p>
          <p><strong>UPI:</strong> {step3.upiId || "N/A"}</p>
        </div>
      )}

      {/* Agreement */}
      {step4 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Agreement</h2>
          <p>Status: {step4.agreement ? "✅ Accepted" : "❌ Not Accepted"}</p>
        </div>
      )}
    </div>
  );
}

// Share button component
function ShareButton({ url }: { url: string }) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } catch (err) {
      alert("Failed to copy link.");
    }
  };

  return (
    <Button onClick={copyToClipboard} variant="outline" className="flex gap-2 items-center">
      <Copy className="w-4 h-4" />
      Share
    </Button>
  );
}

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type TitleHeaderProps = {
  activeStep: number;
};

const steps = [
  {
    id: 1,
    title: "Restaurant Information",
    subtitle: "Owner's name, mobile number and adddress",
    href: "/partner-with-us/new",
  },
  {
    id: 2,
    title: "Menu and operational details",
    subtitle: "Menu, dish images and timings",
    href: "/partner-with-us/add-menu-items",
  },
  {
    id: 3,
    title: "Restaurant documents",
    subtitle: "PAN Card, Account Number and IFSC code",
    href: "/partner-with-us/restaurant-documents",
  },
  {
    id: 4,
    title: "Partner contract",
    subtitle: "Partner agreement and contact details",
    href: "/partner-with-us/partner-contract",
  },
];

export default function TitleHeaderPartner({ activeStep }: TitleHeaderProps) {
  return (
    <div>
      <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
        <CardHeader>
          <h1 className="text-xl font-semibold">Complete your registration</h1>
          <div className="border-t border-gray-300 w-full p-0" />
        </CardHeader>

        {/* Set a fixed height for the CardContent */}
        <CardContent className="h-[300px]"> {/* Fixed height */}
          <div className="h-full"> {/* Container to help with layout */}
            {steps.map((step, index) => (
              <div key={step.id} className="flex">
                {/* Left side with step indicator and connector */}
                <div className="flex flex-col items-center mr-2">
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex-shrink-0 ${
                      activeStep === step.id ? "border-[#4947e0]" : "border-black"
                    }`}
                  ></div>
                  {index < steps.length - 1 && (
                    <div className="border-l border-gray-300 h-5 flex-grow-0"></div>
                  )}
                </div>
                
                {/* Right side with content */}
                <div className="pb-4">
                  <h1
                    className={`text-lg ${
                      activeStep === step.id
                        ? "text-[#4947e0] font-bold"
                        : "text-[#596738]"
                    }`}
                  >
                    {step.title}
                  </h1>

                  {/* Always render subtitle but control visibility */}
                  <p className={`font-extralight text-gray-500 ${
                    activeStep === step.id ? "opacity-100" : "opacity-0 h-0"
                  }`}>
                    {step.subtitle}
                  </p>

                  <Link href={step.href} className="underline text-[#4947e0] block mt-1">
                    {activeStep === step.id ? "continue" : "edit details"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
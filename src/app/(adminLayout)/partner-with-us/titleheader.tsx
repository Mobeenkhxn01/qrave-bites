import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
  StepperTitle,
} from "@/components/ui/stepper";
import Link from "next/link";

type TitleHeaderProps = {
  activeStep: number;
};

const steps = [
  {
    id: 1,
    title: "Restaurant Information",
    subtitle: "Owner's name, mobile number and address",
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
    <div className="w-full mx-auto max-w-xl space-y-8">
      {/* ✅ Stepper for small & medium devices (lg:hidden) */}
      <div className="block lg:hidden text-center">
        <Stepper defaultValue={activeStep}>
          {steps.map((step) => (
            <StepperItem key={step.id} step={step.id} className="not-last:flex-1">
              <StepperTrigger>
                <StepperIndicator asChild>{step.id}</StepperIndicator>
              </StepperTrigger>
              {step.id < steps.length && <StepperSeparator />}
            </StepperItem>
          ))}
        </Stepper>
        <p className="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
          Complete your registration
        </p>
      </div>

      {/* ✅ Stepper for large and up devices (lg:block) */}
      <div className="hidden lg:block">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Complete your registration
        </h1>
        <Stepper defaultValue={activeStep} orientation="vertical">
          {steps.map(({ id, title, subtitle, href }) => (
            <StepperItem
              key={id}
              step={id}
              className="relative items-start not-last:flex-1"
            >
              <StepperTrigger className="items-start rounded pb-10 last:pb-0">
                <StepperIndicator />
                <div className="mt-0.5 px-2 text-left">
                  <StepperTitle
                    className={activeStep === id ? "text-[#4947e0] font-bold" : "text-[#596738]"}
                  >
                    {title}
                  </StepperTitle>
                  <p
                    className={`text-sm text-muted-foreground transition-all duration-200 ${
                      activeStep === id ? "opacity-100" : "opacity-0 h-0"
                    }`}
                  >
                    {subtitle}
                  </p>
                  <Link
                    href={href}
                    className={`text-sm underline mt-1 block ${
                      activeStep === id ? "text-[#4947e0]" : "text-gray-400"
                    }`}
                  >
                    {activeStep === id ? "continue" : "edit details"}
                  </Link>
                </div>
              </StepperTrigger>

              {id < steps.length && (
                <StepperSeparator className="absolute inset-y-0 top-[calc(1.5rem+0.125rem)] left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)]" />
              )}
            </StepperItem>
          ))}
        </Stepper>
      </div>
    </div>
  );
}

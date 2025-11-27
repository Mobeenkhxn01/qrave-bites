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

      <div className="block lg:hidden text-center">
        <Stepper defaultValue={activeStep}>
          {steps.map((step) => (
            <StepperItem key={step.id} step={step.id} className="flex-1">
              <StepperTrigger>
                <StepperIndicator asChild>{step.id}</StepperIndicator>
              </StepperTrigger>
              {step.id < steps.length && <StepperSeparator />}
            </StepperItem>
          ))}
        </Stepper>

        <p className="text-muted-foreground mt-2 text-xs">
          Complete your registration
        </p>
      </div>

      <div className="hidden lg:block">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Complete your registration
        </h1>

        <Stepper defaultValue={activeStep} orientation="vertical">
          {steps.map(({ id, title, subtitle, href }) => (
            <StepperItem
              key={id}
              step={id}
              className="relative items-start"
            >
              <StepperTrigger className="items-start rounded pb-10 last:pb-0">
                <StepperIndicator />

                <div className="mt-0.5 px-2 text-left">
                  <StepperTitle
                    className={
                      activeStep === id
                        ? "text-[#4947e0] font-bold"
                        : "text-[#596738]"
                    }
                  >
                    {title}
                  </StepperTitle>

                  <p
                    className={
                      activeStep === id
                        ? "text-sm text-muted-foreground mt-1 opacity-100"
                        : "text-sm text-muted-foreground mt-1 opacity-0 h-0 overflow-hidden"
                    }
                  >
                    {subtitle}
                  </p>

                  <Link
                    href={href}
                    className={
                      activeStep === id
                        ? "text-sm underline text-[#4947e0] mt-2 block"
                        : "text-sm underline text-gray-400 mt-2 block"
                    }
                  >
                    {activeStep === id ? "continue" : "edit details"}
                  </Link>
                </div>
              </StepperTrigger>

              {id < steps.length && (
                <StepperSeparator className="absolute left-3 top-8 h-[calc(100%-2rem)] -translate-x-1/2" />
              )}
            </StepperItem>
          ))}
        </Stepper>
      </div>
    </div>
  );
}

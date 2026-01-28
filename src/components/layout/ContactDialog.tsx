"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Enter valid email"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ContactDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(data: FormValues) {
    console.log(data);
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw]! sm:max-w-[85vw]! md:max-w-[75vw]! lg:max-w-225! xl:max-w-250! w-full h-auto p-0 gap-0 overflow-hidden rounded-xl sm:rounded-2xl border-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full">
          {/* LEFT PANEL - Hidden on mobile */}
          <div className="hidden lg:flex flex-col justify-between bg-[#0f2744] text-white p-6 lg:p-8 xl:p-10">
            <div>
              <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold leading-tight">
                You are taking the right
                <br /> step for your business.
              </h2>
              <p className="mt-3 lg:mt-4 text-white/70 text-xs lg:text-sm xl:text-base">
                Trusted by growing restaurants across India
              </p>
            </div>

            <div className="text-lg lg:text-xl xl:text-2xl font-bold">
              Qrave<span className="text-blue-400">Bites</span>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="flex flex-col justify-center px-5 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 lg:py-10">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-4">
              <div className="text-base sm:text-lg font-bold">
                Qrave<span className="text-blue-400">Bites</span>
              </div>
            </div>

            <DialogTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-1 sm:mb-2">
              Setup Free Demo
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-5 lg:mb-6">
              Fill in the details & our product specialist will reach out to you
            </DialogDescription>

            <Form {...form}>
              <div className="space-y-3 sm:space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Your Name *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="h-8 sm:h-9 lg:h-10 text-xs sm:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Phone Number *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+91" 
                          {...field} 
                          className="h-8 sm:h-9 lg:h-10 text-xs sm:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Email Address *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="h-8 sm:h-9 lg:h-10 text-xs sm:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={2}
                          {...field} 
                          className="text-xs sm:text-sm resize-none min-h-15 sm:min-h-17.5"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed pt-1">
                  By clicking Continue, you consent to receive calls, messages
                  and emails from QraveBites regarding product updates and
                  offers.
                </p>

                <div className="flex justify-end pt-2 sm:pt-3">
                  <Button
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                    className="w-full sm:w-auto rounded-full px-6 sm:px-8 py-2 h-auto text-xs sm:text-sm"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
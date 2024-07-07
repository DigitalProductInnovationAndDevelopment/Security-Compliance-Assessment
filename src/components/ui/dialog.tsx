import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Icons } from "../icons";
import { cn } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";

interface DialogContentProps extends DialogPrimitive.DialogContentProps {
  children: React.ReactNode;
}

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(({ children, ...props }, forwardedRef) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-20 bg-black opacity-30" />
    <DialogPrimitive.Content
      className="fixed left-1/2 top-1/2 z-50 min-h-[10rem] min-w-[25rem] -translate-x-1/2 -translate-y-1/2 transform rounded-md border-2 bg-white p-2 shadow-lg"
      {...props}
      ref={forwardedRef}
    >
      {children}
      <DialogPrimitive.Close
        aria-label="Close"
        className="absolute right-2 top-2"
      >
        <div className="h-6 w-6 pt-1">
          <Icons.collapse />
        </div>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <>
    <DialogPrimitive.Title
      className={cn(
        "space-beetween flex p-1 text-center text-lg font-medium sm:text-left",
        className,
      )}
      {...props}
    />
    <Separator className="my-1" />
  </>
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

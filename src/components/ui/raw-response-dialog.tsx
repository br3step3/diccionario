"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

export interface RawResponseDialogProps {
  rawResponse: string
  onOpenChange?: (open: boolean) => void
}

export function RawResponseDialog({
  rawResponse,
  onOpenChange,
}: RawResponseDialogProps) {
  return (
    <DialogPrimitive.Root defaultOpen onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-lg bg-background p-6 shadow-lg",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          )}
        >
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
          
          <DialogPrimitive.Title className="text-lg font-semibold">Raw Gemini Response</DialogPrimitive.Title>
          <div className="space-y-4">
            <pre className="max-h-[70vh] overflow-auto rounded bg-muted p-4 text-sm whitespace-pre-wrap break-words">
              {rawResponse}
            </pre>
            <div className="mt-4">
              <h4 className="text-md font-medium">Raw Response Details</h4>
              <pre className="max-h-[50vh] overflow-auto rounded bg-muted p-4 text-sm whitespace-pre-wrap break-words">
                {rawResponse}
              </pre>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
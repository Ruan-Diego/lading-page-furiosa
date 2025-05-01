import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "input text-white/90 bg-gray-800 px-3 py-1 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-bg-gray-900 transition-all duration-150 ease-in-out",
        className
      )}
      {...props}
    />
  )
}

export { Input }

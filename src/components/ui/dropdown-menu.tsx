"use client";

import * as React from "react";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function DropdownMenu({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="dropdown-menu" {...props}>
      {children}
    </div>
  );
}

function DropdownMenuPortal({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="dropdown-menu-portal" {...props}>
      {children}
    </div>
  );
}

function DropdownMenuTrigger({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="dropdown-menu-trigger"
      className={cn("inline-flex items-center", className)}
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-content"
      className={cn(
        "min-w-32 rounded-lg border border-white/10 bg-slate-950/95 p-1 text-slate-100 shadow-lg",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-group"
      className={cn("space-y-1", className)}
      {...props}
    />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<"button"> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <button
      type="button"
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-white/10",
        inset && "pl-7",
        variant === "destructive" && "text-rose-300",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: React.ComponentProps<"button"> & {
  checked?: boolean;
  inset?: boolean;
}) {
  return (
    <button
      type="button"
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-white/10",
        inset && "pl-7",
        className
      )}
      {...props}
    >
      <span className="inline-flex w-4 justify-center">
        {checked ? <CheckIcon className="size-4" /> : null}
      </span>
      {children}
    </button>
  );
}

function DropdownMenuRadioGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-radio-group"
      className={cn("space-y-1", className)}
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<"button"> & {
  inset?: boolean;
}) {
  return (
    <button
      type="button"
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-white/10",
        inset && "pl-7",
        className
      )}
      {...props}
    >
      <CheckIcon className="size-4 opacity-60" />
      {children}
    </button>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<"div"> & {
  inset?: boolean;
}) {
  return (
    <div
      data-slot="dropdown-menu-label"
      className={cn("px-2 py-1 text-xs text-slate-400", inset && "pl-7", className)}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-separator"
      className={cn("my-1 h-px bg-white/10", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("ml-auto text-xs tracking-widest text-slate-500", className)}
      {...props}
    />
  );
}

function DropdownMenuSub({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="dropdown-menu-sub" {...props}>
      {children}
    </div>
  );
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  inset?: boolean;
}) {
  return (
    <button
      type="button"
      data-slot="dropdown-menu-sub-trigger"
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-white/10",
        inset && "pl-7",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </button>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "mt-1 rounded-lg border border-white/10 bg-slate-950/95 p-1",
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};

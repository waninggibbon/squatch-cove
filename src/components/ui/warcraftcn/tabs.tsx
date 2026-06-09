import * as RadixTabs from "@radix-ui/react-tabs";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import "@/components/ui/warcraftcn/styles/warcraft.css";

const tabVariants = cva("wc-tabs-root w-full max-w-full flex", {
  variants: {
    faction: {
      default: "wc-tabs-default text-white",
      orc: "wc-tabs-orc",
      elf: "wc-tabs-elf",
      human: "wc-tabs-human",
      undead: "wc-tabs-undead",
    },
  },
  defaultVariants: { faction: "default" },
});

// Responsive trigger style enhancements
const triggerVariants = cva(
  "wc-tab-trigger relative flex items-center justify-center font-semibold tracking-wide transition-transform duration-200 select-none whitespace-nowrap sm:max-w-[40px] lg:max-w-[50px]",
  {
    variants: {
      disabled: {
        false: "cursor-pointer",
        true: "cursor-not-allowed opacity-60 bg-gray-300 dark:bg-neutral-700 text-gray-500 dark:text-neutral-400",
      },
    },
    defaultVariants: { disabled: false },
  },
);

type FactionType = "default" | "orc" | "elf" | "human" | "undead";
type TabsProps = Omit<
  React.ComponentPropsWithoutRef<typeof RadixTabs.Root>,
  "orientation"
> &
  VariantProps<typeof tabVariants> & { faction?: FactionType };

const Tabs = React.forwardRef<
  React.ComponentRef<typeof RadixTabs.Root>,
  TabsProps
>(({ className, faction = "default", ...props }, ref) => (
  <RadixTabs.Root
    ref={ref}
    className={cn(
      tabVariants({ faction }),
      "flex flex-col w-full max-w-full data-[orientation='vertical']:flex-row",
      className,
    )}
    {...props}
  />
));
Tabs.displayName = "Tabs";

type TabsListProps = React.ComponentPropsWithoutRef<typeof RadixTabs.List>;

const TabsList = React.forwardRef<
  React.ComponentRef<typeof RadixTabs.List>,
  TabsListProps
>(({ className, ...props }, ref) => (
  <RadixTabs.List
    ref={ref}
    className={cn(
      "fantasy wc-tab-list relative no-scrollbar bg-transparent",
      "flex w-full gap-1 px-1 overflow-x-auto no-scrollbar sm:gap-2 sm:px-0 mb-1",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

type TabsTriggerProps = React.ComponentPropsWithoutRef<
  typeof RadixTabs.Trigger
> & { disabled?: boolean };

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof RadixTabs.Trigger>,
  TabsTriggerProps
>(({ className, children, disabled = false, ...props }, ref) => (
  <RadixTabs.Trigger
    ref={ref}
    className={cn(
      triggerVariants({ disabled }),
      "min-w-0 w-full h-11 px-3 text-sm",
      className,
    )}
    disabled={disabled}
    aria-disabled={disabled}
    tabIndex={disabled ? -1 : undefined}
    {...props}
  >
    <span className="tab-label relative truncate tab-label-base">
      {children}
    </span>
    <span className="tab-burst" />
  </RadixTabs.Trigger>
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof RadixTabs.Content>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.Content>
>(({ className, ...props }, ref) => (
  <RadixTabs.Content
    ref={ref}
    className={cn(
      "relative flex-1 w-full overflow-x-visible text-[#f3e7c4]",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };

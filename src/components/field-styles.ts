// Same field look as the search filter inputs on the home page.
export const fieldClassName =
  "h-11.5 rounded-lg border-transparent bg-muted/70 px-3.5 shadow-none dark:bg-muted"

export const errorId = (id: string) => `${id}-error`

// Primary action button on the auth pages (brand teal, full width).
export const brandButtonClassName =
  "h-10 w-full rounded-lg bg-brand text-brand-foreground hover:bg-brand/90"

// Compact brand button for page actions (Add Listing, Edit, Save).
export const brandActionClassName =
  "h-9 gap-2 rounded-lg bg-brand px-4 text-brand-foreground hover:bg-brand/90"

// shadcn Switch is lime (primary) when on; use the brand teal instead.
export const brandSwitchClassName = "data-checked:bg-brand"

// Floor / room pill toggles on the listing detail pages.
export const pillToggleClassName =
  "h-9 min-w-28 gap-2 rounded-full border border-brand px-4 text-brand hover:bg-brand/10 hover:text-brand aria-pressed:bg-brand aria-pressed:text-brand-foreground"

import { Button } from "@/components/ui/button"
import {
  AtSign,
  Globe,
  Mail,
  MapPin,
  Phone,
  Rss,
  Send,
  Share2,
} from "lucide-react"

const linkGroups = [
  {
    title: "Discover",
    links: [
      "Houses",
      "Apartments",
      "Shared Housing",
      "Student Housing",
      "Verified Listings",
    ],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Press", "Blog", "Contact"],
  },
  {
    title: "Support",
    links: [
      "Help Center",
      "Safety Center",
      "Terms of Service",
      "Privacy Policy",
      "Cookies",
    ],
  },
]

const socials = [
  { label: "Website", href: "#", Icon: Globe },
  { label: "Email", href: "#", Icon: AtSign },
  { label: "RSS", href: "#", Icon: Rss },
  { label: "Share", href: "#", Icon: Share2 },
]

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_3fr]">
          <div className="space-y-6">
            <div>
              <p className="font-heading text-2xl font-semibold tracking-tight">
                Stay<span className="text-primary">ly</span>
              </p>
              <p className="text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed">
                Find your perfect place to stay. Browse thousands of verified
                homes, apartments, and shared spaces across the city.
              </p>
            </div>

            <ul className="space-y-3 text-sm">
              <li className="text-muted-foreground flex items-center gap-2">
                <MapPin className="text-primary size-4" />
                123 Toul Kork, Phnom Penh, Cambodia
              </li>
              <li className="text-muted-foreground flex items-center gap-2">
                <Phone className="text-primary size-4" />
                +1 (555) 000-1234
              </li>
              <li className="text-muted-foreground flex items-center gap-2">
                <Mail className="text-primary size-4" />
                hello@stayly.com
              </li>
            </ul>

            <div className="bg-background flex flex-col gap-4 rounded-xl border p-5">
              <p className="text-sm font-medium">Get property alerts</p>
              <form
                className="flex flex-col gap-2 sm:flex-row"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm transition-colors outline-none focus-visible:ring-3"
                />
                <Button type="submit" size="sm" className="shrink-0">
                  <Send data-slot="icon-inline-start" />
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {linkGroups.map((group) => (
              <div key={group.title}>
                <p className="text-sm font-semibold">{group.title}</p>
                <ul className="mt-4 space-y-3 text-sm">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t pt-8 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            © 2026 Stayly. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="bg-background text-muted-foreground hover:border-primary/30 hover:bg-primary/10 hover:text-primary inline-flex size-9 items-center justify-center rounded-md border transition-colors"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
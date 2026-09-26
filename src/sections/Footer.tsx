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
    <footer className="border-t bg-slate-50/80">
      <div className="container mx-auto px-24 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_3fr]">
          <div className="space-y-6">
            <div>
              <p className="text-4xl font-bold">
                <span className="text-emerald-600">SB</span>
                <span className="text-orange-500">O</span>
                <span className="text-emerald-600">V</span>
              </p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
                Find your perfect place to stay. Browse thousands of verified
                homes, apartments, and shared spaces across the city.
              </p>
            </div>

            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-slate-500">
                <MapPin className="size-4 text-emerald-600" />
                123 Toul Kork, Phnom Penh, Cambodia
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <Phone className="size-4 text-emerald-600" />
                +1 (555) 000-1234
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <Mail className="size-4 text-emerald-600" />
                hello@sbov.com
              </li>
            </ul>

            <div className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold text-slate-900">
                Get property alerts
              </p>
              <form
                className="flex flex-col gap-2 sm:flex-row"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-10 w-full rounded-full border border-transparent bg-muted/70 px-4 text-sm transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                <Button
                  type="submit"
                  className="h-10 shrink-0 gap-2 rounded-full bg-brand-dark px-4.5 font-normal text-brand-dark-foreground hover:bg-brand-dark/90"
                >
                  <Send data-slot="icon-inline-start" />
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {linkGroups.map((group) => (
              <div key={group.title}>
                <p className="text-sm font-semibold text-slate-900">
                  {group.title}
                </p>
                <ul className="mt-4 space-y-3 text-sm">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-slate-500 transition-colors hover:text-emerald-600"
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
          <p className="text-sm text-slate-500">
            © 2026 SBOV. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-emerald-600 hover:bg-emerald-600 hover:text-white"
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

export default Footer

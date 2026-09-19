import {
  BedDouble,
  Heart,
  MapPin,
  Phone,
  Star,
  Wallet,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

export function CardInfo() {
  return (
    <article className="w-full max-w-[360px] overflow-hidden rounded-[24px] border border-border bg-card shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <div className="relative h-[200px] bg-cover bg-center" aria-label="House exterior" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80')" }}>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          aria-label="Save listing"
          className="absolute top-3.5 right-3.5 h-9 w-9 rounded-full border-0 bg-white/80 text-slate-800 shadow-lg backdrop-blur-sm hover:bg-white"
        >
          <Heart className="h-4 w-4 fill-none" />
        </Button>
      </div>

      <div className="space-y-4 p-4 pb-3">
        <div className="flex items-center justify-between gap-3">
          <h1 className="m-0 text-[1.1rem] font-extrabold tracking-[0.02em] text-slate-900">
            SOPHEAP&apos;S RENTHOUSE
          </h1>

          <div
            className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1.5 text-xs font-bold text-slate-800"
            aria-label="Rating 4.6 out of 5"
          >
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>4.6</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          <span>Khon Sen Sok, Phnom Penh</span>
        </div>

        <div className="space-y-2 border-t border-slate-200 pt-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <BedDouble className="h-4 w-4 text-slate-500" />
            <span>12 rooms available</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Wallet className="h-4 w-4 text-slate-500" />
            <span>
              Start from: <strong className="font-semibold text-slate-900">80$ / room</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/80 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-emerald-500 text-sm font-bold text-white">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-800">Monster</span>
            <span className="text-xs text-slate-500">012 325 555</span>
          </div>
        </div>

        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label="Contact host"
          className="h-10 w-10 rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
        >
          <Phone className="h-4 w-4" />
        </Button>
      </div>
    </article>
  )
}

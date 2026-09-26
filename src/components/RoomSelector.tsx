import { BedDouble, CheckCircle2, Clock, Maximize, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { cn } from "@/lib/utils"
import type { Room } from "@/types/house-type"

interface RoomSelectorProps {
  rooms: Room[]
  selectedRoomId: string
  onSelect: (roomId: string) => void
}

export function RoomSelector({
  rooms,
  selectedRoomId,
  onSelect,
}: RoomSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="Rooms in this house"
      aria-orientation="vertical"
      className="flex max-h-[34rem] flex-col gap-2 overflow-y-auto pr-1"
    >
      {rooms.map((room) => {
        const isSelected = room.roomId === selectedRoomId

        return (
          <button
            key={room.roomId}
            type="button"
            role="tab"
            id={`room-tab-${room.roomId}`}
            aria-selected={isSelected}
            aria-controls="room-panel"
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelect(room.roomId)}
            className={cn(
              "flex w-full flex-col gap-2 rounded-2xl border p-3 text-left transition-colors",
              "focus-visible:ring-3 focus-visible:ring-brand/40 focus-visible:outline-none",
              isSelected
                ? "border-brand bg-brand/8 shadow-[0_4px_16px_rgba(15,23,42,0.08)]"
                : "border-border bg-card hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-slate-900">
                Room {String(room.roomNumber).padStart(2, "0")}
              </span>

              <Badge
                variant={room.isAvailable ? "secondary" : "destructive"}
                className="h-5 text-[0.65rem]"
              >
                {room.isAvailable ? (
                  <>
                    <CheckCircle2 />
                    Available
                  </>
                ) : (
                  <>
                    <Clock />
                    Occupied
                  </>
                )}
              </Badge>
            </div>

            <span className="flex items-baseline gap-1">
              <strong className="text-lg font-extrabold text-slate-900">
                ${room.price}
              </strong>
              <span className="text-xs text-slate-500">/ month</span>
            </span>

            <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <BedDouble className="size-3.5 text-slate-400" />
                {room.bedType}
              </span>
              <span className="flex items-center gap-1">
                <Users className="size-3.5 text-slate-400" />
                {room.capacity}
              </span>
              <span className="flex items-center gap-1">
                <Maximize className="size-3.5 text-slate-400" />
                {room.sizeSqm} m²
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default RoomSelector

import {
  Bell,
  CheckCheck,
  CircleDot,
  MessageSquareText,
  Search,
} from "lucide-react"

const notifications = [
  {
    id: 1,
    name: "Manunh",
    preview: "requested access to add new list...",
    time: "Today Wednesday at 9:42 AM",
    accent: "from-sky-200 to-sky-400",
    unread: true,
    group: "Today",
  },
  {
    id: 2,
    name: "Hengly",
    preview: "requested has improve succes...",
    time: "Today Wednesday at 9:42 AM",
    accent: "from-violet-200 to-violet-400",
    unread: false,
    group: "Today",
  },
  {
    id: 3,
    name: "Jekson",
    preview: "requested access to add new list...",
    time: "Last April-07-25",
    accent: "from-emerald-200 to-emerald-400",
    unread: true,
    group: "Previous 7 Days",
  },
  {
    id: 4,
    name: "Jasmin",
    preview: "requested has improve succes...",
    time: "Last March-02-25",
    accent: "from-amber-200 to-amber-400",
    unread: false,
    group: "Previous 7 Days",
  },
  {
    id: 5,
    name: "Numa",
    preview: "requested has improve succes...",
    time: "Last February-16-25",
    accent: "from-pink-200 to-pink-400",
    unread: true,
    group: "Previous 30 Days",
  },
  {
    id: 6,
    name: "Hengly",
    preview: "requested has improve succes...",
    time: "Last Tuesday at 9:42 AM",
    accent: "from-cyan-200 to-cyan-400",
    unread: true,
    group: "May",
  },
]

const messages = [
  {
    id: 1,
    name: "Nina",
    preview: "Hi, I need help with the room booking.",
    time: "2m ago",
    accent: "from-emerald-200 to-emerald-400",
  },
  {
    id: 2,
    name: "Kimnam",
    preview: "The payment is already sent. Thanks!",
    time: "18m ago",
    accent: "from-orange-200 to-orange-400",
  },
  {
    id: 3,
    name: "Lia",
    preview: "Can you confirm the check-in time?",
    time: "1h ago",
    accent: "from-violet-200 to-violet-400",
  },
  {
    id: 4,
    name: "Sovanna",
    preview: "I left the key at the front desk.",
    time: "3h ago",
    accent: "from-rose-200 to-rose-400",
  },
]

function AvatarBadge({ label, accent }: { label: string; accent: string }) {
  return (
    <div
      className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${accent} text-sm font-bold text-slate-800 shadow-inner`}
    >
      {label}
    </div>
  )
}

export function NotificationPanel() {
  const groups = ["Today", "Previous 7 Days", "Previous 30 Days", "May"]

  return (
    <div className="w-[400px] overflow-hidden rounded-[2rem] border-2 border-[#0f172a] bg-[#dfeae8] shadow-[0_18px_50px_rgba(15,23,42,0.22)]">
      <div className="flex items-center justify-between border-b border-slate-300/80 px-6 py-5">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-slate-800" />
          <h3 className="text-[2rem] font-black tracking-[-0.06em] text-slate-800">
            Notifications
          </h3>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 text-base font-semibold text-emerald-700 transition-opacity hover:opacity-80"
        >
          <CheckCheck className="h-4 w-4" />
          Mark as read
        </button>
      </div>

      <div className="max-h-[70vh] overflow-y-auto bg-[#dfeae8] px-3 pt-3 pb-4">
        {groups.map((group) => {
          const groupItems = notifications.filter(
            (item) => item.group === group
          )
          if (!groupItems.length) return null

          return (
            <div key={group} className="mb-2">
              <h4 className="px-3 pt-3 pb-2 text-[1.05rem] font-bold text-slate-700">
                {group}
              </h4>

              <div className="space-y-2">
                {groupItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 rounded-[1.4rem] border border-slate-200/80 bg-[#eaf3f2] px-3 py-3 ${
                      item.unread
                        ? "shadow-[inset_0_0_0_1px_rgba(16,185,129,0.08)]"
                        : ""
                    }`}
                  >
                    <AvatarBadge
                      label={item.name.slice(0, 2)}
                      accent={item.accent}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[1.1rem] font-bold text-slate-800">
                          {item.name}
                        </p>
                        <span className="text-lg text-slate-800">
                          requested
                        </span>
                      </div>

                      <p className="mt-1 truncate text-base text-slate-600">
                        {item.preview}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{item.time}</p>
                    </div>

                    {item.unread && (
                      <CircleDot className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function MessagePanel() {
  return (
    <div className="w-[400px] overflow-hidden rounded-[2rem] border-2 border-[#0f172a] bg-[#dfeae8] shadow-[0_18px_50px_rgba(15,23,42,0.22)]">
      <div className="flex items-center justify-between border-b border-slate-300/80 px-6 py-5">
        <div className="flex items-center gap-3">
          <MessageSquareText className="h-5 w-5 text-slate-800" />
          <h3 className="text-[2rem] font-black tracking-[-0.06em] text-slate-800">
            Messages
          </h3>
        </div>

        <button
          type="button"
          className="rounded-full bg-slate-900 p-2 text-white transition-opacity hover:opacity-90"
          aria-label="Search messages"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[70vh] overflow-y-auto bg-[#dfeae8] px-3 py-3">
        <div className="space-y-2">
          {messages.map((message) => (
            <button
              key={message.id}
              type="button"
              className="flex w-full items-center gap-3 rounded-[1.5rem] border border-slate-200/80 bg-[#eaf3f2] px-3 py-3 text-left transition-transform hover:-translate-y-0.5 hover:bg-[#edf7f5]"
            >
              <AvatarBadge
                label={message.name.slice(0, 2)}
                accent={message.accent}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-[1.12rem] font-bold text-slate-800">
                    {message.name}
                  </p>
                  <span className="text-xs font-medium text-slate-500">
                    {message.time}
                  </span>
                </div>
                <p className="mt-1 truncate text-base text-slate-600">
                  {message.preview}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

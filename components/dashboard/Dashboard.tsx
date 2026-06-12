import {
  ChevronDown,
  DollarSign,
  Repeat2,
  ShoppingCart,
  Sun,
  ThumbsUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import CitizenAssistantChat from "@/components/chat/CitizenAssistantChat";
import AppShell from "@/components/layout/AppShell";

const statCards = [
  {
    label: "Sales",
    value: "75%",
    meta: "Conversion rate",
    change: "7%",
    kind: "progress",
    progress: 75,
    positive: true,
  },
  {
    label: "Revenue",
    value: "$4,300",
    meta: "Last 7 days",
    change: "8%",
    kind: "area",
    positive: true,
  },
  {
    label: "New clients",
    value: "6,782",
    meta: "Last 7 days",
    change: "0%",
    kind: "line",
    neutral: true,
  },
  {
    label: "Active subscriptions",
    value: "2,986",
    meta: "Last 7 days",
    change: "4%",
    kind: "bars",
    positive: true,
  },
];

const activityCards = [
  {
    title: "132 Sales",
    subtitle: "12 waiting payments",
    icon: DollarSign,
    className: "bg-[#0d6efd] text-white",
  },
  {
    title: "78 Orders",
    subtitle: "32 shipped",
    icon: ShoppingCart,
    className: "bg-[#2fb344] text-white",
  },
  {
    title: "623 Shares",
    subtitle: "16 today",
    icon: Repeat2,
    className: "bg-black text-white",
  },
  {
    title: "132 Likes",
    subtitle: "21 today",
    icon: ThumbsUp,
    className: "bg-[#0d6efd] text-white",
  },
];

const barValues = [
  18, 20, 17, 22, 19, 24, 18, 21, 23, 20, 31, 25, 21, 18, 39, 27, 31, 25, 24,
  28, 31, 26, 34,
];


function WelcomeIllustration() {
  return (
    <svg
      aria-hidden="true"
      className="h-[170px] w-[230px] max-w-full"
      viewBox="0 0 230 170"
    >
      <rect x="43" y="24" width="133" height="112" rx="36" fill="#eaf1fb" />
      <path
        d="M98 28c22 6 51 3 69 29 13 19 17 46 4 65-16 24-51 26-78 19-31-8-54-28-49-58 6-33 28-62 54-55Z"
        fill="#dbe9fb"
      />
      <path d="M71 139h121" stroke="#cfd7e3" strokeWidth="2" />
      <circle cx="124" cy="59" r="20" fill="#0d6efd" />
      <path
        d="m114 59 7 7 15-16"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
      <path d="M73 81c-5 18 1 39 14 50" stroke="#0d6efd" strokeWidth="6" />
      <path
        d="M67 90c-11 13-21 12-25 4"
        fill="none"
        stroke="#f7b37f"
        strokeLinecap="round"
        strokeWidth="7"
      />
      <path d="M78 71c9 4 13 15 8 24l-18-7c1-9 4-14 10-17Z" fill="#4f6074" />
      <path d="m82 102 8 35h-13l-11-32Z" fill="#0d6efd" />
      <path d="m67 105-13 25h-11l15-35Z" fill="#0b5ed7" />
      <circle cx="77" cy="65" r="8" fill="#f7b37f" />
      <path d="M68 66c7 1 14-3 15-9-9-4-18 0-15 9Z" fill="#2c3440" />
      <path d="M137 91c-20 5-29 22-25 45h43c8-16 3-35-18-45Z" fill="#0d6efd" />
      <path d="M135 91c9 1 16 8 20 20l-13 3-7-23Z" fill="#425466" />
      <circle cx="141" cy="84" r="8" fill="#f7b37f" />
      <path d="M132 81c8 2 16 1 19-4-7-7-17-6-19 4Z" fill="#425466" />
      <rect x="161" y="86" width="35" height="47" rx="6" fill="#56616f" />
      <rect x="167" y="78" width="28" height="11" rx="2" fill="#8792a2" />
      <circle cx="178" cy="112" r="13" fill="#2d3748" />
      <circle cx="178" cy="112" r="5" fill="#dbe9fb" />
      <path
        d="M49 57c6 9 12 9 18 0M176 42c7 7 12 7 17-1M198 61c-7 12-5 20 5 25M101 39c-5-8-4-14 2-20"
        fill="none"
        stroke="#0d6efd"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <circle cx="97" cy="107" r="2" fill="#0d6efd" />
      <circle cx="150" cy="49" r="2.5" fill="#667085" />
      <circle cx="172" cy="63" r="2" fill="#9fb8d8" />
    </svg>
  );
}

function SparkLine({
  muted = false,
  filled = false,
}: {
  muted?: boolean;
  filled?: boolean;
}) {
  const path =
    "M1 47 C15 52 24 47 34 48 C45 48 51 42 61 45 C69 48 70 35 78 38 C88 44 98 40 108 42 C120 44 123 29 130 33 C138 37 141 49 151 43 C160 37 165 44 172 48 C183 56 186 36 198 41 C210 45 216 34 228 28";

  return (
    <svg className="h-full w-full" viewBox="0 0 230 64" preserveAspectRatio="none">
      {filled ? (
        <path
          d={`${path} L228 64 L1 64 Z`}
          fill="#0d6efd"
          opacity="0.12"
        />
      ) : null}
      <path
        d="M1 34 C12 18 19 51 30 28 C41 7 47 56 60 31 C73 4 82 61 94 35 C106 15 115 45 126 23 C137 2 143 59 157 36 C171 13 179 49 190 25 C202 4 212 47 229 18"
        fill="none"
        stroke="#aab4c2"
        strokeDasharray="4 4"
        strokeWidth="1.4"
      />
      <path
        d={path}
        fill="none"
        stroke={muted ? "#93a4b7" : "#0d6efd"}
        strokeLinecap="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function Gauge() {
  return (
    <div className="relative mx-auto mt-3 h-[118px] w-[178px]">
      <svg viewBox="0 0 180 118" className="h-full w-full">
        <path
          d="M31 99a60 60 0 0 1 118 0"
          fill="none"
          stroke="#e4e8ee"
          strokeLinecap="butt"
          strokeWidth="22"
        />
        <path
          d="M31 99a60 60 0 0 1 118 0"
          fill="none"
          pathLength="100"
          stroke="#0d6efd"
          strokeLinecap="butt"
          strokeDasharray="78 100"
          strokeWidth="22"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-4 text-center text-2xl font-medium text-[#253142]">
        78%
      </div>
    </div>
  );
}

function TinyBars({ compact = false }: { compact?: boolean }) {
  const values = compact
    ? [32, 38, 34, 50, 39, 42, 44, 37, 53, 48, 65, 51, 41, 36, 79, 48, 55, 43, 49, 38, 52, 46, 41, 58]
    : barValues;

  return (
    <div className="flex h-full items-end gap-[5px]">
      {values.map((value, index) => (
        <span
          className="w-full min-w-1 rounded-t-sm bg-[#0d6efd]"
          key={`${value}-${index}`}
          style={{ height: `${value}%` }}
        />
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  meta,
  change,
  kind,
  progress,
  positive,
  neutral,
}: {
  label: string;
  value: string;
  meta: string;
  change: string;
  kind: string;
  progress?: number;
  positive?: boolean;
  neutral?: boolean;
}) {
  return (
    <article className="rounded-md border border-[#dfe3e8] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#667085]">
            {label}
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-2xl font-semibold leading-none text-[#182433]">
              {value}
            </p>
            {kind !== "progress" ? (
              <span
                className={`text-sm ${
                  neutral
                    ? "text-[#f59f00]"
                    : positive
                      ? "text-[#2fb344]"
                      : "text-[#d63939]"
                }`}
              >
                {change}
              </span>
            ) : null}
          </div>
        </div>
        <button className="flex items-center gap-1 text-sm text-[#667085]">
          {meta}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      {kind === "progress" ? (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-[#182433]">{meta}</span>
            <span className="text-[#2fb344]">{change}</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-[#e9edf3]">
            <div
              className="h-full rounded-full bg-[#0d6efd]"
              style={{ width: `${progress ?? 0}%` }}
            />
          </div>
        </div>
      ) : null}

      {kind === "area" ? (
        <div className="mt-6 h-[48px]">
          <SparkLine filled />
        </div>
      ) : null}

      {kind === "line" ? (
        <div className="mt-6 h-[48px]">
          <SparkLine />
        </div>
      ) : null}

      {kind === "bars" ? (
        <div className="mt-5 h-[58px]">
          <TinyBars compact />
        </div>
      ) : null}
    </article>
  );
}

function ActivityCard({
  title,
  subtitle,
  icon: Icon,
  className,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  className: string;
}) {
  return (
    <article className="flex items-center gap-4 rounded-md border border-[#dfe3e8] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${className}`}
      >
        <Icon className="h-5 w-5" strokeWidth={1.9} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-[#182433]">{title}</p>
        <p className="truncate text-sm text-[#667085]">{subtitle}</p>
      </div>
    </article>
  );
}

function MainStats() {
  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr]">
      <article className="rounded-md border border-[#dfe3e8] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="grid min-h-[190px] gap-5 sm:grid-cols-[1.45fr_1fr]">
          <div className="flex flex-col">
            <div>
              <h2 className="text-xl font-semibold text-[#182433]">
                Welcome back, Pawel
              </h2>
              <p className="mt-3 max-w-[320px] text-sm leading-6 text-[#526071]">
                You have 5 new messages and 2 new notifications.
              </p>
            </div>
            <div className="mt-auto grid gap-8 pt-8 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#667085]">
                  Today&apos;s sales
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-base font-semibold text-[#182433]">
                    6,782
                  </span>
                  <span className="text-sm text-[#2fb344]">7%</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#e9edf3]">
                  <div className="h-full w-[70%] bg-[#2fb344]" />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#667085]">
                  Growth rate
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-base font-semibold text-[#182433]">
                    78.4%
                  </span>
                  <span className="text-sm text-[#d63939]">-1%</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#e9edf3]">
                  <div className="h-full w-[78%] bg-[#d63939]" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <WelcomeIllustration />
          </div>
        </div>
      </article>

      <article className="rounded-md border border-[#dfe3e8] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <p className="text-xs font-medium uppercase tracking-wide text-[#667085]">
          Total users
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <p className="text-2xl font-semibold leading-none text-[#182433]">
            75,782
          </p>
          <span className="text-sm text-[#2fb344]">2%</span>
        </div>
        <p className="mt-3 text-sm text-[#667085]">
          24,635 users increased from last month
        </p>
        <div className="mt-11 h-[58px]">
          <SparkLine filled />
        </div>
      </article>

      <article className="rounded-md border border-[#dfe3e8] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <p className="text-xs font-medium uppercase tracking-wide text-[#667085]">
          Active users
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <p className="text-2xl font-semibold leading-none text-[#182433]">
            25,782
          </p>
          <span className="text-sm text-[#d63939]">-1%</span>
        </div>
        <Gauge />
      </article>
    </div>
  );
}

function TrafficSummary() {
  return (
    <article className="rounded-md border border-[#dfe3e8] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <h3 className="text-base font-semibold text-[#182433]">Traffic summary</h3>
      <div className="mt-6 grid h-[270px] grid-cols-[28px_1fr] gap-3">
        <div className="flex flex-col justify-between pb-5 text-xs text-[#526071]">
          <span>100</span>
          <span>80</span>
          <span>60</span>
          <span>40</span>
          <span>20</span>
        </div>
        <div className="relative border-l border-dashed border-[#dfe3e8]">
          <div className="absolute inset-0 grid grid-rows-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <span className="border-t border-dashed border-[#dfe3e8]" key={index} />
            ))}
          </div>
          <div className="absolute inset-x-3 bottom-0 flex h-full items-end gap-2">
            {[
              28, 40, 36, 32, 46, 58, 64, 57, 41, 35, 50, 72, 65, 70, 98, 56,
            ].map((value, index) => (
              <div className="flex h-full flex-1 items-end" key={`${value}-${index}`}>
                <span
                  className="block w-full rounded-t-sm bg-[#0d6efd]"
                  style={{ height: `${Math.max(value - 7, 12)}%` }}
                />
                <span
                  className="block w-full rounded-t-sm bg-[#2fb344]"
                  style={{ height: `${Math.min(value, 100)}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function WorldMap() {
  const regions = [
    "M42 74 65 58l29 8 12 19-20 22-32-2-20-13Z",
    "M96 53 128 47l25 17-7 28-31 6-22-18Z",
    "M145 99 177 91l29 20-13 30-39 4-23-20Z",
    "M197 51 245 45l39 21-18 33-56 7-29-25Z",
    "M278 87 342 74l51 23-19 36-76 3-39-25Z",
    "M382 49 451 43l54 26-26 39-82 7-38-30Z",
    "M504 102 565 91l49 22-18 34-73 7-39-24Z",
    "M206 133 247 146l7 43-28 35-31-24-9-41Z",
    "M431 127 492 139l20 53-43 28-52-18-16-47Z",
  ];

  return (
    <svg className="h-full w-full" viewBox="0 0 650 260" preserveAspectRatio="xMidYMid meet">
      <rect width="650" height="260" fill="white" />
      <g fill="#e9eef5" stroke="#d8dee8" strokeWidth="1.2">
        <path d="M32 67 72 42l62 12 37 42-31 53-76-4-43-43Z" />
        <path d="M171 38 255 26l73 42-30 67-94 7-49-49Z" />
        <path d="M337 58 432 23l89 29-3 62-88 27-74-21Z" />
        <path d="M501 48 619 43l18 65-48 45-99-14-25-55Z" />
        <path d="M198 146 272 159l18 57-44 41-61-34-12-48Z" />
        <path d="M389 141 492 144l51 48-25 51-96-4-54-45Z" />
      </g>
      <g fill="#0d6efd" opacity="0.76">
        {regions.map((path) => (
          <path d={path} key={path} />
        ))}
      </g>
      <g fill="#0d6efd">
        <circle cx="87" cy="86" r="4" />
        <circle cx="228" cy="82" r="4" />
        <circle cx="418" cy="81" r="4" />
        <circle cx="542" cy="126" r="4" />
        <circle cx="226" cy="178" r="4" />
      </g>
    </svg>
  );
}

function Locations() {
  return (
    <article className="rounded-md border border-[#dfe3e8] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <h3 className="text-base font-semibold text-[#182433]">Locations</h3>
      <div className="mt-4 h-[284px] overflow-hidden">
        <WorldMap />
      </div>
    </article>
  );
}

export default function Dashboard() {
  return (
    <AppShell activeHref="/">
      <main className="mx-auto max-w-[1288px] px-4 py-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#667085]">
              Overview
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#182433]">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-10 rounded-md border border-[#dfe3e8] bg-white px-4 text-sm font-medium text-[#182433] shadow-sm hover:bg-[#f8fafc]">
              New view
            </button>
            <CitizenAssistantChat />
          </div>
        </div>

        <div className="space-y-4">
          <MainStats />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {activityCards.map((card) => (
              <ActivityCard key={card.title} {...card} />
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <TrafficSummary />
            <Locations />
          </div>
        </div>
      </main>

      <button
        aria-label="Customize"
        className="fixed bottom-5 left-4 flex h-10 w-10 items-center justify-center rounded-md bg-[#0d6efd] text-white shadow-lg hover:bg-[#0b5ed7]"
      >
        <Sun className="h-5 w-5" strokeWidth={1.8} />
      </button>
    </AppShell>
  );
}

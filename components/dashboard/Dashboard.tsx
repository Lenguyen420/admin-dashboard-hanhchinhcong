import {
  Activity,
  BadgeCheck,
  BellRing,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileCheck2,
  FileText,
  MapPinned,
  MessageSquareText,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import CitizenAssistantChat from "@/components/chat/CitizenAssistantChat";
import AppShell from "@/components/layout/AppShell";

type StatCardData = {
  label: string;
  value: string;
  meta: string;
  change: string;
  kind: "progress" | "area" | "line" | "bars";
  progress?: number;
  positive?: boolean;
  neutral?: boolean;
};

const statCards: StatCardData[] = [
  {
    label: "Hồ sơ trực tuyến",
    value: "1.248",
    meta: "Trong tháng này",
    change: "+12%",
    kind: "progress",
    progress: 82,
    positive: true,
  },
  {
    label: "Hồ sơ đã xử lý",
    value: "1.086",
    meta: "Trong tháng này",
    change: "+9%",
    kind: "area",
    positive: true,
  },
  {
    label: "Phản ánh kiến nghị",
    value: "126",
    meta: "Trong tháng này",
    change: "+4%",
    kind: "line",
    neutral: true,
  },
  {
    label: "Lượt truy cập cổng số",
    value: "8.542",
    meta: "Trong 30 ngày",
    change: "+16%",
    kind: "bars",
    positive: true,
  },
];

const activityCards = [
  {
    title: "42 hồ sơ chờ xử lý",
    subtitle: "Cần tiếp nhận và phân loại",
    icon: Clock3,
    className: "bg-amber-500 text-white",
  },
  {
    title: "1.086 hồ sơ hoàn thành",
    subtitle: "Đã trả kết quả cho công dân",
    icon: CheckCircle2,
    className: "bg-emerald-600 text-white",
  },
  {
    title: "18 phản ánh mới",
    subtitle: "Đang chờ cán bộ phản hồi",
    icon: MessageSquareText,
    className: "bg-blue-600 text-white",
  },
  {
    title: "32 thông báo",
    subtitle: "Đã gửi trong hôm nay",
    icon: BellRing,
    className: "bg-violet-600 text-white",
  },
];

const barValues = [
  32, 46, 38, 52, 44, 58, 62, 49, 66, 72, 54, 68, 75, 64, 82, 78, 88, 70, 76,
  84, 90, 86, 94, 88,
];

function WelcomeIllustration() {
  return (
    <svg
      aria-hidden="true"
      className="h-[180px] w-[240px] max-w-full"
      viewBox="0 0 240 180"
    >
      <rect x="30" y="24" width="174" height="126" rx="32" fill="#eff6ff" />

      <rect
        x="78"
        y="43"
        width="88"
        height="102"
        rx="10"
        fill="#ffffff"
        stroke="#bfdbfe"
        strokeWidth="2"
      />

      <rect x="94" y="59" width="56" height="8" rx="4" fill="#dbeafe" />
      <rect x="94" y="78" width="56" height="8" rx="4" fill="#dbeafe" />
      <rect x="94" y="97" width="38" height="8" rx="4" fill="#dbeafe" />

      <circle cx="70" cy="67" r="24" fill="#2563eb" />
      <path
        d="m60 67 7 7 14-17"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />

      <circle cx="174" cy="117" r="27" fill="#10b981" />
      <path
        d="M174 102v30M159 117h30"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeWidth="5"
      />

      <circle cx="183" cy="55" r="13" fill="#f59e0b" />
      <path
        d="M183 48v8l5 4"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeWidth="3"
      />

      <path d="M49 151h144" stroke="#cbd5e1" strokeWidth="2" />
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
    "M1 48 C14 50 23 43 34 46 C45 49 52 37 62 40 C72 44 80 30 90 34 C103 39 112 28 122 31 C133 35 140 23 151 27 C162 31 172 22 183 25 C195 29 207 18 229 15";

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 230 64"
      preserveAspectRatio="none"
    >
      {filled ? (
        <path d={`${path} L229 64 L1 64 Z`} fill="#2563eb" opacity="0.12" />
      ) : null}

      <path
        d={path}
        fill="none"
        stroke={muted ? "#94a3b8" : "#2563eb"}
        strokeLinecap="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}

function Gauge() {
  return (
    <div className="relative mx-auto mt-3 h-[118px] w-[178px]">
      <svg className="h-full w-full" viewBox="0 0 180 118">
        <path
          d="M31 99a60 60 0 0 1 118 0"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="22"
        />
        <path
          d="M31 99a60 60 0 0 1 118 0"
          fill="none"
          pathLength="100"
          stroke="#10b981"
          strokeDasharray="87 100"
          strokeWidth="22"
        />
      </svg>

      <div className="absolute inset-x-0 bottom-4 text-center">
        <p className="text-2xl font-semibold text-slate-800">87%</p>
        <p className="mt-1 text-xs text-slate-500">Đã kích hoạt</p>
      </div>
    </div>
  );
}

function TinyBars() {
  return (
    <div className="flex h-full items-end gap-[5px]">
      {barValues.map((value, index) => (
        <span
          className="w-full min-w-1 rounded-t-sm bg-blue-600"
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
}: StatCardData) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-slate-800">{value}</p>

            {kind !== "progress" ? (
              <span
                className={`text-sm font-medium ${
                  neutral
                    ? "text-amber-600"
                    : positive
                      ? "text-emerald-600"
                      : "text-red-600"
                }`}
              >
                {change}
              </span>
            ) : null}
          </div>
        </div>

        <button
          className="flex items-center gap-1 text-xs text-slate-500"
          type="button"
        >
          {meta}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      {kind === "progress" ? (
        <div className="mt-7">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-600">Tỷ lệ hoàn tất</span>
            <span className="font-medium text-emerald-600">{change}</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{ width: `${progress ?? 0}%` }}
            />
          </div>
        </div>
      ) : null}

      {kind === "area" ? (
        <div className="mt-6 h-[52px]">
          <SparkLine filled />
        </div>
      ) : null}

      {kind === "line" ? (
        <div className="mt-6 h-[52px]">
          <SparkLine muted />
        </div>
      ) : null}

      {kind === "bars" ? (
        <div className="mt-6 h-[58px]">
          <TinyBars />
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
    <article className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${className}`}
      >
        <Icon className="h-5 w-5" strokeWidth={1.9} />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-800">{title}</p>
        <p className="mt-1 truncate text-sm text-slate-500">{subtitle}</p>
      </div>
    </article>
  );
}

function MainStats() {
  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr]">
      <article className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-blue-50 p-5 shadow-sm">
        <div className="grid min-h-[200px] gap-5 sm:grid-cols-[1.45fr_1fr]">
          <div className="flex flex-col">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Trung tâm điều hành số
              </p>

              <h2 className="mt-2 text-xl font-semibold text-slate-800">
                Chào mừng đến Dashboard Công dân số
              </h2>

              <p className="mt-3 max-w-[420px] text-sm leading-6 text-slate-600">
                Theo dõi dữ liệu công dân, hồ sơ hành chính, phản ánh kiến nghị
                và mức độ sử dụng dịch vụ số tại xã/phường.
              </p>
            </div>

            <div className="mt-auto grid gap-7 pt-8 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Hồ sơ tiếp nhận hôm nay
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="text-lg font-semibold text-slate-800">
                    86
                  </span>
                  <span className="text-sm font-medium text-emerald-600">
                    +12%
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[72%] rounded-full bg-emerald-500" />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tỷ lệ xử lý đúng hạn
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="text-lg font-semibold text-slate-800">
                    96,8%
                  </span>
                  <span className="text-sm font-medium text-emerald-600">
                    +2,4%
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[96%] rounded-full bg-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <WelcomeIllustration />
          </div>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Users className="h-5 w-5" />
          </div>

          <span className="text-sm font-medium text-emerald-600">+3,8%</span>
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Tổng công dân
        </p>

        <p className="mt-2 text-2xl font-semibold text-slate-800">18.642</p>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Tăng 684 công dân so với tháng trước
        </p>

        <div className="mt-5 h-[48px]">
          <SparkLine filled />
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <BadgeCheck className="h-5 w-5" />
          </div>

          <span className="text-sm font-medium text-emerald-600">+5,2%</span>
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Tài khoản công dân số
        </p>

        <p className="mt-2 text-2xl font-semibold text-slate-800">16.219</p>

        <Gauge />
      </article>
    </div>
  );
}

function ServiceChart() {
  const data = [
    { label: "T2", online: 38, completed: 32 },
    { label: "T3", online: 52, completed: 45 },
    { label: "T4", online: 48, completed: 42 },
    { label: "T5", online: 62, completed: 54 },
    { label: "T6", online: 74, completed: 66 },
    { label: "T7", online: 56, completed: 50 },
    { label: "CN", online: 42, completed: 37 },
  ];

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-800">
            Thống kê hồ sơ dịch vụ công
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Số lượng hồ sơ tiếp nhận và hoàn thành trong 7 ngày
          </p>
        </div>

        <div className="flex gap-4 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-2">
            <i className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            Tiếp nhận
          </span>

          <span className="flex items-center gap-2">
            <i className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Hoàn thành
          </span>
        </div>
      </div>

      <div className="mt-6 grid h-[270px] grid-cols-[30px_1fr] gap-3">
        <div className="flex flex-col justify-between pb-7 text-xs text-slate-400">
          <span>80</span>
          <span>60</span>
          <span>40</span>
          <span>20</span>
          <span>0</span>
        </div>

        <div className="relative">
          <div className="absolute inset-x-0 top-0 grid h-[240px] grid-rows-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <span
                className="border-t border-dashed border-slate-200"
                key={index}
              />
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-0 flex h-[240px] items-end justify-around gap-3">
            {data.map((item) => (
              <div
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                key={item.label}
              >
                <div className="flex h-full items-end gap-1.5">
                  <span
                    className="block w-5 rounded-t-md bg-blue-600"
                    style={{ height: `${item.online}%` }}
                  />
                  <span
                    className="block w-5 rounded-t-md bg-emerald-500"
                    style={{ height: `${item.completed}%` }}
                  />
                </div>

                <span className="text-xs font-medium text-slate-500">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function DigitalCitizenSummary() {
  const rows = [
    {
      label: "Đã xác thực định danh",
      value: "15.824",
      percent: 85,
      icon: ShieldCheck,
      iconClassName: "bg-emerald-50 text-emerald-600",
      progressClassName: "bg-emerald-500",
    },
    {
      label: "Đã đăng ký tài khoản số",
      value: "16.219",
      percent: 87,
      icon: UserCheck,
      iconClassName: "bg-blue-50 text-blue-600",
      progressClassName: "bg-blue-600",
    },
    {
      label: "Đã sử dụng dịch vụ công",
      value: "12.456",
      percent: 67,
      icon: FileCheck2,
      iconClassName: "bg-violet-50 text-violet-600",
      progressClassName: "bg-violet-500",
    },
    {
      label: "Đã cài ứng dụng công dân số",
      value: "10.982",
      percent: 59,
      icon: Activity,
      iconClassName: "bg-amber-50 text-amber-600",
      progressClassName: "bg-amber-500",
    },
  ];

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-800">
        Mức độ tham gia công dân số
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Thống kê trên tổng số 18.642 công dân
      </p>

      <div className="mt-5 space-y-5">
        {rows.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.iconClassName}`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  <p className="truncate text-sm font-medium text-slate-700">
                    {item.label}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">
                    {item.value}
                  </p>
                  <p className="text-xs text-slate-500">{item.percent}%</p>
                </div>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${item.progressClassName}`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function WardSummary() {
  const wards = [
    {
      name: "Khu phố 1",
      citizens: "3.842",
      accounts: "3.468",
      rate: "90%",
    },
    {
      name: "Khu phố 2",
      citizens: "3.126",
      accounts: "2.734",
      rate: "87%",
    },
    {
      name: "Khu phố 3",
      citizens: "4.254",
      accounts: "3.625",
      rate: "85%",
    },
    {
      name: "Khu phố 4",
      citizens: "3.980",
      accounts: "3.354",
      rate: "84%",
    },
    {
      name: "Khu phố 5",
      citizens: "3.440",
      accounts: "3.038",
      rate: "88%",
    },
  ];

  return (
    <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-5">
        <div>
          <h3 className="text-base font-semibold text-slate-800">
            Thống kê theo khu phố
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Tiến độ triển khai tài khoản công dân số
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <MapPinned className="h-5 w-5" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Địa bàn</th>
              <th className="px-5 py-3 font-semibold">Công dân</th>
              <th className="px-5 py-3 font-semibold">Tài khoản số</th>
              <th className="px-5 py-3 text-right font-semibold">Tỷ lệ</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {wards.map((item) => (
              <tr className="hover:bg-slate-50" key={item.name}>
                <td className="px-5 py-4 font-medium text-slate-700">
                  {item.name}
                </td>
                <td className="px-5 py-4 text-slate-600">{item.citizens}</td>
                <td className="px-5 py-4 text-slate-600">{item.accounts}</td>
                <td className="px-5 py-4 text-right">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                    {item.rate}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export default function Dashboard() {
  return (
    <AppShell activeHref="/">
      <main className="mx-auto max-w-[1400px] px-4 py-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Trung tâm điều hành
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-800">
              Dashboard Công dân số
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Dữ liệu tổng hợp hoạt động chuyển đổi số tại xã/phường
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
              type="button"
            >
              <Building2 className="h-4 w-4" />
              UBND xã/phường
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

          <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
            <ServiceChart />
            <DigitalCitizenSummary />
          </div>

          <WardSummary />
        </div>
      </main>
    </AppShell>
  );
}

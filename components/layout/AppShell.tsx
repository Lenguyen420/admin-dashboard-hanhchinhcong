import { Bell, Grid2X2, Moon, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  {
    label: "Tổng quan",
    href: "/",
  },
  {
    label: "Chatbot",
    href: "/admin/knowledge",
  },
  {
    label: "Phản ánh kiến nghị",
    href: "/admin/feedbacks",
  },
  {
    label: "Người dùng",
    href: "/admin/users",
  },
  {
    label: "Tin tức",
    href: "/admin/news",
  },
  {
    label: "Văn bản pháp luật",
    href: "/admin/legal-document",
  },
  {
    label: "Danh mục văn bản",
    href: "/admin/document-categories",
  },
  {
    label: "Doanh nghiệp",
    href: "/admin/businesses",
  },
  {
    label: "Khu công nghiệp",
    href: "/admin/industrial-parks",
  },
  {
    label: "Việc làm",
    href: "/admin/jobs",
  },
  {
    label: "Sản phẩm OCOP",
    href: "/admin/ocops",
  },
  {
    label: "Cửa hàng",
    href: "/admin/stores",
  },
  {
    label: "Khu vực",
    href: "/admin/zones",
  },
  {
    label: "Tệp đính kèm",
    href: "/admin/attachments",
  },
];

function PartyFlag() {
  return (
    <div
      aria-label="Cờ Đảng"
      className="
        relative flex h-9 w-14 items-center justify-center overflow-hidden
        rounded-sm border border-yellow-300/50 bg-[#c8102e]
        shadow-sm ring-1 ring-white/20
      "
      title="Cờ Đảng"
    >
      <span className="text-[22px] font-black leading-none text-[#ffd21f]">
        ☭
      </span>

      <span className="absolute inset-x-0 top-0 h-1 bg-white/10" />
      <span className="absolute inset-y-0 left-0 w-1 bg-black/10" />
    </div>
  );
}

function VietnamFlag() {
  return (
    <div
      aria-label="Cờ Tổ quốc Việt Nam"
      className="
        relative flex h-9 w-14 items-center justify-center overflow-hidden
        rounded-sm border border-yellow-300/50 bg-[#da251d]
        shadow-sm ring-1 ring-white/20
      "
      title="Cờ Tổ quốc Việt Nam"
    >
      <span className="text-[24px] leading-none text-[#ffff00]">★</span>

      <span className="absolute inset-x-0 top-0 h-1 bg-white/10" />
      <span className="absolute inset-y-0 left-0 w-1 bg-black/10" />
    </div>
  );
}

function Logo() {
  return (
    <Link
      aria-label="Trang chủ"
      className="group flex min-w-0 items-center gap-4"
      href="/"
    >
      <div className="hidden items-center gap-2 sm:flex">
        <PartyFlag />
        <VietnamFlag />
      </div>

      <div
        className="
          relative min-w-0 overflow-hidden rounded-2xl
          border border-yellow-300/40
          bg-white/10 px-4 py-3
          shadow-sm shadow-red-950/20
          ring-1 ring-white/15
          backdrop-blur
          transition-all duration-300
          group-hover:-translate-y-0.5
          group-hover:bg-white/15
          group-hover:shadow-md
        "
      >
        <div className="absolute left-0 top-0 h-full w-1.5 bg-[#ffd21f]" />

        <div className="pl-2 leading-tight">
          <p
            className="
              truncate text-[12px] font-bold uppercase tracking-wide
              text-yellow-100 sm:text-sm
            "
          >
            ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM
          </p>

          <p
            className="
              mt-1 truncate text-[15px] font-extrabold uppercase tracking-wide
              text-white sm:text-base
            "
          >
            XÃ CÂY SỘP, TỈNH TP. HỒ CHÍ MINH
          </p>
        </div>
      </div>
    </Link>
  );
}

function IconButton({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className="
        flex h-9 w-9 items-center justify-center
        rounded-lg border border-white/15
        bg-white/10 text-white/90
        transition
        hover:bg-white/20
        hover:text-white
      "
      title={label}
      type="button"
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
    </button>
  );
}

function OfferText() {
  return (
    <p className="shrink-0 px-12 text-sm text-yellow-50">
      <span className="font-bold text-[#ffd21f]">SKILL TRIP X</span>
      <span className="mx-3 text-yellow-200/70">•</span>
      Công ty phần mềm cung cấp giải pháp công nghệ hiện đại, thiết kế website,
      xây dựng ứng dụng và chuyển đổi số cho doanh nghiệp.
      <span className="mx-3 text-yellow-200/70">•</span>
      <span className="font-semibold text-white">
        Đồng hành cùng doanh nghiệp trên hành trình phát triển số
      </span>
      <span className="mx-3 text-yellow-200/70">•</span>
    </p>
  );
}

function TopOffer() {
  return (
    <div
      className="
        relative flex h-9 w-full items-center overflow-hidden
        border-b border-red-900/30
        bg-gradient-to-r from-[#7f0d0d] via-[#b91c1c] to-[#7f0d0d]
      "
    >
      <div className="animate-marquee flex w-max shrink-0 items-center whitespace-nowrap">
        <OfferText />
        <OfferText />
      </div>
    </div>
  );
}

function Header() {
  return (
    <header
      className="
        border-b border-red-950/30
        bg-gradient-to-br from-[#8f1111] via-[#b91c1c] to-[#7f0d0d]
        text-white shadow-md shadow-red-950/20
      "
    >
      <div className="mx-auto flex max-w-[1288px] flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <Logo />

        <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end">
          <div className="flex items-center gap-2 sm:hidden">
            <PartyFlag />
            <VietnamFlag />
          </div>

          <div className="flex items-center gap-1">
            <IconButton icon={Moon} label="Chế độ tối" />

            <div className="relative">
              <IconButton icon={Bell} label="Thông báo" />

              <span className="absolute right-2 top-1.5 h-2.5 w-2.5 rounded-full border border-white bg-[#ffd21f]" />
            </div>

            <IconButton icon={Grid2X2} label="Ứng dụng" />
          </div>

          <div
            className="
              flex items-center gap-3 rounded-xl
              border border-white/15 bg-white/10
              px-3 py-2 backdrop-blur
            "
          >
            <div className="h-9 w-9 overflow-hidden rounded-lg border border-white/20 bg-yellow-100">
              <div className="flex h-full items-end justify-center bg-gradient-to-b from-yellow-200 to-red-700">
                <User className="h-7 w-7 text-white/95" />
              </div>
            </div>

            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">Quản trị viên</p>
              <p className="text-xs text-yellow-100/90">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavBar({ activeHref }: { activeHref: string }) {
  return (
    <nav
      className="
        border-b border-red-200
        bg-white shadow-sm
      "
    >
      <div className="mx-auto max-w-[1288px] overflow-x-auto px-4">
        <div className="flex min-w-max items-center gap-1">
          {navItems.map(({ label, href }) => {
            const active =
              href === "/"
                ? activeHref === "/"
                : activeHref === href || activeHref.startsWith(`${href}/`);

            return (
              <Link
                className={`
                  group relative flex h-13 items-center rounded-t-lg px-3
                  text-sm font-medium transition-colors
                  ${
                    active
                      ? "bg-red-50 text-[#b91c1c]"
                      : "text-[#4b5563] hover:bg-red-50 hover:text-[#b91c1c]"
                  }
                `}
                href={href}
                key={href}
              >
                <span>{label}</span>

                {active ? (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#b91c1c]" />
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default function AppShell({
  activeHref = "/",
  children,
}: {
  activeHref?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f2ef] text-[#182433]">
      <TopOffer />
      <Header />
      <NavBar activeHref={activeHref} />

      <main className="mx-auto w-full max-w-[1288px] px-4 py-6">
        {children}
      </main>
    </div>
  );
}

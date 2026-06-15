import { Bell, Grid2X2, Moon, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { FolderOpen, FileText, Newspaper } from "lucide-react";

import logo from "@/public/logo.png";

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
    href: "/admin/document",
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

function Logo() {
  return (
    <Link aria-label="Trang chủ" className="group flex items-center" href="/">
      <div
        className="
          flex h-14 w-50 items-center justify-center
          overflow-hidden rounded-2xl
          border border-blue-200
          bg-white
          p-0.5
          shadow-md shadow-blue-100
          ring-2 ring-blue-50
          transition-all duration-300
          group-hover:-translate-y-0.5
          group-hover:border-blue-400
          group-hover:shadow-lg
          group-hover:shadow-blue-200
        "
      >
        <NextImage
          alt="Logo"
          className="
            h-full w-full object-contain
            transition-transform duration-300
            group-hover:scale-105
          "
          priority
          src={logo}
        />
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
        rounded-md text-[#667085]
        transition
        hover:bg-[#f1f5f9]
        hover:text-[#1f2937]
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
    <p className="shrink-0 px-12 text-sm text-[#1f2a44]">
      <span className="font-bold text-[#003c71]">SKILL TRIP X</span>
      <span className="mx-3 text-[#94a3b8]">•</span>
      Công ty phần mềm cung cấp giải pháp công nghệ hiện đại, thiết kế website,
      xây dựng ứng dụng và chuyển đổi số cho doanh nghiệp.
      <span className="mx-3 text-[#94a3b8]">•</span>
      <span className="font-semibold text-[#0077b6]">
        Đồng hành cùng doanh nghiệp trên hành trình phát triển số
      </span>
      <span className="mx-3 text-[#94a3b8]">•</span>
    </p>
  );
}

function TopOffer() {
  return (
    <div className="relative flex h-10 w-full items-center overflow-hidden border-b border-[#dfe3e8] bg-white">
      <div className="animate-marquee flex w-max shrink-0 items-center whitespace-nowrap">
        <OfferText />
        <OfferText />
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-[#dfe3e8] bg-white">
      <div className="mx-auto flex max-w-[1288px] flex-col gap-4 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <Logo />

        <div className="flex flex-wrap items-center gap-3">
          <div className="ml-1 flex items-center gap-1">
            <IconButton icon={Moon} label="Chế độ tối" />

            <div className="relative">
              <IconButton icon={Bell} label="Thông báo" />

              <span className="absolute right-2 top-1.5 h-2.5 w-2.5 rounded-full bg-[#d63939]" />
            </div>

            <IconButton icon={Grid2X2} label="Ứng dụng" />
          </div>

          <div className="flex items-center gap-3 pl-2">
            <div className="h-9 w-9 overflow-hidden rounded-md bg-[#f2d3bd]">
              <div className="flex h-full items-end justify-center bg-gradient-to-b from-[#f1c3a3] to-[#2d6cdf]">
                <User className="h-7 w-7 text-white/90" />
              </div>
            </div>

            <div className="leading-tight">
              <p className="text-sm font-medium text-[#182433]">
                Quản trị viên
              </p>

              <p className="text-xs text-[#667085]">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavBar({ activeHref }: { activeHref: string }) {
  return (
    <nav className="border-b border-[#dfe3e8] bg-white">
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
                  group relative flex h-14 items-center px-3
                  text-sm transition-colors
                  ${active ? "font-medium text-[#182433]" : "text-[#526071]"}
                  hover:text-[#0d6efd]
                `}
                href={href}
                key={href}
              >
                <span>{label}</span>

                {active ? (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 bg-[#0d6efd]" />
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
    <div className="min-h-screen bg-[#f5f7fb] text-[#182433]">
      <TopOffer />
      <Header />
      <NavBar activeHref={activeHref} />
      {children}
    </div>
  );
}

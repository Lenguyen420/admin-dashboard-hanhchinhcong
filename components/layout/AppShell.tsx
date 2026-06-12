import {
  Bell,
  Box,
  ChevronDown,
  CircleHelp,
  Code,
  Database,
  Gift,
  Grid2X2,
  Home,
  MessageSquareText,
  Moon,
  Package,
  Settings,
  ShieldCheck,
  Star,
  Tags,
  User,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Knowledge", icon: Database, href: "/admin/knowledge" },
  { label: "Feedback types", icon: Tags, href: "/admin/feedback-types" },
  { label: "Feedbacks", icon: MessageSquareText, href: "/admin/feedbacks" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Interface", icon: Box, href: "#", menu: true },
  { label: "Forms", icon: ShieldCheck, href: "#", menu: true },
  { label: "Extra", icon: Star, href: "#", menu: true },
  { label: "Layout", icon: Grid2X2, href: "#", menu: true },
  { label: "Plugins", icon: Package, href: "#", menu: true },
  { label: "Addons", icon: Gift, href: "#", menu: true },
  { label: "Help", icon: CircleHelp, href: "#", menu: true },
];

function Logo() {
  return (
    <Link className="flex items-center gap-3" href="/">
      <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#0d6efd] text-white shadow-sm">
        <span className="text-xl font-bold leading-none">&gt;_</span>
      </div>
      <span className="text-2xl font-semibold tracking-tight text-[#3f454d]">
        tabler
      </span>
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
      className="flex h-9 w-9 items-center justify-center rounded-md text-[#667085] transition hover:bg-[#f1f5f9] hover:text-[#1f2937]"
      title={label}
      type="button"
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
    </button>
  );
}

function TopOffer() {
  return (
    <div className="relative flex h-10 items-center justify-center border-b border-[#dfe3e8] bg-white px-10 text-sm text-[#1f2a44]">
      <p className="truncate">
        <span className="font-semibold">SPECIAL OFFER</span>
        <span className="ml-2">Get all Tabler&apos;s products for just</span>
        <span className="font-semibold"> $69.</span>
        <span> Save </span>
        <span className="font-semibold">$47!</span>
      </p>
      <button
        aria-label="Close offer"
        className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[#8a94a6] hover:bg-[#f1f5f9]"
        type="button"
      >
        x
      </button>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-[#dfe3e8] bg-white">
      <div className="mx-auto flex max-w-[1288px] flex-col gap-4 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <Logo />

        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex h-10 items-center gap-2 rounded-md border border-[#dfe3e8] bg-white px-4 text-sm font-medium text-[#182433] shadow-sm hover:bg-[#f8fafc]">
            <Code className="h-4 w-4" />
            Source code
          </button>
          <button className="inline-flex h-10 items-center gap-2 rounded-md border border-[#dfe3e8] bg-white px-4 text-sm font-medium text-[#182433] shadow-sm hover:bg-[#f8fafc]">
            <span className="text-lg leading-none text-[#e83e8c]">♡</span>
            Sponsor
          </button>
          <div className="ml-1 flex items-center gap-1">
            <IconButton icon={Moon} label="Dark mode" />
            <div className="relative">
              <IconButton icon={Bell} label="Notifications" />
              <span className="absolute right-2 top-1.5 h-2.5 w-2.5 rounded-full bg-[#d63939]" />
            </div>
            <IconButton icon={Grid2X2} label="Apps" />
          </div>
          <div className="flex items-center gap-3 pl-2">
            <div className="h-9 w-9 overflow-hidden rounded-md bg-[#f2d3bd]">
              <div className="flex h-full items-end justify-center bg-gradient-to-b from-[#f1c3a3] to-[#2d6cdf]">
                <User className="h-7 w-7 text-white/90" />
              </div>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-medium text-[#182433]">Pawel Kuna</p>
              <p className="text-xs text-[#667085]">UI Designer</p>
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
      <div className="mx-auto flex max-w-[1288px] items-center justify-between gap-6 overflow-x-auto px-4">
        <div className="flex min-w-max items-center gap-1">
          {navItems.map(({ label, icon: Icon, href, menu }) => {
            const active = href === activeHref;

            return (
              <Link
                className={`group relative flex h-14 items-center gap-2 px-3 text-sm ${
                  active ? "text-[#182433]" : "text-[#526071]"
                } hover:text-[#0d6efd]`}
                href={href}
                key={label}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
                <span>{label}</span>
                {menu ? <ChevronDown className="h-3.5 w-3.5" /> : null}
                {active ? (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 bg-[#0d6efd]" />
                ) : null}
              </Link>
            );
          })}
        </div>
        <a
          className="relative hidden h-14 min-w-max items-center gap-2 px-3 text-sm text-[#526071] hover:text-[#0d6efd] lg:flex"
          href="#"
        >
          <Settings className="h-[18px] w-[18px]" strokeWidth={1.7} />
          Theme Settings
          <span className="absolute right-0 top-1 rounded-full bg-[#d63939] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
            New
          </span>
        </a>
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

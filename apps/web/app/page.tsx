import AuthModal from "./components/AuthModal";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "Academic Quest",
    description:
      "Bantuan pengerjaan tugas, laporan, makalah, dan kebutuhan akademik lainnya.",
    tag: "POPULAR",
  },
  {
    icon: Sparkles,
    title: "Creative Quest",
    description:
      "Presentasi, desain, dokumentasi, dan kebutuhan project yang lebih kreatif.",
    tag: "CREATIVE",
  },
  {
    icon: Trophy,
    title: "Final Quest",
    description:
      "Project besar, tugas akhir, dan pekerjaan dengan deadline yang lebih serius.",
    tag: "PREMIUM",
  },
];

const steps = [
  {
    number: "01",
    title: "Send Your Quest",
    description: "Kirim detail tugas, file, dan deadline.",
  },
  {
    number: "02",
    title: "Get Your Quote",
    description: "Kami cek kebutuhan dan kirim estimasi harga.",
  },
  {
    number: "03",
    title: "Start The Quest",
    description: "Setelah pembayaran, pengerjaan langsung dimulai.",
  },
  {
    number: "04",
    title: "Claim Result",
    description: "Pantau progress sampai hasil siap diterima.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#090b12] text-white">
      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute left-[8%] top-[10%] h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute right-[8%] top-[35%] h-96 w-96 rounded-full bg-cyan-500/8 blur-3xl" />
        <div className="absolute bottom-[5%] left-[38%] h-80 w-80 rounded-full bg-fuchsia-600/8 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#090b12]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center border border-violet-400/30 bg-violet-500/10 shadow-[4px_4px_0_rgba(139,92,246,.18)]">
              <span className="text-lg font-black text-violet-300">
                TM
              </span>
            </div>

            <div>
              <div className="text-lg font-black tracking-[0.12em]">
                TASKMATE
              </div>
              <div className="text-[9px] font-semibold tracking-[0.28em] text-white/35">
                QUEST MANAGEMENT
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#services"
              className="text-sm text-white/55 transition hover:text-white"
            >
              Services
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-white/55 transition hover:text-white"
            >
              How It Works
            </a>

            <a
              href="#why-taskmate"
              className="text-sm text-white/55 transition hover:text-white"
            >
              Why TaskMate
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/?auth=login"
              className="hidden px-4 py-2 text-sm font-semibold text-white/70 transition hover:text-white sm:block"
            >
              Login
            </Link>

            <Link
              href="/?auth=register"
              className="group inline-flex items-center gap-2 border border-violet-400/50 bg-violet-500 px-4 py-2.5 text-sm font-bold text-white shadow-[4px_4px_0_rgba(124,58,237,.35)] transition hover:-translate-y-0.5 hover:bg-violet-400 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              Create Account
              <ArrowRight
                size={15}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-28 lg:pt-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-[10px] font-bold tracking-[0.22em] text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              TASKMATE ONLINE
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-8xl">
              YOUR TASK.
              <br />
              <span className="text-violet-400">OUR QUEST.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
              Selesaikan tugas lebih cepat dengan sistem pengerjaan yang
              transparan, terstruktur, dan mudah dipantau dari awal sampai
              selesai.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="?auth=register"
                className="group inline-flex items-center justify-center gap-3 border border-violet-400 bg-violet-500 px-6 py-4 text-sm font-black tracking-wide shadow-[6px_6px_0_rgba(124,58,237,.25)] transition hover:-translate-y-1 hover:bg-violet-400"
              >
                START A QUEST
                <ChevronRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-3 border border-white/10 bg-white/[0.03] px-6 py-4 text-sm font-bold text-white/75 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                HOW IT WORKS
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/40">
              <span className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400" />
                Transparent pricing
              </span>

              <span className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400" />
                Progress tracking
              </span>

              <span className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400" />
                Secure account
              </span>
            </div>
          </div>

          {/* QUEST TERMINAL */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative border border-violet-400/20 bg-[#111624] p-2 shadow-[12px_12px_0_rgba(124,58,237,.08)]">
              <div className="border border-white/8 bg-[#0d111b]">
                <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-400/70" />
                    <span className="h-2 w-2 rounded-full bg-yellow-300/70" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
                  </div>

                  <span className="font-mono text-[9px] tracking-[0.2em] text-white/25">
                    QUEST_BOARD.EXE
                  </span>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="mb-7 flex items-start justify-between">
                    <div>
                      <div className="text-[10px] font-bold tracking-[0.2em] text-violet-300">
                        ACTIVE QUEST
                      </div>
                      <div className="mt-2 text-2xl font-black">
                        Academic Assignment
                      </div>
                    </div>

                    <div className="border border-amber-300/20 bg-amber-300/5 px-3 py-2 text-right">
                      <div className="text-[9px] font-bold tracking-widest text-amber-300/60">
                        XP
                      </div>
                      <div className="text-lg font-black text-amber-300">
                        +450
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <QuestProgress
                      label="Brief"
                      status="Complete"
                      percent={100}
                    />

                    <QuestProgress
                      label="Research"
                      status="In Progress"
                      percent={68}
                    />

                    <QuestProgress
                      label="Finalization"
                      status="Pending"
                      percent={12}
                    />
                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <div className="border border-white/8 bg-white/[0.025] p-4">
                      <div className="text-[9px] font-bold tracking-[0.18em] text-white/25">
                        DEADLINE
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-sm font-bold">
                        <Clock3 size={15} className="text-cyan-300" />
                        18 Aug 2026
                      </div>
                    </div>

                    <div className="border border-white/8 bg-white/[0.025] p-4">
                      <div className="text-[9px] font-bold tracking-[0.18em] text-white/25">
                        STATUS
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-sm font-bold text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        ON TRACK
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-3 hidden border border-cyan-300/20 bg-cyan-400/5 px-4 py-3 backdrop-blur-md sm:block">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] text-cyan-200">
                <Zap size={13} />
                QUEST READY
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="services"
        className="relative z-10 border-y border-white/8 bg-white/[0.015]"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-3 text-[10px] font-bold tracking-[0.24em] text-violet-300">
                AVAILABLE QUESTS
              </div>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Choose your mission.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-white/40">
              Pilih kategori pekerjaan yang sesuai dengan kebutuhanmu.
              Detail dan harga dibahas berdasarkan brief yang kamu kirim.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  className="group border border-white/8 bg-[#0e131e] p-6 transition hover:-translate-y-1 hover:border-violet-400/30 hover:bg-[#111725]"
                >
                  <div className="mb-8 flex items-start justify-between">
                    <div className="grid h-12 w-12 place-items-center border border-violet-400/20 bg-violet-400/5">
                      <Icon size={22} className="text-violet-300" />
                    </div>

                    <span className="border border-white/8 px-2 py-1 text-[9px] font-bold tracking-[0.18em] text-white/30">
                      {service.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-black">{service.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-white/40">
                    {service.description}
                  </p>

                  <div className="mt-7 flex items-center gap-2 text-xs font-bold text-violet-300">
                    Learn more
                    <ArrowRight
                      size={14}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-3 text-[10px] font-bold tracking-[0.24em] text-cyan-300">
              QUEST FLOW
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Simple process. Clear progress.
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/40">
              Dari brief sampai hasil akhir, semua langkah dibuat sesederhana
              mungkin.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative border border-white/8 bg-[#0d121c] p-6"
              >
                {index < steps.length - 1 && (
                  <div className="absolute right-[-12px] top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 place-items-center border border-white/8 bg-[#0d121c] md:grid">
                    <ChevronRight size={13} className="text-white/20" />
                  </div>
                )}

                <div className="font-mono text-4xl font-black text-violet-400/25">
                  {step.number}
                </div>

                <h3 className="mt-5 text-base font-black">{step.title}</h3>

                <p className="mt-2 text-sm leading-6 text-white/35">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY TASKMATE */}
      <section id="why-taskmate" className="relative z-10">
        <div className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
          <div className="border border-violet-400/15 bg-violet-500/[0.035] p-7 sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
              <div>
                <div className="mb-3 text-[10px] font-bold tracking-[0.24em] text-emerald-300">
                  WHY TASKMATE
                </div>

                <h2 className="text-3xl font-black leading-tight sm:text-4xl">
                  A cleaner way to manage every quest.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-white/40">
                  TaskMate dirancang supaya komunikasi, progress, deadline,
                  dan pembayaran berada dalam satu alur yang jelas.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Feature
                  icon={<ShieldCheck size={18} />}
                  title="Secure"
                  description="Account dan proses dibuat dengan keamanan sebagai fondasi."
                />

                <Feature
                  icon={<MessageCircle size={18} />}
                  title="Clear Communication"
                  description="Update dan informasi pesanan tidak tercecer."
                />

                <Feature
                  icon={<Clock3 size={18} />}
                  title="On Track"
                  description="Deadline dan progress bisa dipantau kapan saja."
                />

                <Feature
                  icon={<Trophy size={18} />}
                  title="Quest Complete"
                  description="Semua pekerjaan punya status dan hasil yang jelas."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 border-t border-white/8">
        <div className="mx-auto max-w-5xl px-5 py-20 text-center lg:px-8">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 border border-amber-300/15 bg-amber-300/5 px-3 py-2 text-[9px] font-bold tracking-[0.2em] text-amber-200/80">
            <Sparkles size={13} />
            READY FOR YOUR NEXT QUEST?
          </div>

          <h2 className="text-4xl font-black tracking-[-0.03em] sm:text-6xl">
            Let's finish it.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/40 sm:text-base">
            Buat akun, kirim detail tugasmu, dan biarkan TaskMate membantu
            mengelola quest sampai selesai.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/?auth=register"
              className="inline-flex items-center justify-center gap-2 border border-violet-400 bg-violet-500 px-6 py-4 text-sm font-black shadow-[6px_6px_0_rgba(124,58,237,.2)] transition hover:-translate-y-1 hover:bg-violet-400"
            >
              CREATE ACCOUNT
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/?auth=login"
              className="inline-flex items-center justify-center border border-white/10 bg-white/[0.03] px-6 py-4 text-sm font-bold text-white/70 transition hover:bg-white/[0.06] hover:text-white"
            >
              I ALREADY HAVE AN ACCOUNT
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="font-black tracking-[0.16em] text-white/55">
            TASKMATE
          </div>

          <div>
            Your Task. Our Quest.
          </div>

          <div>
            © 2026 TaskMate
          </div>
        </div>
      </footer>

      <AuthModal />
    </main>
  );
}

function QuestProgress({
  label,
  status,
  percent,
}: {
  label: string;
  status: string;
  percent: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-semibold text-white/75">{label}</span>
        <span className="text-white/30">{status}</span>
      </div>

      <div className="h-2 border border-white/10 bg-white/[0.04] p-[1px]">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-cyan-400"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="border border-white/8 bg-[#0d121c] p-5">
      <div className="grid h-9 w-9 place-items-center border border-cyan-300/15 bg-cyan-300/5 text-cyan-200">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-black">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-white/35">{description}</p>
    </div>
  );
}
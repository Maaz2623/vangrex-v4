"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Roboto_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

gsap.registerPlugin(ScrollTrigger);

const features = [
  [
    "Autonomous engineering",
    "From intent to pull request, agent teams carry work through with transparent checkpoints.",
  ],
  [
    "Visual workflows",
    "Design dependable execution paths with branching, memory, retries, and approvals.",
  ],
  [
    "Persistent context",
    "Every project has a living understanding of your codebase, conventions, and decisions.",
  ],
  [
    "Production awareness",
    "Connect signals from CI and production to turn incidents into resolved work.",
  ],
  [
    "Human approval gates",
    "Keep people in control at the moments that carry risk or demand judgment.",
  ],
  [
    "Engineering observability",
    "See every agent decision, tool call, change, and outcome in one place.",
  ],
];

const roboto = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const agents = [
  "Planner",
  "Architect",
  "Backend",
  "Frontend",
  "QA",
  "Security",
  "DevOps",
  "Docs",
];

const faqs = [
  [
    "Is Vangrex an AI coding assistant?",
    "No. Vangrex coordinates complete, specialized AI teams across the software lifecycle. It connects planning, implementation, review, deployment, and operational learning in a single system.",
  ],
  [
    "How does Vangrex work with our codebase?",
    "You connect repositories and define the permissions and approval policies appropriate for your organization. Agents develop structured project context as they work.",
  ],
  [
    "Can engineers stay in control?",
    "Always. Workflows can include mandatory approval gates, scoped permissions, and clear audit trails for every action an agent takes.",
  ],
  [
    "Who is Vangrex for?",
    "Engineering organizations that want to scale delivery capacity without sacrificing the reliability, context, and judgment that great software requires.",
  ],
];

export function MainSections() {
  const [open, setOpen] = useState(0);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      // --------------------------------------------------
      // Section reveals
      // --------------------------------------------------

      gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              once: true,
            },
          },
        );
      });

      // --------------------------------------------------
      // Platform cards
      // --------------------------------------------------

      gsap.fromTo(
        ".platform-card",
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".platform-cards",
            start: "top 82%",
            once: true,
          },
        },
      );

      // --------------------------------------------------
      // Workflow canvas parallax
      // --------------------------------------------------

      gsap.to(".workflow-parallax", {
        y: -35,
        ease: "none",
        scrollTrigger: {
          trigger: ".workflow-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // --------------------------------------------------
      // Workflow nodes reveal
      // --------------------------------------------------

      gsap.fromTo(
        ".workflow-node",
        {
          opacity: 0,
          y: 18,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".workflow-canvas",
            start: "top 78%",
            once: true,
          },
        },
      );

      // --------------------------------------------------
      // Agents section
      // --------------------------------------------------

      gsap.fromTo(
        ".agent-card",
        {
          opacity: 0,
          y: 20,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".agents-grid",
            start: "top 80%",
            once: true,
          },
        },
      );

      // Subtle movement of the graph itself.
      gsap.to(".agent-graph", {
        y: -25,
        ease: "none",
        scrollTrigger: {
          trigger: ".agents-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // --------------------------------------------------
      // Features
      // --------------------------------------------------

      gsap.fromTo(
        ".feature-card",
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 82%",
            once: true,
          },
        },
      );

      // --------------------------------------------------
      // Comparison
      // --------------------------------------------------

      gsap.fromTo(
        ".comparison-card",
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".comparison-grid",
            start: "top 82%",
            once: true,
          },
        },
      );

      // --------------------------------------------------
      // Testimonial
      // --------------------------------------------------

      gsap.fromTo(
        ".testimonial",
        {
          opacity: 0,
          x: 30,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".testimonial",
            start: "top 82%",
            once: true,
          },
        },
      );

      // --------------------------------------------------
      // CTA glow parallax
      // --------------------------------------------------

      gsap.to(".cta-glow", {
        y: -50,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // --------------------------------------------------
      // Refresh after everything is ready
      // --------------------------------------------------

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={root}>
      {/* ------------------------------------------------ */}
      {/* Trusted by */}
      {/* ------------------------------------------------ */}

      <section className="border-y border-border bg-muted/20 px-5 py-7 sm:px-7">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 text-xs text-muted-foreground">
          <span className="eyebrow">
            Trusted by teams building the next era
          </span>

          <div className="flex gap-7 font-semibold tracking-[.12em] sm:gap-12">
            <span>ARCFORM</span>
            <span>MONO</span>
            <span>HYPERLINE</span>
            <span className="hidden sm:block">ROUTE</span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ */}
      {/* Platform */}
      {/* ------------------------------------------------ */}

      <section id="platform" className="gsap-reveal px-5 py-24 sm:px-7">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">One system. One source of truth.</p>

          <div className="mt-5 grid gap-8 lg:grid-cols-2">
            <h2 className="display text-4xl font-semibold sm:text-5xl">
              The work moves forward.{" "}
              <span className="text-muted-foreground">Not around.</span>
            </h2>

            <p className="max-w-md self-end text-base leading-7 text-muted-foreground">
              Vangrex replaces the handoffs and fragmented tools between an idea
              and a dependable release with an engineering system built to think
              in sequence.
            </p>
          </div>

          <div className="platform-cards mt-12 grid gap-3 md:grid-cols-4">
            {[
              [
                "01",
                "Project",
                "Ground the team in product and repository context.",
              ],
              [
                "02",
                "Workflow",
                "Define how work should move, including the exceptions.",
              ],
              [
                "03",
                "Agent team",
                "Give each discipline the focus it needs to do excellent work.",
              ],
              [
                "04",
                "Execution",
                "Observe autonomous progress and approve what matters.",
              ],
            ].map((x) => (
              <motion.article
                whileHover={{ y: -5 }}
                key={x[1]}
                className="platform-card card min-h-48 p-5"
              >
                <span className="text-xs text-primary">{x[0]}</span>

                <h3 className="mt-10 text-lg font-medium">{x[1]}</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {x[2]}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ */}
      {/* Workflow */}
      {/* ------------------------------------------------ */}

      <section
        id="workflows"
        className={cn(
          "workflow-section overflow-hidden border-y border-border bg-muted/30 px-5 py-24 sm:px-7",
          roboto.className,
        )}
      >
        <div className="workflow-parallax mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
            <div className="gsap-reveal">
              <p className="eyebrow">Workflow builder</p>

              <h2 className="display mt-5 text-4xl font-semibold sm:text-5xl">
                Engineering judgment,{" "}
                <span className="text-muted-foreground">made executable.</span>
              </h2>

              <p className="mt-6 max-w-sm leading-7 text-muted-foreground">
                Compose intelligent paths through complex work. Conditions,
                parallel execution, human gates, and recovery are first-class
                building blocks.
              </p>
            </div>

            <WorkflowCanvas />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ */}
      {/* Agents */}
      {/* ------------------------------------------------ */}

      <section
        id="agents"
        className="agents-section overflow-hidden px-5 py-24 sm:px-7"
      >
        <div className="mx-auto max-w-6xl">
          <div className="gsap-reveal text-center">
            <p className="eyebrow">Specialists, in sync</p>

            <h2 className="display mx-auto mt-5 max-w-2xl text-4xl font-semibold sm:text-5xl">
              One team.{" "}
              <span className="text-muted-foreground">Many perspectives.</span>
            </h2>
          </div>

          <div className="agent-graph card relative mt-12 overflow-hidden p-5 sm:p-8">
            <div className="absolute inset-0 grid-bg opacity-60" />

            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 1000 430"
              preserveAspectRatio="none"
            >
              <path
                d="M120 90 C300 90 270 215 500 215 S700 80 890 80 M120 340 C300 340 300 215 500 215 S730 340 890 340"
                fill="none"
                stroke="hsl(var(--primary) / 0.45)"
                strokeWidth="1"
              />
            </svg>

            <div className="agents-grid relative grid grid-cols-2 gap-3 sm:grid-cols-4">
              {agents.map((a, i) => (
                <motion.div
                  key={a}
                  whileHover={{ scale: 1.03 }}
                  className="agent-card rounded-xl border border-border bg-card/85 p-4 backdrop-blur"
                >
                  <span className="text-[10px] text-primary">0{i + 1}</span>

                  <b className="mt-5 block text-sm font-medium">{a}</b>

                  <span className="mt-1 block text-[11px] text-muted-foreground">
                    {i % 3 === 0 ? "Planning" : "Connected"}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="relative mx-auto mt-7 w-fit rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs text-primary">
              Shared project memory
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ */}
      {/* Features */}
      {/* ------------------------------------------------ */}

      <section className="px-5 pb-24 sm:px-7">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">A platform engineered for the whole loop</p>

          <div className="features-grid mt-8 grid gap-3 md:grid-cols-3">
            {features.map((f, i) => (
              <motion.article
                whileHover={{ y: -4 }}
                key={f[0]}
                className="feature-card card p-6"
              >
                <span className="text-xs text-muted-foreground">0{i + 1}</span>

                <h3 className="mt-10 text-lg font-medium">{f[0]}</h3>

                <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
                  {f[1]}
                </p>

                <span className="mt-7 block text-sm text-foreground">
                  Learn more <i className="not-italic text-primary">↗</i>
                </span>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ */}
      {/* Comparison */}
      {/* ------------------------------------------------ */}

      <section className="border-y border-border bg-muted/30 px-5 py-24 sm:px-7">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="gsap-reveal">
              <p className="eyebrow">The next evolution</p>

              <h2 className="display mt-5 text-4xl font-semibold sm:text-5xl">
                A new model for software delivery.
              </h2>
            </div>

            <p className="gsap-reveal self-end leading-7 text-muted-foreground">
              Tools make individuals faster. Vangrex makes the entire
              engineering function more capable, more continuous, and more
              certain.
            </p>
          </div>

          <div className="comparison-grid mt-12 grid overflow-hidden rounded-2xl border border-border md:grid-cols-3">
            {[
              ["Traditional", "Human capacity is the limiting system."],
              ["AI assistant", "One developer, accelerated."],
              ["Vangrex", "A coordinated team, compounding."],
            ].map((x, i) => (
              <div
                key={x[0]}
                className={`comparison-card min-h-48 border-border p-6 ${
                  i ? "border-t md:border-l md:border-t-0" : ""
                } ${i === 2 ? "bg-primary/5" : ""}`}
              >
                <span className="text-xs text-muted-foreground">0{i + 1}</span>

                <h3 className="mt-10 text-xl font-medium">{x[0]}</h3>

                <p className="mt-3 max-w-45 text-sm leading-6 text-muted-foreground">
                  {x[1]}
                </p>

                {i === 2 && (
                  <span className="mt-7 inline-block rounded-full border border-primary/30 px-2 py-1 text-[10px] text-primary">
                    THE VANGREX MODEL
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ */}
      {/* Company */}
      {/* ------------------------------------------------ */}

      <section id="company" className="px-5 py-24 sm:px-7">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <div className="gsap-reveal">
            <p className="eyebrow">Built for ambitious teams</p>

            <h2 className="display mt-5 text-4xl font-semibold sm:text-5xl">
              Quietly powerful.
              <br />
              <span className="text-muted-foreground">Deeply trusted.</span>
            </h2>
          </div>

          <blockquote className="testimonial card p-7 sm:p-10">
            <p className="text-2xl leading-snug tracking-[-.035em]">
              “Vangrex changed our mental model from asking AI for help to
              leading a team that never loses context.”
            </p>

            <footer className="mt-10 flex items-center gap-3 text-sm">
              <span className="grid size-9 place-items-center rounded-full bg-muted text-xs">
                AL
              </span>

              <span>
                <b className="block font-medium">Amara Liu</b>

                <small className="text-muted-foreground">
                  VP Engineering, Northstar
                </small>
              </span>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ------------------------------------------------ */}
      {/* FAQ */}
      {/* ------------------------------------------------ */}

      <section className="border-y border-border bg-muted/30 px-5 py-24 sm:px-7">
        <div className="mx-auto max-w-3xl">
          <div className="gsap-reveal">
            <p className="eyebrow text-center">Frequently asked</p>

            <h2 className="display mt-5 text-center text-4xl font-semibold sm:text-5xl">
              Clarity, by design.
            </h2>
          </div>

          <div className="mt-10">
            {faqs.map((f, i) => (
              <div key={f[0]} className="border-b border-border">
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="flex w-full items-center justify-between py-5 text-left text-sm font-medium"
                >
                  <span>{f[0]}</span>

                  <span className="text-xl text-muted-foreground">
                    {open === i ? "−" : "+"}
                  </span>
                </button>

                <AnimatePresence>
                  {open === i && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pb-5 pr-10 text-sm leading-6 text-muted-foreground"
                    >
                      {f[1]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ */}
      {/* CTA */}
      {/* ------------------------------------------------ */}

      <section
        id="cta"
        className="cta-section relative overflow-hidden px-5 py-28 text-center sm:px-7"
      >
        <div className="cta-glow absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/.18),transparent_60%)]" />

        <div className="relative mx-auto max-w-3xl gsap-reveal">
          <p className="eyebrow">The work begins here</p>

          <h2 className="display mt-6 text-4xl font-semibold sm:text-6xl">
            The future of software engineering is autonomous.
          </h2>

          <p className="mx-auto mt-6 max-w-md leading-7 text-muted-foreground">
            Build an AI team that understands your product, carries the work,
            and earns your trust.
          </p>

          <a
            href="mailto:hello@vangrex.com"
            className="button-primary mt-8 inline-block rounded-xl px-6 py-3.5 text-sm font-semibold transition"
          >
            Contact Us <span className="ml-2">→</span>
          </a>
        </div>
      </section>

      {/* ------------------------------------------------ */}
      {/* Footer */}
      {/* ------------------------------------------------ */}

      <footer className="border-t border-border px-5 py-8 sm:px-7">
        <div className="mx-auto flex max-w-6xl items-center flex-wrap justify-between gap-5 text-xs text-muted-foreground">
          <span
            className={`font-semibold items-center tracking-wider text-lg text-foreground flex ${roboto.className}`}
          >
            <Logo height={35} width={35} /> Vangrex
          </span>
          <span>© 2026 Vangrex, Inc.</span>
          <span>Privacy &nbsp; Security &nbsp; Status</span>
        </div>
      </footer>
    </main>
  );
}

function WorkflowCanvas() {
  return (
    <div className="workflow-canvas card relative min-h-95 overflow-hidden p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between border-b border-border pb-3 text-[11px]">
        <span className="text-muted-foreground">
          release /{" "}
          <b className="font-medium text-foreground">payment-reconciliation</b>
        </span>

        <span className="rounded bg-primary/10 px-2 py-1 text-primary">
          Valid
        </span>
      </div>

      <svg
        className="absolute left-[12%] top-20 h-60 w-[76%]"
        preserveAspectRatio="none"
      >
        <path
          d="M30 50 H280 V140 H420 M280 50 V245 H420"
          fill="none"
          stroke="hsl(var(--primary) / 0.55)"
          strokeWidth="1.5"
        />
      </svg>

      <div className="relative grid grid-cols-2 gap-x-10 gap-y-8 pt-8 text-xs sm:grid-cols-3">
        <Flow label="New issue" tag="TRIGGER" />
        <Flow label="Plan approach" tag="AGENT" />
        <Flow label="Risk review" tag="GATE" />
        <Flow label="Parallel build" tag="TEAM" />
        <Flow label="Run checks" tag="SYSTEM" />
        <Flow label="Create release" tag="ACTION" />
      </div>
    </div>
  );
}

function Flow({ label, tag }: { label: string; tag: string }) {
  return (
    <div className="workflow-node rounded-lg border border-border bg-card p-3 shadow-sm">
      <span className="text-[9px] text-primary">{tag}</span>

      <b className="mt-2 block text-[11px] font-medium">{label}</b>
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Roboto_Mono } from "next/font/google";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const roboto = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

/* -------------------------------------------------------------------------- */
/* Platform features                                                          */
/* -------------------------------------------------------------------------- */

const features = [
  [
    "Visual workflow builder",
    "Design executable workflows on a canvas using triggers, logic, AI agents, tools, and actions.",
  ],
  [
    "AI agents",
    "Give your workflows agents that can reason through tasks, use tools, and make decisions.",
  ],
  [
    "Tool integration",
    "Connect agents and workflows to APIs, services, databases, and application-specific capabilities.",
  ],
  [
    "Reliable execution",
    "Run workflows with structured execution, branching, retries, state, and observable progress.",
  ],
  [
    "Human-in-the-loop",
    "Add approval points whenever an action needs review, confirmation, or human judgment.",
  ],
  [
    "Developer SDK",
    "Trigger Vangrex workflows from your own applications and integrate execution into your products.",
  ],
];

/* -------------------------------------------------------------------------- */
/* Workflow building blocks                                                   */
/* -------------------------------------------------------------------------- */

const workflowNodes = [
  "Trigger",
  "Input",
  "AI Agent",
  "Tool",
  "Condition",
  "Action",
];

/* -------------------------------------------------------------------------- */
/* Agent capabilities                                                          */
/* -------------------------------------------------------------------------- */

const agents = [
  "Reasoning",
  "Research",
  "Data",
  "API",
  "Code",
  "Decision",
  "Validation",
  "Action",
];

/* -------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* -------------------------------------------------------------------------- */

const faqs = [
  [
    "What is Vangrex?",
    "Vangrex is an AI workflow orchestration platform for building and running intelligent workflows. You can visually compose workflows, add AI agents and tools, execute them, and integrate them into your own applications.",
  ],
  [
    "What can I build with Vangrex?",
    "You can build automated workflows, AI-powered processes, internal tools, application backends, agentic systems, data pipelines, and other systems where multiple steps need to be coordinated and executed reliably.",
  ],
  [
    "What are AI agents in Vangrex?",
    "Agents are workflow components that can reason about a task and use the tools available to them. They can be placed inside a larger workflow and work alongside other nodes and application logic.",
  ],
  [
    "Can I connect my own tools?",
    "Yes. Vangrex is designed to connect workflows and agents with external capabilities such as APIs, services, data sources, and application logic.",
  ],
  [
    "Can I trigger Vangrex from my application?",
    "Yes. The Vangrex SDK allows developers to integrate workflows into their applications and trigger executions programmatically.",
  ],
  [
    "Do workflows always run autonomously?",
    "Not necessarily. Workflows can be designed for fully automated execution or include conditions, approval steps, and human intervention where needed.",
  ],
];

/* -------------------------------------------------------------------------- */
/* Main sections                                                              */
/* -------------------------------------------------------------------------- */

export function MainSections() {
  const [open, setOpen] = useState(0);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      /* -------------------------------------------------------------------- */
      /* Section reveals                                                       */
      /* -------------------------------------------------------------------- */

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

      /* -------------------------------------------------------------------- */
      /* Platform cards                                                        */
      /* -------------------------------------------------------------------- */

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

      /* -------------------------------------------------------------------- */
      /* Workflow canvas                                                       */
      /* -------------------------------------------------------------------- */

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

      /* -------------------------------------------------------------------- */
      /* Agent section                                                         */
      /* -------------------------------------------------------------------- */

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

      /* -------------------------------------------------------------------- */
      /* Features                                                              */
      /* -------------------------------------------------------------------- */

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

      /* -------------------------------------------------------------------- */
      /* Integration section                                                    */
      /* -------------------------------------------------------------------- */

      gsap.fromTo(
        ".integration-card",
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
            trigger: ".integration-grid",
            start: "top 82%",
            once: true,
          },
        },
      );

      /* -------------------------------------------------------------------- */
      /* CTA glow                                                              */
      /* -------------------------------------------------------------------- */

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

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={root}>
      {/* ------------------------------------------------------------------ */}
      {/* What Vangrex is                                                    */}
      {/* ------------------------------------------------------------------ */}

      <section className="border-y border-border bg-muted/20 px-5 py-7 sm:px-7">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 text-xs text-muted-foreground">
          <span className="eyebrow">Build and run intelligent systems</span>

          <div className="flex flex-wrap gap-5 font-semibold tracking-[.12em] sm:gap-10">
            <span>WORKFLOWS</span>
            <span>AGENTS</span>
            <span>TOOLS</span>
            <span>EXECUTION</span>
            <span className="hidden sm:block">SDK</span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Platform                                                            */}
      {/* ------------------------------------------------------------------ */}

      <section id="platform" className="gsap-reveal px-5 py-24 sm:px-7">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">The Vangrex platform</p>

          <div className="mt-5 grid gap-8 lg:grid-cols-2">
            <h2 className="display text-4xl font-semibold sm:text-5xl">
              Build the system.
              <br />
              <span className="text-muted-foreground">Let it do the work.</span>
            </h2>

            <p className="max-w-md self-end text-base leading-7 text-muted-foreground">
              Vangrex gives you the building blocks to create intelligent
              systems that can reason, interact with tools, make decisions, and
              execute work without stitching together multiple platforms.
            </p>
          </div>

          <div className="platform-cards mt-12 grid gap-3 md:grid-cols-4">
            {[
              [
                "01",
                "Build",
                "Create workflows visually on a flexible execution canvas.",
              ],
              [
                "02",
                "Compose",
                "Combine logic, agents, tools, data, and actions into one flow.",
              ],
              [
                "03",
                "Execute",
                "Run workflows with structured execution and observable state.",
              ],
              [
                "04",
                "Integrate",
                "Trigger your workflows directly from your applications.",
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

      {/* ------------------------------------------------------------------ */}
      {/* Workflow Builder                                                    */}
      {/* ------------------------------------------------------------------ */}

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
                Your logic.
                <br />
                <span className="text-muted-foreground">Made executable.</span>
              </h2>

              <p className="mt-6 max-w-sm leading-7 text-muted-foreground">
                Turn complex processes into visual execution graphs. Connect
                triggers, agents, tools, conditions, and actions into workflows
                that can actually run.
              </p>
            </div>

            <WorkflowCanvas />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Agents                                                              */}
      {/* ------------------------------------------------------------------ */}

      <section
        id="agents"
        className="agents-section overflow-hidden px-5 py-24 sm:px-7"
      >
        <div className="mx-auto max-w-6xl">
          <div className="gsap-reveal text-center">
            <p className="eyebrow">AI agents</p>

            <h2 className="display mx-auto mt-5 max-w-2xl text-4xl font-semibold sm:text-5xl">
              Give workflows{" "}
              <span className="text-muted-foreground">
                the ability to think.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl leading-7 text-muted-foreground">
              Add AI agents to your workflows when a task requires reasoning,
              decisions, context, or interaction with external tools.
            </p>
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
              {agents.map((agent, i) => (
                <motion.div
                  key={agent}
                  whileHover={{ scale: 1.03 }}
                  className="agent-card rounded-xl border border-border bg-card/85 p-4 backdrop-blur"
                >
                  <span className="text-[10px] text-primary">0{i + 1}</span>

                  <b className="mt-5 block text-sm font-medium">{agent}</b>

                  <span className="mt-1 block text-[11px] text-muted-foreground">
                    Agent capability
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="relative mx-auto mt-7 w-fit rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs text-primary">
              AI agent + tools + workflow context
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Features                                                            */}
      {/* ------------------------------------------------------------------ */}

      <section className="px-5 pb-24 sm:px-7">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">
            Everything needed to build intelligent workflows
          </p>

          <div className="features-grid mt-8 grid gap-3 md:grid-cols-3">
            {features.map((feature, i) => (
              <motion.article
                whileHover={{ y: -4 }}
                key={feature[0]}
                className="feature-card card p-6"
              >
                <span className="text-xs text-muted-foreground">0{i + 1}</span>

                <h3 className="mt-10 text-lg font-medium">{feature[0]}</h3>

                <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
                  {feature[1]}
                </p>

                <span className="mt-7 block text-sm text-foreground">
                  Explore <i className="not-italic text-primary">↗</i>
                </span>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Integration / SDK                                                   */}
      {/* ------------------------------------------------------------------ */}

      <section
        id="developers"
        className="border-y border-border bg-muted/30 px-5 py-24 sm:px-7"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="gsap-reveal">
              <p className="eyebrow">Built for developers</p>

              <h2 className="display mt-5 text-4xl font-semibold sm:text-5xl">
                Build visually.
                <br />
                <span className="text-muted-foreground">
                  Ship programmatically.
                </span>
              </h2>
            </div>

            <p className="gsap-reveal self-end leading-7 text-muted-foreground">
              Vangrex isn't limited to the canvas. Use the SDK to trigger
              workflows from your own applications and bring AI-powered
              execution into the products you're already building.
            </p>
          </div>

          <div className="integration-grid mt-12 grid gap-3 md:grid-cols-3">
            {[
              [
                "01",
                "Create",
                "Design and configure your workflow in Vangrex.",
              ],
              [
                "02",
                "Trigger",
                "Start workflow executions from your application using the SDK.",
              ],
              [
                "03",
                "Receive",
                "Use execution results and updates inside your application.",
              ],
            ].map((item) => (
              <motion.article
                whileHover={{ y: -5 }}
                key={item[1]}
                className="integration-card card min-h-48 p-6"
              >
                <span className="text-xs text-primary">{item[0]}</span>

                <h3 className="mt-10 text-lg font-medium">{item[1]}</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item[2]}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Comparison                                                          */}
      {/* ------------------------------------------------------------------ */}

      <section className="px-5 py-24 sm:px-7">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="gsap-reveal">
              <p className="eyebrow">From prompts to systems</p>

              <h2 className="display mt-5 text-4xl font-semibold sm:text-5xl">
                AI is more than a chat box.
              </h2>
            </div>

            <p className="gsap-reveal self-end leading-7 text-muted-foreground">
              Prompts are useful for interacting with models. Vangrex gives you
              the infrastructure around those models to build workflows that can
              perform multi-step work.
            </p>
          </div>

          <div className="comparison-grid mt-12 grid overflow-hidden rounded-2xl border border-border md:grid-cols-3">
            {[
              ["AI chat", "Ask a model a question and receive a response."],
              [
                "AI automation",
                "Connect predefined steps and automate repetitive work.",
              ],
              [
                "Vangrex",
                "Compose workflows with AI agents, tools, logic, and executable actions.",
              ],
            ].map((item, i) => (
              <div
                key={item[0]}
                className={cn(
                  "comparison-card min-h-48 border-border p-6",
                  i ? "border-t md:border-l md:border-t-0" : "",
                  i === 2 && "bg-primary/5",
                )}
              >
                <span className="text-xs text-muted-foreground">0{i + 1}</span>

                <h3 className="mt-10 text-xl font-medium">{item[0]}</h3>

                <p className="mt-3 max-w-52 text-sm leading-6 text-muted-foreground">
                  {item[1]}
                </p>

                {i === 2 && (
                  <span className="mt-7 inline-block rounded-full border border-primary/30 px-2 py-1 text-[10px] text-primary">
                    VANGREX
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Company / Philosophy                                                */}
      {/* ------------------------------------------------------------------ */}

      <section
        id="company"
        className="border-y border-border bg-muted/30 px-5 py-24 sm:px-7"
      >
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <div className="gsap-reveal">
            <p className="eyebrow">The idea behind Vangrex</p>

            <h2 className="display mt-5 text-4xl font-semibold sm:text-5xl">
              Make AI <span className="text-muted-foreground">executable.</span>
            </h2>
          </div>

          <div className="testimonial card p-7 sm:p-10">
            <p className="text-2xl leading-snug tracking-[-.035em]">
              AI shouldn't stop at generating an answer. It should be able to
              participate in the process, use the right tools, make decisions,
              and complete the work.
            </p>

            <div className="mt-10 flex items-center gap-3 text-sm">
              <span className="grid size-9 place-items-center rounded-full bg-muted text-xs">
                VX
              </span>

              <span>
                <b className="block font-medium">Vangrex</b>

                <small className="text-muted-foreground">
                  AI workflow orchestration
                </small>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FAQ                                                                 */}
      {/* ------------------------------------------------------------------ */}

      <section className="px-5 py-24 sm:px-7">
        <div className="mx-auto max-w-3xl">
          <div className="gsap-reveal">
            <p className="eyebrow text-center">Frequently asked</p>

            <h2 className="display mt-5 text-center text-4xl font-semibold sm:text-5xl">
              How Vangrex works.
            </h2>
          </div>

          <div className="mt-10">
            {faqs.map((faq, i) => (
              <div key={faq[0]} className="border-b border-border">
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="flex w-full items-center justify-between py-5 text-left text-sm font-medium"
                >
                  <span>{faq[0]}</span>

                  <span className="text-xl text-muted-foreground">
                    {open === i ? "−" : "+"}
                  </span>
                </button>

                <AnimatePresence>
                  {open === i && (
                    <motion.p
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      className="overflow-hidden pb-5 pr-10 text-sm leading-6 text-muted-foreground"
                    >
                      {faq[1]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CTA                                                                 */}
      {/* ------------------------------------------------------------------ */}

      <section
        id="cta"
        className="cta-section relative overflow-hidden px-5 py-28 text-center sm:px-7"
      >
        <div className="cta-glow absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/.18),transparent_60%)]" />

        <div className="relative mx-auto max-w-3xl gsap-reveal">
          <p className="eyebrow">Build with Vangrex</p>

          <h2 className="display mt-6 text-4xl font-semibold sm:text-6xl">
            Turn your AI ideas into{" "}
            <span className="text-muted-foreground">systems that run.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-md leading-7 text-muted-foreground">
            Build workflows, add AI agents, connect your tools, and bring
            intelligent execution into your applications.
          </p>

          <Link
            href="/auth/sign-in"
            className="button-primary mt-8 inline-block rounded-xl px-6 py-3.5 text-sm font-semibold transition"
          >
            Start building <span className="ml-2">→</span>
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Footer                                                              */}
      {/* ------------------------------------------------------------------ */}

      <footer className="border-t border-border px-5 py-8 sm:px-7">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 text-xs text-muted-foreground">
          <span
            className={cn(
              "flex items-center text-lg font-semibold tracking-wider text-foreground",
              roboto.className,
            )}
          >
            <Logo height={35} width={35} />
            Vangrex
          </span>

          <span>© 2026 Vangrex</span>

          <div className="flex gap-5">
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </Link>

            <Link
              href="/security"
              className="transition-colors hover:text-foreground"
            >
              Security
            </Link>

            <Link
              href="/docs"
              className="transition-colors hover:text-foreground"
            >
              Docs
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Workflow canvas                                                            */
/* -------------------------------------------------------------------------- */

function WorkflowCanvas() {
  return (
    <div className="workflow-canvas card relative min-h-95 overflow-hidden p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between border-b border-border pb-3 text-[11px]">
        <span className="text-muted-foreground">
          workflow /{" "}
          <b className="font-medium text-foreground">customer-support-agent</b>
        </span>

        <span className="rounded bg-primary/10 px-2 py-1 text-primary">
          Ready
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
        {workflowNodes.map((node, i) => (
          <Flow
            key={node}
            label={node}
            tag={
              i === 0
                ? "TRIGGER"
                : i === 2
                  ? "AGENT"
                  : i === 4
                    ? "LOGIC"
                    : "NODE"
            }
          />
        ))}
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

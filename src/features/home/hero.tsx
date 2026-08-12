"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const nodes = [
  ["01", "Project", "Repository context"],
  ["02", "Workflow", "Release orchestration"],
  ["03", "Agent team", "8 specialists active"],
  ["04", "Production", "Monitored continuously"],
];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      // Main hero entrance
      tl.from(".hero-eyebrow", {
        opacity: 0,
        y: 10,
        duration: 0.5,
      })
        .from(
          ".hero-title",
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
          },
          "-=0.3",
        )
        .from(
          ".hero-description",
          {
            opacity: 0,
            y: 12,
            duration: 0.55,
          },
          "-=0.4",
        )
        .from(
          ".hero-actions",
          {
            opacity: 0,
            y: 10,
            duration: 0.5,
          },
          "-=0.3",
        )
        .from(
          ".hero-stats",
          {
            opacity: 0,
            y: 8,
            duration: 0.45,
          },
          "-=0.25",
        );

      // Execution card
      gsap.from(".execution-card", {
        opacity: 0,
        scale: 0.96,
        y: 12,
        duration: 0.75,
        delay: 0.2,
        ease: "power3.out",
      });

      // Card header
      gsap.from(".execution-header", {
        opacity: 0,
        y: 6,
        duration: 0.4,
        delay: 0.55,
        ease: "power2.out",
      });

      // Workflow nodes
      gsap.from(".workflow-node", {
        opacity: 0,
        x: 12,
        duration: 0.4,
        stagger: 0.1,
        delay: 0.65,
        ease: "power2.out",
      });

      // Draw the workflow connection
      gsap.from(".workflow-connection", {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 0.8,
        delay: 0.8,
        ease: "power2.out",
      });

      // Bottom card stats
      gsap.from(".execution-stats > div", {
        opacity: 0,
        y: 6,
        duration: 0.35,
        stagger: 0.08,
        delay: 1.05,
        ease: "power2.out",
      });

      // Very subtle background movement
      gsap.fromTo(
        ".hero-glow",
        {
          opacity: 0,
          scale: 0.95,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          delay: 0.1,
          ease: "power2.out",
        },
      );

      // Small status pulse — deliberately subtle
      gsap.to(".active-status", {
        opacity: 0.45,
        duration: 1.4,
        repeat: 1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.2,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="top"
      className="grid-bg relative isolate overflow-hidden px-5 pt-28 sm:px-7"
    >
      <div className="noise" />

      <div className="hero-glow absolute left-1/2 top-0 -z-10 h-120 w-180 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,hsl(var(--primary)/.2),transparent_65%)]" />

      <div className="mx-auto grid min-h-[650px] max-w-6xl items-center gap-10 pb-12 pt-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-8">
        {/* LEFT */}
        <div>
          <p className="hero-eyebrow eyebrow mb-5 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" />
            The operating system for AI engineering
          </p>

          <h1 className="hero-title display max-w-2xl text-[clamp(3rem,6vw,5.5rem)] font-semibold">
            Build software with{" "}
            <span className="text-muted-foreground">AI teams,</span> not AI
            tools.
          </h1>

          <p className="hero-description mt-6 max-w-lg text-base leading-7 text-muted-foreground">
            Vangrex brings planning, execution, and production into one
            system—where specialized agents work together as a reliable
            engineering team.
          </p>

          <div className="hero-actions mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <Link
                href="/auth/sign-in"
                className="rounded-xl px-5 py-3 text-sm font-semibold transition"
              >
                Start building <span className="ml-2">→</span>
              </Link>
            </Button>

            <Button asChild variant={`outline`}>
              <Link
                href="#platform"
                className="rounded-xl px-5 py-3 text-sm font-semibold transition"
              >
                Explore the platform <span className="ml-2">→</span>
              </Link>
            </Button>
          </div>

          <div className="hero-stats mt-10 flex gap-7 border-t border-border pt-5 text-xs text-muted-foreground">
            <span>
              <b className="mr-1 text-foreground">$20M</b> Series A
            </span>

            <span>
              <b className="mr-1 text-foreground">50M+</b> lines reviewed
            </span>

            <span>
              <b className="mr-1 text-foreground">99.9%</b> task uptime
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="execution-card card relative mx-auto w-full max-w-[460px] overflow-hidden p-4">
          <div className="execution-header mb-4 flex items-center justify-between border-b border-border pb-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-2">
              <i className="active-status size-2 rounded-full bg-emerald-500" />
              EXECUTION GRAPH
            </span>

            <span>LIVE / 08:32:19</span>
          </div>

          <div className="relative space-y-2.5">
            {nodes.map(([num, name, detail]) => (
              <div
                key={name}
                className="workflow-node relative z-10 flex items-center gap-3 rounded-xl border border-border bg-card/90 p-3"
              >
                <span className="grid size-7 place-items-center rounded-lg border border-border bg-muted text-[10px] text-muted-foreground">
                  {num}
                </span>

                <span className="flex-1">
                  <b className="block text-sm font-medium">{name}</b>

                  <small className="text-[11px] text-muted-foreground">
                    {detail}
                  </small>
                </span>

                <span
                  className={
                    name === "Agent team"
                      ? "active-status size-2 rounded-full bg-primary shadow-[0_0_14px_hsl(var(--primary)/.7)]"
                      : "size-1.5 rounded-full bg-muted-foreground/40"
                  }
                />
              </div>
            ))}

            <div
              className="workflow-connection absolute left-7 top-8 -z-0 h-[220px] w-px bg-primary/60"
              aria-hidden="true"
            />
          </div>

          <div className="execution-stats mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
            <div>
              <b className="block text-sm">12</b>
              <small className="text-[10px] text-muted-foreground">
                Agents
              </small>
            </div>

            <div>
              <b className="block text-sm">36</b>
              <small className="text-[10px] text-muted-foreground">Tasks</small>
            </div>

            <div>
              <b className="block text-sm text-emerald-500">98%</b>
              <small className="text-[10px] text-muted-foreground">
                On track
              </small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

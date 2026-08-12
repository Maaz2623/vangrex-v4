"use client";

import { Hero } from "./hero";
import { MainSections } from "./main-section";
import { SiteHeader } from "./site-header";


export const HomePage = () => {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <MainSections />
    </main>
  );
};

import { requireAuth } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import React from "react";

const HomePage = async () => {
  await requireAuth();

  redirect("/projects");

  return <div>Home Page</div>;
};

export default HomePage;

import { HomePage } from "@/features/home/home-page";
import { requireUnAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnAuth();

  return <HomePage />;
};

export default Page;

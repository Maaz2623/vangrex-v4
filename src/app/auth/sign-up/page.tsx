import { LoginForm } from "@/features/auth/components/login-form";
import { RegisterForm } from "@/features/auth/components/register-form";
import { requireUnAuth } from "@/lib/auth-utils";
const LoginPage = async () => {
  await requireUnAuth();

  return <RegisterForm />;
};

export default LoginPage;

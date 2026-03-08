import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LogIn,
  Shield,
  BarChart3,
  Bell,
  Lock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// ─── Validation schema ────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Demo credentials ─────────────────────────────────────────────────────────
const DEMO_ACCOUNTS = [
  {
    label: "Admin",
    email: "admin@pathom.com",
    password: "admin123",
    role: "Admin",
  },
  {
    label: "Business",
    email: "user@pathom.com",
    password: "password123",
    role: "Business",
  },
  {
    label: "Developer",
    email: "dev@pathom.com",
    password: "dev123",
    role: "User",
  },
];

// ─── Feature highlights ───────────────────────────────────────────────────────
const FEATURES = [
  { icon: BarChart3, text: "Real-time analytics dashboard" },
  { icon: Bell, text: "Smart alert & event monitoring" },
  { icon: Shield, text: "Role-based access control" },
];

// ─── Component ────────────────────────────────────────────────────────────────
const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, resetError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });
  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = form;

  // Redirect after successful login
  useEffect(() => {
    if (isAuthenticated) {
      setLoginSuccess(true);
      const timer = setTimeout(() => navigate("/dashboard"), 800);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  // Clear error when user starts typing again
  useEffect(() => {
    if (error) resetError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: LoginFormValues) => {
    resetError();
    await login({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
    });
  };

  const fillDemo = (account: (typeof DEMO_ACCOUNTS)[0]) => {
    setValue("email", account.email, { shouldValidate: true });
    setValue("password", account.password, { shouldValidate: true });
  };

  const isPending = isLoading || isSubmitting;

  return (
    <div className="min-h-screen flex">
      {/* ── Left Brand Panel ─────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-[#0f172a] flex-col justify-between p-12">
        {/* Gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/30 blur-3xl" />
          <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-violet-600/25 blur-3xl" />
          <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white font-bold text-lg backdrop-blur-sm">
            P
          </div>
          <span className="text-white text-xl font-bold tracking-tight">
            Pathom
          </span>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 text-blue-300 text-xs font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              Management Platform v2.0
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight">
              Manage your
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                operations smarter
              </span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              Unified dashboard for real-time monitoring, event tracking, and
              full team collaboration — all in one place.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/8 border border-white/10">
                  <Icon className="h-4 w-4 text-blue-300" />
                </div>
                <span className="text-slate-300 text-sm">{text}</span>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex gap-6 pt-2">
            {[
              { value: "99.9%", label: "Uptime" },
              { value: "< 50ms", label: "Response" },
              { value: "256-bit", label: "Encryption" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-white font-bold text-lg">{stat.value}</p>
                <p className="text-slate-500 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-2 text-slate-600 text-xs">
          <Lock className="h-3 w-3" />
          <span>Secured with end-to-end encryption</span>
        </div>
      </div>

      {/* ── Right Login Panel ─────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              P
            </div>
            <span className="text-lg font-bold">Pathom</span>
          </div>

          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground text-sm">
              Sign in to your Pathom Dashboard account
            </p>
          </div>

          {/* Demo accounts */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Demo Accounts
            </p>
            <div className="flex gap-2 flex-wrap">
              {DEMO_ACCOUNTS.map((acc) => (
                <Button
                  key={acc.email}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemo(acc)}
                  className="h-auto px-3 py-1.5 text-xs gap-1.5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {acc.label}
                  <span className="text-muted-foreground">· {acc.role}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center">
            <Separator className="flex-1" />
            <span className="mx-2 text-xs text-muted-foreground whitespace-nowrap">
              or enter your credentials
            </span>
            <Separator className="flex-1" />
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="your@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs"
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className="pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setShowPassword((p) => !p)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember me */}
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal text-muted-foreground cursor-pointer">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />

              {/* Global error */}
              {error && (
                <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success state */}
              {loginSuccess && (
                <div className="flex items-center gap-2.5 rounded-lg border border-green-500/30 bg-green-500/8 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Login successful! Redirecting...</span>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                disabled={isPending || loginSuccess}
                className="w-full"
              >
                {isPending ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Footer info */}
          <p className="text-center text-xs text-muted-foreground">
            Protected by Pathom Security. By signing in you agree to our{" "}
            <span className="text-primary cursor-pointer hover:underline">
              Terms of Service
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

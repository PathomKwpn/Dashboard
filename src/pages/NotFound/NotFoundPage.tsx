import { useNavigate, useLocation } from "react-router-dom";
import { Home, ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center text-center max-w-md space-y-8">
        {/* Illustration */}
        <div className="relative">
          <p className="text-[9rem] font-extrabold leading-none text-muted/40 select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted border border-border">
              <SearchX className="h-9 w-9 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The page{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">
              {location.pathname}
            </code>{" "}
            could not be found. Please check the URL or return to the homepage.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button onClick={() => navigate("/dashboard")}>
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "error" | "success" | "info";

const styles: Record<Tone, { box: string; icon: React.ElementType }> = {
  error:   { box: "border-error bg-errorbg text-error",       icon: AlertCircle },
  success: { box: "border-success bg-successbg text-success", icon: CheckCircle2 },
  info:    { box: "border-stroke bg-offwhite text-black",     icon: Info },
};

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  title?: string;
}

export function Alert({ tone = "info", title, children, className, ...props }: AlertProps) {
  const { box, icon: Icon } = styles[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("flex items-start gap-3 rounded-md border p-4", box, className)}
      {...props}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="text-right">
        {title && <p className="text-button">{title}</p>}
        {children && <p className="text-body mt-1 text-black/70">{children}</p>}
      </div>
    </div>
  );
}

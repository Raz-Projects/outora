import { cn } from "@/lib/utils";
import { Input } from "./input";

type State = "default" | "error" | "success";

const ring: Record<State, string> = {
  default: "border-stroke focus-visible:border-beige",
  error:   "border-error   focus-visible:border-error",
  success: "border-success focus-visible:border-success",
};

interface FieldProps extends React.ComponentProps<"input"> {
  label?: string;
  state?: State;
  /** הודעה מתחת לשדה */
  message?: string;
}

export function Field({ label, state = "default", message, className, ...props }: FieldProps) {
  return (
    <div className="w-full">
      {label && <label className="text-button mb-2 block text-black">{label}</label>}
      <Input className={cn(ring[state], className)} {...props} />
      {message && (
        <p
          className={cn(
            "text-tag mt-2",
            state === "error" && "text-error",
            state === "success" && "text-success",
            state === "default" && "text-textgray"
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}

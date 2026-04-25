import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
  variant="ghost"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
  data-testid="button-theme-toggle"
  className="
    fixed bottom-[65px] right-[65px] z-50

    border-0
    bg-white/10
    backdrop-blur-[20px]
    border-b border-white/50
    text-[#353535]

    shadow-[inset_4px_4px_4px_rgba(0,0,0,0.06),_4px_4px_4px_rgba(0,0,0,0.08)]

    w-[60px] h-[60px]
    rounded-full
    overflow-hidden

    inline-flex items-center justify-center
  "
>
  <Sun className="!h-[30px] !w-[30px] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
  <Moon className="absolute !h-[30px] !w-[30px] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" color="white"/>
  <span className="sr-only">Toggle theme</span>
</Button>

  );
}


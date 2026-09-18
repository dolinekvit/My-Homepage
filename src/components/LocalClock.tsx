import { useNow } from "@/lib/useNow";

export function LocalClock({ locales }: { locales?: Intl.LocalesArgument }) {
  const now = useNow();
  const time = new Intl.DateTimeFormat(locales, { hour: "2-digit", minute: "2-digit" }).format(now);
  const date = new Intl.DateTimeFormat(locales, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);

  return (
    <div className="flex flex-col items-center gap-1">
      <p className="font-heading text-8xl leading-none font-extralight tracking-tight tabular-nums">
        {time}
      </p>
      <p className="text-sm font-medium text-foreground/70">{date}</p>
    </div>
  );
}

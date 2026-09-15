import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type SegmentedOption<T extends string> = { value: T; label: string };

/** macOS-style segmented control: exactly one of a few options is always selected. */
export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly SegmentedOption<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <ToggleGroup
      type="single"
      aria-label={label}
      value={value}
      onValueChange={(next) => {
        // Radix reports "" when the active item is clicked again; keep the current selection.
        if (next) onChange(next as T);
      }}
      spacing={1}
      className="rounded-lg bg-muted p-0.5"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          size="sm"
          className="rounded-md px-3 text-foreground hover:bg-transparent data-[state=on]:bg-card data-[state=on]:shadow-sm dark:data-[state=on]:bg-accent"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

import { cva } from "class-variance-authority";
import { Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSettings } from "@/lib/useSettings";
import { useState } from "react";

const tile = "group flex w-20 cursor-pointer flex-col items-center gap-2 rounded-xl outline-none";

const appIcon = cva(
  "relative grid size-16 place-items-center rounded-[22.5%] transition-[scale,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105 group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-ring group-active:scale-95 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-linear-to-b after:from-white/22 after:to-transparent after:to-45% motion-reduce:transition-none",
  {
    variants: {
      variant: {
        site: "bg-white shadow-[inset_0_0_0_0.5px_rgb(0_0_0/8%),0_1px_2px_rgb(0_0_0/10%),0_8px_20px_-6px_rgb(0_0_0/28%)] dark:shadow-[inset_0_0_0_0.5px_rgb(255_255_255/10%),0_1px_2px_rgb(0_0_0/40%),0_8px_20px_-6px_rgb(0_0_0/60%)]",
        add: "bg-white/35 shadow-[inset_0_0_0_1px_rgb(255_255_255/55%),0_8px_20px_-8px_rgb(0_0_0/18%)] backdrop-blur-xl backdrop-saturate-160 dark:bg-white/8 dark:shadow-[inset_0_0_0_1px_rgb(255_255_255/12%),0_8px_20px_-8px_rgb(0_0_0/50%)]",
      },
    },
  },
);

function faviconUrl(site: string) {
  return `https://www.google.com/s2/favicons?domain=${site}&sz=64`;
}

export function FavoriteSite({ name, url }: { name: string; url: string }) {
  return (
    <a href={url} title={name} className={tile}>
      <span className={appIcon({ variant: "site" })}>
        <img src={faviconUrl(url)} alt="" draggable={false} className="size-9 rounded-md" />
      </span>
      <span className="max-w-full truncate text-xs font-medium text-foreground/90">{name}</span>
    </a>
  );
}

export function AddFavoriteButton({ onClick }: { onClick?: () => void }) {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { settings, updateSettings } = useSettings();

  const addSite = () => {
    if (Boolean(url) && Boolean(name)) {
      const urlOrigin = url.match(/^http|https/)
        ? new URL(url).origin
        : new URL(`https://${url}`).origin;

      updateSettings({ favoriteSites: [...settings.favoriteSites, { url: urlOrigin, name }] });
    }

    setPopoverOpen(false);
  };

  const onPopoverToggle = (open: boolean) => {
    if (!open) {
      setUrl("");
      setName("");
    }

    setPopoverOpen(open);
  };

  return (
    <Popover onOpenChange={onPopoverToggle} open={popoverOpen}>
      <PopoverTrigger asChild={true}>
        <button type="button" onClick={onClick} className={tile}>
          <span className={appIcon({ variant: "add" })}>
            <Plus className="size-7 text-muted-foreground" strokeWidth={1.75} />
          </span>
          <span className="text-xs font-medium text-muted-foreground">Add site</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="url">URL</Label>
          <Input
            name="url"
            placeholder="Site URL"
            onChange={(e) => setUrl(e.currentTarget.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            name="name"
            placeholder="Site name"
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </div>
        <Button onClick={addSite}>Add</Button>
      </PopoverContent>
    </Popover>
  );
}

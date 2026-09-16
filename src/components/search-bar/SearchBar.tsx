import { useSettings } from "@/lib/useSettings";
import { Input } from "../ui/input";

export function SearchBar() {
  const { settings } = useSettings();

  return <Input className="glass" placeholder="Search..." />;
}

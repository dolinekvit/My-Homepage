import { Search } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { ELEVATION } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";

export function SearchBar() {
  const { term, onChange, onKeyPress } = useSearch();

  return (
    <InputGroup
      className={cn("h-14 rounded-2xl glass border-transparent px-2", ELEVATION)}
      onKeyDown={onKeyPress}
    >
      <InputGroupAddon align="inline-start">
        <Search className="size-5" />
      </InputGroupAddon>
      <InputGroupInput
        aria-label="Search"
        value={term}
        onChange={onChange}
        placeholder="Search the web"
        className="h-14 text-base md:text-base"
      />
    </InputGroup>
  );
}

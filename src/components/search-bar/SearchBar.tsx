import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Search } from "lucide-react";
import { useSearch } from "@/hooks/use-search";

export function SearchBar() {
  const { term, onChange, onKeyPress } = useSearch();

  return (
    <InputGroup className="glass" onKeyDown={onKeyPress}>
      <InputGroupAddon align="inline-start">
        <Search />
      </InputGroupAddon>
      <InputGroupInput value={term} onChange={onChange} placeholder="Search..." autoFocus={true} />
    </InputGroup>
  );
}

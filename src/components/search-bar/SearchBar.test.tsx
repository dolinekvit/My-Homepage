import { render, screen } from "@testing-library/react";
import { SearchBar } from "./SearchBar";
import userEvent from "@testing-library/user-event";
import { useSearch } from "@/hooks/use-search";
import { createWrapper } from "@/test/query";

vi.mock("../../hooks/use-search.ts", { spy: true });

describe(SearchBar.name, () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render", () => {
    render(<SearchBar />, { wrapper: createWrapper() });

    expect(screen.getByRole("textbox", { name: /search/i })).toBeInTheDocument();
  });

  it("should react to typing", async () => {
    const user = userEvent.setup();

    render(<SearchBar />, { wrapper: createWrapper() });

    const searchBar = screen.getByRole("textbox", { name: /search/i });

    await user.type(searchBar, "Search example");

    expect(searchBar).toHaveValue("Search example");
  });

  it("should relocate on enter", async () => {
    const user = userEvent.setup();
    const mockFn = vi.fn();
    const useSearchMock = vi.mocked(useSearch);

    useSearchMock.mockImplementation(() => ({
      term: "Search example",
      onChange: vi.fn(),
      onKeyPress: mockFn,
    }));

    render(<SearchBar />, { wrapper: createWrapper() });

    screen.getByRole("textbox", { name: /search/i }).focus();

    await user.keyboard("{Enter}");

    expect(mockFn).toHaveBeenCalledOnce();
  });
});

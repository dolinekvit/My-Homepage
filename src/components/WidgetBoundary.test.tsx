import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WidgetBoundary } from "@/components/WidgetBoundary";

const crash = { enabled: true };

function FlakyWidget() {
  if (crash.enabled) throw new Error("boom");
  return <p>Recovered</p>;
}

describe("WidgetBoundary", () => {
  it("contains a crashing widget and lets the user reload it", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    crash.enabled = true;

    render(
      <>
        <WidgetBoundary name="Weather">
          <FlakyWidget />
        </WidgetBoundary>
        <p>Another widget</p>
      </>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Weather couldn't be displayed.");
    expect(screen.getByText("Another widget")).toBeInTheDocument();

    crash.enabled = false;
    await user.click(screen.getByRole("button", { name: "Reload widget" }));

    expect(screen.getByText("Recovered")).toBeInTheDocument();
  });
});

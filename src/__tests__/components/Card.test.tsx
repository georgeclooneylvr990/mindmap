import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Card from "@/components/ui/Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Hello world</Card>);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("applies warm border color", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("border-[#e8e0d6]");
  });

  it("applies default medium padding", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("p-5");
  });

  it("applies small padding when specified", () => {
    const { container } = render(<Card padding="sm">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("p-3");
  });

  it("applies large padding when specified", () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("p-6");
  });

  it("merges custom className", () => {
    const { container } = render(<Card className="my-custom">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("my-custom");
    expect(card.className).toContain("rounded-xl");
  });
});

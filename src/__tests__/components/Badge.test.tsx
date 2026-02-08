import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Badge from "@/components/ui/Badge";

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge>Philosophy</Badge>);
    expect(screen.getByText("Philosophy")).toBeInTheDocument();
  });

  it("renders as span by default (no onClick)", () => {
    const { container } = render(<Badge>Tag</Badge>);
    expect(container.querySelector("span")).toBeTruthy();
    expect(container.querySelector("button")).toBeNull();
  });

  it("renders as button when onClick is provided", () => {
    const onClick = vi.fn();
    render(<Badge onClick={onClick}>Clickable</Badge>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const onClick = vi.fn();
    render(<Badge onClick={onClick}>Click me</Badge>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("applies default variant with warm tones", () => {
    const { container } = render(<Badge>Default</Badge>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("bg-[#f5efe8]");
    expect(el.className).toContain("text-[#6b6157]");
  });

  it("applies podcast variant", () => {
    const { container } = render(<Badge variant="podcast">Pod</Badge>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("bg-amber-50");
    expect(el.className).toContain("text-amber-800");
  });

  it("applies book variant", () => {
    const { container } = render(<Badge variant="book">Book</Badge>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("bg-emerald-50");
    expect(el.className).toContain("text-emerald-800");
  });

  it("applies article variant", () => {
    const { container } = render(<Badge variant="article">Art</Badge>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("bg-sky-50");
    expect(el.className).toContain("text-sky-800");
  });

  it("applies personal_writing variant", () => {
    const { container } = render(
      <Badge variant="personal_writing">Writing</Badge>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("bg-violet-50");
    expect(el.className).toContain("text-violet-800");
  });

  it("has rounded-full pill shape", () => {
    const { container } = render(<Badge>Pill</Badge>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("rounded-full");
  });
});

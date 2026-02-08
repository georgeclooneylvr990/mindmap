import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import StarRating from "@/components/ui/StarRating";

describe("StarRating", () => {
  it("renders 5 rating dots", () => {
    render(<StarRating value={3} readonly />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(5);
  });

  it("fills dots up to the rating value with accent color", () => {
    render(<StarRating value={3} readonly />);
    const buttons = screen.getAllByRole("button");
    // First 3 should have accent bg
    for (let i = 0; i < 3; i++) {
      expect(buttons[i].className).toContain("bg-[#c47a2b]");
    }
    // Last 2 should have muted bg
    for (let i = 3; i < 5; i++) {
      expect(buttons[i].className).toContain("bg-[#e8e0d6]");
    }
  });

  it("does not show label text in readonly mode", () => {
    render(<StarRating value={3} readonly />);
    expect(screen.queryByText("Significant")).not.toBeInTheDocument();
  });

  it("shows influence label when editable and value > 0", () => {
    render(<StarRating value={4} onChange={vi.fn()} />);
    expect(screen.getByText("Major")).toBeInTheDocument();
  });

  it("calls onChange with the clicked rating", () => {
    const onChange = vi.fn();
    render(<StarRating value={2} onChange={onChange} />);
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[3]); // Click 4th dot
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("does not call onChange in readonly mode", () => {
    const onChange = vi.fn();
    render(<StarRating value={2} onChange={onChange} readonly />);
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[3]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("has accessible aria-labels", () => {
    render(<StarRating value={3} readonly />);
    expect(screen.getByLabelText("1 of 5 - Minor")).toBeInTheDocument();
    expect(screen.getByLabelText("5 of 5 - Transformative")).toBeInTheDocument();
  });

  it("uses small size dots when size=sm", () => {
    render(<StarRating value={1} readonly size="sm" />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0].className).toContain("w-2.5");
    expect(buttons[0].className).toContain("h-2.5");
  });
});

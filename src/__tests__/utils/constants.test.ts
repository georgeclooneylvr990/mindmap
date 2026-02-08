import { describe, it, expect } from "vitest";
import { ENTRY_TYPES, INFLUENCE_LABELS } from "@/lib/utils/constants";

describe("ENTRY_TYPES", () => {
  it("has all four entry types", () => {
    expect(Object.keys(ENTRY_TYPES)).toEqual([
      "PODCAST",
      "BOOK",
      "PERSONAL_WRITING",
      "ARTICLE",
    ]);
  });

  it("each type has label, color, and icon", () => {
    for (const [, value] of Object.entries(ENTRY_TYPES)) {
      expect(value).toHaveProperty("label");
      expect(value).toHaveProperty("color");
      expect(value).toHaveProperty("icon");
      expect(typeof value.label).toBe("string");
      expect(typeof value.icon).toBe("string");
    }
  });
});

describe("INFLUENCE_LABELS", () => {
  it("has labels for ratings 1-5", () => {
    expect(INFLUENCE_LABELS[1]).toBe("Minor");
    expect(INFLUENCE_LABELS[2]).toBe("Moderate");
    expect(INFLUENCE_LABELS[3]).toBe("Significant");
    expect(INFLUENCE_LABELS[4]).toBe("Major");
    expect(INFLUENCE_LABELS[5]).toBe("Transformative");
  });
});

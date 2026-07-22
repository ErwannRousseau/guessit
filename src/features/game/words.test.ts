import { describe, expect, test } from "bun:test";

import { categoryLabels, playableCategoryIds, wordsByCategory } from "./words";

describe("word catalog", () => {
  test("exposes every playable category with a label and 24 non-empty words", () => {
    expect(playableCategoryIds).toEqual([
      "objects",
      "animals",
      "food",
      "places",
      "jobs",
      "leisure",
    ]);

    for (const categoryId of playableCategoryIds) {
      expect(categoryLabels[categoryId]).not.toBeEmpty();
      expect(wordsByCategory[categoryId]).toHaveLength(24);
      expect(wordsByCategory[categoryId].every((word) => word.trim().length > 0)).toBe(true);
    }
  });

  test("keeps the mixed-category label separate from playable catalogs", () => {
    expect(categoryLabels.mix).toBe("Tout mélanger");
    expect(playableCategoryIds).not.toContain("mix");
  });
});

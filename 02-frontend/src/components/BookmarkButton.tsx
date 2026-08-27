import { useState } from "react";

type SaveState = "idle" | "saving" | "saved";

export function BookmarkButton({ articleTitle }: { articleTitle: string }) {
  const [state, setState] = useState<SaveState>("idle");

  function handleClick() {
    if (state === "saving") return;
    if (state === "saved") {
      setState("idle");
      return;
    }
    setState("saving");
    window.setTimeout(() => setState("saved"), 800);
  }

  const isSaved = state === "saved";

  return (
    <button
      type="button"
      className="bookmark-btn"
      onClick={handleClick}
      disabled={state === "saving"}
      aria-pressed={isSaved}
      aria-label={isSaved ? `Fjern "${articleTitle}" fra gemte` : `Gem "${articleTitle}"`}
    >
      {state === "saving" ? "…" : isSaved ? "★" : "☆"}
    </button>
  );
}
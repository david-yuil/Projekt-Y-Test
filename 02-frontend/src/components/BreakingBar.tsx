import type { BreakingNews } from "../types";

export function BreakingBar({ news }: { news: BreakingNews }) {
  return (
    <div className="breaking-bar">
      <span>BREAKING</span>
      <p>{news.headline}</p>
      {news.tag.map((tag) => (
        <button key={tag} type="button">{tag}</button>
      ))}
    </div>
  );
}
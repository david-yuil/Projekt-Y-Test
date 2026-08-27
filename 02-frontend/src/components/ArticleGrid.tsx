import type { ArticleCard as ArticleCardType } from "../types";
import { ArticleCard } from "./ArticleCard";

export function ArticleGrid({ cards }: { cards: ArticleCardType[] }) {
  if (cards.length === 0) {
    return (
      <div>
        <h2>Ingen artikler lige nu</h2>
        <p>Der er ikke noget indhold at vise i denne sektion endnu.</p>
      </div>
    );
  }

  return (
    <div className="article-grid">
      {cards.map((card) => (
        <ArticleCard key={card.id} card={card} />
      ))}
    </div>
  );
}
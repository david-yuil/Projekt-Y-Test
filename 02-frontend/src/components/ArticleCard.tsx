import type { ArticleCard as ArticleCardType } from "../types";
import { BookmarkButton } from "./BookmarkButton";

function assertNever(x: never): never {
  throw new Error("Unhandled card kind: " + JSON.stringify(x));
}

export function ArticleCard({ card }: { card: ArticleCardType }) {
  switch (card.kind) {
    case "standard":
      return (
        <article className="card">
          <BookmarkButton articleTitle={card.title} />
          <img src={card.urlImage} alt={card.title} />
          <span className="card-category">{card.category}</span>
          <h3>{card.title}</h3>
          {card.hasVideo && <span>Video</span>}
        </article>
      );
    case "stat":
      return (
        <article className="card">
          <BookmarkButton articleTitle={card.description} />
          <span className="card-category">{card.category}</span>
          <p>{card.value}</p>
          <p>{card.description}</p>
          <button type="button">{card.buttonText}</button>
        </article>
      );
    case "quote":
      return (
        <article className="card">
          <BookmarkButton articleTitle={card.title} />
          <span>/{card.source.toLowerCase()}/</span>
          <h3>{card.title}</h3>
        </article>
      );
    case "list":
      return (
        <article className="card">
          <BookmarkButton articleTitle={card.title} />
          <span className="card-category">{card.category}</span>
          {card.items.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </article>
      );
    case "guide":
      return (
        <article className="card">
          <BookmarkButton articleTitle={card.title} />
          <img src={card.urlImage} alt={card.title} />
          <span className="card-category">{card.category}</span>
          <h3>{card.title}</h3>
          <span>{card.author}</span>
        </article>
      );
    default:
      return assertNever(card);
  }
}
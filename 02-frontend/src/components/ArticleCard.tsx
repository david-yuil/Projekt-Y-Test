import type { ArticleCard as ArticleCardType } from "../types";
import VideoIcon from "../assets/icons/icon (2).svg";

function assertNever(x: never): never {
  throw new Error("Unhandled card kind: " + JSON.stringify(x));
}

export function ArticleCard({ card }: { card: ArticleCardType }) {
  switch (card.kind) {
    case "standard":
      return (
        <article className="card card--overlay">
          <img className="card-image-bg-flex1" src={card.urlImage} alt={card.title} />
          <div className="card-scrim" aria-hidden="true" />
          <div className="card-overlay-body">
            <span className="card-category card-category--light">
              {card.category}
            </span>
            <h3 className="card-title-light">{card.title}</h3>
            {card.hasVideo && (
              <span className="video-badge">
                <img src={VideoIcon} alt="" width="12" height="12" /> Video
              </span>
            )}
          </div>
        </article>
      );

    case "stat":
      return (
        <article className="card card--stat">
          <span className="card-category">{card.category}</span>
          <p className="stat-value">{card.value}</p>
          <p className="stat-description">{card.description}</p>
          <button type="button" className="stat-cta">
            {card.buttonText}
          </button>
        </article>
      );

    case "quote":
      return (
        <article className="card card--quote">
          <span className="quote-source">/{card.source.toLowerCase()}/</span>
          <h3 className="quote-title">{card.title}</h3>
        </article>
      );

    case "list":
      return (
        <article className="card news-list-card">
          {card.items.map((item, i) => (
            <div className="news-list-row" key={i}>
              <div className="news-list-thumb" aria-hidden="true" />
              <div className="news-list-content">
                <span className="news-list-category">{card.category}</span>
                <p className="news-list-headline">{item.text}</p>
                {item.hasAudio && (
                  <span className="news-list-audio-badge">🔊 Lyd</span>
                )}
              </div>
            </div>
          ))}
        </article>
      );
    case "guide":
      return (
        <article className="card card--guide">
          <img className="guide-image" src={card.urlImage} alt={card.title} />
          <div className="guide-body">
            <span className="card-category">{card.category}</span>
            <h3 className="guide-title">{card.title}</h3>
            <span className="guide-author">AF {card.author.toUpperCase()}</span>
          </div>
        </article>
      );

    default:
      return assertNever(card);
  }
}

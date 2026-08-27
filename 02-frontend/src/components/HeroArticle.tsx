import type { HeroArticle as HeroArticleType } from "../types";

export function HeroArticle({ article }: { article: HeroArticleType }) {
  return (
    <div className="hero">
      <span>{article.category}</span>
      <h1>{article.title}</h1>
      <img src={article.urlImage} alt={article.title} />
      <ul>
        {article.relatedHeadlines.map((headline) => (
          <li key={headline}>{headline}</li>
        ))}
      </ul>
    </div>
  );
}
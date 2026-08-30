import type { HeroArticle as HeroArticleType } from "../types";

export function HeroArticle({ article }: { article: HeroArticleType }) {
  return (
    <div className="hero">
      <span>{article.category}</span>
      <h1 className="hero-h1">{article.title}</h1>
      <img src={article.urlImage} alt={article.title} />
      <span>{article.category}</span>
      <div className="hero-bord">
        <h1>Regeringen fremlægger ny plan for dansk økonomi</h1>
        <ul>
          {article.relatedHeadlines.map((headline) => (
            <li key={headline}>{headline}</li>
          ))}
        </ul>
      </div>
      <span>{article.category}</span>
      <h1 className="hero-h1">{article.title}</h1>
    </div>
  );
}

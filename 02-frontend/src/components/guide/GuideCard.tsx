import "./GuideCard.css";

type GuideCardProps = {
  image: string;
  title: string;
  author: string;
};

export function GuideCard({ image, title, author }: GuideCardProps) {
  return (
    <article className="guide-card">
      <img className="guide-card-img" src={image} alt={title} />
      <div className="guide-card-body">
        <span className="guide-card-eyebrow">↗ GUIDE</span>
        <h3 className="guide-card-title">{title}</h3>
        <span className="guide-card-author">AF {author.toUpperCase()}</span>
      </div>
    </article>
  );
}
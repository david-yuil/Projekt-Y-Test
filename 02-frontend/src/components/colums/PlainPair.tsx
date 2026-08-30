import "./PlainPair.css";

type PlainCard = {
  image: string;
  category?: string;
  title: string;
};

type PlainPairProps = {
  left: PlainCard;
  right: PlainCard;
};

export function PlainPair({ left, right }: PlainPairProps) {
  return (
    <div className="plain-pair">
      <article className="plain-pair-card">
        <img className="plain-pair-img" src={left.image} alt={left.title} />
        <h3 className="plain-pair-title">{left.title}</h3>
      </article>

      <article className="plain-pair-card">
        <img className="plain-pair-img" src={right.image} alt={right.title} />
        <h3 className="plain-pair-title">{right.title}</h3>
      </article>
    </div>
  );
}
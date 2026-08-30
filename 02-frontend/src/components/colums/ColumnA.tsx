import "./ColumnA.css";

type ColumnAProps = {
  overlayImage: string;
  overlayCategory: string;
  overlayTitle: string;
  quoteSource: string;
  quoteTitle: string;
};

export function ColumnA({
  overlayImage,
  overlayCategory,
  overlayTitle,
  quoteSource,
  quoteTitle,
}: ColumnAProps) {
  return (
    <div className="col-a">
      <article className="col-a-plain">
        <img className="col-a-plain-img" src={overlayImage} alt={overlayTitle} />
        <span className="col-a-plain-category">{overlayCategory}</span>
        <h3 className="col-a-plain-title">{overlayTitle}</h3>
      </article>

      <article className="col-a-quote">
        <span className="col-a-quote-source">/{quoteSource.toLowerCase()}/</span>
        <h3 className="col-a-quote-title">{quoteTitle}</h3>
      </article>
    </div>
  );
}
import "./ColumnC.css";
import PlayIcon from "../../assets/icons/icon (2).svg";
type ColumnCProps = {
  topImage: string;
  topCategory: string;
  topTitle: string;
  bottomImage: string;
  bottomCategory: string;
  bottomTitle: string;
  bottomHasVideo?: boolean;
};

export function ColumnC({
  topImage,
  topCategory,
  topTitle,
  bottomImage,
  bottomCategory,
  bottomTitle,
  bottomHasVideo,
}: ColumnCProps) {
  return (
    <div className="col-c">
      <article className="col-c-plain-top">
        <img className="col-c-plain-img" src={topImage} alt={topTitle} />
        <span className="col-c-plain-category-top">{topCategory}</span>
        <h3 className="col-c-overlay-title-top">{topTitle}</h3>
      </article>

      <article className="col-c-overlay col-c-overlay--tall">
        <img
          className="col-c-overlay-img"
          src={bottomImage}
          alt={bottomTitle}
        />
        <div className="col-c-overlay-scrim" aria-hidden="true" />
        <div className="col-c-overlay-body">
          <span className="col-c-overlay-category">{bottomCategory}</span>
          <h3 className="col-c-overlay-title">{bottomTitle}</h3>
          {bottomHasVideo && (
            <span className="col-c-video-badge">
              <img src={PlayIcon} alt="" width="10" height="10" />
              Video
            </span>
          )}
        </div>
      </article>
    </div>
  );
}

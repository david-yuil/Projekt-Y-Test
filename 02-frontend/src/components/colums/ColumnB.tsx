import "./ColumnB.css";
import AudioIcon from "../../assets/icons/icon.svg";

type ListItem = {
  text: string;
  hasAudio?: boolean;
  thumbnail: string;
};

type ColumnBProps = {
  overlayImage: string;
  overlayCategory: string;
  overlayTitle: string;
  listCategory: string;
  listItems: ListItem[];
};

export function ColumnB({
  overlayImage,
  overlayCategory,
  overlayTitle,
  listCategory,
  listItems,
}: ColumnBProps) {
  return (
    <div className="col-b">
      <article className="col-b-overlay">
        <img
          className="col-b-overlay-img"
          src={overlayImage}
          alt={overlayTitle}
        />
        <div className="col-b-overlay-scrim" aria-hidden="true" />
        <div className="col-b-overlay-body">
          <span className="col-b-overlay-category">{overlayCategory}</span>
          <h3 className="col-b-overlay-title">{overlayTitle}</h3>
        </div>
      </article>

      <article className="col-b-list">
        {listItems.map((item, i) => (
          <div className="col-b-list-row" key={i}>
            <img className="col-b-list-thumb" src={item.thumbnail} alt="" />
            <div className="col-b-list-content">
              <span className="col-b-list-category">{listCategory}</span>
              <p className="col-b-list-headline">{item.text}</p>
              {item.hasAudio && (
                <span className="col-b-list-audio">
                  <img src={AudioIcon} alt="" width="12" height="12" />
                  LYD
                </span>
              )}
            </div>
          </div>
        ))}
      </article>
    </div>
  );
}

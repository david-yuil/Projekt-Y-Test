import { useState, useEffect } from "react";
import type { BreakingNews } from "../types";
import CircleIcon from "../assets/icons/circle-icon.svg";
import Icon from "../assets/icons/Group 149.svg";

export function BreakingBar({ news }: { news: BreakingNews }) {
  const [tagIndex, setTagIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTagIndex((current) => (current + 1) % news.tag.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [news.tag.length]);

  return (
    <div className="breaking-bar">
      <div className="breaking-bar-left">
        {" "}
        <div className="breaking-left">
          {" "}
          <img src={Icon} alt="" className="circle-icon" />
          <span>BREAKING</span>
        </div>
        <p>{news.headline}</p>
      </div>
      <div className="breaking-bar-right">
        <img src={CircleIcon} alt="" className="break-icon" />
        <div className="tag-slider">
          <button type="button" key={tagIndex} className="tag-slide">
            {news.tag[tagIndex]}
          </button>
        </div>
      </div>
    </div>
  );
}
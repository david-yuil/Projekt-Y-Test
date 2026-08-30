import type { ArticleCard as ArticleCardType } from "../types";
import { ArticleCard } from "./ArticleCard";
import { PlainPair } from "../components/colums/PlainPair";
import { ColumnA } from "../components/colums/ColumnA";
import { ColumnB } from "../components/colums/ColumnB";
import { ColumnC } from "../components/colums/ColumnC";
import { GuideCard } from "./guide/GuideCard";
import kobenhavnPhoto from "../assets/images/3c8a7747586d05307c4a235c56594551dfab6503.png";
import petrolPhoto from "../assets/images/d7e15e582d97781fe8ebb383b75b47c781313871.png";
import storUroThumb from "../assets/images/231b116c36f6f918608053c1b851158018656af1 (1).png";
import windmills from "../assets/images/f881fde2c6dc9d3651f9585038837b149a5bedb9.png";
import nature from "../assets/images/2ec55ea8030213cfb660d815b7f2ad56996f6e9e.png";
import listeViserPhoto from "../assets/images/70758feb82b6b97b2fcc0b0414af801794d4eda1.png";
import virksomhederPhoto2 from "../assets/images/3ea3596e366a4551643f378666e6a7b4cba047f9.png";
import housePhoto from "../assets/images/dc85f9d031dbda4b94943e5b572d8c812403fa11.png"


export function ArticleGrid({ cards }: { cards: ArticleCardType[] }) {
  if (cards.length === 0) {
    return (
      <div className="empty-state">
        <h2>Ingen artikler lige nu</h2>
      </div>
    );
  }

  const [wideCard, statCard] = cards;

  return (
    <div className="article-sections">
      <div className="row-flex">
        {wideCard && (
          <div className="flex-2">
            <ArticleCard card={wideCard} />
          </div>
        )}
        {statCard && (
          <div className="flex-1">
            <ArticleCard card={statCard} />
          </div>
        )}
      </div>

      <div className="row-flex">
        <div className="flex-col">
          <ColumnA
            overlayImage={kobenhavnPhoto}
            overlayCategory="DANSK POLITIK"
            overlayTitle="København vil forbyde fossile varebiler i centrum"
            quoteSource="Ritzau"
            quoteTitle="UK's Starmer announces resignation, Burnham puts himself forward as successor"
          />
        </div>
        <div className="flex-col">
          <ColumnB
            overlayImage={petrolPhoto}
            overlayCategory="DANSK POLITIK"
            overlayTitle="Streamingtjenester mister millioner af abonnenter efter prisstigning"
            listCategory="DANSK POLITIK"
            listItems={[
              {
                text: "Stor uro på markederne: Frygtindeks stiger markant",
                hasAudio: true,
                thumbnail: storUroThumb,
              },
              {
                text: "Stor uro på markederne: Frygtindeks stiger markant",
                thumbnail: storUroThumb,
              },
              {
                text: "Stor uro på markederne: Frygtindeks stiger markant",
                thumbnail: storUroThumb,
              },
            ]}
          />
        </div>
        <div className="flex-col">
          <ColumnC
            topImage={windmills}
            topCategory="DANSK POLITIK"
            topTitle="»Forskere finder mulig forklaring på stigende havtemperaturer«"
            bottomImage={nature}
            bottomCategory="DANSK POLITIK"
            bottomTitle="Nyt supersygehus åbner med robotter på operationsstuerne"
            bottomHasVideo
          />
        </div>
      </div>
           <PlainPair
        left={{
          image: listeViserPhoto,
          title: "Liste viser, hvilke job der vil forandre sig mest med kunstig intelligens",
        }}
        right={{
          image: housePhoto,
          title: "Virksomheder giver helt nye måder for at få fat i boligens friværdi",
        }}
      />
      <GuideCard
        image={virksomhederPhoto2}
        title="Én bestemt måde at lege med far på kan gøre børn mere robuste"
        author="Tobias Andreasen"
      />
    </div>
  );
}

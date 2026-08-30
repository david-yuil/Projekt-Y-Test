import type { ArticleCard, HomepageData } from "../types";
import heroPhoto from "../assets/images/231b116c36f6f918608053c1b851158018656af1 (1).png";
import CardPhoto2 from "../assets/images/3c8a7747586d05307c4a235c56594551dfab6503.png";
import CardPhoto6 from "../assets/images/dc85f9d031dbda4b94943e5b572d8c812403fa11.png";

export const mockCards: ArticleCard[] = [
  {
    id: "card-1",
    kind: "standard",
    category: "DANSK POLITIK",
    title:
      "Virksomheder giver helt nye måder for at få fat i boligens friværdi",
    urlImage: CardPhoto6,
    hasVideo: true,
  },
  {
    id: "card-2",
    kind: "stat",
    category: "DAGENS TAL",
    title: "",
    value: "2",
    description:
      "dage til soft launch og dermed den første mulighed for, at andre kan se os over skulderen i Projekt Y.",
    buttonText: "Se alle dagens tal",
  },
  {
    id: "card-3",
    kind: "standard",
    category: "DANSK POLITIK",
    title: "København vil forbyde fossile varebiler i centrum",
    urlImage: CardPhoto2,
    hasVideo: false,
  },
  {
    id: "card-4",
    kind: "standard",
    category: "DANSK POLITIK",
    title:
      "Streamingtjenester mister millioner af abonnenter efter prisstigning",
    urlImage:
      "https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=800&q=80",
    hasVideo: false,
  },
  {
    id: "card-5",
    kind: "quote",
    category: "RITZAU",
    title:
      "UK's Starmer announces resignation, Burnham puts himself forward as successor",
    source: "Ritzau",
  },
  {
    id: "card-6",
    kind: "list",
    category: "DANSK POLITIK",
    title: "Stor uro på markederne",
    // Awkward case on purpose: only one item instead of the usual three.
    items: [{ text: "Stor uro på markederne: Frygtindeks stiger markant" }],
  },
  {
    id: "card-7",
    kind: "standard",
    category: "DANSK POLITIK",
    // Awkward case on purpose: an unusually long headline.
    title:
      "Nyt supersygehus åbner med robotter på operationsstuerne, og regionen venter markant kortere ventetider allerede fra næste kvartal",
    urlImage:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    hasVideo: true,
  },
  {
    id: "card-8",
    kind: "guide",
    category: "GUIDE",
    title: "Én bestemt måde at lege med far på kan gøre børn mere robuste",
    urlImage:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80",
    author: "Tobias Andreasen",
  },
];

export const mockHomepageData: HomepageData = {
  breaking: {
    headline: "Regeringen indkalder til hastepressemøde",
    tag: ["Hormuz-strædet", "Regeringen"],
  },
  hero: {
    category: "DANSK POLITIK",
    title: "Regeringen fremlægger ny plan for dansk økonomi",
    urlImage: heroPhoto,
    relatedHeadlines: [
      "Regeringen vil ændre reglerne for offentlig administration",
      "Nyt udspil fra regeringen skal styrke erhvervslivet",
      "Regeringen præsenterer forslag til skattereform",
    ],
  },
  cards: mockCards,
};

export const emptyHomepageData: HomepageData = {
  breaking: mockHomepageData.breaking,
  hero: mockHomepageData.hero,
  cards: [],
};

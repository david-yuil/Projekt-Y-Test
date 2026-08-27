import type { ArticleCard, HomepageData } from "../types";

export const mockCards: ArticleCard[] = [
  {
    id: "card-1",
    kind: "standard",
    category: "DANSK POLITIK",
    title:
      "Virksomheder giver helt nye måder for at få fat i boligens friværdi",
    urlImage:
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80",
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
    urlImage:
      "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=800&q=80",
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
    items: ["Stor uro på markederne: Frygtindeks stiger markant"],
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
    urlImage:
      "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&q=80",
    relatedHeadlines: [
      "Regeringen vil ændre reglerne for offentlig administration",
      "Nyt udspil fra regeringen skal styrke erhvervslivet",
      "Regeringen præsenterer forslag til skattereform",
    ],
  },
  cards: mockCards,
};

// A separate, empty dataset to demonstrate the "empty" state:
// a successful response with no articles to show.
export const emptyHomepageData: HomepageData = {
  breaking: mockHomepageData.breaking,
  hero: mockHomepageData.hero,
  cards: [],
};

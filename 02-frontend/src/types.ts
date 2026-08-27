export type BaseCard = { category: string; title: string; id: string };

export type ArticleCard =
  | (BaseCard & { kind: "standard"; urlImage: string; hasVideo: boolean })
  | (BaseCard & {
      kind: "stat";
      description: string;
      buttonText: string;
      value: string;
    })
  | (BaseCard & { kind: "quote"; source: string })
  | (BaseCard & { kind: "list"; items: string[] })
  | (BaseCard & { kind: "guide"; urlImage: string; author: string });

export type HeroArticle = {
  category: string;
  title: string;
  urlImage: string;
  relatedHeadlines: string[];
};

export type BreakingNews = {
  headline: string;
  tag: string[];
};

export type HomepageData = {
  breaking: BreakingNews;
  hero: HeroArticle;
  cards: ArticleCard[];
};

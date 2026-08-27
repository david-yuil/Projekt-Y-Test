import { Header } from "./components/Header";
import { BreakingBar } from "./components/BreakingBar";
import { HeroArticle } from "./components/HeroArticle";
import { ArticleGrid } from "./components/ArticleGrid";
import { mockHomepageData } from "./data/mockData";
import "./App.css";

function App() {
  return (
    <div>
      <Header />
      <BreakingBar news={mockHomepageData.breaking} />
      <HeroArticle article={mockHomepageData.hero} />
      <ArticleGrid cards={mockHomepageData.cards} />
    </div>
  );
}

export default App;

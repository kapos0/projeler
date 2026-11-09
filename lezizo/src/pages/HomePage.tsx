import { ArrowLeft, ChefHat, Flame, Leaf, Search, Plus } from "lucide-react";
import RecipeCard from "../components/RecipeCard";
import type { Recipe } from "../types/recipe";
type Props = {
  recipes: Recipe[];
  query: string;
  onQuery: (q: string) => void;
  onOpen: (r: Recipe) => void;
  favorites: number[];
  onFavorite: (id: number) => void;
  onAdd: () => void;
};
export default function HomePage({
  recipes,
  query,
  onQuery,
  onOpen,
  favorites,
  onFavorite,
  onAdd,
}: Props) {
  const filtered = recipes.filter(
    (r) =>
      r.title.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr")) ||
      r.ingredients.some((i) =>
        i.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr")),
      ),
  );
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Leaf size={14} /> Bugünün mutfak ilhamı
          </span>
          <h1>
            İyi yemek,
            <br />
            <em>iyi hissettirir.</em>
          </h1>
          <p>
            Aradığın lezzeti bul, kendi tarifini paylaş ve mutfağını her gün
            yeniden keşfet.
          </p>
          <div className="search-box">
            <Search size={20} />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Tarif veya malzeme ara..."
            />
            <kbd>⌘ K</kbd>
          </div>
        </div>
        <div className="hero-art">
          <div className="art-circle" />
          <div className="floating-note note-top">
            <ChefHat size={17} />
            <span>
              Bugün ne
              <br />
              <strong>pişirsek?</strong>
            </span>
          </div>
          <div className="floating-note note-bottom">
            <Flame size={16} />
            <span>
              12.400+<small>ev yapımı tarif</small>
            </span>
          </div>
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=85"
            alt="Mutfakta yemek hazırlayan kişi"
          />
        </div>
      </section>
      <section className="section-head">
        <div>
          <span className="eyebrow">Sana özel seçtik</span>
          <h2>Bugün mutfakta</h2>
        </div>
        <button className="text-button">
          Tümünü gör <ArrowLeft size={16} className="arrow-right" />
        </button>
      </section>
      <div className="featured-grid">
        {filtered.slice(0, 3).map((r) => (
          <RecipeCard
            key={r.id}
            recipe={r}
            onOpen={() => onOpen(r)}
            isFavorite={favorites.includes(r.id)}
            onFavorite={() => onFavorite(r.id)}
          />
        ))}
      </div>
      <section className="section-head lower">
        <div>
          <span className="eyebrow">Topluluktan yeni</span>
          <h2>İlham veren tarifler</h2>
        </div>
        <div className="filter-pills">
          <button className="selected">Tümü</button>
          <button>Pratik</button>
          <button>Vejetaryen</button>
        </div>
      </section>
      <div className="recipe-list">
        {filtered.slice(3).map((r) => (
          <RecipeCard
            key={r.id}
            recipe={r}
            onOpen={() => onOpen(r)}
            isFavorite={favorites.includes(r.id)}
            onFavorite={() => onFavorite(r.id)}
          />
        ))}
        <button className="add-recipe-card" onClick={onAdd}>
          <span>
            <Plus size={20} />
          </span>
          <strong>Kendi tarifini ekle</strong>
          <small>Lezzetini herkesle paylaş</small>
        </button>
      </div>
    </>
  );
}

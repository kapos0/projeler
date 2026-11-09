import { ArrowLeft, CalendarDays, Heart, Sparkles, Trash2 } from "lucide-react";
import RecipeCard from "../components/RecipeCard";
import type { Recipe } from "../types/recipe";
type Common = {
  recipes: Recipe[];
  favorites: number[];
  onFavorite: (id: number) => void;
  onOpen: (r: Recipe) => void;
};
export function FavoritesPage({
  recipes,
  favorites,
  onFavorite,
  onOpen,
}: Common) {
  const saved = recipes.filter((r) => favorites.includes(r.id));
  return (
    <section className="page-section">
      <div className="page-title">
        <div>
          <span className="eyebrow">
            <Heart size={14} /> Kişisel koleksiyonun
          </span>
          <h1>Favorilerim</h1>
          <p>Kalbine dokunan tarifler burada senin için saklanır.</p>
        </div>
        <div className="stat-badge">
          <strong>{saved.length}</strong>
          <span>kayıtlı tarif</span>
        </div>
      </div>
      {saved.length ? (
        <div className="recipe-list favorite-grid">
          {saved.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              onOpen={() => onOpen(r)}
              isFavorite
              onFavorite={() => onFavorite(r.id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Heart size={28} />
          <h2>Henüz favorin yok</h2>
          <p>
            Keşfet ekranından beğendiğin tarifleri kalbine dokunarak kaydet.
          </p>
        </div>
      )}
    </section>
  );
}
export function MenuPage({
  recipes,
  menu,
  onToggle,
}: {
  recipes: Recipe[];
  menu: Record<string, number[]>;
  onToggle: (meal: string, id: number) => void;
}) {
  return (
    <section className="page-section">
      <div className="page-title">
        <div>
          <span className="eyebrow">
            <CalendarDays size={14} /> Haftalık planın
          </span>
          <h1>Menüm</h1>
          <p>Haftanın yemeklerini önceden planla, mutfakta daha az düşün.</p>
        </div>
        <div className="stat-badge">
          <strong>{Object.values(menu).flat().length}</strong>
          <span>planlı tarif</span>
        </div>
      </div>
      <div className="meal-columns">
        {Object.keys(menu).map((meal) => (
          <div className="meal-column" key={meal}>
            <div className="meal-heading">
              <span
                className={`meal-dot ${meal === "Kahvaltı" ? "yellow" : meal === "Öğle" ? "green" : "red"}`}
              />
              <h2>{meal}</h2>
              <span>{menu[meal].length} tarif</span>
            </div>
            {recipes
              .filter((r) => menu[meal].includes(r.id))
              .map((r) => (
                <div className="menu-recipe" key={r.id}>
                  <img src={r.image} alt={r.title} />
                  <div>
                    <strong>{r.title}</strong>
                    <small>{r.time}</small>
                  </div>
                  <button
                    onClick={() => onToggle(meal, r.id)}
                    aria-label={`${r.title} menüden çıkar`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            <div className="menu-add">
              <select
                value=""
                onChange={(e) =>
                  e.target.value && onToggle(meal, Number(e.target.value))
                }
              >
                <option value="">+ Tarif ekle</option>
                {recipes
                  .filter((r) => !menu[meal].includes(r.id))
                  .map((r) => (
                    <option value={r.id} key={r.id}>
                      {r.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export function ProfilePage({
  recipes,
  favorites,
  onFavorite,
  onOpen,
  name,
  sharedCount,
  menuCount,
  onViewFavorites,
  onEdit,
}: {
  recipes: Recipe[];
  favorites: number[];
  onFavorite: (id: number) => void;
  onOpen: (r: Recipe) => void;
  name: string;
  sharedCount: number;
  menuCount: number;
  onViewFavorites: () => void;
  onEdit: () => void;
}) {
  const saved = recipes.filter((r) => favorites.includes(r.id));
  return (
    <section className="page-section profile-page">
      <div className="page-title">
        <div>
          <span className="eyebrow">Lezizo topluluğu</span>
          <h1>{name}</h1>
          <p>Mutfağını, favorilerini ve tariflerini yönet.</p>
        </div>
        <button className="outline-button" onClick={onEdit}>
          Profili düzenle
        </button>
      </div>
      <div className="profile-stats">
        <div>
          <strong>{saved.length}</strong>
          <span>Favori tarif</span>
        </div>
        <div>
          <strong>{sharedCount}</strong>
          <span>Paylaşılan tarif</span>
        </div>
        <div>
          <strong>{menuCount}</strong>
          <span>Menüdeki tarif</span>
        </div>
      </div>
      <div className="profile-content">
        <div>
          <div className="section-head">
            <div>
              <span className="eyebrow">Son kayıtların</span>
              <h2>Favorilerinden</h2>
            </div>
            <button className="text-button" onClick={onViewFavorites}>
              Tümünü gör <ArrowLeft size={16} className="arrow-right" />
            </button>
          </div>
          <div className="recipe-list profile-recipes">
            {saved.slice(0, 3).map((r) => (
              <RecipeCard
                key={r.id}
                recipe={r}
                onOpen={() => onOpen(r)}
                isFavorite
                onFavorite={() => onFavorite(r.id)}
              />
            ))}
          </div>
        </div>
        <div className="profile-tip">
          <Sparkles size={20} />
          <span>Lezizo önerisi</span>
          <h3>Bu hafta yeni bir şey dene</h3>
          <p>
            Menündeki tariflere göre sana özel ilhamlar hazırlamaya devam
            ediyoruz.
          </p>
        </div>
      </div>
    </section>
  );
}

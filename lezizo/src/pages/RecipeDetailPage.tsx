import { ArrowLeft, Heart } from "lucide-react";
import type { Recipe } from "../types/recipe";
type Props = {
  recipe: Recipe;
  favorite: boolean;
  onBack: () => void;
  onFavorite: () => void;
};
export default function RecipeDetailPage({
  recipe,
  favorite,
  onBack,
  onFavorite,
}: Props) {
  return (
    <section className="detail-view">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={17} /> Tariflere dön
      </button>
      <div className="detail-grid">
        <div>
          <img className="detail-image" src={recipe.image} alt={recipe.title} />
          <div className="detail-actions">
            <button
              className={`outline-button ${favorite ? "active-save" : ""}`}
              onClick={onFavorite}
            >
              <Heart size={17} fill={favorite ? "currentColor" : "none"} />{" "}
              {favorite ? "Favorilerde" : "Favoriye ekle"}
            </button>
            <span className="author-chip">
              Tarif sahibi <strong>{recipe.author}</strong>
            </span>
          </div>
        </div>
        <div className="detail-copy">
          <span className="eyebrow">
            {recipe.category} · {recipe.time}
          </span>
          <h1>{recipe.title}</h1>
          <p className="lead">{recipe.description}</p>
          <h2 className="detail-subtitle">Malzemeler</h2>
          <ul className="ingredient-list">
            {recipe.ingredients.map((i) => (
              <li key={i}>
                <span className="ingredient-dot" />
                {i}
              </li>
            ))}
          </ul>
          <h2 className="detail-subtitle instructions-title">Yapılışı</h2>
          <p className="instructions-copy">{recipe.instructions}</p>
        </div>
      </div>
      <div className="nutrition-panel">
        <div>
          <span className="eyebrow">Bir porsiyon için</span>
          <h2>Besin değerleri</h2>
          <p>Günün enerjisini dengeli ve lezzetli bir şekilde tamamla.</p>
        </div>
        <div className="nutrition-bars">
          {recipe.nutrition.map((item) => (
            <div className="nutrition-item" key={item.label}>
              <div className="nutrition-label">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
              <div className="bar-track">
                <span
                  style={{ width: `${item.percent}%`, background: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

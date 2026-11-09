import { Clock3, Heart, Star } from "lucide-react";
import type { Recipe } from "../types/recipe";

type Props = {
  recipe: Recipe;
  onOpen: () => void;
  isFavorite: boolean;
  onFavorite: () => void;
};
export default function RecipeCard({
  recipe,
  onOpen,
  isFavorite,
  onFavorite,
}: Props) {
  return (
    <article className="recipe-card" onClick={onOpen}>
      <div className="card-image-wrap">
        <img src={recipe.image} alt={recipe.title} />
        <button
          className={`save-button ${isFavorite ? "saved" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            onFavorite();
          }}
          aria-label="Favorilere ekle"
        >
          <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <span className="category-pill">{recipe.category}</span>
      </div>
      <div className="card-content">
        <div className="recipe-meta">
          <span>
            <Clock3 size={14} /> {recipe.time}
          </span>
          <span className="rating">
            <Star size={14} fill="currentColor" /> {recipe.rating}
          </span>
        </div>
        <h3>{recipe.title}</h3>
        <p>{recipe.author}</p>
      </div>
    </article>
  );
}

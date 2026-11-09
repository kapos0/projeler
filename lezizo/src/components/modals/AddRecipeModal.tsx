import { Plus, X } from "lucide-react";
import type { Recipe } from "../../types/recipe";
export default function AddRecipeModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (r: Recipe) => void;
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>
        <span className="eyebrow">Topluluğa katıl</span>
        <h2>Tarifini paylaş</h2>
        <p>
          Malzemeleri ve adım adım yapılışını ekle, tarifin tüm Lezizo
          mutfağında görünsün.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            onAdd({
              id: Date.now(),
              title: String(f.get("title")),
              category: "Topluluktan",
              time: "30 dk",
              rating: "Yeni",
              image:
                "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
              author: String(f.get("author")),
              description: "Topluluğumuzdan yepyeni bir ev tarifi.",
              ingredients: String(f.get("ingredients"))
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean),
              instructions: String(f.get("instructions")),
              nutrition: [
                { label: "Protein", value: "—", percent: 45, color: "#e7a24e" },
                {
                  label: "Karbonhidrat",
                  value: "—",
                  percent: 62,
                  color: "#7a9b70",
                },
                { label: "Yağ", value: "—", percent: 32, color: "#c75d4d" },
              ],
            });
          }}
        >
          <label>
            Tarif adı
            <input name="title" required placeholder="Örn. Anne usulü mantı" />
          </label>
          <label>
            Adın
            <input name="author" required placeholder="Ad Soyad" />
          </label>
          <label>
            Malzemeler <small>Virgülle ayır</small>
            <textarea name="ingredients" required rows={3} />
          </label>
          <label>
            Yapılışı <small>Adım adım anlat</small>
            <textarea name="instructions" required rows={5} />
          </label>
          <button className="primary-button" type="submit">
            <Plus size={18} /> Tarifi yayınla
          </button>
        </form>
      </div>
    </div>
  );
}

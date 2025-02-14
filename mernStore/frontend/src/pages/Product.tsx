import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeftIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { useProductStore } from "../store/useProductStore";

export default function ProductPage() {
    const {
        currentProduct,
        formData,
        setFormData,
        loading,
        error,
        fetchProduct,
        updateProduct,
        deleteProduct,
    } = useProductStore();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchProduct(id || "");
    }, [fetchProduct, id]);

    const handleDelete = async () => {
        if (window.confirm("Bu ürünü silmek istediğinize eminmisiniz")) {
            await deleteProduct(id || "");
            navigate("/");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="alert alert-error">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <button
                onClick={() => navigate("/")}
                className="btn btn-ghost mb-8"
            >
                <ArrowLeftIcon className="size-4 mr-2" />
                Anasayfaya dön
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-lg overflow-hidden shadow-lg bg-base-100">
                    <img
                        src={currentProduct?.image}
                        alt={currentProduct?.name}
                        className="size-full object-cover"
                    />
                </div>
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-6">
                            Ürünü Güncelle
                        </h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                updateProduct(id || "");
                            }}
                            className="space-y-6"
                        >
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base font-medium">
                                        Ürün Adı
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ürün Adı"
                                    className="input input-bordered w-full"
                                    value={formData.name}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => setFormData("name", e.target.value)}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base font-medium">
                                        Ürün Açıklaması
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ürün Açıklaması"
                                    className="input input-bordered w-full"
                                    value={formData.description}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setFormData(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base font-medium">
                                        Ürün fiyatı
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="input input-bordered w-full"
                                    value={formData.price}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => setFormData("price", e.target.value)}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base font-medium">
                                        Image URL
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="https://example.com/image.jpg"
                                    className="input input-bordered w-full"
                                    value={formData.image}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => setFormData("image", e.target.value)}
                                />
                            </div>
                            <div className="flex justify-between mt-8">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="btn btn-error"
                                >
                                    <Trash2Icon className="size-4 mr-2" />
                                    <span>Ürünü Sil</span>
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={
                                        loading ||
                                        !formData.name ||
                                        !formData.price ||
                                        !formData.description ||
                                        !formData.image
                                    }
                                >
                                    {loading ? (
                                        <span className="loading loading-spinner loading-sm" />
                                    ) : (
                                        <>
                                            <SaveIcon className="size-4 mr-2" />
                                            <span>Değişiklikleri Kaydet</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

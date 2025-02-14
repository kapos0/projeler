import { useProductStore } from "../store/useProductStore";
import {
    DollarSignIcon,
    ImageIcon,
    Package2Icon,
    PlusCircleIcon,
} from "lucide-react";

export default function AddProductModal() {
    const { addProduct, formData, setFormData, loading } = useProductStore();
    function handleCloseModal() {
        const modal = document.getElementById(
            "add_product_modal"
        ) as HTMLDialogElement;
        if (modal) modal.close();
    }
    return (
        <dialog id="add_product_modal" className="modal">
            <div className="modal-box">
                <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={handleCloseModal}
                >
                    X
                </button>
                <h3 className="font-bold text-xl mb-8">Yeni Ürün Ekle</h3>

                <form onSubmit={addProduct} className="space-y-6">
                    <div className="grid gap-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base font-medium">
                                    Ürün Adı
                                </span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                                    <Package2Icon className="size-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Ürün adını giriniz"
                                    className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200"
                                    value={formData.name}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => setFormData("name", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base font-medium">
                                    Ürün Açıklaması
                                </span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                                    <Package2Icon className="size-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Ürün açıklamasını giriniz"
                                    className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200"
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
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base font-medium">
                                    Fiyat
                                </span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                                    <DollarSignIcon className="size-5" />
                                </div>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200"
                                    value={
                                        formData.price !== null
                                            ? formData.price
                                            : 0.0
                                    }
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setFormData(
                                            "price",
                                            parseFloat(e.target.value)
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base font-medium">
                                    Ürün resmi URL
                                </span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                                    <ImageIcon className="size-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="https://example.com/image.jpg"
                                    className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200"
                                    value={formData.image}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => setFormData("image", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={handleCloseModal}
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary min-w-[120px]"
                            disabled={
                                !formData.name ||
                                !formData.description ||
                                !formData.price ||
                                !formData.image ||
                                loading
                            }
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                <>
                                    <PlusCircleIcon className="size-5 mr-2" />
                                    Ürün ekle
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="modal-backdrop" onClick={handleCloseModal}>
                <button>Kapat</button>
            </div>
        </dialog>
    );
}

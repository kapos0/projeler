"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Archive,
    BookOpen,
    ChevronDown,
    CirclePlus,
    ExternalLink,
    GripVertical,
    LayoutDashboard,
    Plus,
    Search,
    Star,
    Trash2,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
    createBoard,
    createColumn,
    createFular,
    deleteBoard,
    deleteFular,
    moveFular,
    updateFular,
} from "@/lib/actions/board";

type BoardData = Awaited<
    ReturnType<typeof import("@/lib/actions/board").getDashboardData>
>;
type BoardState = NonNullable<BoardData>;
type Fular = NonNullable<BoardData>["fulars"][number];
type Column = NonNullable<BoardData>["columns"][number];

export default function DashboardBoard({
    initialData,
}: {
    initialData: NonNullable<BoardData>;
}) {
    const [data, setData] = useOptimistic<
        BoardState,
        (next: BoardState) => BoardState
    >(initialData, (current, update) => update(current));
    const [activeBoardId, setActiveBoardId] = useState(
        initialData.boards[0]?.id ?? "",
    );
    const [query, setQuery] = useState("");
    const [showFularForm, setShowFularForm] = useState(false);
    const [showColumnForm, setShowColumnForm] = useState(false);
    const [showBoardForm, setShowBoardForm] = useState(false);
    const [activeColumnId, setActiveColumnId] = useState("");
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [selectedFular, setSelectedFular] = useState<Fular | null>(null);
    const [editingFular, setEditingFular] = useState<Fular | null>(null);
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const columns = useMemo(
        () =>
            data.columns
                .filter((column) => column.boardId === activeBoardId)
                .sort((a, b) => a.order - b.order),
        [activeBoardId, data.columns],
    );
    const fulars = useMemo(
        () =>
            data.fulars.filter((fular) => {
                const matchesBoard = fular.boardId === activeBoardId;
                const matchesQuery =
                    `${fular.title} ${fular.creator} ${fular.mediaType} ${fular.tags.join(" ")}`
                        .toLocaleLowerCase("tr-TR")
                        .includes(query.toLocaleLowerCase("tr-TR"));
                return matchesBoard && matchesQuery;
            }),
        [activeBoardId, data.fulars, query],
    );
    const activeBoard = data.boards.find((board) => board.id === activeBoardId);
    const total = data.fulars.filter(
        (fular) => fular.boardId === activeBoardId,
    ).length;
    const finished = data.fulars.filter(
        (fular) =>
            fular.boardId === activeBoardId &&
            ["Tamamlandı", "Okudum"].includes(
                columns.find((column) => column.id === fular.columnId)?.name ??
                    "",
            ),
    ).length;

    function submitAction(
        action: (
            formData: FormData,
        ) => Promise<{ error?: string; success?: boolean }>,
        form: HTMLFormElement,
        onSuccess: () => void,
    ) {
        setError("");
        const formData = new FormData(form);
        startTransition(async () => {
            const result = await action(formData);
            if (result.error) {
                setError(result.error);
                return;
            }
            onSuccess();
            router.refresh();
        });
    }

    function handleDrop(columnId: string) {
        if (!draggedId) return;
        const dragged = data.fulars.find((fular) => fular.id === draggedId);
        if (!dragged || dragged.columnId === columnId) return;
        setDraggedId(null);
        startTransition(async () => {
            setData((current) => ({
                ...current,
                fulars: current.fulars.map((fular) =>
                    fular.id === draggedId ? { ...fular, columnId } : fular,
                ),
            }));
            const result = await moveFular(draggedId, columnId);
            if (result.error) {
                setError(result.error);
                setData((current) => ({
                    ...current,
                    fulars: current.fulars.map((fular) =>
                        fular.id === draggedId
                            ? { ...fular, columnId: dragged.columnId }
                            : fular,
                    ),
                }));
                return;
            }
            router.refresh();
        });
    }

    function removeFular(fularId: string) {
        if (!window.confirm("Bu fuları silmek istediğinize emin misiniz?"))
            return;
        startTransition(async () => {
            const result = await deleteFular(fularId);
            if (result.error) setError(result.error);
            else {
                setData((current) => ({
                    ...current,
                    fulars: current.fulars.filter(
                        (fular) => fular.id !== fularId,
                    ),
                }));
                router.refresh();
            }
        });
    }

    function removeBoard() {
        if (
            !activeBoard ||
            !window.confirm(
                `"${activeBoard.name}" boardını ve içindeki fuları silmek istediğinize emin misiniz?`,
            )
        )
            return;
        startTransition(async () => {
            const result = await deleteBoard(activeBoard.id);
            if (result.error) {
                setError(result.error);
                return;
            }
            setActiveBoardId(
                data.boards.find((board) => board.id !== activeBoard.id)?.id ??
                    "",
            );
            router.refresh();
        });
    }

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-[#fff9fb]">
            <div className="mx-auto max-w-375 px-4 py-8 sm:px-8">
                <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
                            <LayoutDashboard className="size-4" /> Kişisel takip
                            alanın
                        </div>
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                            Fular panosu
                        </h1>
                        <p className="mt-2 text-slate-500">
                            Takip ettiklerini, sıradakileri ve keşfetmek
                            istediklerini tek yerde tut.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowBoardForm(true)}
                        >
                            <LayoutDashboard /> Yeni board
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={removeBoard}
                            disabled={!activeBoard}
                        >
                            <Trash2 /> Boardı sil
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setShowColumnForm(true)}
                        >
                            <Plus /> Kolon ekle
                        </Button>
                        <Button
                            onClick={() => {
                                setActiveColumnId(columns[0]?.id ?? "");
                                setShowFularForm(true);
                            }}
                        >
                            <CirclePlus /> Fular ekle
                        </Button>
                    </div>
                </header>

                <section className="mb-7 grid gap-3 sm:grid-cols-3">
                    <StatCard
                        label="Bu board'da"
                        value={total.toString()}
                        detail="toplam fular"
                        icon={<BookOpen />}
                    />
                    <StatCard
                        label="Tamamlanan"
                        value={finished.toString()}
                        detail={
                            total
                                ? `%${Math.round((finished / total) * 100)} tamamlandı`
                                : "henüz yok"
                        }
                        icon={<Archive />}
                    />
                    <StatCard
                        label="Aktif board"
                        value={activeBoard?.name ?? "—"}
                        detail="kişisel çalışma alanın"
                        icon={<LayoutDashboard />}
                    />
                </section>

                <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-pink-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Başlık, üretici veya etiket ara..."
                            className="h-10 border-0 bg-slate-50 pl-9 shadow-none focus-visible:ring-1"
                        />
                    </div>
                    <select
                        value={activeBoardId}
                        onChange={(event) =>
                            setActiveBoardId(event.target.value)
                        }
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-primary"
                    >
                        {data.boards.map((board) => (
                            <option key={board.id} value={board.id}>
                                {board.name}
                            </option>
                        ))}
                    </select>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="flex gap-4 overflow-x-auto pb-5">
                    {columns.map((column) => (
                        <ColumnView
                            key={column.id}
                            column={column}
                            fulars={fulars.filter(
                                (fular) => fular.columnId === column.id,
                            )}
                            onDragStart={setDraggedId}
                            onDrop={handleDrop}
                            onDelete={removeFular}
                            onSelect={setSelectedFular}
                            onAdd={() => {
                                setActiveColumnId(column.id);
                                setShowFularForm(true);
                            }}
                        />
                    ))}
                    <button
                        onClick={() => setShowColumnForm(true)}
                        className="flex min-h-40 min-w-64 items-center justify-center rounded-xl border-2 border-dashed border-pink-200 text-sm font-medium text-primary transition hover:border-primary hover:bg-pink-50"
                    >
                        <Plus className="mr-2 size-4" /> Yeni kolon
                    </button>
                </div>
            </div>

            {showFularForm && (
                <Modal
                    title="Yeni fular ekle"
                    onClose={() => setShowFularForm(false)}
                >
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitAction(createFular, event.currentTarget, () =>
                                setShowFularForm(false),
                            );
                        }}
                        className="grid gap-4 sm:grid-cols-2"
                    >
                        <input
                            type="hidden"
                            name="boardId"
                            value={activeBoardId}
                        />
                        <input
                            type="hidden"
                            name="columnId"
                            value={activeColumnId}
                        />
                        <Field
                            name="title"
                            label="Başlık"
                            placeholder="Örn. Interstellar"
                            required
                        />
                        <Field
                            name="creator"
                            label="Üretici / sanatçı"
                            placeholder="Christopher Nolan"
                            required
                        />
                        <SelectField
                            name="mediaType"
                            label="İçerik türü"
                            options={[
                                "Kitap",
                                "Film",
                                "Dizi",
                                "Podcast",
                                "Müzik",
                                "Oyun",
                                "Diğer",
                            ]}
                        />
                        <Field
                            name="category"
                            label="Tür / kategori"
                            placeholder="Bilim kurgu, tarih..."
                        />
                        <Field
                            name="rating"
                            label="Puan (1-5)"
                            placeholder="Henüz puanlama"
                        />
                        <Field
                            name="tags"
                            label="Etiketler"
                            placeholder="klasik, tekrar oku"
                        />
                        <Field
                            name="actionDate"
                            label="Tüketim / bitirme tarihi"
                            type="date"
                        />
                        <div className="sm:col-span-2">
                            <Field
                                name="mediaUrl"
                                label="Görsel / medya URL'si (opsiyonel)"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Field
                                name="description"
                                label="Kısa not"
                                placeholder="Bunu neden takip etmek istiyorsun?"
                            />
                        </div>
                        <div className="flex justify-end gap-2 sm:col-span-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowFularForm(false)}
                            >
                                Vazgeç
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                Fuları kaydet
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}
            {showColumnForm && (
                <Modal
                    title="Yeni kolon"
                    onClose={() => setShowColumnForm(false)}
                >
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitAction(
                                createColumn,
                                event.currentTarget,
                                () => setShowColumnForm(false),
                            );
                        }}
                        className="space-y-4"
                    >
                        <input
                            type="hidden"
                            name="boardId"
                            value={activeBoardId}
                        />
                        <Field
                            name="name"
                            label="Kolon adı"
                            placeholder="Örn. Tekrar okuyacağım"
                            required
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowColumnForm(false)}
                            >
                                Vazgeç
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                Kolonu ekle
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}
            {showBoardForm && (
                <Modal
                    title="Yeni board"
                    onClose={() => setShowBoardForm(false)}
                >
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitAction(createBoard, event.currentTarget, () =>
                                setShowBoardForm(false),
                            );
                        }}
                        className="space-y-4"
                    >
                        <Field
                            name="name"
                            label="Board adı"
                            placeholder="Örn. Alışveriş listem"
                            required
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowBoardForm(false)}
                            >
                                Vazgeç
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                Board oluştur
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}
            {selectedFular && (
                <FularDetailModal
                    fular={selectedFular}
                    onClose={() => setSelectedFular(null)}
                    onEdit={() => {
                        setEditingFular(selectedFular);
                        setSelectedFular(null);
                    }}
                />
            )}
            {editingFular && (
                <FularEditModal
                    fular={editingFular}
                    isPending={isPending}
                    onClose={() => setEditingFular(null)}
                    onSubmit={(form) =>
                        submitAction(updateFular, form, () =>
                            setEditingFular(null),
                        )
                    }
                />
            )}
        </main>
    );
}

function StatCard({
    label,
    value,
    detail,
    icon,
}: {
    label: string;
    value: string;
    detail: string;
    icon: React.ReactNode;
}) {
    return (
        <Card className="border-pink-100 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
                <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-950">
                        {value}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{detail}</p>
                </div>
                <div className="rounded-xl bg-pink-50 p-3 text-primary">
                    {icon}
                </div>
            </CardContent>
        </Card>
    );
}

function ColumnView({
    column,
    fulars,
    onDragStart,
    onDrop,
    onDelete,
    onSelect,
    onAdd,
}: {
    column: Column;
    fulars: Fular[];
    onDragStart: (id: string) => void;
    onDrop: (id: string) => void;
    onDelete: (id: string) => void;
    onSelect: (fular: Fular) => void;
    onAdd: () => void;
}) {
    return (
        <section
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => onDrop(column.id)}
            className="min-h-72 min-w-72 rounded-xl border border-pink-100 bg-pink-50/60 p-3 sm:min-w-80"
        >
            <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary" />
                    <h2 className="font-semibold text-slate-800">
                        {column.name}
                    </h2>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500">
                        {fulars.length}
                    </span>
                </div>
                <Button variant="ghost" size="icon-xs" onClick={onAdd}>
                    <Plus />
                </Button>
            </div>
            <div className="space-y-3">
                {fulars.map((fular) => (
                    <FularCard
                        key={fular.id}
                        fular={fular}
                        onDragStart={onDragStart}
                        onDelete={onDelete}
                        onSelect={onSelect}
                    />
                ))}
            </div>
            <button
                onClick={onAdd}
                className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-pink-200 py-2 text-xs text-slate-500 hover:bg-white hover:text-primary"
            >
                <Plus className="size-3" /> Fular ekle
            </button>
        </section>
    );
}

function FularCard({
    fular,
    onDragStart,
    onDelete,
    onSelect,
}: {
    fular: Fular;
    onDragStart: (id: string) => void;
    onDelete: (id: string) => void;
    onSelect: (fular: Fular) => void;
}) {
    return (
        <Card
            draggable
            onDragStart={() => onDragStart(fular.id)}
            onClick={() => onSelect(fular)}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelect(fular);
            }}
            role="button"
            tabIndex={0}
            className="cursor-grab border-pink-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing"
        >
            <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                    <GripVertical className="mt-0.5 size-4 shrink-0 text-slate-300" />
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold leading-tight text-slate-900">
                            {fular.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            {fular.creator}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={(event) => {
                            event.stopPropagation();
                            onDelete(fular.id);
                        }}
                        title="Sil"
                    >
                        <Trash2 className="text-slate-400" />
                    </Button>
                </div>
                {fular.description && (
                    <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
                        {fular.description}
                    </p>
                )}
                <div className="flex flex-wrap items-center gap-1.5">
                    {fular.category && (
                        <span className="rounded bg-pink-50 px-2 py-1 text-[11px] text-primary">
                            {fular.category}
                        </span>
                    )}
                    {fular.tags.slice(0, 2).map((tag: string) => (
                        <span
                            key={tag}
                            className="rounded bg-slate-100 px-2 py-1 text-[11px] text-slate-500"
                        >
                            #{tag}
                        </span>
                    ))}
                    {fular.rating && (
                        <span className="ml-auto flex items-center gap-0.5 text-xs text-amber-500">
                            <Star className="size-3 fill-current" />{" "}
                            {fular.rating}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function FularDetailModal({
    fular,
    onClose,
    onEdit,
}: {
    fular: Fular;
    onClose: () => void;
    onEdit: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4"
            onMouseDown={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="fular-detail-title"
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-pink-100 p-6">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Fular detayı
                        </p>
                        <h2
                            id="fular-detail-title"
                            className="mt-1 text-2xl font-semibold text-slate-950"
                        >
                            {fular.title}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={onEdit}>
                            Düzenle
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            aria-label="Kapat"
                        >
                            <X />
                        </Button>
                    </div>
                </div>
                <div className="grid gap-6 p-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    {fular.mediaUrl ? (
                        <a
                            href={fular.mediaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="group overflow-hidden rounded-xl border border-pink-100 bg-pink-50"
                        >
                            <Image
                                src={fular.mediaUrl}
                                alt={`${fular.title} görseli`}
                                className="h-full min-h-52 w-full object-cover transition group-hover:scale-105"
                            />
                            <span className="flex items-center justify-center gap-1 border-t border-pink-100 bg-white p-2 text-xs text-primary">
                                <ExternalLink className="size-3" /> Görseli yeni
                                sekmede aç
                            </span>
                        </a>
                    ) : (
                        <div className="flex min-h-52 items-center justify-center rounded-xl bg-pink-50 text-sm text-slate-400">
                            Görsel eklenmemiş
                        </div>
                    )}
                    <div className="space-y-4">
                        <DetailRow
                            label="Üretici / sanatçı"
                            value={fular.creator}
                        />
                        <DetailRow
                            label="İçerik türü"
                            value={fular.mediaType}
                        />
                        {fular.category && (
                            <DetailRow
                                label="Kategori"
                                value={fular.category}
                            />
                        )}
                        {fular.rating && (
                            <DetailRow
                                label="Puan"
                                value={`${fular.rating} / 5`}
                            />
                        )}
                        {fular.actionDate && (
                            <DetailRow
                                label="Tarih"
                                value={new Date(
                                    fular.actionDate,
                                ).toLocaleDateString("tr-TR")}
                            />
                        )}
                        {fular.tags.length > 0 && (
                            <DetailRow
                                label="Etiketler"
                                value={fular.tags
                                    .map((tag: string) => `#${tag}`)
                                    .join(" ")}
                            />
                        )}
                        {fular.description && (
                            <DetailRow label="Not" value={fular.description} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function FularEditModal({
    fular,
    isPending,
    onClose,
    onSubmit,
}: {
    fular: Fular;
    isPending: boolean;
    onClose: () => void;
    onSubmit: (form: HTMLFormElement) => void;
}) {
    return (
        <Modal title="Fuları düzenle" onClose={onClose}>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit(event.currentTarget);
                }}
                className="grid gap-4 sm:grid-cols-2"
            >
                <input type="hidden" name="fularId" value={fular.id} />
                <Field
                    name="title"
                    label="Başlık"
                    required
                    defaultValue={fular.title}
                />
                <Field
                    name="creator"
                    label="Üretici / sanatçı"
                    required
                    defaultValue={fular.creator}
                />
                <SelectField
                    name="mediaType"
                    label="İçerik türü"
                    options={[
                        "Kitap",
                        "Film",
                        "Dizi",
                        "Podcast",
                        "Müzik",
                        "Oyun",
                        "Diğer",
                    ]}
                    defaultValue={fular.mediaType}
                />
                <Field
                    name="category"
                    label="Tür / kategori"
                    defaultValue={fular.category}
                />
                <Field
                    name="rating"
                    label="Puan (1-5)"
                    defaultValue={fular.rating}
                />
                <Field
                    name="tags"
                    label="Etiketler"
                    defaultValue={fular.tags.join(", ")}
                />
                <Field
                    name="actionDate"
                    label="Tüketim / bitirme tarihi"
                    type="date"
                    defaultValue={
                        fular.actionDate ? fular.actionDate.slice(0, 10) : ""
                    }
                />
                <div className="sm:col-span-2">
                    <Field
                        name="mediaUrl"
                        label="Görsel / medya URL'si (opsiyonel)"
                        defaultValue={fular.mediaUrl}
                    />
                </div>
                <div className="sm:col-span-2">
                    <Field
                        name="description"
                        label="Kısa not"
                        defaultValue={fular.description}
                    />
                </div>
                <div className="flex justify-end gap-2 sm:col-span-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Vazgeç
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending
                            ? "Kaydediliyor..."
                            : "Değişiklikleri kaydet"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {label}
            </p>
            <p className="mt-1 text-sm text-slate-700">{value}</p>
        </div>
    );
}

function Field({
    name,
    label,
    placeholder,
    type = "text",
    required = false,
    defaultValue,
}: {
    name: string;
    label: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
    defaultValue?: string;
}) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={name}>
                {label}
                {required && <span className="text-primary"> *</span>}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                defaultValue={defaultValue}
                required={required}
            />
        </div>
    );
}

function SelectField({
    name,
    label,
    options,
    defaultValue,
}: {
    name: string;
    label: string;
    options: string[];
    defaultValue?: string;
}) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={name}>{label}</Label>
            <select
                id={name}
                name={name}
                defaultValue={defaultValue ?? options[0]}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus:border-primary"
            >
                {options.map((option) => (
                    <option key={option}>{option}</option>
                ))}
            </select>
        </div>
    );
}

function Modal({
    title,
    children,
    onClose,
}: {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4"
            onMouseDown={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-950">
                        {title}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <ChevronDown className="rotate-45" />
                    </Button>
                </div>
                {children}
            </div>
        </div>
    );
}

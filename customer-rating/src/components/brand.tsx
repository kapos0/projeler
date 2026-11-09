import Link from "next/link";

type BrandProps = {
    href?: string;
    compact?: boolean;
};

export function Brand({ href = "/", compact = false }: BrandProps) {
    const content = (
        <>
            <span className={`flex items-center justify-center rounded-xl bg-[#17211b] font-semibold text-white ${compact ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm"}`}>
                md
            </span>
            <span className={compact ? "text-base" : "text-lg"}>Müşteri Deneyim Merkezi</span>
        </>
    );

    return href ? (
        <Link href={href} className="flex items-center gap-2 font-semibold tracking-tight">
            {content}
        </Link>
    ) : (
        <div className="flex items-center gap-2 font-semibold tracking-tight">{content}</div>
    );
}

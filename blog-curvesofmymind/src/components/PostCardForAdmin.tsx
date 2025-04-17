"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PostType } from "@/models/PostModel";

type PostCardProps = PostType & {
    onDelete?: (id: string) => void;
    onUpdate?: () => void;
    onPostDeleted?: (id: string) => void;
};

export default function PostCardForAdmin({
    _id,
    title,
    content,
    category,
    image,
    onDelete = () => {},
    onUpdate = () => {},
    onPostDeleted = () => {},
    createdAt,
    updatedAt,
}: PostCardProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const truncatedContent =
        content.length > 64 ? `${content.substring(0, 64)}...` : content;
    return (
        <Card className="overflow-hidden transition-all hover:shadow-md w-full max-w-[400px] sm:w-[400px]">
            <div className="relative h-32 sm:h-48 w-full">
                <Image
                    src={image || "/placeholder.svg?height=192&width=384"}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>
            <CardHeader className="p-4 pb-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-semibold line-clamp-1">
                        {title}
                    </h3>
                    <Badge
                        variant="outline"
                        className="mt-2 sm:mt-0 sm:ml-2 shrink-0"
                    >
                        {category}
                    </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                    <p>
                        Gönderi Oluşturuldu:{" "}
                        <span>
                            {new Date(createdAt).toLocaleString("tr-TR")}
                        </span>
                    </p>
                    <p>
                        Gönderi Güncellendi:{" "}
                        <span>
                            {new Date(updatedAt).toLocaleString("tr-TR")}
                        </span>
                    </p>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <p className="text-sm text-muted-foreground">
                    {truncatedContent}
                </p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 p-4 pt-0">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdate()}
                    className="h-8 px-3"
                >
                    <Edit className="mr-2 h-3.5 w-3.5" />
                    Güncelle
                </Button>

                <AlertDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                >
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 px-3"
                        >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Sil
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Bu postu silmek istediğinize emin misiniz?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Bu işlem geri alınamaz. Post kalıcı olarak
                                silinecektir.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    onDelete(_id);
                                    onPostDeleted(_id);
                                    setIsDeleteDialogOpen(false);
                                }}
                            >
                                Sil
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
}

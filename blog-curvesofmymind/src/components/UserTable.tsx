import { CheckIcon, XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { UserType } from "@/models/UserModel";
export function UserTable({ users }: { users: UserType[] }) {
    return (
        <Card className="w-full overflow-hidden">
            <div className="overflow-x-auto">
                <Table className="min-w-[600px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-gray-500 font-medium">
                                DATE CREATED
                            </TableHead>
                            <TableHead className="text-gray-500 font-medium">
                                USER IMAGE
                            </TableHead>
                            <TableHead className="text-gray-500 font-medium">
                                USERNAME
                            </TableHead>
                            <TableHead className="text-gray-500 font-medium">
                                EMAIL
                            </TableHead>
                            <TableHead className="text-gray-500 font-medium">
                                ADMIN
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell className="text-sm text-gray-600">
                                    {user?.createdAt.toLocaleString("tr-TR")}
                                </TableCell>
                                <TableCell>
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage
                                            src={
                                                user.avatar ||
                                                "/placeholder.svg"
                                            }
                                            alt={user.username}
                                        />
                                        <AvatarFallback>
                                            {user.username
                                                .substring(0, 2)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">
                                    {user.username}
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">
                                    {user.email}
                                </TableCell>
                                <TableCell>
                                    {user.role === "admin" ? (
                                        <CheckIcon className="h-5 w-5 text-emerald-500" />
                                    ) : (
                                        <XIcon className="h-5 w-5 text-red-500" />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}

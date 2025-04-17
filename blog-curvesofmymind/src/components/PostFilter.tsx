"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

type SidebarData = {
    searchTerm: string;
    category: string;
};

type PostFilterProps = {
    sidebarData: SidebarData;
    onFilterChange: (data: SidebarData) => void;
};

export default function PostFilter({
    sidebarData,
    onFilterChange,
}: PostFilterProps) {
    const [formData, setFormData] = useState<SidebarData>(sidebarData);

    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, searchTerm: e.target.value });
    }

    function handleCategoryChange(value: string) {
        setFormData({ ...formData, category: value });
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onFilterChange(formData);
    }

    return (
        <div className="w-full md:w-72 lg:w-80 border-r border-border shrink-0">
            <div className="p-4 md:p-6">
                <h2 className="text-lg font-semibold mb-4">Filter Posts</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label
                            htmlFor="searchTerm"
                            className="text-sm font-medium"
                        >
                            Search Term
                        </label>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="searchTerm"
                                placeholder="Search posts..."
                                className="pl-8"
                                value={formData.searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="category"
                            className="text-sm font-medium"
                        >
                            Category
                        </label>
                        <Select
                            value={formData.category}
                            onValueChange={handleCategoryChange}
                        >
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="uncategorized">
                                    Uncategorized
                                </SelectItem>
                                <SelectItem value="news">News</SelectItem>
                                <SelectItem value="thoughts">
                                    Thoughts
                                </SelectItem>
                                <SelectItem value="fun">Fun</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" className="w-full">
                        Apply Filters
                    </Button>
                </form>
            </div>
        </div>
    );
}

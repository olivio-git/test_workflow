import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Button } from "../atoms/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../atoms/select";
import { cn } from "@/lib/utils";

interface PaginationProps {
    currentPage: number;
    totalData: number;
    onPageChange: (page: number) => void;
    showRows?: number;
    onShowRowsChange?: (rows: number) => void;
    className?: string
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalData,
    onPageChange,
    showRows = 10,
    onShowRowsChange,
    className
}) => {
    const totalPages = Math.ceil(totalData / showRows);
    const getVisiblePages = () => {
        const pages = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page: number | string) => {
        if (typeof page === 'number') {
            onPageChange(page);
        }
    };

    if (totalPages <= 1) return null

    return (
        <div className={cn(
            "flex flex-col sm:flex-row gap-3 sm:gap-1 items-center justify-between px-2 py-3 border-t border-gray-200",
            className
        )}>
            {/* Left side - Show rows selector */}
            <div className="flex items-center">
                <Select value={showRows.toString()} onValueChange={(value) => onShowRowsChange?.(Number(value))}>
                    <SelectTrigger className="space-x-2">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border border-gray-200 shadow-lg">
                        <SelectItem className="hover:bg-gray-50" value={"10"}>10 registros</SelectItem>
                        <SelectItem className="hover:bg-gray-50" value={"25"}>25 registros</SelectItem>
                        <SelectItem className="hover:bg-gray-50" value={"50"}>50 registros</SelectItem>
                        <SelectItem className="hover:bg-gray-50" value={"100"}>100 registros</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Page numbers */}
            <div className="flex items-center gap-1 text-xs sm:text-sm">
                {/* Previous button */}
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="cursor-pointer disabled:cursor-not-allowed size-8"
                >
                    <ChevronLeftIcon className="size-4" />
                </Button>

                {/* Page numbers */}
                {getVisiblePages().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="flex items-center justify-center size-6 sm:size-8 text-gray-500">
                                ...
                            </span>
                        ) : (
                            <Button
                                variant={page === currentPage ? "default" : 'outline'} size="sm"
                                onClick={() => handlePageClick(page)}
                                className="cursor-pointer min-w-8"
                            >
                                {page}
                            </Button>
                        )}
                    </React.Fragment>
                ))}

                {/* Next button */}
                <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="cursor-pointer disabled:cursor-not-allowed size-8"
                >
                    <ChevronRightIcon className="size-4" />
                </Button>
            </div>

            {/* Right side - empty for balance */}
        </div>
    );
};

export default Pagination;
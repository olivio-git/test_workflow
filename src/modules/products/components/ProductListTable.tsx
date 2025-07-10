import {
    flexRender,
    type Table,
} from "@tanstack/react-table"
import {
    Table as AtomTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/atoms/table"
import { Checkbox } from "@/components/atoms/checkbox"
import { Button } from "@/components/atoms/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/atoms/dropdown-menu"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { ProductGet } from "../types/ProductGet"
interface Props {
    table: Table<ProductGet>
}
const ProductListTable: React.FC<Props> = ({ table }) => {

    function SortableHeader({ columnId, children }: { columnId: string; children: React.ReactNode }) {
        const column = table.getColumn(columnId)
        const sorted = column?.getIsSorted()

        return (
            <div
                className="cursor-pointer hover:bg-gray-50 select-none flex items-center gap-2"
                onClick={column?.getToggleSortingHandler()}
            >
                {children}
                <div className="flex flex-col">
                    <ChevronUp
                        className={`h-3 w-3 ${sorted === "asc" ? "text-blue-600" : "text-gray-300"}`}
                    />
                    <ChevronDown
                        className={`h-3 w-3 -mt-1 ${sorted === "desc" ? "text-blue-600" : "text-gray-300"}`}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">Columnas</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                    {table.getAllLeafColumns().map(column => (
                        column.getCanHide() && (
                            <DropdownMenuItem key={column.id} className="flex items-center gap-2">
                                <Checkbox
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                />
                                {typeof column.columnDef.header === "string"
                                    ? column.columnDef.header
                                    : column.id}
                            </DropdownMenuItem>
                        )
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>


            <AtomTable className="w-full table-fixed">
                <colgroup>
                    {table.getFlatHeaders().map(header => (
                        <col key={header.id} style={{ width: header.getSize() }} />
                    ))}
                </colgroup>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className="relative group select-none"
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {header.column.getCanResize() && (
                                        <div
                                            onMouseDown={header.getResizeHandler()}
                                            onTouchStart={header.getResizeHandler()}
                                            className="absolute right-0 top-0 h-full w-0.5 cursor-col-resize bg-gray-200 group-hover:bg-blue-400"
                                        />
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id} className="p-1">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </AtomTable>
        </div>
    )
}

export default ProductListTable

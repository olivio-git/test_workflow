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
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
interface Props<T> {
    table: Table<T>
    renderBottomRow?: () => React.ReactNode;
    isLoading?: boolean;
}

const CustomizableTable = <T,>({ table, renderBottomRow, isLoading }: Props<T>) => {

    return (
        <AtomTable className="w-full table-fixed text-xs">
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableHead
                                key={header.id}
                                className="relative group select-none text-left border-b border-gray-200"
                                style={{ width: header.getSize() }}
                            >
                                {header.isPlaceholder ? null : (
                                    <div
                                        className={`flex items-center gap-2 justify-between ${header.column.getCanSort() ? "cursor-pointer select-none" : ""
                                            }`}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getCanSort() && (
                                            <div className="flex flex-col text-blue-400">
                                                {header.column.getIsSorted() === "asc" ? (
                                                    <ArrowUp className="w-3 h-3" />
                                                ) : header.column.getIsSorted() === "desc" ? (
                                                    <ArrowDown className="w-3 h-3" />
                                                ) : (
                                                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {header.column.getCanResize() && (
                                    <div
                                        onMouseDown={header.getResizeHandler()}
                                        onTouchStart={header.getResizeHandler()}
                                        className="absolute right-0 top-0 h-full w-px cursor-col-resize bg-gray-200 group-hover:bg-blue-400"
                                    />
                                )}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody className="divide-y divide-gray-200">
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={table.getVisibleFlatColumns().length} className="text-center py-10">
                            {/* <Spinner className="mx-auto mb-2" /> */}
                            <span className="text-gray-500">Cargando datos...</span>
                        </TableCell>
                    </TableRow>
                ) : (
                    <>
                        {
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="p-1 truncate">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        }
                        {/* Renderizar fila personalizada si se provee */}
                        {renderBottomRow && renderBottomRow()}
                    </>
                )}

            </TableBody>
        </AtomTable>
    )
}
export default CustomizableTable;
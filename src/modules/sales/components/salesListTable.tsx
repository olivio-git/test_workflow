import { useEffect, useMemo, useState } from "react";
import type { SaleGetAll, SalesGetAllResponse } from "../types/salesGetAllResponse";
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, type ColumnDef, type RowSelectionState } from "@tanstack/react-table";
import { Checkbox } from "@/components/atoms/checkbox";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/atoms/badge";
import { Edit, Eye, Loader2, MoreVertical, Settings } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import CustomizableTable from "@/components/common/CustomizableTable";
import ResizableBox from "@/components/atoms/resizable-box";
import type { useSalesFilters } from "../hooks/useSalesFilters";
import Pagination from "@/components/common/pagination";
import { TooltipWrapper } from "@/components/common/TooltipWrapper ";
import { Kbd } from "@/components/atoms/kbd";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/atoms/dropdown-menu";
import { Button } from "@/components/atoms/button";
import authSDK from "@/services/sdk-simple-auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { formatCurrency } from "@/utils/formaters";

interface SalesListTableProps {
    data: SalesGetAllResponse
    sales: SaleGetAll[]
    filters: ReturnType<typeof useSalesFilters>["filters"]
    setPage: ReturnType<typeof useSalesFilters>["setPage"]
    updateFilter: ReturnType<typeof useSalesFilters>["updateFilter"]
    isInfiniteScroll: boolean
    isLoading: boolean
    isFetching: boolean,
    isError: boolean,
}

const getColumnVisibilityKey = (userName: string) => `sales-columns-${userName}`;

const SalesListTable: React.FC<SalesListTableProps> = ({
    data,
    sales,
    filters,
    setPage,
    updateFilter,
    isInfiniteScroll,
    isError,
    isFetching,
    isLoading,
}) => {
    const [columnVisibility, setColumnVisibility] = useState({})
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const user = authSDK.getCurrentUser()

    useEffect(() => {
        if (!user?.name) return;
        const COLUMN_VISIBILITY_KEY = getColumnVisibilityKey(user.name);
        const savedVisibility = localStorage.getItem(COLUMN_VISIBILITY_KEY);
        if (savedVisibility) {
            try {
                const parsed = JSON.parse(savedVisibility);
                setColumnVisibility(parsed);
            } catch (error) {
                console.error('Error parsing column visibility:', error);
                localStorage.removeItem(COLUMN_VISIBILITY_KEY);
            }
        }
    }, [user?.name]);

    useEffect(() => {
        if (!user?.name || Object.keys(columnVisibility).length === 0) return;
        const COLUMN_VISIBILITY_KEY = getColumnVisibilityKey(user.name);
        try {
            localStorage.setItem(COLUMN_VISIBILITY_KEY, JSON.stringify(columnVisibility));
        } catch (error) {
            console.error('Error saving column visibility:', error);
        }
    }, [columnVisibility, user?.name]);

    const columns = useMemo<ColumnDef<SaleGetAll>[]>(() => [
        {
            id: "Select",
            header: ({ table }) => (
                <Checkbox
                    className="border border-gray-400"
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Seleccionar todo"
                />
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <Checkbox
                        className="border border-gray-400"
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Seleccionar fila"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: true,
            size: 40,
            minSize: 40,
        },
        {
            accessorKey: "nro_venta",
            header: "Nro. Venta",
            size: 120,
            minSize: 100,
            enableHiding: false,
            cell: ({ row, getValue }) => (
                <div
                    className="flex items-center gap-1.5">
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="size-6 px-0"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    onKeyDown={(e) => {
                                        if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
                                            e.stopPropagation();
                                        }
                                    }}
                                >
                                    <MoreVertical className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                onCloseAutoFocus={(e) => {
                                    e.preventDefault();
                                }}
                                align="start"
                                className="w-48">
                                <DropdownMenuItem
                                    onKeyDown={(e) => e.stopPropagation()}
                                // onClick={() => handleProductDetail(row.original.id)}
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onKeyDown={(e) => e.stopPropagation()}
                                    onClick={() => { }}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar venta
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <TooltipWrapper
                        tooltipContentProps={{
                            align: 'start'
                        }}
                        tooltip={
                            <p>Presiona <Kbd>enter</Kbd> para ver los detalles de la venta</p>
                        }
                    >
                        <div className="space-y-1 flex flex-col">
                            <span className="font-medium text-foreground">{getValue<string>()}</span>
                            <span className="text-xs text-muted-foreground">ID: {row.original.id}</span>
                        </div>
                    </TooltipWrapper>
                </div>
            ),
        },
        {
            accessorKey: "fecha",
            header: "Fecha",
            size: 140,
            minSize: 120,
            cell: ({ getValue }) => {
                const dateString = getValue<string>();

                try {
                    const date = new Date(dateString);
                    const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

                    return (
                        <div className="text-center text-xs">
                            <div className={`font-medium ${isToday ? 'text-blue-600' : 'text-foreground'}`}>
                                {format(date, "dd/MM/yyyy", { locale: es })}
                            </div>
                            <div className="text-muted-foreground">
                                {format(date, "HH:mm", { locale: es })}
                            </div>
                        </div>
                    );
                } catch {
                    return <span className="text-xs text-muted-foreground">{dateString}</span>;
                }
            },
        },
        {
            accessorKey: "cliente",
            header: "Cliente",
            size: 250,
            minSize: 200,
            cell: ({ row }) => {
                const cliente = row.original.cliente;
                return (
                    <div className="space-y-1 flex flex-col">
                        <span className={`${!cliente ? "italic text-muted-foreground" : "font-medium text-foreground"}`}>
                            {cliente?.cliente || "Sin cliente"}
                        </span>
                        {
                            cliente &&
                            <div className="text-xs text-muted-foreground space-y-0.5">
                                {cliente.nit && <div>NIT: {cliente.nit}</div>}
                                {cliente.contacto && <div>Tel: {cliente.contacto}</div>}
                            </div>
                        }
                    </div>
                );
            },
        },
        {
            accessorKey: "responsable",
            header: "Responsable",
            size: 180,
            minSize: 150,
            cell: ({ row }) => {
                const resp = row.original.responsable;
                const nombreCompleto = `${resp ? `${resp.nombre} ${resp.apellido_paterno}${resp.apellido_materno ? ` ${resp.apellido_materno}` : ''}` : 'Sin responsable'}`;
                return (
                    <div className="space-y-1 flex flex-col">
                        <span className={`${!resp ? "italic text-muted-foreground" : "font-medium text-foreground"}`}>{nombreCompleto}</span>
                        {
                            resp &&
                            <span className="text-xs text-muted-foreground">DNI: {resp.dni}</span>
                        }
                    </div>
                );
            },
        },
        {
            accessorKey: "contexto",
            header: "Contexto",
            size: 120,
            minSize: 100,
            cell: ({ getValue }) => {
                const contexto = getValue<string>();
                const [tipo, categoria] = contexto.split('|');
                return (
                    <div className="space-y-1 flex flex-col">
                        <Badge variant={'info'} className="text-xs w-max">
                            {tipo}
                        </Badge>
                        <div className="text-xs text-muted-foreground">{categoria}</div>
                    </div>
                );
            },
        },
        {
            accessorKey: "total",
            header: "Total",
            size: 120,
            minSize: 100,
            cell: ({ getValue }) => (
                <div className="text-right font-medium text-green-600">
                    {formatCurrency(getValue<number>())}
                </div>
            ),
        },
        {
            accessorKey: "comprobantes",
            header: "Comprobantes",
            size: 140,
            minSize: 120,
            cell: ({ getValue }) => {
                const comprobantes = getValue<string>();

                if (!comprobantes || comprobantes.trim() === "" || comprobantes === "|") {
                    return (
                        <div className="text-center">
                            <span className="text-muted-foreground italic text-xs">
                                Sin comprobantes
                            </span>
                        </div>
                    );
                }

                const [comprobante1, comprobante2] = comprobantes
                    .split("|")
                    .map(comp => comp.trim())
                    .filter(comp => comp !== "");

                return (
                    <div className="flex flex-col space-y-0.5 text-xs text-foreground items-center">
                        {comprobante1 && (
                            <Badge variant={'secondary'} className="flex justify-center w-full rounded py-0.5">{comprobante1}</Badge>
                        )}
                        {comprobante2 && (
                            <Badge variant={'secondary'} className="flex justify-center w-full rounded py-0.5">{comprobante2}</Badge>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "comentarios",
            header: "Comentarios",
            size: 200,
            minSize: 150,
            cell: ({ getValue }) => {
                const comentarios = getValue<string | null>();
                return (
                    <div className={`text-xs text-muted-foreground truncate ${!comentarios ? "italic" : ""}`}>
                        {comentarios || "Sin comentarios"}
                    </div>
                );
            },
        },
    ], []);

    const table = useReactTable<SaleGetAll>({
        data: sales,
        columns,
        state: {
            columnVisibility,
            rowSelection,
        },
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: "onChange",
        enableColumnResizing: true,
        enableRowSelection: true,
    });

    const hasSalesSelected = Object.keys(rowSelection).length;

    const onPageChange = (page: number) => {
        setPage(page);
    };

    const onShowRowsChange = (rows: number) => {
        updateFilter("pagina_registros", rows);
    };

    return (
        <section>
            {/* Results Info */}
            <div className="p-2 text-sm text-gray-600 border-b border-gray-200 flex items-center justify-between">
                {
                    sales.length > 0 ? (
                        isInfiniteScroll ? (
                            `Mostrando ${sales.length} de ${data?.meta?.total} ventas`
                        ) : (
                            (() => {
                                const pagina = filters.pagina ?? 1;
                                const porPagina = filters.pagina_registros ?? 1;

                                const inicio = (pagina - 1) * porPagina + 1;
                                const fin = pagina * porPagina;

                                return `Mostrando ${inicio} - ${fin} de ${data?.meta?.total} ventas`;
                            })()
                        )
                    ) : (
                        <span>Cargando...</span>
                    )
                }

                <div className="flex items-center gap-2">
                    <label className="block text-sm font-medium text-gray-700">Mostrar:</label>
                    <Select value={(filters.pagina_registros ?? 10).toString()} onValueChange={(value) => onShowRowsChange?.(Number(value))}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="shadow-lg">
                            <SelectItem value={"10"}>10</SelectItem>
                            <SelectItem value={"25"}>25</SelectItem>
                            <SelectItem value={"50"}>50</SelectItem>
                            <SelectItem value={"100"}>100</SelectItem>
                        </SelectContent>
                    </Select>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Settings className="w-4 h-4 mr-2" />
                                Columnas
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 max-h-96 overflow-y-auto border border-gray-200">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuItem
                                        key={column.id}
                                        className="flex items-center space-x-2 cursor-pointer"
                                        onSelect={(e) => e.preventDefault()}
                                        onClick={() => column.toggleVisibility(!column.getIsVisible())}
                                    >
                                        <Checkbox
                                            className="border border-gray-400"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        />
                                        <span className="flex-1">
                                            {typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}
                                        </span>
                                    </DropdownMenuItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {
                        table && hasSalesSelected > 0 && (
                            <Button size={'sm'} className="relative"
                            // onClick={handleAddSelectedToCart}
                            >
                                Proximamente...
                                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                                    {hasSalesSelected}
                                </Badge>
                            </Button>
                        )
                    }
                </div>
            </div>

            {isInfiniteScroll ? (
                <InfiniteScroll
                    dataLength={sales.length}
                    next={() => setPage((filters.pagina || 1) + 1)}
                    hasMore={sales.length < ((data?.meta?.total ?? 0))}
                    loader={
                        <div className="flex items-center justify-center gap-2 text-center p-6 text-xs sm:text-sm text-gray-500 bg-gray-50">
                            <Loader2 className="size-4 animate-spin" />
                            Cargando más ventas...
                        </div>
                    }
                    scrollableTarget="main-scroll-container"
                >
                    <CustomizableTable
                        table={table}
                        isError={isError}
                        errorMessage="Ocurrió un error al cargar las ventas"
                        isLoading={isLoading}
                        rows={filters.pagina_registros}
                        noDataMessage="No se encontraron ventas"
                        // selectedRowIndex={selectedIndex}
                        // onRowClick={handleRowClick}
                        // onRowDoubleClick={handleRowDoubleClick}
                        // tableRef={containerRef}
                        // focused={isFocused}
                        keyboardNavigationEnabled={true}
                    />
                </InfiniteScroll>
            ) : (
                <ResizableBox
                    direction="vertical"
                    minSize={10}
                >
                    <div
                        className="overflow-auto h-full">
                        <div
                            // onClick={handleTableClick}
                            className="overflow-x-hidden">
                            <CustomizableTable
                                table={table}
                                isError={isError}
                                isFetching={isFetching}
                                isLoading={isLoading}
                                errorMessage="Ocurrió un error al cargar las ventas"
                                noDataMessage="No se encontraron ventas"
                                rows={filters.pagina_registros}
                                // selectedRowIndex={selectedIndex}
                                // onRowClick={handleRowClick}
                                // onRowDoubleClick={handleRowDoubleClick}
                                // tableRef={containerRef}
                                // focused={isFocused}
                                keyboardNavigationEnabled={true}
                            />

                        </div>

                        {/* Pagination */}
                        {
                            (data?.data?.length ?? 0) > 0 && (
                                <Pagination
                                    currentPage={filters.pagina || 1}
                                    onPageChange={onPageChange}
                                    totalData={data?.meta?.total ?? 1}
                                    onShowRowsChange={onShowRowsChange}
                                    showRows={filters.pagina_registros}
                                />
                            )
                        }
                    </div>
                </ResizableBox>
            )}
        </section>
    );
}

export default SalesListTable;
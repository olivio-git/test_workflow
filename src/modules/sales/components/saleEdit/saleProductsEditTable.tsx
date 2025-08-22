import { Button } from '@/components/atoms/button';
import { Trash2 } from 'lucide-react';
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { formatCell } from '@/utils/formatCell';
import CustomizableTable from '@/components/common/CustomizableTable';
import type { SaleItemGetById } from '../../types/salesGetResponse';
import { EditableQuantity } from '@/modules/shoppingCart/components/editableQuantity';
import { EditablePrice } from '@/modules/shoppingCart/components/editablePrice';

type TableSaleProductsProps = {
    products: SaleItemGetById[]
};

export const TableSaleProducts = forwardRef<
    { focusFirstQuantityInput: () => void }, // tipo del ref
    TableSaleProductsProps                     // tipo de props
>(({
    products
}, ref) => {
    // refs para inputs de cantidad
    const firstQuantityInputRef = useRef<HTMLInputElement | null>(null);

    // Exponer método focusFirstQuantityInput
    useImperativeHandle(ref, () => ({
        focusFirstQuantityInput: () => {
            if (firstQuantityInputRef.current) {
                firstQuantityInputRef.current.focus();
            }
        }
    }));

    const columns = useMemo<ColumnDef<SaleItemGetById>[]>(() => [
        {
            accessorFn: row => row.producto.descripcion,
            id: "descripcion",
            header: "Descripcion",
            size: 300,
            minSize: 250,
            enableHiding: false,
            cell: ({ getValue }) => (
                <div
                    className="flex items-center">
                    <h3 className="font-medium text-gray-700 truncate">{getValue<string>()}</h3>
                </div>
            ),
        },
        {
            accessorFn: row => row.producto.codigo_oem,
            id: "codigo_oem",
            header: "Cód. OEM",
            cell: ({ getValue }) => (
                <div>{formatCell(getValue<string>())}</div>
            ),
        },
        {
            accessorFn: row => row.producto.marca?.marca,
            id: "marca",
            header: "Marca",
        },
        {
            accessorKey: "cantidad",
            id: 'cantidad',
            header: "Cantidad",
            minSize: 110,
            cell: ({ getValue, row }) => {
                const quantity = getValue<number>()
                const product = row.original.producto
                // Solo asignar el ref al primer row (rowIndex === 0)
                const refToAssign = row.index === 0 ? firstQuantityInputRef : null;
                return (
                    <EditableQuantity
                        value={quantity}
                        className="w-full"
                        buttonClassName="w-full"
                        onSubmit={(value) => {}}
                        // onSubmit={(value) => updateQuantity(product.id, value as number)}
                        validate={(val) => {
                            const num = parseInt(val);
                            return !isNaN(num) && num > 0;
                        }}
                        inputRef={refToAssign}
                    />
                )
            },
        },
        {
            accessorKey: "precio",
            id: 'precio',
            header: "Precio Unit.",
            minSize: 110,
            cell: ({ getValue, row }) => {
                const basePrice = getValue<number>()
                const product = row.original.producto
                return (
                    <EditablePrice
                        value={basePrice}
                        onSubmit={(value) => {}}
                        // onSubmit={(value) => updateCustomPrice(product.id, value as number)}
                        className="w-full"
                        buttonClassName="w-full"
                        numberProps={{ min: 0, step: 0.01 }}
                    />
                )
            },
        },
        // {
        //     accessorKey: "customSubtotal",
        //     id: 'customSubtotal',
        //     header: "Subtotal",
        //     minSize: 110,
        //     cell: ({ getValue, row }) => {
        //         const itemSubtotal = getValue<number>()
        //         const product = row.original.product
        //         return (
        //             <EditablePrice
        //                 value={itemSubtotal}
        //                 onSubmit={(value) => updateCustomSubtotal(product.id, value as number)}
        //                 className="w-full"
        //                 inputClassName="hover:bg-green-50 text-green-600 hover:text-green-600 border-green-200"
        //                 numberProps={{ min: 0, step: 0.01 }}
        //             />
        //         )
        //     },
        // },
        {
            id: "action",
            header: "Acciones",
            size: 60,
            minSize: 40,
            cell: ({ row }) => {
                const product = row.original.producto
                return (
                    <div className='flex items-center justify-center'>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            // onClick={() => removeItem(product.id)}
                            className="text-red-500 hover:text-red-500 size-7
                    "
                        >
                            <Trash2 className="size-3" />
                        </Button>
                    </div>
                )
            }
        }
    ], [])
    const table = useReactTable<SaleItemGetById>({
        data: products,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: "onChange",
        enableColumnResizing: true,
        enableRowSelection: true,
    })

    return (
        <CustomizableTable
            table={table}
            isLoading={false}
        />
    );
});
export default TableSaleProducts
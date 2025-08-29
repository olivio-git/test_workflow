import { Button } from '@/components/atoms/button';
import { Trash2 } from 'lucide-react';
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import CustomizableTable from '@/components/common/CustomizableTable';
import { EditableQuantity } from '@/modules/shoppingCart/components/editableQuantity';
import { EditablePrice } from '@/modules/shoppingCart/components/editablePrice';
import { Input } from '@/components/atoms/input';
import type { QuotationUpdateDetail } from '../types/quotationUpdate.types';

type QuotationDetailsEditingTableProps = {
    products: QuotationUpdateDetail[]
    removeItem: (id: number) => void
    updateQuantity: (productId: number, quantity: number) => void
    updatePrice: (productId: number, price: number) => void
    updateCustomSubtotal: (productId: number, customSubtotal: number) => void
    updateDescription: (productId: number, description: string) => void;
    updateBrand: (productId: number, brand: string) => void;
};

export const QuotationDetailsEditingTable = forwardRef<
    { focusFirstQuantityInput: () => void },
    QuotationDetailsEditingTableProps
>(({
    products,
    removeItem,
    updateQuantity,
    updatePrice,
    updateCustomSubtotal,
    updateBrand,
    updateDescription,
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

    const columns = useMemo<ColumnDef<QuotationUpdateDetail>[]>(() => [
        {
            accessorKey: "orden",
            header: "#",
            size: 40
        },
        {
            accessorKey: "descripcion",
            id: "descripcion",
            header: "Descripcion",
            size: 300,
            minSize: 250,
            enableHiding: false,
            cell: ({ row, getValue }) => {
                const refToAssign = row.index === 0 ? firstQuantityInputRef : null;
                const description = getValue<string>()
                const item = row.original
                return (
                    <div
                        className="flex items-center">
                        <Input
                            value={description}
                            onChange={(e) => updateDescription(item.id_producto, e.target.value)}
                            ref={refToAssign}
                            autoSelectOnFocus={true}
                        />
                    </div>
                )
            },
        },
        {
            accessorKey: "nueva_marca",
            id: "marca",
            header: "Marca",
            cell: ({ row, getValue }) => {
                const brand = getValue<string>()
                const item = row.original
                return (
                    <Input
                        value={brand}
                        onChange={(e) => updateBrand(item.id_producto, e.target.value)}
                        autoSelectOnFocus={true}
                    />
                )
            },
        },
        {
            accessorKey: "cantidad",
            header: "Cantidad",
            minSize: 110,
            cell: ({ getValue, row }) => {
                const quantity = getValue<number>()
                const item = row.original
                return (
                    <EditableQuantity
                        value={quantity}
                        className="w-full"
                        buttonClassName="w-full"
                        onSubmit={(value) => updateQuantity(item.id_producto, value as number)}
                        validate={(val) => {
                            const num = parseInt(val);
                            return !isNaN(num) && num > 0;
                        }}
                    />
                )
            },
        },
        {
            accessorKey: "precio",
            header: "Precio Unit.",
            minSize: 110,
            cell: ({ getValue, row }) => {
                const basePrice = getValue<number>()
                const item = row.original
                return (
                    <EditablePrice
                        value={basePrice}
                        onSubmit={(value) => updatePrice(item.id_producto, value as number)}
                        className="w-full"
                        buttonClassName="w-full"
                        numberProps={{ min: 0, step: 0.01 }}
                    />
                )
            },
        },
        {
            id: 'customSubtotal',
            header: "Subtotal",
            minSize: 110,
            cell: ({ row }) => {
                const item = row.original
                const subtotal = item.cantidad * item.precio
                return (
                    <EditablePrice
                        value={subtotal}
                        onSubmit={(value) => updateCustomSubtotal(item.id_producto, value as number)}
                        className="w-full"
                        inputClassName="hover:bg-green-50 text-green-600 hover:text-green-600 border-green-200"
                        numberProps={{ min: 0, step: 0.01 }}
                    />
                )
            },
        },
        {
            id: "action",
            header: "Acciones",
            size: 60,
            minSize: 40,
            cell: ({ row }) => {
                const item = row.original
                return (
                    <div className='flex items-center justify-center'>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(item.id_producto)}
                            className="text-red-500 hover:text-red-500 size-7
                    "
                        >
                            <Trash2 className="size-3" />
                        </Button>
                    </div>
                )
            }
        }
    ], [removeItem, updateQuantity, updatePrice, updateCustomSubtotal, updateBrand, updateDescription]);
    const table = useReactTable<QuotationUpdateDetail>({
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
export default QuotationDetailsEditingTable
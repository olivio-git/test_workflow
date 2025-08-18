import { Button } from '@/components/atoms/button';
import authSDK from '@/services/sdk-simple-auth';
import { useBranchStore } from '@/states/branchStore';
import { FileText, CreditCard } from 'lucide-react';
import { useCartWithUtils } from '../hooks/useCartWithUtils';
import { Separator } from '@/components/atoms/separator';
import { Label } from '@/components/atoms/label';
import { EditablePercentage } from './EditablePercentage';
import { EditablePrice } from './editablePrice';
import { useNavigate } from 'react-router';
import TableShoppingCart from './tableShoppingCart';
import ShortcutKey from '@/components/common/ShortcutKey';
import { useHotkeys } from 'react-hotkeys-hook';
import { useRef } from 'react';
import { formatCurrency } from '@/utils/formaters';

interface ShoppingCartProps {
    callback?: () => void;
    // focusItemId?: string;
}

const BottomShoppingCartBar: React.FC<ShoppingCartProps> = ({
    callback
    // focusItemId,
}) => {
    const tableRef = useRef<{ focusFirstQuantityInput: () => void }>(null);
    const user = authSDK.getCurrentUser()
    const { selectedBranchId } = useBranchStore()
    const navigate = useNavigate()
    const {
        items: cart,
        getCartSubtotal,
        getCartTotal,
        discountAmount,
        discountPercent,
        setDiscountAmount,
        setDiscountPercent,
        clearCart,
    } = useCartWithUtils(user?.name || '', selectedBranchId ?? '')

    const subtotal = getCartSubtotal();
    const total = getCartTotal();

    // shorcuts
    useHotkeys("alt+f", () => {
        if (tableRef.current) {
            callback?.()
            tableRef.current.focusFirstQuantityInput();
        }
    }, {
        enableOnFormTags: false,
        preventDefault: true,
    })

    return (
        <section
            className="bg-card border border-border rounded-lg shadow-sm overflow-hidden mt-2"

        >
            <header className="bg-primary text-primary-foreground px-4 py-3">
                <h3 className="font-semibold text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Carrito de Venta
                    </div>
                    <ShortcutKey combo='alt+f' variant="dark" />
                </h3>
            </header>

            <div className="px-2 pb-2">
                {cart.length === 0 ? (
                    <article className="p-8 text-center text-muted-foreground">
                        <div className="text-lg font-medium">Carrito vacío</div>
                        <div className="text-sm mt-1">Agrega productos para comenzar</div>
                    </article>
                ) : (
                    <div className="space-y-2">
                        <TableShoppingCart ref={tableRef} />

                        <Separator />

                        <div className="pt-2 space-y-2">

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-500">Desc. Porcentaje (%)</Label>
                                    <EditablePercentage
                                        key={discountPercent}
                                        value={discountPercent}
                                        onSubmit={(value) => setDiscountPercent(value as number)}
                                        className="w-full"
                                        buttonClassName="w-full"
                                        showEditIcon={false}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-500">Desc. Monto ($)</Label>
                                    <EditablePrice
                                        key={discountAmount}
                                        value={discountAmount}
                                        onSubmit={(value) => setDiscountAmount(value as number)}
                                        className="w-full"
                                        buttonClassName="w-full"
                                        showEditIcon={false}
                                    />
                                </div>
                            </div>


                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Subtotal:</span>
                                <span className="">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between font-medium text-lg">
                                <span>Total:</span>
                                <span>{formatCurrency(total)}</span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-2">
                                <Button
                                    className="w-full cursor-pointer" size={"sm"} onClick={() => {
                                        navigate('/dashboard/create-sale')
                                    }}>
                                    <CreditCard className="size-4" />
                                    Proceder a la Venta
                                </Button>
                                <Button
                                    size={'sm'}
                                    variant="outline" className="w-full cursor-pointer">
                                    <FileText className="size-4" />
                                    Guardar Cotización
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
export default BottomShoppingCartBar
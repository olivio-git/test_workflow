import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import { Label } from "@/components/atoms/label";
import { Loader2, Save } from "lucide-react";
import type { UseFormReset } from "react-hook-form";
import type { Sale } from "../types/sale";
import { EditablePrice } from "@/modules/shoppingCart/components/editablePrice";
import { EditablePercentage } from "@/modules/shoppingCart/components/EditablePercentage";
import TooltipButton from "@/components/common/TooltipButton";
import ShortcutKey from "@/components/common/ShortcutKey";
import { formatCurrency } from "@/utils/formaters";
interface SalesSummaryProps {
    isPending: boolean
    clearCart: () => void
    setDiscountPercent: (percent: number) => void
    setDiscountAmount: (amount: number) => void
    reset: UseFormReset<Sale>
    discountPercent: number
    discountAmount: number
    subtotal: number
    total: number
    hasProducts?: boolean
}
const SalesSummary: React.FC<SalesSummaryProps> = ({
    isPending,
    clearCart,
    setDiscountPercent,
    setDiscountAmount,
    reset,
    discountPercent,
    discountAmount,
    subtotal,
    total,
    hasProducts = true
}) => {
    return (
        <Card className="border-0 shadow-sm">
            <CardContent className="space-y-4">
                <div className="space-y-3 py-4 border-t border-b border-gray-200">
                    {/* Descuento */}
                    <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-700">Descuento</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label className="text-xs text-gray-600">Porcentaje (%)</Label>
                                <EditablePercentage
                                    value={discountPercent}
                                    onSubmit={(value) => setDiscountPercent(value as number)}
                                    className="w-full"
                                    buttonClassName="w-full"
                                    showEditIcon={false}
                                />
                            </div>

                            <div>
                                <Label className="text-xs text-gray-600">Monto (Bs)</Label>
                                <EditablePrice
                                    value={discountAmount}
                                    onSubmit={(value) => setDiscountAmount(value as number)}
                                    className="w-full"
                                    buttonClassName="w-full"
                                    showEditIcon={false}
                                />
                            </div>
                        </div>

                        <div className="flex gap-1">
                            {[5, 10, 15, 20].map((percentage) => (
                                <Button
                                    key={percentage}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-7 px-2 border-orange-300 text-orange-700 hover:bg-orange-100 hover:text-orange-600 transition-colors duration-300"
                                    onClick={() => setDiscountPercent(percentage)}
                                >
                                    {percentage}%
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <Label>Subtotal:</Label>
                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <Label>Descuento ({discountPercent?.toFixed(2)}%):</Label>
                        <span className="font-medium text-orange-600">-{formatCurrency(discountAmount)}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center bg-white rounded-lg p-2 border border-green-200">
                    <Label className="text-base font-bold text-gray-700">TOTAL:</Label>
                    <span className="text-xl font-bold text-green-600 tabular-nums">{formatCurrency(total)}</span>
                </div>

                <div className="flex gap-3">
                    {/* Botón de submit */}
                    <TooltipButton
                        buttonProps={{
                            type: 'submit',
                            disabled: isPending || !hasProducts,
                            variant: 'default',
                            className: "w-full"
                        }}
                        tooltip={
                            <p>Presiona <ShortcutKey combo="Alt + S" /> para realizar la venta</p>
                        }
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Procesando venta...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 size-4" />
                                Registrar Venta
                            </>
                        )}
                        {/* <Kbd variant="dark" className="ml-2 ">Alt + S</Kbd> */}
                    </TooltipButton>

                    <Button
                        type="button"
                        size={'sm'}
                        variant="outline"
                        className="w-full py-3 font-medium"
                        onClick={() => {
                            reset();
                            clearCart();
                        }}
                    >
                        Nueva Venta
                    </Button>

                    {/* <Button
                        size={'sm'}
                        type="button"
                        disabled
                        variant="ghost"
                        className="w-full py-3 font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        Eliminar
                    </Button> */}
                </div>
            </CardContent>
        </Card>
    );
}

export default SalesSummary;
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Label } from "@/components/atoms/label";
import { Save, ShoppingCart } from "lucide-react";
import type { UseFormReset, UseFormWatch } from "react-hook-form";
import type { Sale } from "../types/sale";
import { EditablePrice } from "@/modules/shoppingCart/components/editablePrice";
import { EditablePercentage } from "@/modules/shoppingCart/components/EditablePercentage";
import TooltipButton from "@/components/common/TooltipButton";
import { Kbd } from "@/components/atoms/kbd";
import ShortcutKey from "@/components/common/ShortcutKey";
interface SalesSummaryProps {
    isPending: boolean
    clearCart: () => void
    setDiscountPercent: (percent: number) => void
    setDiscountAmount: (amount: number) => void
    watch: UseFormWatch<Sale>
    reset: UseFormReset<Sale>
    discountPercent: number
    discountAmount: number
    subtotal: number
    total: number
    responsibleName?: string
}
const SalesSummary: React.FC<SalesSummaryProps> = ({
    isPending,
    clearCart,
    setDiscountPercent,
    setDiscountAmount,
    watch,
    reset,
    discountPercent,
    discountAmount,
    subtotal,
    total,
    responsibleName
}) => {
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Resumen de Venta
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cliente:</span>
                    <Badge variant={'secondary'}>{watch("cliente_nombre")}</Badge>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Responsable:</span>
                    <span className="text-sm font-medium">{responsibleName ?? ''}</span>
                </div>

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
                                    key={discountPercent}
                                    value={discountPercent}
                                    onSubmit={(value) => setDiscountPercent(value as number)}
                                    className="w-full"
                                    buttonClassName="w-full"
                                    variant="outline"
                                    showEditIcon={false}
                                />
                            </div>

                            <div>
                                <Label className="text-xs text-gray-600">Monto ($)</Label>
                                <EditablePrice
                                    key={discountAmount}
                                    value={discountAmount}
                                    onSubmit={(value) => setDiscountAmount(value as number)}
                                    className="w-full"
                                    buttonClassName="w-full"
                                    variant="outline"
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
                        <span className="text-sm text-gray-600">Subtotal:</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Descuento ({discountPercent?.toFixed(2)}%):</span>
                        <span className="font-medium text-orange-600">-${discountAmount?.toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center py-2">
                    <span className="text-lg font-semibold">TOTAL:</span>
                    <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                </div>

                <div className="space-y-3">
                    {/* Botón de submit */}
                    <TooltipButton
                        buttonProps={{
                            type: 'submit',
                            disabled: isPending,
                            variant: 'default',
                            className: "w-full"
                        }}
                        tooltip={
                            <p>Presiona <ShortcutKey combo="Alt + S"/> para realizar la venta</p>
                        }
                    >
                        <Save className="mr-2" />
                        {isPending ? "Registrando..." : "Registrar Venta"}
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

                    <Button
                        size={'sm'}
                        type="button"
                        disabled
                        variant="ghost"
                        className="w-full py-3 font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        Eliminar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default SalesSummary;
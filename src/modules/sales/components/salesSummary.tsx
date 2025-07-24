import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Save, ShoppingCart } from "lucide-react";
import type { UseFormReset, UseFormWatch } from "react-hook-form";
import type { Sale } from "../types/sale";
interface SalesSummaryProps {
    isPending: boolean
    clearCart: () => void
    handleGlobalPercentSubmit: (value: string) => void
    handleGlobalAmountSubmit: (value: string) => void
    setDiscountPercent: (percent: number) => void
    setDiscountAmount: (amount: number) => void
    watch: UseFormWatch<Sale>
    reset: UseFormReset<Sale>
    editingGlobalPercent: boolean
    editingGlobalAmount: boolean
    discountPercent: number
    discountAmount: number
    subtotal: number
    total: number
    setEditingGlobalPercent: React.Dispatch<React.SetStateAction<boolean>>;
    setEditingGlobalAmount: React.Dispatch<React.SetStateAction<boolean>>;
}
const SalesSummary: React.FC<SalesSummaryProps> = ({
    isPending,
    clearCart,
    handleGlobalPercentSubmit,
    handleGlobalAmountSubmit,
    setDiscountPercent,
    setDiscountAmount,
    watch,
    reset,
    editingGlobalPercent,
    editingGlobalAmount,
    discountPercent,
    discountAmount,
    subtotal,
    total,
    setEditingGlobalPercent,
    setEditingGlobalAmount
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
                    <Badge className="bg-gray-100 text-gray-800">{watch("cliente_nombre")}</Badge>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Responsable:</span>
                    <span className="text-sm font-medium">{watch("id_responsable")}</span>
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
                                {editingGlobalPercent ? (
                                    <Input
                                        value={discountPercent?.toString()}
                                        onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                                        onBlur={(e) => handleGlobalPercentSubmit(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleGlobalPercentSubmit(e.currentTarget.value)}
                                        className="h-8 text-sm"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        autoFocus
                                    />
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={() => setEditingGlobalPercent(true)}
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-full justify-start text-sm bg-transparent cursor-pointer"
                                    >
                                        {discountPercent ?? 0}%
                                    </Button>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-gray-600">Monto ($)</Label>
                                {editingGlobalAmount ? (
                                    <Input
                                        value={discountAmount?.toString()}
                                        onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                                        onBlur={(e) => handleGlobalAmountSubmit(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleGlobalAmountSubmit(e.currentTarget.value)}
                                        className="h-8 text-sm"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        autoFocus
                                    />
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={() => setEditingGlobalAmount(true)}
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-full justify-start text-sm bg-transparent cursor-pointer"
                                    >
                                        ${discountAmount?.toFixed(2) ?? 0.00}
                                    </Button>
                                )}
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
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-black hover:bg-gray-800 text-white py-3 font-medium"
                    >
                        <Save className="mr-2" />
                        {isPending ? "Registrando..." : "Registrar Venta"}
                    </Button>

                    <Button
                        type="button"
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
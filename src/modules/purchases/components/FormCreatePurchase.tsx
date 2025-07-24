import React from "react";
import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";
import { ComboboxSelect } from "@/modules/products/components/SelectCombobox"; 
import { type FormData } from "../hooks/usePurchaseForm";
// import { useBranchStore } from "@/states/branchStore";

const proveedores = [
  { id: 71, proveedor: "JUANMOTORS" },
  { id: 72, proveedor: "AUTOPARTS SRL" }
];

// const tipoCompra = [
//   {
//     id:1,
//     tipo:"Credito"
//   },
//   {
//     id:2,
//     tipo:"Contado"
//   },
//   {
//     id:3,
//     tipo:"Cuenta corriente"
//   }
// ]

// const forma = [
//   {
//     id:1,
//     forma:"Mayor"
//   },
//   {
//     id:2,
//     forma:"Menor"
//   }
// ]
interface Props {
  formData: FormData;
  errors: Record<string,string>;
  isLoading: boolean;
  onChange: (field: keyof FormData, value: any) => void;
  onBlur: (field: keyof FormData) => void;
  onSubmit: () => void;
}

const FormCreatePurchase: React.FC<Props> = ({
  formData, errors, onChange, onBlur
}) => {
  const inputClass = (f: string) =>
    errors[f] ? "h-8 text-sm border-red-500 focus:border-red-500" : "h-8 text-sm";

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col">
          <Label>Proveedor *</Label>
          <ComboboxSelect
            value={formData.id_proveedor || undefined}
            onChange={v => onChange("id_proveedor", v)}
            options={proveedores}
            optionTag="proveedor"
            placeholder="Seleccionar proveedor"
            className={inputClass("id_proveedor")}
          />
          {errors.id_proveedor && <p className="text-red-500">{errors.id_proveedor}</p>}
        </div>
        <div className="flex flex-col">
          <Label>Fecha *</Label>
          <Input
            type="date"
            value={formData.fecha}
            onChange={e => onChange("fecha", e.target.value)}
            onBlur={() => onBlur("fecha")}
            className={inputClass("fecha")}
          />
          {errors.fecha && <p className="text-red-500">{errors.fecha}</p>}
        </div>
        {/* Repite para nro_comprobante, nro_comprobante2, tipo_compra, forma_compra, comentario */}
        <div className="flex flex-col space-y-2">
          <Label className="text-sm font-medium text-gray-700">Nro comprobante *</Label>
          <Input
            type="text"
            value={formData.nro_comprobante}
            onChange={(e) => onChange("nro_comprobante", e.target.value)}
            onBlur={() => onBlur("nro_comprobante")}
            placeholder="FA-01"
            className={inputClass("nro_comprobante")}
          />
          {errors.nro_comprobante && <p className="text-sm text-red-500 mt-1">{errors.nro_comprobante}</p>}
        </div>  
        {/* Nro comprobante 2 */}
        <div className="flex flex-col space-y-2">
          <Label className="text-sm font-medium text-gray-700">Nro comprobante 2 *</Label>
          <Input
            type="text" 
            value={formData.nro_comprobante2}
            onChange={(e) => onChange("nro_comprobante2", e.target.value)}
            onBlur={() => onBlur("nro_comprobante2")}
            className={inputClass("nro_comprobante2")}
          />
          {errors.nro_comprobante2 && <p className="text-sm text-red-500 mt-1">{errors.nro_comprobante2}</p>}
        </div>  

        {/* Método de pago */}
        <div className="flex flex-col space-y-2">
          <Label className="text-sm font-medium text-gray-700">Tipo de compra *</Label>
          <Input
            type="text" 
            value={formData.tipo_compra}
            onChange={(e) => onChange("tipo_compra", e.target.value)}
            onBlur={() => onBlur("tipo_compra")}
            className={inputClass("tipo_compra")}
          />
          {/* <ComboboxSelect
            value={formData.tipo_compra}
            onChange={(v) => onChange("tipo_compra", v)}
            options={tipoCompra || []}
            optionTag="tipo"
            placeholder="Seleccionar el tipo de compra"
            className={inputClass("tipo_compra")}
          /> */}
          {errors.tipo_compra && <p className="text-sm text-red-500 mt-1">{errors.tipo_compra}</p>}
        </div>
        
        {/* Estado */}
        <div className="flex flex-col space-y-2">
          <Label className="text-sm font-medium text-gray-700">Forma *</Label>
           <Input
            type="text" 
            value={formData.forma_compra}
            onChange={(e) => onChange("forma_compra", e.target.value)}
            onBlur={() => onBlur("forma_compra")}
            className={inputClass("forma_compra")}
          />
          {/* <ComboboxSelect
            value={formData.forma_compra}
            onChange={(v) => onChange("forma_compra", v)}
            options={forma || []}
            optionTag="forma"
            placeholder="Seleccionar estado"
            className={inputClass("forma_compra")}
          /> */}
          {errors.forma_compra && <p className="text-sm text-red-500 mt-1">{errors.forma_compra}</p>}
        </div> 
      </div> 
    </div>
  );
};

export default FormCreatePurchase;

 
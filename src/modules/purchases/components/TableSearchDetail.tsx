import React, { useState } from "react";
import { Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input"; 
import DialogSearchDetails from "./DialogSearchDetails";

// Tipo de dato que responde el api
interface ProductResponse {
  id: number;
  descripcion: string;
  codigo_oem: string;
  codigo_upc: string;
  modelo: string;
  medida: string | null;
  nro_motor: string;
  categoria: string;
  subcategoria: string;
  marca: string;
  procedencia: string;
  unidad_medida: string;
  stock_actual: string;
  stock_resto: string;
  pedido_transito: string;
  pedido_almacen: string;
  precio_venta: string;
  precio_venta_alt: string;
  sucursal: string;
}

// El tipo de producto que ira en el detalle
interface PurchaseDetail {
  id_producto: string;
  cantidad: number;
  costo: number;
  inc_p_venta: number;
  precio_venta: number;
  inc_p_venta_alt: number;
  precio_venta_alt: number;
  producto: ProductResponse; // Referencia al producto original
  subtotal: number; // Calculado
}
interface props{
  formData:any;
  setFormData:(value:any) => void;
}
const PurchaseDetailsTable = ({formData,setFormData}:props) => { 
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCell, setEditingCell] = useState<{
    id: string;
    field: string;
  } | null>(null);
  const [tempValue, setTempValue] = useState("");
  
  // Calcular precios de venta basado en porcentajes
  // const calculatePrices = (
  //   costo: number,
  //   porcGeneral: number,
  //   porcMenor: number
  // ) => {
  //   const precioGeneral = costo * (1 + porcGeneral / 100);
  //   const precioMenor = costo * (1 + porcMenor / 100);
  //   return { precioGeneral, precioMenor };
  // };

  // // Calcular porcentajes basado en precios
  // const calculatePercentages = (
  //   costo: number,
  //   precioGeneral: number,
  //   precioMenor: number
  // ) => {
  //   const porcGeneral = costo > 0 ? ((precioGeneral - costo) / costo) * 100 : 0;
  //   const porcMenor = costo > 0 ? ((precioMenor - costo) / costo) * 100 : 0;
  //   return { porcGeneral, porcMenor };
  // };

  

  const removeProduct = (id: string) => {
    setFormData(formData.detalles.filter((d:any) => d.id_producto !== id));
  };

  const startEdit = (
    id: string,
    field: string,
    currentValue: string | number
  ) => {
    setEditingCell({ id, field });
    setTempValue(currentValue.toString());
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setTempValue("");
  };

  const confirmEdit = () => {
    if (!editingCell) return;

    const { id, field } = editingCell;
    const numValue = parseFloat(tempValue);

    if (isNaN(numValue) || numValue < 0) { 
      ///ERRR
      return;
    }

    setFormData(
      formData.detalles.map((detail:any) => {
        if (detail.id_producto !== id) return detail;

        let updatedDetail = { ...detail };

        switch (field) {
          case "cantidad":
            updatedDetail.cantidad = numValue;
            updatedDetail.subtotal = updatedDetail.costo * numValue;
            break;

          case "costo":
            updatedDetail.costo = numValue;
            updatedDetail.precio_venta =
              numValue * (1 + updatedDetail.inc_p_venta / 100);
            updatedDetail.precio_venta_alt =
              numValue * (1 + updatedDetail.inc_p_venta_alt / 100);
            updatedDetail.subtotal = numValue * updatedDetail.cantidad;
            break;

          case "inc_p_venta":
            updatedDetail.inc_p_venta = numValue;
            updatedDetail.precio_venta =
              updatedDetail.costo * (1 + numValue / 100);
            break;

          case "precio_venta":
            updatedDetail.precio_venta = numValue;
            updatedDetail.inc_p_venta =
              updatedDetail.costo > 0
                ? ((numValue - updatedDetail.costo) / updatedDetail.costo) * 100
                : 0;
            break;

          case "inc_p_venta_alt":
            updatedDetail.inc_p_venta_alt = numValue;
            updatedDetail.precio_venta_alt =
              updatedDetail.costo * (1 + numValue / 100);
            break;

          case "precio_venta_alt":
            updatedDetail.precio_venta_alt = numValue;
            updatedDetail.inc_p_venta_alt =
              updatedDetail.costo > 0
                ? ((numValue - updatedDetail.costo) / updatedDetail.costo) * 100
                : 0;
            break;
        }

        return updatedDetail;
      })
    );

    setEditingCell(null);
    setTempValue("");
  };
  console.log(formData)

  // Calcular totales
  const totalCosto = formData.detalles.reduce((sum:any, detail:any) => sum + detail.subtotal, 0);
  const totalGeneral = formData.detalles.reduce(
    (sum:any, detail:any) => sum + detail.precio_venta * detail.cantidad,
    0
  );
  const totalMenor = formData.detalles.reduce(
    (sum:any, detail:any) => sum + detail.precio_venta_alt * detail.cantidad,
    0
  );

  // Componente para celda editable
  const EditableCell: React.FC<{
    id: string;
    field: string;
    value: number;
    format?: "currency" | "percentage" | "number";
  }> = ({ id, field, value, format = "number" }) => {
    const isEditing = editingCell?.id === id && editingCell?.field === field;

    const formatValue = (val: number) => {
      switch (format) {
        case "currency":
          return `$${val.toFixed(2)}`;
        case "percentage":
          return `${val.toFixed(1)}%`;
        default:
          return val.toString();
      }
    };

    if (isEditing) {
      return (
        <div className="flex items-center gap-1">
          <Input
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="h-6 text-xs w-20 border-gray-200 focus:border-gray-300"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") confirmEdit();
              if (e.key === "Escape") cancelEdit();
            }}
          />
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={confirmEdit}
          >
            <Check className="h-3 w-3 text-green-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={cancelEdit}
          >
            <X className="h-3 w-3 text-red-600" />
          </Button>
        </div>
      );
    }

    return (
      <div
        className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 p-1 rounded border border-transparent hover:border-gray-200"
        onClick={() => startEdit(id, field, value)}
      >
        <span className="text-xs">{formatValue(value)}</span>
        <Edit2 className="h-3 w-3 text-gray-400" />
      </div>
    );
  };

  
  return (
    <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <DialogSearchDetails
        searchTerm={searchTerm}  
        setSearchTerm={setSearchTerm} 
        details={formData}
        setDetails={setFormData}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      ></DialogSearchDetails>

      {formData.detalles.length > 0 ? (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left border-b border-gray-200">
                  Producto
                </th>
                <th className="px-2 py-2 text-center border-b border-gray-200">
                  Cantidad
                </th>
                <th className="px-2 py-2 text-center border-b border-gray-200">
                  Costo
                </th>
                <th className="px-2 py-2 text-center border-b border-gray-200">
                  % Venta
                </th>
                <th className="px-2 py-2 text-center border-b border-gray-200">
                  Precio Venta
                </th>
                <th className="px-2 py-2 text-center border-b border-gray-200">
                  % Venta Alt
                </th>
                <th className="px-2 py-2 text-center border-b border-gray-200">
                  Precio Venta Alt
                </th>
                <th className="px-2 py-2 text-center border-b border-gray-200">
                  Subtotal
                </th>
                <th className="px-2 py-2 text-center border-b border-gray-200">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {formData.detalles.map((detail:any) => (
                <tr key={detail.id_producto} className="hover:bg-gray-50">
                  <td className="px-2 py-2 border-b border-gray-200">
                    <div>
                      <div className="font-medium">
                        {detail.producto.descripcion}
                      </div>
                      <div className="text-gray-500">
                        OEM: {detail.producto.codigo_oem}
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 text-center">
                    <EditableCell
                      id={detail.id_producto}
                      field="cantidad"
                      value={detail.cantidad}
                      format="number"
                    />
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 text-center">
                    <EditableCell
                      id={detail.id_producto}
                      field="costo"
                      value={detail.costo}
                      format="currency"
                    />
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 text-center">
                    <EditableCell
                      id={detail.id_producto}
                      field="inc_p_venta"
                      value={detail.inc_p_venta}
                      format="percentage"
                    />
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 text-center">
                    <EditableCell
                      id={detail.id_producto}
                      field="precio_venta"
                      value={detail.precio_venta}
                      format="currency"
                    />
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 text-center">
                    <EditableCell
                      id={detail.id_producto}
                      field="inc_p_venta_alt"
                      value={detail.inc_p_venta_alt}
                      format="percentage"
                    />
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 text-center">
                    <EditableCell
                      id={detail.id_producto}
                      field="precio_venta_alt"
                      value={detail.precio_venta_alt}
                      format="currency"
                    />
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 text-center">
                    <span className="font-semibold text-green-600">
                      ${detail.subtotal.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 text-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeProduct(detail.id_producto)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td
                  colSpan={2}
                  className="px-2 py-2 border-t border-gray-200 font-semibold text-right"
                >
                  TOTALES:
                </td>
                <td className="px-2 py-2 border-t border-gray-200 text-center font-semibold">
                  ${totalCosto.toFixed(2)}
                </td>
                <td className="px-2 py-2 border-t border-gray-200"></td>
                <td className="px-2 py-2 border-t border-gray-200 text-center font-semibold text-green-600">
                  ${totalGeneral.toFixed(2)}
                </td>
                <td className="px-2 py-2 border-t border-gray-200"></td>
                <td className="px-2 py-2 border-t border-gray-200 text-center font-semibold text-blue-600">
                  ${totalMenor.toFixed(2)}
                </td>
                <td className="px-2 py-2 border-t border-gray-200 text-center font-semibold">
                  ${totalCosto.toFixed(2)}
                </td>
                <td className="px-2 py-2 border-t border-gray-200"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
          <p>No hay productos agregados al detalle.</p>
          <p className="text-sm mt-1">
            Haz clic en "Agregar Producto" para comenzar.
          </p>
        </div>
      )}
    </div>
  );
};

export default PurchaseDetailsTable;

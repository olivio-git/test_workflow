import React, { useState } from "react";
import { Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import DialogSearchDetails from "./DialogSearchDetails";

interface PurchaseDetail {
  id_producto: string;
  cantidad: number;
  costo: number;
  inc_p_venta: number;
  precio_venta: number;
  inc_p_venta_alt: number;
  precio_venta_alt: number;
  producto: { descripcion: string; codigo_oem: string };
  subtotal: number;
}

interface Props {
  detalles: PurchaseDetail[];
  setDetalles: (d: PurchaseDetail[]) => void;
}

const PurchaseDetailsTable: React.FC<Props> = ({ detalles, setDetalles }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState<{id:string; field:string} | null>(null);
  const [temp, setTemp] = useState("");

  const startEdit = (id: string, field: string, val: number) => {
    setEditing({ id, field });
    setTemp(String(val));
  };
  const cancel = () => setEditing(null);
  const confirm = () => {
    if (!editing) return;
    const num = parseFloat(temp);
    if (isNaN(num) || num < 0) return;
    setDetalles(detalles.map(d => {
      if (d.id_producto !== editing.id) return d;
      const u = { ...d, [editing.field]: num };
      u.subtotal = u.costo * u.cantidad;
      if (editing.field === "costo") {
        u.precio_venta = num * (1 + u.inc_p_venta/100);
        u.precio_venta_alt = num * (1 + u.inc_p_venta_alt/100);
      }
      if (editing.field === "inc_p_venta") {
        u.precio_venta = u.costo * (1 + num/100);
      }
      if (editing.field === "inc_p_venta_alt") {
        u.precio_venta_alt = u.costo * (1 + num/100);
      }
      if (editing.field === "precio_venta") {
        u.inc_p_venta = u.costo>0 ? ((num-u.costo)/u.costo)*100 : 0;
      }
      if (editing.field === "precio_venta_alt") {
        u.inc_p_venta_alt = u.costo>0 ? ((num-u.costo)/u.costo)*100 : 0;
      }
      return u;
    }));
    setEditing(null);
  };

  const remove = (id: string) => {
    setDetalles(detalles.filter(d => d.id_producto !== id));
  };

  const EditableCell: React.FC<{
    id: string; field: string; value: number; format?: "currency"|"percentage"|"number";
  }> = ({ id, field, value, format="number" }) => {
    const isEd = editing?.id===id && editing.field===field;
    const fmt = (v: number) => {
      if (format==="currency") return `$${v.toFixed(2)}`;
      if (format==="percentage") return `${v.toFixed(1)}%`;
      return v.toString();
    };
    if (isEd) {
      return (
        <div className="flex gap-1">
          <Input
            value={temp}
            onChange={e=>setTemp(e.target.value)}
            className="h-6 text-xs w-20"
            autoFocus
            onKeyDown={e=>{ if(e.key==="Enter")confirm(); if(e.key==="Escape")cancel(); }}
          />
          <Button size="sm" variant="ghost" className="p-0" onClick={confirm}><Check/></Button>
          <Button size="sm" variant="ghost" className="p-0" onClick={cancel}><X/></Button>
        </div>
      );
    }
    return (
      <div
        className="cursor-pointer p-1 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 flex items-center gap-1"
        onClick={()=>startEdit(id, field, value)}
      >
        <span className="text-xs">{fmt(value)}</span>
        <Edit2 className="w-3 h-3 text-gray-400" />
      </div>
    );
  };

  const totalCosto = detalles.reduce((s,d)=>s + d.subtotal, 0);
  const totalGeneral = detalles.reduce((s,d)=>s + d.precio_venta*d.cantidad, 0);
  const totalMenor = detalles.reduce((s,d)=>s + d.precio_venta_alt*d.cantidad, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
      <DialogSearchDetails
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        details={detalles}
        setDetails={setDetalles}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />
      {detalles.length>0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Costo</th>
                <th>% Venta</th>
                <th>Precio Venta</th>
                <th>% Venta Alt</th>
                <th>Precio Venta Alt</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map(d=>(
                <tr key={d.id_producto} className="hover:bg-gray-50">
                  <td className="px-2">
                    <div className="font-medium">{d.producto.descripcion}</div>
                    <div className="text-gray-500">OEM: {d.producto.codigo_oem}</div>
                  </td>
                  <td className="text-center">
                    <EditableCell id={d.id_producto} field="cantidad" value={d.cantidad} format="number"/>
                  </td>
                  <td className="text-center">
                    <EditableCell id={d.id_producto} field="costo" value={d.costo} format="currency"/>
                  </td>
                  <td className="text-center">
                    <EditableCell id={d.id_producto} field="inc_p_venta" value={d.inc_p_venta} format="percentage"/>
                  </td>
                  <td className="text-center">
                    <EditableCell id={d.id_producto} field="precio_venta" value={d.precio_venta} format="currency"/>
                  </td>
                  <td className="text-center">
                    <EditableCell id={d.id_producto} field="inc_p_venta_alt" value={d.inc_p_venta_alt} format="percentage"/>
                  </td>
                  <td className="text-center">
                    <EditableCell id={d.id_producto} field="precio_venta_alt" value={d.precio_venta_alt} format="currency"/>
                  </td>
                  <td className="text-center font-semibold">${d.subtotal.toFixed(2)}</td>
                  <td className="text-center">
                    <Button size="sm" variant="ghost" onClick={()=>remove(d.id_producto)} className="p-0 text-red-600 hover:bg-red-50">
                      <Trash2 className="w-3 h-3"/>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={2} className="text-right font-semibold">TOTALES:</td>
                <td className="text-center font-semibold">${totalCosto.toFixed(2)}</td>
                <td />
                <td className="text-center font-semibold text-green-600">${totalGeneral.toFixed(2)}</td>
                <td />
                <td className="text-center font-semibold text-blue-600">${totalMenor.toFixed(2)}</td>
                <td className="text-center font-semibold">${totalCosto.toFixed(2)}</td>
                <td/>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500 border border-gray-200 bg-gray-50 rounded-lg">
          <p>No hay productos en el detalle.</p>
          <p className="text-sm mt-1">Haz clic en "Agregar Producto" para empezar.</p>
        </div>
      )}
    </div>
  );
};

export default PurchaseDetailsTable;

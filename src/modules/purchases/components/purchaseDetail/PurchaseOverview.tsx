import { Badge } from '@/components/atoms/badge';
import { TabsContent } from '@/components/atoms/tabs';
import { formatCell } from '@/utils/formatCell';
import type { PurchaseDetail } from '../../types/PurchaseDetail';

interface PurchaseOverviewProps {
  purchase: PurchaseDetail | undefined;
  isLoading: boolean;
  isError: boolean;
}

const PurchaseOverview: React.FC<PurchaseOverviewProps> = ({
  purchase,
  isLoading,
  isError,
}) => {
  if (isLoading) {
    return (
      <TabsContent value="overview" className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </TabsContent>
    );
  }

  if (isError || !purchase) {
    return (
      <TabsContent value="overview" className="space-y-4">
        <div className="text-center text-gray-500 py-8">
          Error al cargar los datos de la compra
        </div>
      </TabsContent>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return formatCell(dateString);
    }
  };

  const getContextColor = (tipo: string) => {
    if (tipo === 'C') return 'warning'; // Credito
    if (tipo === 'P') return 'success'; // Pagado
    return 'secondary';
  };

  const getFormaCompraLabel = (forma: string) => {
    // if (forma === "MN") return "Moneda Nacional"
    // if (forma === "ME") return "Moneda Extranjera"
    if (forma === 'MN') return 'MN';
    if (forma === 'ME') return 'ME';
    return forma;
  };

  const getTipoCompraLabel = (tipo: string) => {
    if (tipo === 'C') return 'Crédito';
    if (tipo === 'P') return 'Contado';
    return tipo;
  };

  // Calcular el total de la compra
  const totalCompra = purchase.detalles.reduce((total, detalle) => {
    return total + parseFloat(detalle.costo) * parseFloat(detalle.cantidad);
  }, 0);

  return (
    <TabsContent value="overview" className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Información General
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Número de Compra */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">
              Número de Compra
            </h3>
            <p className="text-lg font-mono font-semibold text-gray-900">
              {purchase.nro}
            </p>
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Fecha</h3>
            <p className="text-md font-semibold text-gray-900">
              {formatDate(purchase.fecha)}
            </p>
          </div>

          {/* Total */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Total</h3>
            <Badge variant="secondary" className="rounded">
              <p className="text-lg font-bold text-green-400">
                ${totalCompra.toFixed(2)}
              </p>
            </Badge>
          </div>

          {/* Tipo de Compra */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">
              Tipo de Compra
            </h3>
            <Badge
              variant={getContextColor(purchase.tipo_compra)}
              className="rounded"
            >
              {getTipoCompraLabel(purchase.tipo_compra)}
            </Badge>
          </div>

          {/* Forma de Compra */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">
              Forma de Compra
            </h3>
            <Badge variant="secondary" className="rounded">
              {getFormaCompraLabel(purchase.forma_compra)}
            </Badge>
          </div>

          {/* Cantidad de Productos */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Productos</h3>
            <p className="text-md font-semibold">
              {purchase.cantidad_detalles}{' '}
              {purchase.cantidad_detalles === 1 ? 'producto' : 'productos'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información del Proveedor */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Proveedor
          </h2>
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Nombre</h3>
              <p className="text-sm font-semibold text-blue-600">
                {purchase.proveedor.proveedor}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">ID</h3>
              <p className="text-sm font-mono text-gray-900">
                #{purchase.proveedor.id}
              </p>
            </div>
            {purchase.proveedor.nit && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">NIT</h3>
                <p className="text-sm font-mono text-gray-900">
                  {purchase.proveedor.nit}
                </p>
              </div>
            )}
            {purchase.proveedor.direccion && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Dirección</h3>
                <p className="text-sm text-gray-900">
                  {purchase.proveedor.direccion}
                </p>
              </div>
            )}
            {purchase.proveedor.contacto && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Contacto</h3>
                <p className="text-sm text-gray-900">
                  {purchase.proveedor.contacto}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Información del Responsable */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Responsable
          </h2>
          {purchase.responsable ? (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Nombre</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {purchase.responsable.nombre}{' '}
                  {purchase.responsable.apellido_paterno}
                  {purchase.responsable.apellido_materno &&
                    ` ${purchase.responsable.apellido_materno}`}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">DNI</h3>
                <p className="text-sm font-mono text-gray-900">
                  {purchase.responsable.dni}
                </p>
              </div>
              {purchase.responsable.celular && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Celular</h3>
                  <p className="text-sm text-gray-900">
                    {purchase.responsable.celular}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              <p>Sin responsable asignado</p>
            </div>
          )}
        </div>
      </div>
    </TabsContent>
  );
};

export default PurchaseOverview;

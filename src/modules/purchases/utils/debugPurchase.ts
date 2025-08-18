// Utilidad para debug de datos de compra
export const debugPurchaseData = (data: any, context: string = '') => {
  console.group(`🔍 Debug Purchase Data ${context}`);
  
  console.log('📋 Estructura completa:', data);
  
  if (data.detalles && Array.isArray(data.detalles)) {
    console.log('📦 Detalles count:', data.detalles.length);
    
    data.detalles.forEach((detalle: any, index: number) => {
      console.group(`   📦 Detalle ${index + 1}`);
      console.log('   🆔 ID:', detalle.id);
      console.log('   🏷️ Producto ID:', detalle.producto?.id || detalle.id_producto);
      
      // Validar tipos de datos numéricos
      const cantidad = detalle.cantidad;
      const costo = detalle.costo;
      const incPrecioVenta = detalle.inc_precio_venta || detalle.inc_p_venta;
      const precioVenta = detalle.precio_venta;
      const incPrecioVentaAlt = detalle.inc_precio_venta_alt || detalle.inc_p_venta_alt;
      const precioVentaAlt = detalle.precio_venta_alt;
      
      console.log('   📊 Cantidad:', cantidad, `(${typeof cantidad})`, isNaN(Number(cantidad)) ? '❌ INVÁLIDO' : '✅ VÁLIDO');
      console.log('   💰 Costo:', costo, `(${typeof costo})`, isNaN(Number(costo)) ? '❌ INVÁLIDO' : '✅ VÁLIDO');
      console.log('   📈 Inc precio venta:', incPrecioVenta, `(${typeof incPrecioVenta})`, isNaN(Number(incPrecioVenta)) ? '❌ INVÁLIDO' : '✅ VÁLIDO');
      console.log('   💵 Precio venta:', precioVenta, `(${typeof precioVenta})`, isNaN(Number(precioVenta)) ? '❌ INVÁLIDO' : '✅ VÁLIDO');
      console.log('   💴 Precio venta alt:', precioVentaAlt, `(${typeof precioVentaAlt})`, isNaN(Number(precioVentaAlt)) ? '❌ INVÁLIDO' : '✅ VÁLIDO');
      console.log('   💴 Moneda:', detalle.moneda);
      console.groupEnd();
    });
  }
  
  console.log('👤 Usuario:', data.usuario, `(${typeof data.usuario})`);
  console.log('🏢 Sucursal:', data.sucursal, `(${typeof data.sucursal})`);
  console.log('👥 Responsable:', data.id_responsable, `(${typeof data.id_responsable})`);
  
  console.groupEnd();
};

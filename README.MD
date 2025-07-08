# filtros
## Mostrar: status :: solo si tiene
## Sort: por coumna existente :: solo si tiene :: + atajo de teclado
## Resetear filtros :: + atajo de teclado
## Agregar count table items :: en la parte de abajo :: 
## Agregar atajo de teclado en paginacion:: = < + atajo de teclado , = + atajo de teclado :: salto de 1 en 1
## Modulos apartes crear producto | buscar producto = + quitar agregar columnas tablas

## p.por menos sin fac

## Mostrar por defecto con la session sucursal + aumentar + sucursales

## Vendedor, admin global, gerente
## ventanas | ventanas    | ventanas
```json

{
    "window":"busqueda de productos",
    "path":"/product-list",
    "busquedas":[
        {
            "name":"busqueda 1",
            "filters":{
                "name":"ejemp",
                "status":"activo",
                "sort":"name"
            },
            "data":[
                { "productName":"ejemp","price":10}
            ]
        },
        {
            "name":"busqueda 2",
            "filters":{
                "name":"exam",
                "status":"inactivos",
                "sort":"precio"
            },
            "data":[
                { "productName":"exam","price":10},
                { "productName":"exam","price":10},
            ]
        }
    ]
}

```
import { Component, signal } from '@angular/core';
import { Loader } from '@ui/icons/loader';

@Component({
  selector: 'app-create',
  imports: [Loader],
  templateUrl: './create.html',
  styleUrl: './create.scss',
})
export class Create {
  permissions = signal<Array<any>>([
    {
      id: 'sales',
      module: 'Ventas',
      pages: [
        {
          id: 'orders',
          name: 'Pedidos',
          permissions: [
            {
              label: 'Ver Pedidos',
              value: 'pedidos.view',
            },
            {
              label: 'Editar Pedidos',
              value: 'pedidos.edit',
            },
            {
              label: 'Crear Pedidos',
              value: 'pedidos.create',
            },
            {
              label: 'Eliminar Pedidos',
              value: 'pedidos.delete',
            },
          ],
        },
        {
          id: 'quotes',
          name: 'Cotizaciones',
          permissions: [
            {
              label: 'Ver Cotizaciones',
              value: 'cotizaciones.view',
            },
            {
              label: 'Editar Cotizaciones',
              value: 'cotizaciones.edit',
            },
            {
              label: 'Crear Cotizaciones',
              value: 'cotizaciones.create',
            },
            {
              label: 'Eliminar Cotizaciones',
              value: 'cotizaciones.delete',
            },
          ],
        },
      ],
    },
    {
      id: 'inventory',
      module: 'Inventario',
      pages: [
        {
          id: 'products',
          name: 'Productos',
          permissions: [
            {
              label: 'Ver Productos',
              value: 'productos.view',
            },
            {
              label: 'Editar Productos',
              value: 'productos.edit',
            },
            {
              label: 'Crear Productos',
              value: 'productos.create',
            },
            {
              label: 'Eliminar Productos',
              value: 'productos.delete',
            },
          ],
        },
      ],
    },
  ]);

  expandedItems = new Set<string>([]);

}

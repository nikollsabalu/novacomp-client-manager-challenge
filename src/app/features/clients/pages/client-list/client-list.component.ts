import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { ClientService } from '../../services/client.service';
import { Client } from 'src/app/core/models/client.model';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'age', 'birthDate'];

  dataSource = new MatTableDataSource<Client>([]);
  isLoading = true;
  totalClients = 0;
  averageAge = 0;
  standardDeviation = 0;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (sort) {
      this.dataSource.sort = sort;
    }
  }

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  constructor(
    private clientService: ClientService,
    private paginatorIntl: MatPaginatorIntl) {
    this.translatePaginator();
  }

  ngOnInit(): void {
    this.getClients();
  }


  /**
   * Obtiene los clientes registrados en firebase y actualiza la tabla, así como las estadísticas del dashboard.
   */
  getClients(): void {
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.dataSource.data = clients;
        this.calculateStatistics(clients);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener clientes:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Aplica un filtro sobre la tabla de clientes utilizando el texto ingresado por el usuario en el input de búsqueda.
   *
   * @param event Evento generado por el input de búsqueda.
   */
  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  /**
   * Calcula las estadísticas del listado de clientes:
   * - Total de clientes.
   * - Promedio de edad.
   * - Desviación estándar.
   *
   * @param clients Lista de clientes registrados.
   */
  calculateStatistics(clients: Client[]): void {
    this.totalClients = clients.length;

    if (!clients.length) {
      this.averageAge = 0;
      this.standardDeviation = 0;
      return;
    }

    const ages = clients.map(client => client.age);

    const sum = ages.reduce((acc, age) => acc + age, 0);
    this.averageAge = sum / ages.length;

    const variance =
      ages.reduce((acc, age) => acc + Math.pow(age - this.averageAge, 2), 0) /
      ages.length;

    this.standardDeviation = Math.sqrt(variance);
  }

  private translatePaginator(): void {
    this.paginatorIntl.itemsPerPageLabel = 'Registros por página:';
    this.paginatorIntl.nextPageLabel = 'Siguiente';
    this.paginatorIntl.previousPageLabel = 'Anterior';
    this.paginatorIntl.firstPageLabel = 'Primera página';
    this.paginatorIntl.lastPageLabel = 'Última página';

    this.paginatorIntl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ): string => {
      if (length === 0) {
        return '0 de 0';
      }

      const startIndex = page * pageSize;
      const endIndex = Math.min(startIndex + pageSize, length);

      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };

    this.paginatorIntl.changes.next();
  }
}
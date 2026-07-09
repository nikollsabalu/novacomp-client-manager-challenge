import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { ClientService } from '../../services/client.service';
import { Client } from 'src/app/core/models/client.model';

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

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.getClients();
  }

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

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

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
}
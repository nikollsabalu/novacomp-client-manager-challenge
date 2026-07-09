import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  query,
  orderBy
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { Client } from 'src/app/core/models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly collectionName = 'clients';

  constructor(private firestore: Firestore) { }

  /**
   * Obtiene el listado de clientes registrados desde Firestore, ordenados por fecha de creación descendente.
   * @returns Observable con la lista de clientes.
   */

  getClients(): Observable<Client[]> {
    const clientsRef = collection(this.firestore, this.collectionName);

    const clientsQuery = query(
      clientsRef,
      orderBy('createdAt', 'desc')
    );

    return collectionData(clientsQuery, {
      idField: 'id'
    }) as Observable<Client[]>;
  }

  /**
   * Registra un nuevo cliente en Firestore.
   *
   * @param client Información del cliente a registrar.
   * @returns Promesa con la referencia del documento creado.
   */
  addClient(client: Client) {
    const clientsRef = collection(this.firestore, this.collectionName);

    return addDoc(clientsRef, {
      ...client,
      createdAt: new Date()
    });
  }
}
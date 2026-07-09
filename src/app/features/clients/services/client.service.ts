import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  CollectionReference,
  DocumentData
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { Client } from 'src/app/core/models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly collectionName = 'clients';

  constructor(private firestore: Firestore) { }

  getClients(): Observable<Client[]> {
    const clientsRef = collection(
      this.firestore,
      this.collectionName
    ) as CollectionReference<DocumentData>;

    return collectionData(clientsRef, { idField: 'id' }).pipe(
      map((clients: any[]) =>
        clients.map((client) => ({
          ...client,
          birthDate: client.birthDate?.toDate
            ? client.birthDate.toDate()
            : new Date(client.birthDate.seconds * 1000),
          createdAt: client.createdAt?.toDate
            ? client.createdAt.toDate()
            : new Date(client.createdAt.seconds * 1000)
        }))
      )
    ) as Observable<Client[]>;
  }

  addClient(client: Client) {
    const clientsRef = collection(this.firestore, this.collectionName);

    return addDoc(clientsRef, {
      ...client,
      createdAt: new Date()
    });
  }
}
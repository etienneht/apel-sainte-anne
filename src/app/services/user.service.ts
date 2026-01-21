import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  collectionData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AppUser } from '../models/user.model';
import {map} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {


  constructor(private firestore: Firestore) {
  }

  // CREATE
  createUser(user: AppUser): Promise<void> {
    return setDoc(doc(this.firestore, `users/${user.uid}`), user);
  }

  // READ (single)
  getUser(uid: string): Observable<AppUser | null> {
    return docData(
      doc(this.firestore, `users/${uid}`)
    ).pipe(
      map(user => user ? (user as AppUser) : null)
    );
  }



  // READ (all)
  getUsers(): Observable<AppUser[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, {
      idField: 'uid'
    }) as Observable<AppUser[]>;
  }

  // UPDATE
  updateUser(uid: string, data: Partial<AppUser>): Promise<void> {
    return updateDoc(
      doc(this.firestore, `users/${uid}`),
      data
    );
  }

  // DELETE
  deleteUser(uid: string): Promise<void> {
    return deleteDoc(
      doc(this.firestore, `users/${uid}`)
    );
  }
}

import { Injectable } from '@angular/core';

import {AngularFirestore} from '@angular/fire/compat/firestore';

import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore, private angularFireStorage: AngularFireStorage) { }

  public insertar(coches, datos){
    return this.angularFirestore.collection(coches).add(datos);
  }

  public consultar(coches){
    return this.angularFirestore.collection(coches).snapshotChanges();
  }

  public borrar(coches, documentId) {
    return this.angularFirestore.collection(coches).doc(documentId).delete();
  }

  public actualizar(coches, documentId, datos){
    return this.angularFirestore.collection(coches).doc(documentId).set(datos);
  }

  public consultarPorId(coches, documentId) {
    return this.angularFirestore.collection(coches).doc(documentId).snapshotChanges();
  }

  public uploadImage(nombreCarpeta, nombreArchivo, imagenBase64){
    let storageRef=
    this.angularFireStorage.ref(nombreCarpeta).child(nombreArchivo);
    return storageRef.putString("data:image/jpeg;base64,"+imagenBase64, 'data_url');
  }

  public deleteFileFromURL(fileURL){
    return this.angularFireStorage.storage.refFromURL(fileURL).delete();
  }

  
}

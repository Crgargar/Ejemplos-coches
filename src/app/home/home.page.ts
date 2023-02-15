import { Component } from '@angular/core';
import { Coche } from '../coche';

import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  cocheEditando: Coche;
  arrayColeccionCoches: any = [{
    id: "",
    data: {} as Coche
  }];

  constructor(private firestoreService: FirestoreService, private router: Router) {
    // crear un coche vacio al empezar
    this.cocheEditando = {} as Coche;

    this.obtenerListaCoches();
  }


  obtenerListaCoches(){
    this.firestoreService.consultar("coche").subscribe((resultadoConsultaCoches) => {
      this.arrayColeccionCoches = [];
      resultadoConsultaCoches.forEach((datosCoche: any) => {
        this.arrayColeccionCoches.push({
          id: datosCoche.payload.doc.id,
          data: datosCoche.payload.doc.data()
        })
      })
    }
    )
  }

  idCocheSelec: string;

  clickBotonInsertar(){
    this.router.navigate(['/detalle', "C"]);

  }

  selecCoche(cocheSelec) {
    console.log("coche seleccionada: ");
    console.log(cocheSelec);
    this.idCocheSelec = cocheSelec.id;
    this.cocheEditando.marca = cocheSelec.data.marca;
    this.cocheEditando.modelo = cocheSelec.data.modelo;
    this.cocheEditando.anno = cocheSelec.data.anno;
    this.cocheEditando.pais = cocheSelec.data.pais;
    this.cocheEditando.precio = cocheSelec.data.precio;
    this.cocheEditando.imagen = cocheSelec.data.imagen;
    // this.router.navigate(['/detalle']);
    this.router.navigate(['/detalle', this.idCocheSelec]);
  }

  
}

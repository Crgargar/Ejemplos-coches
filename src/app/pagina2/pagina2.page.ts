import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';


@Component({
  selector: 'app-pagina2',
  templateUrl: './pagina2.page.html',
  styleUrls: ['./pagina2.page.scss'],
})
export class Pagina2Page implements OnInit {

    map: L.Map;


  constructor() { }

  ngOnInit() {
  }

  ionViewDidEnter(){
  this.loadMap();
}

loadMap() {
  let marker;
  let latitud = 36.70915575169545;
  let longitud = -6.119396216905574;
  let zoom = 17;
  this.map = L.map("mapId").setView([latitud, longitud], zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      .addTo(this.map);
  marker = L.marker([latitud, longitud]).addTo(this.map);
  L.marker([36.70915575169545, -6.119396216905574]).addTo(this.map).bindPopup('Automoción Terry').openPopup();

      
}

}

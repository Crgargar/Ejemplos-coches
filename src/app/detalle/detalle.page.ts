import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Coche } from '../coche';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';

import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { resourceLimits } from 'worker_threads';

import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';



@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})


export class DetallePage implements OnInit {

  cocheEditando: Coche;
  document: any = {
    id: "",
    data: {} as Coche
  };

  id: string = "";

  handlerMessage = "";
  roleMessage = "";



  constructor(private activatedRoute: ActivatedRoute,private firestoreService: FirestoreService, private router: Router, private alertController: AlertController, 
    private loadingController: LoadingController, private toastController: ToastController, private imagePicker: ImagePicker, private socialSharing: SocialSharing) { 
   }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id')
    
    this.firestoreService.consultarPorId("coche", this.id).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        // Como ejemplo, mostrar el título de la tarea en consola
        console.log(this.document.data.marca);
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Coche;
      } 
    });
  }

  clickBotonInsertar(){
    this.firestoreService.insertar("coche", this.document.data)
    .then(() =>{
      console.log("Coche creado correctamente");
      // limpiar el contenido de los coches que se estaban editando
      this.cocheEditando = {} as Coche;
    }, (error) => {
      console.error(error);
    });
    this.router.navigate(['/home']);

  }

  idCocheSelec: string;

  // clicBotonBorrar() {
  //   this.firestoreService.borrar("coche", this.id).then(() => {
  //     // Limpiar datos de pantalla
  //     this.document.data = {} as Coche;
  //   })
  //   this.router.navigate(['/home']);

  // }

  clicBotonModificar() {
    this.firestoreService.actualizar("coche", this.document.id, this.document.data).then(() => {
      // Limpiar datos de pantalla
      this.document.data = {} as Coche;
    })
    this.router.navigate(['/home']);
  }

  clicBotonVolver(){
    this.router.navigate(['/home']);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Alert canceled';
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.deleteFile(this.document.data.imagen);
            this.handlerMessage = 'Alert confirmed';
            this.firestoreService.borrar("coche", this.id).then(() => {
              this.document.data = {} as Coche;
              console.log("HOLA" + this.id);
            })
            this.router.navigate(['/home']);
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    this.roleMessage = `Dismissed with role: ${role}`;

    }
  async uploadImagePicker(){
    // mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    // mensaje de finalizacion de subida de la imagen
    const toast = await this.toastController.create({
      message: 'image was updated successfully',
      duration: 3000
    });
    // comprobar si la aplicacion tiene permisos de lectura
    this.imagePicker.requestReadPermission().then(
      (result) => {
        // si no tiene permiso de lectura se solicita al usuario
        if(result == false){
          this.imagePicker.requestReadPermission();
        }
        else{
          // abrir selector de imagenes(imagePicker)
          this.imagePicker.getPictures({
            maximumImagesCount: 1, //permitir solo 1 imagen
            outputType: 1 //1 = base64
          }).then(
            (results) => {//en la variable results se tienen las imagenes seleccionadas
            // carpeta del storage donde se almacenara la imagen
            let nombreCarpeta = "imagenes";
            // recorrer todas las imagenes que haya seleccionado el usuario
            // aunque realmente solo sera 1 como se ha indicado en las opciones
            for (var i = 0; i<results.length; i++){
              // mostrar el mensaje de espera
              loading.present();
              // asignar el nombre de la imagen en funcion de la hora actual para
              // evitar duplicidad de nombres
              let nombreImagen = `${new Date().getTime()}`;
              // llamar al metodo que sube la imagen al storage
              this.firestoreService.uploadImage(nombreCarpeta, nombreImagen, results[i])

              .then(snapshot => {
                snapshot.ref.getDownloadURL()
                  .then(downloandURL => {
                    // en la variable downloadURL se tiene la direccion de la descarga de la imagen
                    console.log("downloadURL:" + downloandURL);

                    this.document.data.imagen=downloandURL;
                    // mostrar el mensaje de finalizacion de la subida
                    toast.present();
                    // ocultar mensaje de espera
                    loading.dismiss();
                  })
              })
            }
        },
          (err) => {
            console.log(err)
          }
        );
      }
    }
    ), (err) => {
      console.log(err);
    };
  }

  async deleteFile(fileURL){
    const toast = await this.toastController.create({
      message: 'File was delete successfully',
      duration: 3000
    });
    this.firestoreService.deleteFileFromURL(fileURL)
      .then(() => {
        toast.present();
      }, (err) => {
        console.log(err);
      });
    }

    regularSharing() {
      this.socialSharing.share(`Nombre: ${this.document.data.marca } '/n' Marca: ${this.document.data.modelo}` , null, null, null).then(() => {
        console.log("Se ha compartido correctamente");
      }).catch((error) => {
        console.log("Se ha producido un error: " + error);
      });
    }
    
}

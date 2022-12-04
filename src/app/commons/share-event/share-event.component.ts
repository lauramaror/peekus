import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal, ToastController } from '@ionic/angular';
import { EventPeekus } from 'src/app/models/event.model';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-share-event',
  templateUrl: './share-event.component.html',
  styleUrls: ['./share-event.component.scss'],
})
export class ShareEventComponent implements OnInit {
  @ViewChild(IonModal) modalShare: IonModal;
  @Input() event: EventPeekus;
  @Input() eventQR: string;

  randomId = Math.random();
  logosSocial = [
    {logo:'logo-twitter', link:''},
    {logo:'logo-instagram', link:''},
    {logo:'logo-whatsapp', link:''},
    {logo:'logo-facebook', link:''},
    {logo:'logo-tumblr', link:''},
    {logo:'link-outline', link:''},
  ];

  constructor(
    private imageService: ImageService,
    private toastController: ToastController,
  ) { }

  ngOnInit() {}

  downloadQR(){
    this.imageService.saveCollagesToGallery([this.eventQR]).then((saved) => {
      const textToast = saved ? 'QR guardado en galería' : 'Ha habido un error guardando el QR';
      this.presentToast(textToast);
    });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom',
      cssClass: 'my-custom-toast'
    });

    await toast.present();
  }

}

/* eslint-disable @typescript-eslint/dot-notation */
import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  scanner: any;
  content: HTMLElement;
  img: HTMLElement;

  resultado = '';

  constructor(
    private qrScanner: QRScanner,
    public alertController: AlertController,
    private platform: Platform
  ) {
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.content.style.opacity = '1';

      this.resultado = '';

      this.qrScanner.hide(); // hide camera preview
      this.scanner.unsubscribe(); // stop scanning
    });

  }

  lerQRCode() {
    this.content = document.getElementsByTagName('ion-content')[0];

    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          this.content.style.opacity = '0';

          // start scanning
          this.scanner = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);

            this.resultado = (text['result']) ? text['result'] : text;
            this.content.style.opacity = '1';

            this.exibirAlerta(this.resultado);

            this.qrScanner.hide(); // hide camera preview
            this.scanner.unsubscribe(); // stop scanning
          });

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));

  }

  async exibirAlerta(mensagem: string) {
    const alert = await this.alertController.create({
      header: 'QRScanner',
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();

  }

}

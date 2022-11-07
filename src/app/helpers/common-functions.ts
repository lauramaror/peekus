/* eslint-disable prefer-arrow/prefer-arrow-functions */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export async function presentAlert(alertHeader: string, alertController: any){
  const alert = await alertController.create({
    header: alertHeader,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
      },
      {
        text: 'OK',
        role: 'confirm',
      },
    ],
  });

  await alert.present();

  const { role } = await alert.onDidDismiss();
  return role;
};

export function convertArrayBufferToBase64(elements: number[]){
  let binary = '';
  const bytes = new Uint8Array( elements );
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return 'data:image/jpeg;base64,'+window.btoa( binary );
};

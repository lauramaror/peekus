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

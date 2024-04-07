import * as Burnt from 'burnt';
import { AlertOptions, ToastOptions } from 'burnt/build/types';

export function showToast(options: ToastOptions) {
  Burnt.toast(options);
}

export function showAlert(options: AlertOptions) {
  Burnt.alert(options);
}

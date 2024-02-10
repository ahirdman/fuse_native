import * as Burnt from 'burnt';
import { ToastOptions } from 'burnt/build/types';

export function showToast(options: ToastOptions) {
  Burnt.toast(options);
}

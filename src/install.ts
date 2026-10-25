import './style.css';

const board = document.querySelector<HTMLInputElement>('#confirm-board')!;
const erase = document.querySelector<HTMLInputElement>('#confirm-erase')!;
const control = document.querySelector<HTMLElement>('#installer-control')!;
const status = document.querySelector<HTMLElement>('#browser-status')!;

function update() {
  const supported = window.isSecureContext && 'serial' in navigator;
  control.hidden = !supported || !board.checked || !erase.checked;
  status.textContent = !supported
    ? 'Web Serial を利用できません。デスクトップ版の Chrome または Edge で HTTPS の公開ページを開いてください。 / Web Serial is unavailable. Open the HTTPS site in desktop Chrome or Edge.'
    : control.hidden
      ? '端末と上書きを確認するとインストールボタンが表示されます。 / Confirm the board and overwrite to show the install button.'
      : 'INSTALL を押して USB 端末を選んでください。 / Press INSTALL and select the USB device.';
}

board.addEventListener('change', update);
erase.addEventListener('change', update);
update();

import { MODAL_PORTAL_ID } from '../src/constants/ui';

global.beforeEach(() => {
  // Append div for React Portal

  const modalRoot = global.document.createElement('div');
  modalRoot.setAttribute('id', MODAL_PORTAL_ID);

  const body = global.document.querySelector('body');
  body.appendChild(modalRoot);
});

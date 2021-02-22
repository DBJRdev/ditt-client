// window.location.reload() is read-only property, so location object needs to be recreated
const { location } = window;
delete window.location;

window.location = {
  ...location,
  reload: jest.fn(),
};

const storageMock = (() => {
  let store = {};

  return {
    clear: () => {
      store = {};
    },
    getItem: (key) => store[key],
    removeItem: (key) => {
      delete store[key];
    },
    setItem: (key, value) => {
      store[key] = value.toString();
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: storageMock,
});

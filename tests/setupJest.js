console.error = (error) => {
  throw new Error(error);
};

console.warn = (error) => {
  throw new Error(error);
};

window.fetch = () => {};

jest.mock('react-i18next', () => ({
  withNamespaces: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (t) => t };
    return Component;
  },
}));

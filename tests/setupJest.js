import fetchMock from 'fetch-mock';

fetchMock.config.overwriteRoutes = true;

console.error = (error) => {
  throw new Error(error);
};

console.warn = (error) => {
  throw new Error(error);
};

jest.mock('react-i18next', () => ({
  withTranslation: () => (Component) => {
    Component.defaultProps = {
      ...Component.defaultProps,
      t: (t) => t,
    };

    return Component;
  },
}));

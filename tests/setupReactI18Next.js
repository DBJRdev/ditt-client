jest.mock('react-i18next', () => ({
  withTranslation: () => (Component) => {
    Component.defaultProps = {
      ...Component.defaultProps,
      t: (t) => t,
    };

    return Component;
  },
}));

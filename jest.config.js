module.exports = {
  moduleFileExtensions: [
    'js',
    'jsx',
  ],
  moduleNameMapper: {
    '@react-ui-org/react-ui': '@react-ui-org/react-ui/dist/lib.development.js',
    '\\.scss$': 'identity-obj-proxy',
    '\\.svg$': '<rootDir>/tests/mocks/svgrMock.jsx',
    'redux-api-middleware/es': 'redux-api-middleware',
  },
  setupFiles: [
    '<rootDir>/tests/setupJest.js',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/tests/setupEnzyme.js',
  ],
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
  verbose: true,
};

module.exports = {
  globalSetup: '<rootDir>/tests/setupJestGlobal.js',
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
    '<rootDir>/tests/setupDate.js',
    '<rootDir>/tests/setupDom.js',
    '<rootDir>/tests/setupEnzyme.js',
    '<rootDir>/tests/setupFetch.js',
    '<rootDir>/tests/setupReactI18Next.js',
    '<rootDir>/tests/setupShortId.js',
    '<rootDir>/tests/setupTestingLibrary.js',
    '<rootDir>/tests/setupTimeout.js',
    '<rootDir>/tests/setupWindow.js',
  ],
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
  testEnvironment: 'jsdom',
  verbose: true,
  transformIgnorePatterns: [
    'node_modules'
  ],
};

import fetchMock from 'fetch-mock';

fetchMock.config.overwriteRoutes = true;

global.afterEach(() => {
  fetchMock.reset();
});

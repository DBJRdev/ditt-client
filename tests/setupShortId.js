import shortid from 'shortid';
import sinon from 'sinon';

let mockShortIdGenerate = null;

global.beforeEach(() => {
  let mockShortId = 0;
  mockShortIdGenerate = sinon.stub(shortid, 'generate').callsFake(() => {
    const key = `gen_${mockShortId}`;
    mockShortId += 1;

    return key;
  });
});

global.afterEach(() => {
  mockShortIdGenerate.restore();
});

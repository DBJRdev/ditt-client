import React from 'react';
import { shallow } from 'enzyme';
import SettingsComponent from '../SettingsComponent';
import configMock from '../../../../tests/mocks/configMock';

describe('rendering', () => {
  it('renders correctly', () => {
    const props = {
      config: configMock,
      fetchConfig: () => new Promise(() => {}),
      isFetching: false,
      isPosting: false,
      saveConfig: () => new Promise(() => {}),
    };
    const tree = shallow(<SettingsComponent {...props} />);

    expect(tree).toMatchSnapshot();
  });
});

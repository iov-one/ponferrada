import * as config from './fetchConfig';
import { threeChainsConfig } from '../../test/chainConfigBuilder';
import { getConfig } from '.';

describe('config', () => {
  it('mocks correctly chain config', async () => {
    const fetchConfigMock = jest.spyOn(config, 'fetchConfig');
    fetchConfigMock.mockImplementation(threeChainsConfig);
    expect((await getConfig()).length).toBe(3);

    fetchConfigMock.mockRestore();

    expect((await getConfig()).length).toBe(4);
  });
});

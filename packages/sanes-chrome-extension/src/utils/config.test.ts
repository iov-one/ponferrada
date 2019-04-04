import * as config from './config';
import { getConfig } from '../utils/config';
import { threeChainsConfig } from '../logic/test/chainConfigBuilder';

describe('config', () => {
  it('mocks correctly chain config', async () => {
    const fetchConfigMock = jest.spyOn(config, 'getConfig');
    fetchConfigMock.mockImplementation(threeChainsConfig);
    expect((await getConfig()).chains.length).toBe(3);

    fetchConfigMock.mockRestore();

    expect((await getConfig()).chains.length).toBe(4);
  });
});

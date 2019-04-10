import * as config from './configurationfile';
import { threeChainsConfig } from '../test/chainConfigBuilder';
import { getRuntimeConfiguration } from './runtimeconfiguration';

describe('getRuntimeConfiguration', () => {
  it('mocks correctly chain config', async () => {
    const fetchConfigMock = jest.spyOn(config, 'getConfigurationFile');
    fetchConfigMock.mockImplementation(threeChainsConfig);
    expect((await getRuntimeConfiguration()).chains.length).toEqual(3);

    fetchConfigMock.mockRestore();

    expect((await getRuntimeConfiguration()).chains.length).toEqual(4);
  });
});

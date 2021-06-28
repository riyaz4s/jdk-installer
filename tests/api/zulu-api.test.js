const axios = require('axios');
const { fetchJdkBundle } = require('../../api/zulu-api');

describe('fetchJdkBundle', () => {
  it('should make api call to get bundle list', async () => {
    const fetchListSpy = jest.spyOn(axios, 'get');
    const jdkOptions = {"jdkVersion":"11.0","javaVersion":"11.0","zuluVersion":"11.33","os":"windows","ext":"zip"}
    fetchListSpy.mockResolvedValue({})
    await fetchJdkBundle(jdkOptions);
    expect(fetchListSpy).toBeCalledWith('https://api.azul.com/zulu/download/community/v1.0/bundles/?java_version=11.0&jdk_version=11.0&zulu_version=11.33&os=windows&arch=x86&ext=zip');
  })

  it('should throw error if api fails', async () => {
    const fetchListSpy = jest.spyOn(axios, 'get');
    const jdkOptions = {"jdkVersion":"11.0","javaVersion":"11.0","zuluVersion":"11.33","os":"windows","ext":"zip"}
    fetchListSpy.mockImplementation(() => { throw Error('test') });
    await expect(fetchJdkBundle(jdkOptions)).rejects.toThrow('test');
    expect(fetchListSpy).toBeCalledWith('https://api.azul.com/zulu/download/community/v1.0/bundles/?java_version=11.0&jdk_version=11.0&zulu_version=11.33&os=windows&arch=x86&ext=zip');

  })
})
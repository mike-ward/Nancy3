declare var browser: (env?: any) => {};

declare module 'mithril/test-utils/browserMock' {
  export = browser;
}
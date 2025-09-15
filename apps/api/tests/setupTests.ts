// Test setup for API
import 'jest';

global.console = {
  ...console,
};

global.fetch = jest.fn();

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

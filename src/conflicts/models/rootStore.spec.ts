import { useContext } from 'react';
import { useStore, rootStore } from './rootStore';
jest.mock('react', () => {
  return {
    useContext: jest.fn(),
    createContext: jest.fn().mockImplementation(() => ({ provider: {} })),
  };
});

const contextMock = useContext as jest.Mock<null | unknown>;

afterEach(() => {
  contextMock.mockReset();
});

it('useStore works correctly if store is defined', () => {
  const context = {};
  contextMock.mockImplementation(() => context);

  const result = useStore();

  expect(contextMock).toHaveBeenCalledTimes(1);
  expect(result).toBe(context);
});

it('useStore throws an error if store is undefined', () => {
  contextMock.mockImplementation(() => null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const action = () => useStore();

  expect(action).toThrow();
});

it('root store should call fetchConflicts on init', () => {
  const mockFetch = jest.fn().mockResolvedValue({ data: { data: [] } });

  rootStore.create({}, { fetch: mockFetch });

  expect(mockFetch).toHaveBeenCalledTimes(1);
});

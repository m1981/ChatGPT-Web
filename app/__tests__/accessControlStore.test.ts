// __tests__/accessControlStore.test.ts
import { act, renderHook } from '@testing-library/react-hooks';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AccessControlStore, useAccessStore } from '../store'; // Replace with the path to your accessControlStore file

// Mock fetch function to simulate API calls
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe('accessControlStore', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updates accessCode and token', () => {
    const { result } = renderHook(() => useAccessStore());
    const initialAccessCode = result.current.accessCode;
    const initialToken = result.current.token;

    act(() => {
      result.current.updateCode('newCode');
      result.current.updateToken('newToken');
    });

    expect(result.current.accessCode).not.toBe(initialAccessCode);
    expect(result.current.accessCode).toBe('newCode');
    expect(result.current.token).not.toBe(initialToken);
    expect(result.current.token).toBe('newToken');
  });

  it('checks if authorized', () => {
    const { result } = renderHook(() => useAccessStore());

    expect(result.current.isAuthorized()).toBe(false);

    act(() => {
      result.current.updateCode('newCode');
    });

    expect(result.current.isAuthorized()).toBe(true);

    act(() => {
      result.current.updateCode('');
      result.current.updateToken('newToken');
    });

    expect(result.current.isAuthorized()).toBe(true);
  });

  it('fetches config from the server', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAccessStore());

    act(() => {
      result.current.fetch();
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/api/config', {
      method: 'post',
      body: null,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': localStorage.getItem('csrfToken'),
      },
    });

    await waitForNextUpdate();

    expect(result.current.needCode).toBe(true);
  });
});

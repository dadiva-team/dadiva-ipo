import { NavigateFunction } from 'react-router-dom';
import { Problem } from './Problem';

export async function fetchAPI<T>(
  input: RequestInfo | URL,
  method: string,
  body: BodyInit | undefined,
  headers?: HeadersInit
): Promise<T> {
  const res = await fetch(input, {
    method,
    headers: headers
      ? headers
      : {
          'Content-Type': 'application/json',
        },
    body,
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Problem(await res.json());
  }

  return await res.json();
}

export function get<T>(input: RequestInfo | URL): Promise<T> {
  return fetchAPI<T>(input, 'GET', undefined);
}

export function post<T>(input: RequestInfo | URL, body?: BodyInit): Promise<T> {
  return fetchAPI<T>(input, 'POST', body);
}

export function put<T>(input: RequestInfo | URL, body?: BodyInit): Promise<T> {
  return fetchAPI<T>(input, 'PUT', body);
}

export function deleteRequest<T>(input: RequestInfo | URL): Promise<T> {
  return fetchAPI<T>(input, 'DELETE', undefined);
}

export async function handleRequest<T, E = Error>(promise: Promise<T>): Promise<[E, null] | [null, T]> {
  try {
    const res: T = await promise;
    return [null, res];
  } catch (err) {
    return [err as E, null];
  }
}

export function handleError(
  err: Error | Problem,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  navigate: NavigateFunction
) {
  if (navigate != undefined && err instanceof Problem && err.status === 401) {
    navigate('/login');
  } else if (err instanceof Problem) {
    console.log('Problem title is: ' + err.title);
    setError(err.title);
  } else {
    console.log(err);
    setError(err.message);
  }
}

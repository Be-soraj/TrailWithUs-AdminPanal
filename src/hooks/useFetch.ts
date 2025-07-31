import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import http from "@/http/api";
import type { AxiosRequestConfig } from "axios";

const useFetch = <T = any>(
  url: string,
  key: string[],
  config: AxiosRequestConfig = {},
  queryOptions?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
): UseQueryResult<T, Error> => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const res = await http.get<T>(url, config);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!url,
    retry: 2,
    ...queryOptions,
  });
};

export default useFetch;
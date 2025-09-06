// hooks/usePut.ts (or wherever your usePut is defined)
import { useMutation } from "@tanstack/react-query";
import axios, { type AxiosRequestConfig } from "axios";

const usePut = <T = any>(
  url: string,
  config?: AxiosRequestConfig,
  options?: any
) => {
  return useMutation<T, Error, any>({
    mutationFn: async (data: any) => {
      const response = await axios.put(url, data, {
        ...config,
        headers: {
          ...config?.headers,
          // Don't set Content-Type for FormData - browser will set it automatically
          ...(data instanceof FormData
            ? {}
            : { "Content-Type": "application/json" }),
        },
      });
      return response.data;
    },
    ...options,
  });
};

export default usePut;

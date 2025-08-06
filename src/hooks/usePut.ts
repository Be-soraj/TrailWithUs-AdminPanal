import {
  useMutation,
  type UseMutationResult,
  type UseMutationOptions,
} from "@tanstack/react-query";
import http from "@/http/api";
import type { AxiosRequestConfig } from "axios";

const usePut = <T = any, D = any>(
  url: string,
  config: AxiosRequestConfig = {},
  mutationOptions?: UseMutationOptions<T, Error, D>
): UseMutationResult<T, Error, D, unknown> => {
  return useMutation({
    ...mutationOptions,
    mutationFn: async (data: D) => {
      const res = await http.put<T>(url, data, config);
      return res.data;
    },
  });
};

export default usePut;

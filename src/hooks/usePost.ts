// usePost.ts
import { useMutation, type UseMutationResult, type UseMutationOptions } from "@tanstack/react-query";
import http from "@/http/api";
import type { AxiosRequestConfig } from "axios";

const usePost = <T = any, D = any>(
  url: string,
  config: AxiosRequestConfig = {},
  mutationOptions?: UseMutationOptions<T, Error, D>
): UseMutationResult<T, Error, D, unknown> => {
  return useMutation({
    ...mutationOptions,
    mutationFn: async (data: D) => {
      const res = await http.post<T>(url, data, config);
      return res.data;
    },
  });
};

export default usePost;
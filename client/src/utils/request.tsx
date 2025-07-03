/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosResponse, type Method } from "axios";

interface ApiResponse {
  ret_code: number;
  msg?: string;
  message?: string;
  data?: any;
  [key: string]: any;
}
interface RequestParamProps {
  action?: string;
  params?: Record<string, unknown>;
  [key: string]:
    | string
    | boolean
    | number
    | undefined
    | Record<string, string | boolean>
    | string[]
    | { [name: string]: unknown };
}
type ApiRequestProps = {
  params?: RequestParamProps;
  headers?: Record<string, string>;
  method?: Method | string;
  service?: string;
  action?: string;
  data?: Record<string, unknown>;
};

const instance = axios.create({
  timeout: 60_000,
});

const apiRequest = <R extends ApiResponse>({
  method = "GET",
  action = "",
  data,
  headers = {},
}: ApiRequestProps): Promise<R> =>
  new Promise<R>((resolve, reject) => {
    const urlPrefix = "/api";
    const param = {
      url: urlPrefix + action,
      method,
      headers,
      data,
    };
    instance(param)
      .then((response: AxiosResponse<R>) => {
        if (response.data) {
          const res = response.data;
          resolve(res);
        }
      })
      .catch((error: { message: string; status: number }) => {
        console.log("err", error);
        if (error.status === 401) {
          window.location.href = "/login";
        }
        let label = error.message;
        if (label) {
          if (error.message.includes("timeout")) {
            label = "Request timeout";
          }
          reject(error);
        }
        reject(new Error(label));
      });
  });

export default apiRequest;

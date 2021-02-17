import axios, { AxiosInstance, AxiosResponse } from 'axios';

declare module 'axios' {
  interface AxiosResponse<T = any> extends Promise<T> {}
}

export default abstract class HttpClient {
  protected readonly instance: AxiosInstance;

  public constructor(baseURL: string) {
    this.instance = axios.create({ baseURL });
    this.initializeResponseInterceptor();
  }

  private initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this.handleResponse,
      this.handleError,
    );
  };

  private handleResponse = ({ data }: AxiosResponse) => data;

  protected handleError = (error: any) => Promise.reject(error);
}

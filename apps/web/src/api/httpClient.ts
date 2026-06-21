export interface HttpCLientConfig extends RequestInit {
  baseUrl?: string;
  timeout?: number;
}

export class HttpClientError extends Error {
  public message: string;
  public name = "HttpClientError";
  public status?: number;
  public response?: Response;
  public data?: unknown;
  constructor(
    message: string,
    status?: number,
    response?: Response,
    data?: unknown,
  ) {
    super(message);
    this.message = message;
    this.status = status;
    this.response = response;
    this.data = data;
  }
}

export class HttpClient {
  private baseUrl: string;
  private timeout: number;

  constructor(config: HttpCLientConfig = {}) {
    this.baseUrl = config.baseUrl || "";
    this.timeout = config.timeout || 30_000;
  }

  public async request<T>(
    path: string,
    config: HttpCLientConfig = {},
  ): Promise<T> {
    const { baseUrl, timeout, headers, ...restConfig } = config;
    const url = `${baseUrl ?? this.baseUrl}${path}`;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout ?? this.timeout);

    if (restConfig.signal) {
      restConfig.signal.addEventListener("abort", () => {
        controller.abort();
        clearTimeout(id);
      });
    }

    const finalHeaders = new Headers(headers);
    if (
      !(restConfig.body instanceof FormData) &&
      !finalHeaders.has("Content-Type")
    ) {
      finalHeaders.set("Content-Type", "application/json");
    }

    try {
      const respone = await fetch(url, {
        ...restConfig,
        headers: finalHeaders,
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!respone.ok) {
        let errorData: unknown;
        const contentTYpe = respone.headers.get("content-type");
        if (contentTYpe?.includes("application/json")) {
          errorData = await respone.json();
        } else {
          errorData = await respone.text();
        }
        throw new HttpClientError(
          respone.statusText,
          respone.status,
          respone,
          errorData,
        );
      }

      if (respone.status === 204) {
        return null as T;
      }

      return (await respone.json()) as T;
    } catch (error: unknown) {
      clearTimeout(id);
      let finalError: HttpClientError;
      if (error instanceof HttpClientError) {
        finalError = error;
      } else if (error instanceof Error && error.name === "AbortError") {
        finalError = new HttpClientError(
          "Request timed out or explicitly aborted",
          408,
        );
      } else {
        finalError = new HttpClientError(
          error instanceof Error ? error.message : "Unknown network error",
        );
      }
      throw finalError;
    }
  }

  public async get<T>(path: string, config?: HttpCLientConfig): Promise<T> {
    return this.request<T>(path, { ...config, method: "GET" });
  }

  public async post<T>(
    path: string,
    body?: unknown,
    config?: HttpCLientConfig,
  ): Promise<T> {
    return this.request<T>(path, {
      ...config,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  public async put<T>(
    path: string,
    body?: unknown,
    config?: HttpCLientConfig,
  ): Promise<T> {
    return this.request<T>(path, {
      ...config,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  public async delete<T>(path: string, config?: HttpCLientConfig): Promise<T> {
    return this.request<T>(path, { ...config, method: "DELETE" });
  }
}

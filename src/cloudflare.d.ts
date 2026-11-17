// The few Cloudflare runtime APIs the account area uses (D1, R2, cloudflare:workers).
// The full runtime types (`wrangler types` with runtime) redefine browser globals and
// break the client scripts' types, so only these are declared. Bindings themselves:
// worker-configuration.d.ts (`npm run types`).

declare namespace Cloudflare {
  interface Env {
    /** Comma-separated e-mails that become admins on first sign-in (.dev.vars / secret). */
    ADMIN_EMAILS?: string;
  }
}

declare module 'cloudflare:workers' {
  export const env: Cloudflare.Env;
}

interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  meta: Record<string, unknown>;
}
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(column?: string): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
}

interface R2HTTPMetadata {
  contentType?: string;
  contentDisposition?: string;
}
interface R2Object {
  key: string;
  size: number;
  httpMetadata?: R2HTTPMetadata;
  writeHttpMetadata(headers: Headers): void;
}
interface R2ObjectBody extends R2Object {
  body: ReadableStream;
}
interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
  put(key: string, value: ReadableStream | ArrayBuffer | string | Blob, options?: { httpMetadata?: R2HTTPMetadata }): Promise<R2Object>;
  delete(keys: string | string[]): Promise<void>;
}

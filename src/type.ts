export type AppContext<T = {}> = {
  doc: Document
  fetch: typeof window.fetch
} & T

export type Process<T = {}, S = {}> = (appCtx: AppContext<T>) => AppContext<S>

import { AppContext } from './type'

export type Entry =
  | string
  // | {
  //   styles?: string[],
  //   scripts?: string[],
  // };


export type FetchOpts = {
  fetch?: typeof fetch

  publicPath?: string

  type?: DOMParserSupportedType
}

const domParser = new DOMParser()


export async function loadAppCtx (entry: Entry, opts: FetchOpts): Promise<AppContext> {
  const appCtxFetch = opts.fetch ?? window.fetch

  const response = await appCtxFetch(entry)
  const htmlText = await response.text()

  const doc = domParser.parseFromString(htmlText, opts.type ?? 'text/html')

  return {
    doc,
    fetch: appCtxFetch,
  }
}






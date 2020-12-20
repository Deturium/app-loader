import { Process } from '../type'

type HtmlProcessCtx = {
}

type HtmlProcessOpts = {
  shadowDOM?: boolean
  modifyAST?: (doc: Document) => Document
}

export const htmlProcess: (opts: HtmlProcessOpts) => Process<{}, HtmlProcessCtx> =
  (opts) => (appCtx) => {

    let doc: Document = appCtx.doc

    if (opts.modifyAST) {
      doc = opts.modifyAST(appCtx.doc)
    }

    if (opts.shadowDOM) {
      const supportShadowDOM = !!(document.head.attachShadow || (document.head as any).createShadowRoot);

      if (supportShadowDOM) {
        const appElement = document.createElement('div');
        let shadow: ShadowRoot;

        if (appElement.attachShadow) {
          shadow = appElement.attachShadow({ mode: 'open' });
        } else {
          shadow = (appElement as any).createShadowRoot();
        }

        shadow.appendChild(doc.head)
        shadow.appendChild(doc.body)

        doc.appendChild(appElement)

      } else {
        console.warn('[app-loader] Current browser not support shadowDOM');
      }
    }

    return {
      ...appCtx,
      doc,
    }
  }

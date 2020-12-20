import { Process } from '../type'

type ScriptProcessCtx = {
  execScripts: () => Promise<void>
}

type ScriptProcessOpts = {
  proxy?: typeof window
  strictGlobal?: boolean
}


const scriptCache: Record<string, Promise<Response>> = {}


export const scriptProcess: (opts: ScriptProcessOpts) => Process<{}, ScriptProcessCtx> =
  (opts) => (appCtx) => {

    const scriptTextPromise = Array.from(document.scripts).map(async (script) => {
      if (script.src) {
        const scriptUrl = script.src
        if (scriptCache[scriptUrl]) {
          const res = await scriptCache[scriptUrl]
          return res.text()
        }

        const res = await appCtx.fetch(scriptUrl)

        if (res.status >= 400) {
          throw new Error(`${scriptUrl} load failed with status ${res.status}`);
        }

        return res.text()

      } else {
        return script.innerHTML
      }
    })

    const execScripts = async () => {
      const scriptTexts = await Promise.all(scriptTextPromise)

      scriptTexts.forEach(scriptText => {
        const globalWindow = (0, eval)('window');

        globalWindow.proxy = opts.proxy;
        return opts.strictGlobal
          ? `;(function(window, self){with(window){;${scriptText}}}).bind(window.proxy)(window.proxy, window.proxy);`
          : `;(function(window, self){;${scriptText}).bind(window.proxy)(window.proxy, window.proxy);`;
      });
    }

    return {
      ...appCtx,
      execScripts,
    }
  }

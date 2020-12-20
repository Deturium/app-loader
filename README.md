# app-loader

微应用加载器

# Usage


```js
import { loadAppCtx } from 'app-loader'

const appCtx = await loadAppCtx('http://entry.example.com')

document.appendChild(appCtx.doc)
```



```js
import R from 'ramda'
import { loadAppCtx, htmlProcess, scriptProcess, styleProcess } from 'app-loader'


const loadApp = R.pipe(
  loadAppCtx, 
  
  htmlProcess({
    shadowDOM: true,
    modifyAST(doc) {
      doc.body.appendChild(doc.createElement('footer'))
    },
  }), 

  scriptProcess({
    beforeExec(script) {
      console.log(`${script} will exec`)
    },
    beforeExec(script) {
      console.log(`${script} did exec`)
    },
  }),

  styleProcess({
    inline: true,
    scoped: true,
  }) 
)


const appCtx = await loadApp('http://entry.example.com')

document.appendChild(appCtx.doc)

appCtx.execScript({
  global: {
    window: window,
  },
})
```

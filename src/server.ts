import ChildProcess from 'node:child_process'
import os from 'node:os'

export function configureServer(server: any) {
  server.middlewares.use((req: any, _: any, next: any) => {
    if (req._parsedUrl.pathname === '/code-position') {
      const path
            = req._parsedUrl.query && req._parsedUrl.query.split('=')[1]
      if (path && path !== 'null') {
        if (process.env.VITE_EDITOR === 'webstorm') {
          const linePath = path.split(':')[1]
          const filePath = path.split(':')[0]
          const platform = getOs()
          if (platform === 'win32') {
            ChildProcess.exec(
                  `webstorm64.exe  --line ${linePath} ${filePath}`,
            )
          }
          else {
            ChildProcess.exec(
                  `webstorm64  --line ${linePath} ${filePath}`,
            )
          }
        }
        else {
          ChildProcess.exec(`code -r -g ${path}`)
        }
      }
    }
    next()
  })
}

function getOs() {
  const platform = os.platform()
  return platform
}

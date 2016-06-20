const path = require('path')
const spawn = require('cross-spawn')
const httpServer = require('http-server')
const server = httpServer.createServer({
  root: path.resolve(__dirname, '../../../')
})

server.listen(8080)

let args = process.argv.slice(2)
if (args.indexOf('--config') === -1) {
  args = args.concat(['--config', 'build/nightwatch.config.js'])
}
if (args.indexOf('--env') === -1) {
  args = args.concat(['--env', 'chrome,phantomjs'])
}
const i = args.indexOf('--test')
if (i > -1) {
  args[i + 1] = 'html5/test/e2e/specs/' + args[i + 1]
}

const runner = spawn('nightwatch', args, {
  stdio: 'inherit'
})

runner.on('exit', function (code) {
  server.close()
  process.exit(code)
})

runner.on('error', function (err) {
  server.close()
  throw err
})

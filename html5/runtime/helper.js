// Document
export { Document } from '../vdom'

// callNative
export function sendTasks (...args) {
  global.callNative(args)
}

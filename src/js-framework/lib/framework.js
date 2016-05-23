/**
 * @fileOverview Main entry, instance manager
 *
 * - createInstance(instanceId, code, options, data)
 * - refreshInstance(instanceId, data)
 * - destroyInstance(instanceId)
 * - registerComponents(components)
 * - registerModules(modules)
 * - getRoot(instanceId)
 * - instanceMap
 * - callJS(instanceId, tasks)
 *   - fireEvent(ref, type, data)
 *   - callback(funcId, data)
 */

import * as config from './config'
import AppInstance from './app'
import Vm from './vm'
import VueFramework from 'vue/dist/weex.common.js'

const versionRegExp = /^\/\/ *(\{[^\}]*\}) *\r?\n/

function checkVersion (code) {
  let info
  const result = versionRegExp.exec(code)
  if (result) {
    try {
      info = JSON.parse(result[1])
    } catch (e) {}
  }
  return info
}

const {
  nativeComponentMap
} = config
const instanceMap = {}

/**
 * create a Weex instance
 *
 * @param  {string} instanceId
 * @param  {string} code
 * @param  {object} [options] option `HAS_LOG` enable print log
 * @param  {object} [data]
 */
export function createInstance(instanceId, code, options, data) {
  const instance = instanceMap[instanceId]
  options = options || {}
  config.debug = options.debug
  if (!instance) {
    const info = checkVersion(code)
    if (info && info.framework === 'Vue') {
      instanceMap[instanceId] = 'Vue'
      return VueFramework.createInstance(instanceId, code, options, data)
    }
    const newInstance = new AppInstance(instanceId, options)
    instanceMap[instanceId] = newInstance
    return newInstance.init(code, data)
  }
  return new Error(`invalid instance id "${instanceId}"`)
}

/**
 * refresh a Weex instance
 *
 * @param  {string} instanceId
 * @param  {object} data
 */
export function refreshInstance(instanceId, data) {
  const instance = instanceMap[instanceId]
  if (instance) {
    if (instance === 'Vue') {
      return VueFramework.refreshInstance(instanceId, data)
    }
    return instance.refreshData(data)
  }
  return new Error(`invalid instance id "${instanceId}"`)
}

/**
 * destroy a Weex instance
 * @param  {string} instanceId
 */
export function destroyInstance(instanceId) {
  const instance = instanceMap[instanceId]
  if (!instance) {
    return new Error(`invalid instance id "${instanceId}"`)
  }
  if (instance === 'Vue') {
    VueFramework.destroyInstance(instanceId)
    delete instanceMap[instanceId]
    return
  }
  instance.destroy()
  delete instanceMap[instanceId]
  return instanceMap
}

/**
 * register the name of each native component
 * @param  {array} components array of name
 */
export function registerComponents(components) {
  VueFramework.registerComponents(components)
  if (Array.isArray(components)) {
    components.forEach(function register(name) {
      /* istanbul ignore if */
      if (!name) {
        return
      }
      if (typeof name === 'string') {
        nativeComponentMap[name] = true
      } else if (typeof name === 'object' && typeof name.type === 'string') {
        nativeComponentMap[name.type] = name
      }
    })
  }
}

/**
 * register the name and methods of each module
 * @param  {object} modules a object of modules
 */
export function registerModules(modules) {
  VueFramework.registerModules(modules)
  if (typeof modules === 'object') {
    Vm.registerModules(modules)
  }
}

/**
 * register the name and methods of each api
 * @param  {object} apis a object of apis
 */
export function registerMethods(apis) {
  if (typeof apis === 'object') {
    Vm.registerMethods(apis)
  }
}

/**
 * get a whole element tree of an instance
 * for debugging
 * @param  {string} instanceId
 * @return {object} a virtual dom tree
 */
export function getRoot(instanceId) {
  const instance = instanceMap[instanceId]
  if (instance) {
    if (instance === 'Vue') {
      return VueFramework.getRoot(instanceId)
    }
    return instance.getRootElement()
  }
  return new Error(`invalid instance id "${instanceId}"`)
}

const jsHandlers = {
  fireEvent: function fireEvent(instanceId, ref, type, data) {
    const instance = instanceMap[instanceId]
    return instance.fireEvent(ref, type, data)
  },

  callback: function callback(instanceId, funcId, data, ifLast) {
    const instance = instanceMap[instanceId]
    return instance.callback(funcId, data, ifLast)
  }
}

/**
 * accept calls from native (event or callback)
 *
 * @param  {string} instanceId
 * @param  {array} tasks list with `method` and `args`
 */
export function callJS(instanceId, tasks) {
  const instance = instanceMap[instanceId]
  const results = []
  if (instance && Array.isArray(tasks)) {
    if (instance === 'Vue') {
      return VueFramework.callJS(instanceId, tasks)
    }
    tasks.forEach((task) => {
      const handler = jsHandlers[task.method]
      const args = [...task.args]
      if (typeof handler === 'function') {
        args.unshift(instanceId)
        results.push(handler(...args))
      }
    })
    return results
  }
  return [new Error(`invalid instance id "${instanceId}" or tasks`)]
}

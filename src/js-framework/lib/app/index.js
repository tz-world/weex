/**
 * @fileOverview
 * Weex instance constructor & definition
 */

import {extend, typof} from '../util'
import * as bundle from './bundle'
import * as ctrl from './ctrl'
import Differ from './differ'

import {Document, Node} from '../dom'
import {registerComponent, requireComponent, requireModule} from './register'

export default function AppInstance(instanceId, options) {
  this.id = instanceId
  this.options = options || {}
  this.vm = null
  this.customComponentMap = {}
  this.callbacks = {}
  this.doc = new Document(
    instanceId,
    this.options.bundleUrl
  )
  this.differ = new Differ(instanceId)
  this.uid = 0
}

function normalize(app, v) {
  var type = typof(v)

  switch (type) {
    case 'undefined':
    case 'null':
      return ''
    case 'regexp':
      return v.toString()
    case 'date':
      return v.toISOString()
    case 'number':
    case 'string':
    case 'boolean':
    case 'array':
    case 'object':
      if (v instanceof Node) {
        return v.ref
      }
      return v
    case 'function':
      app.callbacks[++app.uid] = v
      return app.uid.toString()
    default:
      return JSON.stringify(v)
  }
}

AppInstance.prototype.callTasks = function (tasks) {
  if (typof(tasks) !== 'array') {
    tasks = [tasks]
  }

  tasks.forEach((task) => {
    task.args = task.args.map(arg => normalize(this, arg))
  })

  callNative(this.id, tasks, '-1')
}

extend(AppInstance.prototype, bundle, ctrl, {
  registerComponent,
  requireComponent,
  requireModule
})


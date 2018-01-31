//
// This file is part of usn-lib.
// 
// It is subject to the terms and conditions defined in
// file 'LICENSE.', which is part of this source code package.
//
// @author Simon Jentzsch 
// @version 0.9
// @copyright 2017 by Slock.it GmbH
//

/**
 * simply helper for copying properties into objects.
 */
import * as _ from 'underscore'

/**
 * copies values from the src-object to dst.
 * 
 * @export
 * @template T 
 * @param {*} src 
 * @param {T} dst 
 * @param {boolean} [alwaysClone=false] 
 * @returns {T} 
 */
export function copy<T>(src: any, dst: T, alwaysClone: boolean = false, transform?: (path, dst: any) => any, path = ''): T {
  if (!_.isObject(src))
    return src as T
  else if (_.isArray(src)) {
    if (_.isArray(dst)) {
      src.forEach((v, i) => dst[i] = copy(v, _.isObject(dst[i]) ? dst[i] : null, alwaysClone, transform, path + '[' + i + ']'))
      return dst
    }
    else
      return alwaysClone ? src.map((e, i) => copy(e, null, alwaysClone, transform, path + '[' + i + ']')) : <any>src
  }
  if (dst === undefined || dst == null)
    return alwaysClone ? copy(src, {}, alwaysClone, transform, path) : <any>src

  Object.keys(src).forEach(p => dst[p] = copy(src[p], dst[p], alwaysClone, transform, path ? path + '.' + p : p))

  return transform ? transform(path, dst) : dst
}

/**
 * returns true if all memebers of this array fullfil the condtion.
 * 
 * @export
 * @template T 
 * @param {T[]} array 
 * @param {(val: T) => boolean} cond 
 * @returns {boolean} 
 */
export function all<T>(array: T[], cond: (val: T) => boolean): boolean {
  return array.filter(cond).length === array.length
}

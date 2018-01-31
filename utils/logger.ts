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
 * 
 * 
 * simple Logger
 * @export
 * @interface Logger
 */
export interface Logger {
  log(level: string, message: string, ...args: any[]): void
}

/**
 * exports to console.
 */
export class SimpleConsoleLogger implements Logger {
  log(level: string, message: string, ...args: any[]): void {
    // tslint:disable-next-line:no-console
    console.log(level, message, args.map(_ => JSON.stringify(_, null, 2)).join('\n'))
  }

}

/**
 * config for setting the current logger
 */
export const config = {
  logger: <Logger>new SimpleConsoleLogger()
}

/**
 * 
 * simple log-function.
 * @export
 * @param {string} level 
 * @param {string} message 
 * @param {...any[]} args 
 */
export function log(level: string, message: string, ...args: any[]): void {
  if (config.logger) config.logger.log.apply(config.logger, arguments)
}

/**
 * 
 * log with level info.
 * @export
 * @param {string} message 
 * @param {...any[]} args 
 */
export function info(message: string, ...args: any[]): void {
  if (config.logger) config.logger.log.apply(config.logger, ['info', message, ...args])
}

/**
 * 
 * log with level debug.
 * @export
 * @param {string} message 
 * @param {...any[]} args 
 */
export function debug(message: string, ...args: any[]): void {
  if (config.logger) config.logger.log.apply(config.logger, ['debug', message, ...args])
}

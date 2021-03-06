'use strict'

/**
 * Takes an (async) iterable that emits things and returns an async iterable that
 * emits those things in fixed-sized batches.
 *
 * @template T
 * @param {AsyncIterable<T>|Iterable<T>} source
 * @param {number|string} [size=1]
 * @returns {AsyncIterable<T[]>}
 */
async function * batch (source, size) {
  // @ts-ignore - parseInt expects string
  size = parseInt(size)

  if (isNaN(size) || size < 1) {
    size = 1
  }

  /** @type {T[]} */
  let things = []

  for await (const thing of source) {
    things.push(thing)

    while (things.length >= size) {
      yield things.slice(0, size)

      things = things.slice(size)
    }
  }

  while (things.length) {
    yield things.slice(0, size)

    things = things.slice(size)
  }
}

module.exports = batch

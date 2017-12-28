import Signal from '../signal'

/**
 * This module defines fold combinators for signals.
 *
 * @private
 * @module bulb/combinator/fold
 * @author Josh Bassett
 */

/**
 * Folds the binary function `f` over the signal `s` with the starting value
 * `a`. The final value is emitted when the signal completes.
 *
 * @param f A binary function.
 * @param a A starting value.
 * @param a A signal.
 * @returns A new signal.
 */
export function fold (f, a, s) {
  return new Signal(emit => {
    // Fold the next value with the previous value.
    const next = b => { a = f(a, b) }

    const complete = () => {
      // Emit the final value.
      emit.next(a)
      emit.complete()
    }

    return s.subscribe({...emit, next, complete})
  })
}

/**
 * Scans the binary function `f` over the signal `s` with the starting value
 * `a`. Unlike the `fold` function, the signal values are emitted
 * incrementally.
 *
 * @param f A binary function.
 * @param a A starting value.
 * @param a A signal.
 * @returns A new signal.
 */
export function scan (f, a, s) {
  return new Signal(emit => {
    // Emit the starting value.
    emit.next(a)

    // Fold the current value with the previous value and emit the next value
    const next = b => {
      a = f(a, b)
      emit.next(a)
    }

    return s.subscribe({...emit, next})
  })
}

/**
 * Folds the transform function `f` over the signal `s` with the starting value
 * `a`.
 *
 * The transform function `f` should return the new state. It can also
 * optionally emit values or errors using the `emit` argument.
 *
 * @example
 *
 * stateMachine((a, b, emit) => {
 *   emit.next(a * b)
 *   return a + b
 * }, 0, s)
 *
 * @param f A ternary function.
 * @param a A starting value.
 * @param a A signal.
 * @returns A new signal.
 */
export function stateMachine (f, a, s) {
  return new Signal(emit => {
    const next = b => {
      // Fold the next value with the previous value.
      a = f(a, b, emit)
    }

    return s.subscribe({...emit, next})
  })
}

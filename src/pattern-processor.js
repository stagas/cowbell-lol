const { modWrap } = require('everyday-utils')

const g = globalThis

if (!g.didSetup) {
  Array.prototype.get = function (x) {
    return this[modWrap(x, this.length) | 0] + ((x / this.length) | 0) * 12
  }

  // adapted from https://github.com/hdavid/Launchpad95
  g.scales = {
    'major': [0, 2, 4, 5, 7, 9, 11],
    'minor': [0, 2, 3, 5, 7, 8, 10],
    'ionian': [0, 2, 4, 5, 7, 9, 11],
    'aeolian': [0, 2, 3, 5, 7, 8, 10],
    'dorian': [0, 2, 3, 5, 7, 9, 10],
    'mixolydian': [0, 2, 4, 5, 7, 9, 10],
    'lydian': [0, 2, 4, 6, 7, 9, 11],
    'phrygian': [0, 1, 3, 5, 7, 8, 10],
    'locrian': [0, 1, 3, 5, 6, 8, 10],
    'diminished': [0, 1, 3, 4, 6, 7, 9, 10],
    'whole half': [0, 2, 3, 5, 6, 8, 9, 11],
    'whole tone': [0, 2, 4, 6, 8, 10],
    'minor blues': [0, 3, 5, 6, 7, 10],
    'minor pentatonic': [0, 3, 5, 7, 10],
    'major pentatonic': [0, 2, 4, 7, 9],
    'harmonic minor': [0, 2, 3, 5, 7, 8, 11],
    'melodic minor': [0, 2, 3, 5, 7, 9, 11],
    'super locrian': [0, 1, 3, 4, 6, 8, 10],
    'bhairav': [0, 1, 4, 5, 7, 8, 11],
    'hungarian minor': [0, 2, 3, 6, 7, 8, 11],
    'minor gypsy': [0, 1, 4, 5, 7, 8, 10],
    'hirojoshi': [0, 2, 3, 7, 8],
    'in sen': [0, 1, 5, 7, 10],
    'iwato': [0, 1, 5, 6, 10],
    'kumoi': [0, 2, 3, 7, 9],
    'pelog': [0, 1, 3, 4, 7, 8],
    'spanish': [0, 1, 3, 4, 5, 6, 8, 10],
    'ion aeol': [0, 2, 3, 4, 5, 7, 8, 9, 10, 11]
  }

  g.scales.minor.pentatonic = g.scales['minor pentatonic']
  g.scales.minor.blues = g.scales['minor blues']
  g.scales.minor.gypsy = g.scales['minor gypsy']
  g.scales.minor.harmonic = g.scales['harmonic minor']
  g.scales.minor.melodic = g.scales['melodic minor']
  g.scales.minor.hungarian = g.scales['hungarian minor']
  g.scales.major.pentatonic = g.scales['major pentatonic']
  g.scales.whole = {
    tone: g.scales['whole tone'],
    half: g.scales['whole half'],
  }
  g.scales.locrian.super = g.scales['super locrian']
  g.scales.insen = g.scales['in sen']
  g.scales.ionian.aeolian = g.scales['ion aeol']
  g.scales.aeolian.ionian = g.scales['ion aeol']

  // alias
  g.scale = g.scales

  /**
   * https://github.com/mkontogiannis/euclidean-rhythms/blob/474ed90a04068b7692fd7f7ff7525aacf853124d/src/index.ts
   *  Returns the calculated pattern of equally distributed pulses in total steps
   *  based on the euclidean rhythms algorithm described by Godfried Toussaint
   *
   *  @method  getPattern
   *  @param {Number} pulses Number of pulses in the pattern
   *  @param {Number} steps  Number of steps in the pattern (pattern length)
   */
  const getEuclideanPattern = (pulses, steps) => {
    if (pulses < 0 || steps < 0 || steps < pulses) {
      return [];
    }

    // Create the two arrays
    let first = new Array(pulses).fill([1]);
    let second = new Array(steps - pulses).fill([0]);

    let firstLength = first.length;
    let minLength = Math.min(firstLength, second.length);

    let loopThreshold = 0;
    // Loop until at least one array has length gt 2 (1 for first loop)
    while (minLength > loopThreshold) {
      // Allow only loopThreshold to be zero on the first loop
      if (loopThreshold === 0) {
        loopThreshold = 1;
      }

      // For the minimum array loop and concat
      for (let x = 0; x < minLength; x++) {
        first[x] = [...first[x], ...second[x]];
      }

      // if the second was the bigger array, slice the remaining elements/arrays and update
      if (minLength === firstLength) {
        second = second.slice(minLength);
      }
      // Otherwise update the second (smallest array) with the remainders of the first
      // and update the first array to include only the extended sub-arrays
      else {
        second = first.slice(minLength);
        first = first.slice(0, minLength);
      }
      firstLength = first.length;
      minLength = Math.min(firstLength, second.length);
    }

    // Build the final array
    const pattern = [...first.flat(), ...second.flat()];

    return pattern;
  }

  g.events = []
  g.bars = 1

  g.start = 0
  g.end = 1

  g.on = (measure, fn) => {
    const result = []
    let count = 0
    g.end = g.start + g.bars
    let i = 0
    for (let x = g.start; (x < g.end) && (++count < g.maxNotes); x += measure) {
      const events = fn(x, x + measure, i++)
      if (!events) continue
      if (Array.isArray(events[0])) {
        result.push(...events)
      } else {
        result.push(events)
      }
    }
    g.events.push(...result)
    return result
  }

  g.delay = (measure, decay, fn) => {
    let lastNote
    let lastX
    let offset
    return (start, end, z) => {
      const result = []
      let count = 0

      let note = fn(start, end, z)
      if (!note) {
        if (!lastNote) return
        note = lastNote
        if (lastX >= end) return
        start = lastX
      }
      else {
        offset = note[0] - start
      }

      let x
      for (x = start; (x < end) && (++count < g.maxNotes); x += measure) {
        note = [...note]
        note[0] = x + offset
        result.push(note)
        note = [...note]
        note[2] *= decay
        lastNote = note
      }
      lastX = x

      return result
    }
  }

  g.euc = (measure, pulses, fn) => {
    const result = []
    let count = 0
    g.end = g.bars

    const pattern = getEuclideanPattern(pulses, Math.floor((g.end - g.start) / measure) / g.bars)

    let i = 0;
    for (let x = g.start; (x < g.end) && (++count < g.maxNotes); x += measure) {
      const events = fn(x, x + measure, pattern[i % pattern.length])
      i++
      if (!events) continue
      if (Array.isArray(events[0])) {
        result.push(...events)
      } else {
        result.push(events)
      }
    }
    g.events.push(...result)
    return result
  }

  g.i = 0
  g.seed = 42
  g.maxNotes = 512

  g.rnd = (amt = 1) => {
    let t = g.seed += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return (((t ^ t >>> 14) >>> 0) / 4294967296) * amt
  }

  g.rand = g.rnd

  g.slice = (events, a, b) => [...events].filter(
    x => x[0] >= a && x[0] < b
  )

  g.shift = (events, n) => [...events].map(
    x => [
      x[0] + n,
      ...x.slice(1)
    ]
  )

  g.transpose = (events, n) => [...events].map(
    x => [
      x[0],
      x[1] + n,
      ...x.slice(2)
    ]
  )

  g.didSetup = true
}

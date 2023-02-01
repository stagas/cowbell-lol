const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
export const hasOffscreenCanvas = isFirefox ? false : typeof OffscreenCanvas !== 'undefined'

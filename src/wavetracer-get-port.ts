const worker = new Worker(
  // @ts-ignore
  new URL('./wavetracer-worker.js', import.meta.url),
  {
    type: 'module',
  }
)

export const getWavetracerPort = () => {
  return worker
}

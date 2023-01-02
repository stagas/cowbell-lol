/** @jsxImportSource minimal-view */

import { Rect } from 'geometrik'

export const Stretchy = (
  { key, width, height, padding = 0, children }: {
    key?: string | number | object | symbol
    width: number
    height: number
    padding?: number
    children?: JSX.Element
  },
): JSX.Element => (
  <svg
    // width={width + padding * 2}
    // height={height + padding * 2}
    viewBox={new Rect(0, 0, width, height).zoomLinear(padding).toString()}
    preserveAspectRatio="xMidYMid meet"
  >
    <foreignObject x="0" y="0" width={width} height={height}>
      <div
        style={{
          width: width + 'px',
          height: height + 'px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </foreignObject>
  </svg>
)

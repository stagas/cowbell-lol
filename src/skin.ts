import { luminate, saturate } from 'everyday-utils'
import { Knob } from 'x-knob'
import { KnobView } from './knob-view'
import { PlayerView } from './player-view'

/* font-family: 'ABeeZee', sans-serif; */
/* font-family: 'Albert Sans', sans-serif; */
/* font-family: 'Baloo 2', cursive; */
/* font-family: 'Baloo Thambi 2', cursive; */
/* font-family: 'Barlow Semi Condensed', sans-serif; */
/* font-family: 'Baumans', cursive; */
/* font-family: 'Be Vietnam Pro', sans-serif; */
/* font-family: 'DM Mono', monospace; */
/* font-family: 'Gantari', sans-serif; */
/* font-family: 'Geo', sans-serif; */
/* font-family: 'JetBrains Mono', monospace; */
/* font-family: 'Jost', sans-serif; */
/* font-family: 'Questrial', sans-serif; */
/* font-family: 'Share', cursive; */
/* font-family: 'Silkscreen', cursive; */
/* font-family: 'Teko', sans-serif; */

const colors = {
  name: 'default',
  black: '#1d1929',
  red: '#FF3333',
  green: '#BAE67E',
  yellow: '#cc8822',
  blue: '#73D0FF',
  purple: '#8074b0',
  cyan: '#95E6CB',
  white: '#dacafa',
  brightBlack: '#707A8C',
  brightRed: '#FF3333',
  brightGreen: '#77ff44',
  brightYellow: '#cc8822',
  brightBlue: '#3366ff',
  brightPurple: '#bb77ff',
  brightCyan: '#5599ff',
  brightWhite: '',
  foreground: '',
  background: '',
  cursorColor: '#FFCC66',
}

colors.brightWhite = colors.white
colors.foreground = colors.brightWhite
colors.background = colors.black

const sat = 0.075
const bri = 0.0175
const lum = 1.25
const ilum = 0.95

export type Colors = typeof colors

export const getSkin = (colors: Colors) => ({
  fonts: {
    logo: '"Baumans", cursive',
    sans: '"Jost", sans-serif',
    slab: '"Geo", monospace',
    mono: '"JetBrains Mono", monospace',
    cond: '"Barlow Semi Condensed", sans-serif',
  },

  css: /*css*/`
    .i {
    font-family: icon !important;
    font-size: 1em;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
&.clarity-arrow-line:before {
content: "\\e001";
}

&.clarity-close-line:before {
content: "\\e002";
}

&.clarity-link-line:before {
content: "\\e003";
}

&.clarity-plus-line:before {
content: "\\e004";
}

&.clarity-trash-line:before {
content: "\\e005";
}

&.fluent-padding-down-24-regular:before {
content: "\\e006";
}

&.fluent-padding-right-24-regular:before {
content: "\\e007";
}

&.la-backward:before {
content: "\\e008";
}

&.la-check:before {
content: "\\e009";
}

&.la-copy:before {
content: "\\e00a";
}

&.la-forward:before {
content: "\\e00b";
}

&.la-github:before {
content: "\\e00c";
}

&.la-heart:before {
content: "\\e00d";
}

&.la-heart-solid:before {
content: "\\e00e";
}

&.la-list:before {
content: "\\e00f";
}

&.la-pause:before {
content: "\\e010";
}

&.la-play:before {
content: "\\e011";
}

&.la-redo-alt:before {
content: "\\e012";
}

&.la-save:before {
content: "\\e013";
}

&.la-share:before {
content: "\\e014";
}

&.la-sistrix:before {
content: "\\e015";
}

&.la-stop:before {
content: "\\e016";
}

&.mdi-light-chevron-down:before {
content: "\\e017";
}

&.mdi-light-chevron-left:before {
content: "\\e018";
}

&.mdi-light-chevron-right:before {
content: "\\e019";
}

&.mdi-light-chevron-up:before {
content: "\\e01a";
}

&.mdi-light-repeat:before {
content: "\\e01b";
}

&.mdi-light-repeat-once:before {
content: "\\e01c";
}

&.ph-upload-simple-duotone:before {
content: "\\e01d";
}

  }
  `,

  colors: {
    ...colors,

    cursor: colors.cursorColor,

    fg: colors.foreground,
    fgLight: luminate(saturate(colors.foreground, -0.45 + sat), (0.05 + bri) * lum),
    fgPale: luminate(saturate(colors.foreground, -0.6 + sat), (-0.4 + bri) * ilum),

    bg: colors.background,
    bgPale: luminate(saturate(colors.background, 0.15 + sat), (0.18 + bri) * lum),
    bgPaleLight: luminate(saturate(colors.background, 0.15 + sat), (0.3 + bri) * lum),
    bgLight: luminate(saturate(colors.background, 0.05 + sat), (.025 + bri) * lum),
    bgLighter: luminate(saturate(colors.background, 0.1 + sat), (.082 + bri) * lum),
    bgDark: luminate(colors.background, (-0.005 + bri) * lum),
    bgDarky: luminate(saturate(colors.background, -0.015 + sat), (-0.022 + bri) * ilum),
    bgDarker: luminate(saturate(colors.background, 0.02 + sat), (-0.045 + bri) * ilum),

    shadeBright: `${luminate(saturate(colors.background, 1), (0.71 + bri) * lum)}55`,
    shadeBrighter: `${luminate(saturate(colors.foreground, .10 + sat), (-0.04 + bri) * ilum)}ee`,
    shadeSoft: `${luminate(saturate(colors.background, 0.131 + sat), (0.266 + bri) * lum)}62`,
    shadeSofter: `${luminate(saturate(colors.background, 0.1 + sat), (0.3 + bri) * lum)}25`,
    shadeSoftest: `${luminate(saturate(colors.background, 0 + sat), (0.05 + bri) * lum)}55`,
    shadeDark: `${luminate(saturate(colors.background, -0.015 + sat), (-0.07 + bri) * ilum)}88`,
    shadeDarker: `${luminate(saturate(colors.background, 0.1 + sat), (-0.08 + bri) * ilum)}88`,
    shadeBlack: `${luminate(saturate(colors.background, 0.45 + sat), (-0.225 + bri) * ilum)}88`,
    shadeBlackHalf: `${luminate(saturate(colors.background, 0.25 + sat), (-0.28 + bri) * lum)}77`,
  },

  styles: {
    raised: '',
    lowered: '',
    deep: '',
  }
})

export const skin = getSkin(colors)

skin.styles = {
  raised: /*css*/`
    box-shadow:
      inset 2px 2px 1px -1.7px ${skin.colors.shadeBright}
      ,inset -2px -2px 4px -1px ${skin.colors.shadeBlack}
      ;
  `,
  lowered: /*css*/`
    box-shadow:
      inset -2px -2px 1px -1.7px ${skin.colors.shadeBright}
      ,inset 2px 2px 4px -1px ${skin.colors.shadeBlack}
      ;

  `,
  deep: /*css*/`
    box-shadow:
      inset -2px -2px 5px 0px ${skin.colors.shadeBlack}
      ,inset 2px 2px 5px 0px ${skin.colors.shadeBlack}
      ;

  `,
}

skin.css += /*css*/`
a {
  all: unset;
}

${Knob} {
  box-sizing: border-box;
  max-width: 40px;
  max-height: 40px;
  position: relative;
  top: .5px;

  --white: ${skin.colors.bgPale};
  --grey: ${skin.colors.fg};
  --dark: ${skin.colors.bgPale};
  --black: ${skin.colors.shadeBlack};

  &::part(line),
  &::part(fill-value) {
    stroke: ${skin.colors.fg};
  }
}

.wrapper {
  position: relative;
  display: flex;
  flex: 1;
  > * {
    flex: 1;
  }
}

.hidden {
  position: fixed:
  opacity: 0 !important;
  z-index: -9999;
  overflow: hidden;
  pointer-events: none;
}

.none {
  display: none !important;
}

.transparent {
  opacity: 0 !important;
  pointer-events: none;
}

.raised {
  ${skin.styles.raised}
}

.lowered {
  ${skin.styles.lowered}
}

.player-view {
  max-width: 100%;
  overflow: hidden;
}

.controls {
  z-index: 4;
  display: flex;
  flex-flow: row nowrap;
  gap: 10.5px;
  align-items: center;
  justify-content: center;

  ${KnobView} {
    position: relative;
    top: 2.1px;
  }

  &-secondary {
    z-index: 5;
  }
}

${PlayerView} {
  &::part(controls) {
    background: ${skin.colors.bgLighter};
    padding: 0 15px;
    min-width: 88.5px;
    gap: 8.5px;
  }
}

[part=app-selected] {
  position: relative;
  height: 290px;
  background: ${skin.colors.bgDarky};

  &:before {
    content: ' ';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: calc(100% + 1px);
    z-index: 999;
    pointer-events: none;
    ${skin.styles.deep}
  }

  &:focus-within {
  }

  &[state=errored] {
    /* &:focus-within {
      &::before {
        box-shadow: inset 0 0 0 8px #f21;
      }
    } */
  }
}

.track {
  &-toolbar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: space-between;
    padding: 11px 8px;
    box-sizing: border-box;

    &-controls {
      display: flex;
      flex-flow: row wrap;
      gap: 9px;
    }
  }
}

.trackviews {
  display: flex;
  width: 100%;
  height: 100%;
  flex: 1;
  overflow: hidden;
}

.centered {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.column {
  flex-flow: column nowrap;
}
`

export type Skin = typeof skin

// console.log(JSON.stringify(skin.colors, null, 2))

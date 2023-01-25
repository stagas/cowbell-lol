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

export type Colors = typeof colors

export const getSkin = (colors: Colors) => ({
  fonts: {
    logo: "'Baumans', cursive",
    sans: "'Jost', sans-serif",
    slab: "'Geo', sans-serif",
    mono: "'JetBrains Mono', monospace",
    cond: "'Barlow Semi Condensed', sans-serif",
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

&.clarity-trash-line:before {
content: "\\e004";
}

&.fluent-padding-down-24-regular:before {
content: "\\e005";
}

&.fluent-padding-right-24-regular:before {
content: "\\e006";
}

&.la-backward:before {
content: "\\e007";
}

&.la-check:before {
content: "\\e008";
}

&.la-forward:before {
content: "\\e009";
}

&.la-github:before {
content: "\\e00a";
}

&.la-heart:before {
content: "\\e00b";
}

&.la-heart-solid:before {
content: "\\e00c";
}

&.la-list:before {
content: "\\e00d";
}

&.la-pause:before {
content: "\\e00e";
}

&.la-play:before {
content: "\\e00f";
}

&.la-save:before {
content: "\\e010";
}

&.la-share:before {
content: "\\e011";
}

&.la-sistrix:before {
content: "\\e012";
}

&.la-stop:before {
content: "\\e013";
}

&.mdi-light-chevron-down:before {
content: "\\e014";
}

&.mdi-light-chevron-left:before {
content: "\\e015";
}

&.mdi-light-chevron-right:before {
content: "\\e016";
}

&.mdi-light-chevron-up:before {
content: "\\e017";
}

&.mdi-light-repeat:before {
content: "\\e018";
}

&.mdi-light-repeat-once:before {
content: "\\e019";
}

&.ph-upload-simple-duotone:before {
content: "\\e01a";
}

  }
  `,

  colors: {
    ...colors,

    cursor: colors.cursorColor,

    fg: colors.foreground,
    fgLight: luminate(saturate(colors.foreground, -0.45), 0.05),
    fgPale: luminate(saturate(colors.foreground, -0.6), -0.4),

    bg: colors.background,
    bgPale: luminate(saturate(colors.background, 0.15), 0.18),
    bgPaleLight: luminate(saturate(colors.background, 0.15), 0.3),
    bgLight: luminate(saturate(colors.background, 0.05), .025),
    bgLighter: luminate(saturate(colors.background, 0.1), .082),
    bgDark: luminate(colors.background, -0.005),
    bgDarky: luminate(saturate(colors.background, -0.015), -0.022),
    bgDarker: luminate(saturate(colors.background, 0.02), -0.045),

    shadeBright: `${luminate(saturate(colors.background, 1), 0.71)}55`,
    shadeBrighter: `${luminate(saturate(colors.foreground, .10), -0.04)}ee`,
    shadeSoft: `${luminate(saturate(colors.background, 0.12), 0.35)}55`,
    shadeSofter: `${luminate(saturate(colors.background, 0.1), 0.3)}25`,
    shadeSoftest: `${luminate(saturate(colors.background, 0), 0.05)}55`,
    shadeDark: `${luminate(saturate(colors.background, -0.015), -0.07)}88`,
    shadeDarker: `${luminate(saturate(colors.background, 0.1), -0.08)}88`,
    shadeBlack: `${luminate(saturate(colors.background, 0.45), -0.225)}88`,
    shadeBlackHalf: `${luminate(saturate(colors.background, 0.25), -0.28)}77`,
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
${Knob} {
  box-sizing: border-box;
  /* padding: 0px 3.5px; */
  max-width: 40px;
  max-height: 40px;
  position: relative;
  top: .5px;
  /* transform: rotate(-45deg); */

  --white: ${skin.colors.bgPale};
  --grey: ${skin.colors.fg};
  --dark: ${skin.colors.bgPale};
  --black: ${skin.colors.shadeBlack};

  &::part(line),
  &::part(fill-value) {
    stroke: ${skin.colors.fg};
    /* display: none; */
  }
  /* display: inline-block; */
  /* min-width: 20px; */
  /* flex: 1; */
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
  width: 0;
  height: 0;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
}

.none {
  display: none;
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
  /* min-width: 126px; */
  z-index: 4;
  display: flex;
  flex-flow: row nowrap;
  gap: 10.5px;
  align-items: center;
  justify-content: center;

  ${KnobView} {
    position: relative;
    top: 1.05px;
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
`

export type Skin = typeof skin

// console.log(JSON.stringify(skin.colors, null, 2))

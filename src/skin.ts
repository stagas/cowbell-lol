import { luminate, saturate } from 'everyday-utils'
import { Knob } from 'x-knob'

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
    slab: "'Geo', sans-serif"
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

&.la-backward:before {
content: "\\e005";
}

&.la-check:before {
content: "\\e006";
}

&.la-forward:before {
content: "\\e007";
}

&.la-github:before {
content: "\\e008";
}

&.la-heart:before {
content: "\\e009";
}

&.la-heart-solid:before {
content: "\\e00a";
}

&.la-list:before {
content: "\\e00b";
}

&.la-pause:before {
content: "\\e00c";
}

&.la-play:before {
content: "\\e00d";
}

&.la-save:before {
content: "\\e00e";
}

&.la-share:before {
content: "\\e00f";
}

&.la-sistrix:before {
content: "\\e010";
}

&.la-stop:before {
content: "\\e011";
}

&.mdi-light-chevron-down:before {
content: "\\e012";
}

&.mdi-light-chevron-left:before {
content: "\\e013";
}

&.mdi-light-chevron-right:before {
content: "\\e014";
}

&.mdi-light-chevron-up:before {
content: "\\e015";
}

&.mdi-light-repeat:before {
content: "\\e016";
}

&.mdi-light-repeat-once:before {
content: "\\e017";
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
    bgLight: luminate(colors.background, .025),
    bgLighter: luminate(saturate(colors.background, 0.05), .082),
    bgDark: luminate(colors.background, -0.005),
    bgDarky: luminate(saturate(colors.background, -0.015), -0.022),
    bgDarker: luminate(saturate(colors.background, 0.02), -0.045),

    shadeBright: `${luminate(saturate(colors.background, 1), 0.71)}55`,
    shadeBrighter: `${luminate(saturate(colors.foreground, .10), -0.04)}ee`,
    shadeSoft: `${luminate(saturate(colors.background, 0.2), 0.35)}55`,
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
`

export type Skin = typeof skin

// console.log(JSON.stringify(skin.colors, null, 2))

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

    &.la-backward:before {
      content: "\\e001";
    }

    &.la-forward:before {
      content: "\\e002";
    }

    &.la-pause:before {
      content: "\\e003";
    }

    &.la-play:before {
      content: "\\e004";
    }

    &.la-stop:before {
      content: "\\e005";
    }

    &.mdi-light-chevron-down:before {
      content: "\\e006";
    }

    &.mdi-light-chevron-left:before {
      content: "\\e007";
    }

    &.mdi-light-chevron-right:before {
      content: "\\e008";
    }

    &.mdi-light-chevron-up:before {
      content: "\\e009";
    }

    &.mdi-light-repeat:before {
      content: "\\e00a";
    }

    &.mdi-light-repeat-once:before {
      content: "\\e00b";
    }
  }
  `,

  colors: {
    ...colors,

    cursor: colors.cursorColor,

    fg: colors.foreground,
    fgLight: luminate(saturate(colors.foreground, -0.45), 0.05),
    fgPale: luminate(saturate(colors.foreground, -0.75), -0.4),

    bg: colors.background,
    bgPale: luminate(saturate(colors.background, 0.15), 0.18),
    bgPaleLight: luminate(saturate(colors.background, 0.15), 0.3),
    bgLight: luminate(colors.background, .05),
    bgDark: '',

    shadeBright: `${luminate(saturate(colors.background, 1), 0.71)}55`,
    shadeBrighter: `${luminate(saturate(colors.foreground, .08), -0.04)}ee`,
    shadeDark: `${luminate(saturate(colors.background, -0.18), -0.0625)}14`,
    shadeDarker: `${luminate(saturate(colors.background, -0.18), -0.05)}dd`,
    shadeBlack: `${luminate(saturate(colors.background, 0.5), -0.125)}99`,
  }
})

export const skin = getSkin(colors)

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
`

export type Skin = typeof skin

console.log(JSON.stringify(skin.colors, null, 2))

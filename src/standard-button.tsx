/** @jsxImportSource minimal-view */

import { view, web } from 'minimal-view'
import { theme } from './theme'


export const StandardButton = web(view('standard-button',
  class props {
    text!: string;
    onClick!: () => any
  },
  class local {
  },
  function actions({ $, fns, fn }) {
    return fns(new class actions {
    })
  },
  function effects({ $, fx }) {

    $.css = /*css*/ `
      & { 
        font-family: ${theme['fontFamily']};
        font-size: ${theme['fontSize']};
      }
      button {
        all: unset;
        border: 2px solid ${theme['primaryBgColor']};
        color: ${theme['primaryBgColor']};
        padding: 5px;
        background-color: ${theme['primaryLight']};
        
        &:hover {
          border-color: ${theme['primaryLight']};
          transition: border-color ease-out .1s;
        }
        &:active {
          border: 2px solid white;
          color:  ${theme['primaryLight']};
          background-color: ${theme['primaryBgColor']};
        } 
      }
    `

    fx(function drawSdtButton({ text, onClick }) {
      $.view = <>
        <button onclick={onClick}>
          {text}
        </button>
      </>
    })
  }
))
/** @jsxImportSource minimal-view */

import { view, web } from 'minimal-view'
import { App } from './app'
import { NumberInput } from './number-input'
import { theme } from './theme'


export const MenuBar = web(view('menu-bar',
  class props {
    app!: typeof App.Context;
    onSave!: () => void;
    onShare!: () => void;

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
        display: flex;
        position: fixed;  
        height: 50px;
        width: 100%;
        background-color: ${theme['secondaryBgColor']};
        z-index: 999999999;
        flex-direction: row;
        justify-content: space-between;
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

    fx(function drawMenuBar({ onSave, onShare }) {
      $.view = <>
        <button
          onclick={
            () => {
              $.app.isBackgroundVisible = !$.app.isBackgroundVisible
            }
          }
        >
          Change Background
        </button>
        <NumberInput min={1} max={666} value={$.app.audio.deps.bpm} step={1} align="x" />
        <button onclick={onSave}>
          Save
        </button>
        <button onclick={onShare}>
          Share
        </button>
      </>
    })
  }
))
/** @jsxImportSource minimal-view */

import { view, web } from 'minimal-view'
import { App } from './app'
import { NumberInput } from './number-input'
import { theme } from './theme'
import { StandardButton } from './standard-button'

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
        z-index: 9999999;
        flex-direction: row;
        justify-content: space-between;
        font-family: ${theme['fontFamily']};
        font-size: ${theme['fontSize']};
      }
    `

    fx(function drawMenuBar({ onSave, onShare }) {
      const changeBg = function () {
        $.app.isBackgroundVisible = !$.app.isBackgroundVisible
      }
      const openSettings = function () {
        $.app.isSettingsPanelOpen = true
      }
      $.view = <>
        <StandardButton text="Settings" onClick={openSettings}></StandardButton>
        <StandardButton text="Change Background" onClick={changeBg}></StandardButton>
        <NumberInput min={1} max={666} value={$.app.audio.deps.bpm} step={1} align="x" />
        <StandardButton text="Save" onClick={onSave}></StandardButton>
        <StandardButton text="Share" onClick={onShare}></StandardButton>
      </>
    })
  }
))
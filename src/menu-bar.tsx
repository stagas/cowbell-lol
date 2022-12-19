/** @jsxImportSource minimal-view */

import {  view, web } from 'minimal-view'
import {App} from './app'
import { NumberInput } from './number-input'

export const MenuBar = web(view('menuBar',
  class props {
    app!: typeof App.Context
  },
  class local {

  },
  function actions({ $, fns, fn }) {
    return fns(new class actions { 
      setBPM = function(this: HTMLInputElement ) { 
        $.app.audio.$.bpm = this.valueAsNumber
        console.log($.app.audio.$.bpm)
      }

      save = function(){
        console.log("saving...")
      }

      share = function() {
        console.log("sharing...")
      }
    })
  },
  function effects({ $, fx }) {
    $.css = /*css*/ `
      & { 
        display: flex;
        position:fixed;  
        height:50px;
        width:100%;
        background-color: #093893;
        z-index: 999999999;
        flex-direction: row;
        justify-content: space-between;
        font-family: Mono;
        font-size: 20px;
      }
      button {
        all: unset;
        border: 2px solid #000  ;
        color: black;
        padding:5px;
        background-color: white;
          &:active {
          border: 2px solid white;
          color: white;
          background-color: black;
        } 
      }
    `

    fx(function drawMenuBar({app}) {
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
        <button onclick={$.save}>
          Save
        </button>
        <button onclick={$.share}>
          Share
        </button>
      </>
    })
  }
))
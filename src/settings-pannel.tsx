/** @jsxImportSource minimal-view */

import { view, web } from 'minimal-view'
import { theme } from './theme'
import { App } from './app'
import { StandardButton } from './standard-button'


export const SettingsPanel = web(view('settings-panel',
  class props {
    app!: typeof App.Context;
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
            all: unset;
            display: flex;
            position: fixed; 
            width: 100%; 
            height: 100%; 
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.5);   
            z-index: 999999999;
            justify-content: space-between;
            font-family: ${theme['fontFamily']};
            font-size: ${theme['fontSize']}; 
            
            .panel {
              display: flex;
              position: relative;
              cursor: pointer; 
              padding:50px;
              border: 10px solid white;
              flex-direction: column;
              background-color: ${theme['secondaryBgColor']};
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              gap:25px;
              .close-settings {
                position: absolute;
                top:5px;
                left:5px;
              }
              .panel-row {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                text-align:center;
              }
          }
        }
    
        .checkbox-container {
          display: block;
          position: relative;
          padding-left: 35px;
          margin-bottom: 12px;
          cursor: pointer;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          align-self: flex-start;
          input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
          }
          .checkmark {
            position: absolute;
            top: 0;
            right: 0;
            height: 25px;
            width: 25px;
            background-color: ${theme['primaryBgColor']} ;
            &:after {
              content: "";
              position: absolute;
              display: none;
              left: 9px;
              top: 5px;
              width: 5px;
              height: 10px;
              border: solid white;
              border-width: 0 3px 3px 0;
              -webkit-transform: rotate(45deg);
              -ms-transform: rotate(45deg);
              transform: rotate(45deg);
            }
          }
          &:hover input ~ .checkmark {
            background-color: ${theme['primaryBgColor']};
          }
          input:checked ~ .checkmark {
            background-color: ${theme['primaryBgColor']};
          }
          input:checked ~ .checkmark:after {
            display: block;
          }
        }
    `

    fx(function drawSettingsPanel() {
      $.view = <>
        <div id="panel-shadow" class="hidden">
          <div class="panel">
            <div class="panel-row">
              <label for="buffer-size">Buffer Size</label>
              <select id="buffer-size" name="buffer-size">
                <option value="1024">1024</option>
                <option value="512">512</option>
                <option value="256">256</option>
                <option value="128">128</option>
              </select>
            </div>
            <div class="panel-row">
              <label for="sample-rate">Sample Rate</label>
              <select id="sample-rate" name="sample-rate">
                <option value="44100">44100</option>
                <option value="48000">48000</option>
              </select>
            </div>
            <div class="panel-row">
              Enable Helper View
              <label class="checkbox-container">
                <input type="checkbox" checked={false} onchange={() => {
                  $.app.isHelperOn = !$.app.isHelperOn
                }}
                ></input>
                <span class="checkmark"></span>
              </label>
            </div>
            <div class="panel-row">Cowbell LOL INC</div>
            <div class="panel-row">
              <StandardButton text="Close" onClick={() => { $.app.isSettingsPanelOpen = false }}></StandardButton>
            </div>
          </div>
        </div>
      </>
    })
  }
))
/** @jsxImportSource minimal-view */

import { web, view, Dep } from 'minimal-view'

import CodeMirror from 'codemirror'
import { css, hintCss } from '@dylanvann/codemirror-css'
import 'codemirror/keymap/sublime';
// import 'codemirror/addon/display/fullscreen.css';
// import 'codemirror/theme/neat.css';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/mode/simple';
// import 'codemirror/mode/clike/clike';
import 'codemirror/addon/comment/comment';
// import '../../styles/components/_codemirror.css';

export const Code = web('code-editor', view(
  class props {
    value!: Dep<string>
    rows?: number = 10
  }, class local {
  textarea?: HTMLTextAreaElement
  themeCss?: string
}, ({ $, fx, refs }) => {
  $.css = /*css*/`
    textarea {
      display: block;
      box-sizing: border-box;
      background: #000;
      color: #fff;
      border: none;
      width: 100%;
      resize: vertical;
    }
    .CodeMirror-matchingbracket {
      background: red;
      font-weight: bold;
    }
  `

  fx(async () => {
    const res = await fetch('https://cdn.jsdelivr.net/npm/codemirror@5.65.9/theme/liquibyte.css')
    $.themeCss = await res.text()

  })
  fx(({ textarea }) => {
    /* Example definition of a simple mode that understands a subset of
 * JavaScript:
 */

    CodeMirror.defineSimpleMode("simplemode", {
      // The start state contains the rules that are initially used
      start: [
        // The regex matches the token, the token property contains the type
        { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string" },
        // You can match multiple tokens at once. Note that the captured
        // groups must span the whole string in this case
        {
          regex: /(function)(\s+)([a-z$][\w$]*)/,
          token: ["keyword", '', "variable-2"]
        },
        // Rules are matched in the order in which they appear, so there is
        // no ambiguity between this one and the one above
        {
          regex: /(?:function|var|return|if|for|while|else|do|this)\b/,
          token: "keyword"
        },
        { regex: /true|false|null|undefined/, token: "atom" },
        {
          regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
          token: "number"
        },
        { regex: /\\.*/, token: "comment" },
        { regex: /\/(?:[^\\]|\\.)*?\//, token: "variable-3" },
        // A next property will cause the mode to move to a different state
        { regex: /\/\*/, token: "comment", next: "comment" },
        { regex: /[-+/*=<>!]+/, token: "operator" },
        // indent and dedent properties guide autoindentation
        { regex: /[{[(]/, indent: true },
        { regex: /[}]\)]/, dedent: true },
        { regex: /#([a-z$][\w$]*)?/, token: 'buffer' },
        { regex: /[a-z$][\w$]*(?=\()/, token: "call" },
        { regex: /[a-z$][\w$]*/, token: "variable" },
        // You can embed other modes with the mode property. This rule
        // causes all code between << and >> to be highlighted with the XML
        // mode.
        { regex: /<</, token: "meta", mode: { spec: "xml", end: />>/ } }
      ],
      // The multi-line comment state.
      comment: [
        { regex: /.*?\*\//, token: "comment", next: "start" },
        { regex: /.*/, token: "comment" }
      ],
      // The meta property contains global information about the mode. It
      // can contain properties like lineComment, which are supported by
      // all modes, and also directives like dontIndentStates, which are
      // specific to simple modes.
      meta: {
        dontIndentStates: ["comment"],
        lineComment: "\\"
      }
    });

    CodeMirror.fromTextArea(textarea, {
      tabSize: 2,
      lineNumbers: false,
      mode: 'simplemode',
      theme: 'liquibyte',
      matchBrackets: true,
      // keyMap: 'sublime',
      extraKeys: {
        'Ctrl-/': cm => {
          cm.toggleComment()
        },
        'Cmd-/': cm => {
          cm.toggleComment()
        },
      }
    });
  })

  fx(({ value, rows, themeCss }) => {
    $.view = <>
      <style>{`
    ${css}

    ${hintCss}

    ${themeCss}

    .CodeMirror {
      font-size: 15px !important;
    }
    .cm-call {
      color: #b5f;
      font-weight: bold;
    }
    .cm-buffer {
      color: #9ef;
    }
    .cm-operator {
      color: #888 !important;
    }
    `}</style>
      <textarea key="text"
        ref={refs.textarea}
        spellcheck="false"
        autocorrect="off"
        rows={rows}
      // oninput={
      //   function (this: HTMLTextAreaElement) {
      //     value.value = this.value
      //   }}
      >
        {value.value}
      </textarea>
    </>
  })
}))

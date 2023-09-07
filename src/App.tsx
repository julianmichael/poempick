import React from 'react';
import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { ArrowLeft } from 'react-bootstrap-icons';


enum HidingStyle {
  FirstLetterOfWord = 0,
  // RandomLetters,
}

enum RevealingStyle {
  Word = 0,
  Line,
  Stanza,
}

enum RevealingMethod {
  Hover = 0,
  Click,
}

interface Selection {
  stanza: number,
  line: number,
  word: number,
}
const NoSelection = { stanza: -Infinity, line: -Infinity, word: -Infinity }

const tokenSplitPattern = "[ ,'-.!?]"
function isWordHideable(word: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(word)
}

function Poem(props: {
  poem: string,
  isHiding: boolean,
  hidingStyle: HidingStyle,
  revealingStyle: RevealingStyle,
  revealingMethod: RevealingMethod,
  extraItemsToReveal: number
}) {
  const [selection, setSelection] = useState<Selection>(NoSelection);

  return (
    // align text left via bootstrap class on this div
    <div className="poem text-start">
      {props.poem.split("\n\n").map((stanza, stanzaIndex) => {
        const stanzaIsHidden = props.isHiding
          && props.revealingStyle === RevealingStyle.Stanza
          && props.isHiding
          && !(stanzaIndex >= selection.stanza
            && stanzaIndex <= selection.stanza + props.extraItemsToReveal);

        return (
          <p
            onMouseEnter={e => {
              if (props.revealingStyle === RevealingStyle.Stanza && props.revealingMethod === RevealingMethod.Hover) {
                setSelection({ stanza: stanzaIndex, line: -Infinity, word: -Infinity })
              }
            }}
            onMouseLeave={e => {
              if (props.revealingStyle === RevealingStyle.Stanza && props.revealingMethod === RevealingMethod.Hover) {
                setSelection(NoSelection)
              }
            }}
            onClick={e => {
              const thisSelection = { stanza: stanzaIndex, line: -Infinity, word: -Infinity }
              if (props.revealingStyle === RevealingStyle.Stanza && props.revealingMethod === RevealingMethod.Click) {
                if (JSON.stringify(selection) === JSON.stringify(thisSelection)) {
                  setSelection(NoSelection)
                } else {
                  setSelection(thisSelection)
                }
              }
            }}
          >{stanza.split("\n").map((line, lineIndex) => {
            const lineIsHidden = props.isHiding
              && props.revealingStyle === RevealingStyle.Line
              && props.isHiding
              && !(selection.stanza === stanzaIndex
                && lineIndex >= selection.line
                && lineIndex <= selection.line + props.extraItemsToReveal);

            var numSpacesSoFar = 0
            return (
              <p className="mb-0"
                onMouseEnter={e => {
                  if (props.revealingStyle === RevealingStyle.Line && props.revealingMethod === RevealingMethod.Hover) {
                    setSelection({ stanza: stanzaIndex, line: lineIndex, word: -Infinity })
                  }
                }}
                onMouseLeave={e => {
                  if (props.revealingStyle === RevealingStyle.Line && props.revealingMethod === RevealingMethod.Hover) {
                    setSelection({ stanza: stanzaIndex, line: -Infinity, word: -Infinity })
                  }
                }}
                onClick={e => {
                  const thisSelection = { stanza: stanzaIndex, line: lineIndex, word: -Infinity }
                  if (props.revealingStyle == RevealingStyle.Line && props.revealingMethod === RevealingMethod.Click) {
                    if (JSON.stringify(selection) === JSON.stringify(thisSelection)) {
                      setSelection(NoSelection);
                    } else {
                      setSelection(thisSelection);
                    }
                  }
                }}
              >{line.split(/(?=\W+)|(?<=\W+)/g).map((word, rawWordIndex) => {
                const wordIndex = rawWordIndex - numSpacesSoFar
                if (word === " ") {
                  numSpacesSoFar += 1
                }
                const wordsAreHidden = props.revealingStyle === RevealingStyle.Word && props.isHiding
                const wordIsRevealed = selection.stanza === stanzaIndex
                  && selection.line === lineIndex
                  && wordIndex >= selection.word
                  && wordIndex <= selection.word + props.extraItemsToReveal;
                const wordIsHidden = stanzaIsHidden
                  || lineIsHidden
                  || (isWordHideable(word) && wordsAreHidden && !wordIsRevealed);
                var hiddenWord = word;
                if (props.hidingStyle === HidingStyle.FirstLetterOfWord) {
                  hiddenWord = word.charAt(0).toString()
                }
                return (
                  <span
                    onMouseEnter={e => {
                      if (props.revealingStyle === RevealingStyle.Word && props.revealingMethod === RevealingMethod.Hover) {
                        setSelection({ stanza: stanzaIndex, line: lineIndex, word: wordIndex })
                      }
                    }}
                    onMouseLeave={e => {
                      if (props.revealingStyle === RevealingStyle.Word && props.revealingMethod === RevealingMethod.Hover) {
                        setSelection(NoSelection)
                      }
                    }}
                    onClick={e => {
                      const thisSelection = { stanza: stanzaIndex, line: lineIndex, word: wordIndex }
                      if (props.revealingStyle === RevealingStyle.Word && props.revealingMethod === RevealingMethod.Click) {
                        if (JSON.stringify(selection) === JSON.stringify(thisSelection)) {
                          setSelection(NoSelection);
                        } else {
                          setSelection(thisSelection);
                        }
                      }
                    }}
                  >{wordIsHidden ? hiddenWord : word}</span>
                )
              }
              )}</p>
            )
          })}</p>
        )
      })}
    </div >
  );
}

function App() {
  const [title, setTitle] = useState<string>("");
  const [poem, setPoem] = useState<string>("");
  const [poemTmp, setPoemTmp] = useState<string>("");
  const [isHidingWords, setIsHidingWords] = useState<boolean>(true);
  const [hidingStyle, setHidingStyle] = useState<HidingStyle>(HidingStyle.FirstLetterOfWord);
  const [revealingMethod, setRevealingMethod] = useState<RevealingMethod>(RevealingMethod.Hover);
  const [revealingStyle, setRevealingStyle] = useState<RevealingStyle>(RevealingStyle.Word);
  const [extraItemsToReveal, setExtraItemsToReveal] = useState<number>(0);

  // bootstrap dropdown for hiding style
  const isHidingCheckbox = (
    <div className="form-check">
      <input className="form-check-input" type="checkbox" value="" id="is-hiding-checkbox" checked={isHidingWords} onChange={e => setIsHidingWords(e.target.checked)} />
      <label className="form-check-label" htmlFor="is-hiding-checkbox">
        Hide words
      </label>
    </div>
  )
  const hidingStyleDropdown = (
    <div className="form-group">
      <label className="mb-1" htmlFor="hiding-style-dropdown">Hiding style: </label>
      <select className="form-select" value={hidingStyle} onChange={e => setHidingStyle(parseInt(e.target.value))}>
        <option value={HidingStyle.FirstLetterOfWord}>First letter of word</option>
        {/* <option value={HidingStyle.RandomLetters}>Random letters</option> */}
      </select>
    </div>
  );
  const revealingMethodDropdown = (
    <div className="form-group">
      <label className="mb-1" htmlFor="revealing-method-dropdown">Revealing method: </label>
      <select className="form-select" value={revealingMethod} onChange={e => setRevealingMethod(parseInt(e.target.value))}>
        <option value={RevealingMethod.Hover}>Hover</option>
        <option value={RevealingMethod.Click}>Click</option>
      </select>
    </div>
  );
  const revealingStyleDropdown = (
    <div className="form-group">
      <label className="mb-1" htmlFor="revealing-style-dropdown">Revealing style: </label>
      <select className="form-select" value={revealingStyle} onChange={e => setRevealingStyle(parseInt(e.target.value))}>
        <option value={RevealingStyle.Word}>Word</option>
        <option value={RevealingStyle.Line}>Line</option>
        <option value={RevealingStyle.Stanza}>Stanza</option>
      </select>
    </div>
  );
  const extraItemsToRevealNumberField = (
    <div className="form-group">
      <label className="mb-1" htmlFor="extra-items-to-reveal-number-field">Extra items to reveal: </label>
      <input type="number" className="form-control" id="extra-items-to-reveal-number-field" value={extraItemsToReveal} onChange={e => setExtraItemsToReveal(parseInt(e.target.value))} />
    </div>
  );

  if (poem === "") {
    return (
      <div className="App container">
        Enter a poem.
        <form>
          <input id="poem-title" type="text" className="form-control mb-2" placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} />
          <textarea id="poem-field" className="form-control mb-2" placeholder="Poem" rows={10} onChange={(e) => setPoemTmp(e.target.value)}>{poemTmp}</textarea>
          <button className="btn btn-primary w-100" onClick={() => setPoem(poemTmp)}>Memorize!</button>
        </form>
      </div>
    );
  } else {
    return (
      <div className="App container">
        <div className="row text-start mt-1 mb-2">
          <div className="col">
            <button className="btn btn-outline-secondary" onClick={() => setPoem("")}><ArrowLeft /> Change poem</button>
          </div>
          <div className="col">
            {isHidingCheckbox}
          </div>
          <div className="col">
            {hidingStyleDropdown}
          </div>
          <div className="col">
            {revealingMethodDropdown}
          </div>
          <div className="col">
            {revealingStyleDropdown}
          </div>
          <div className="col">
            {extraItemsToRevealNumberField}
          </div>
        </div>
        <h1>{title}</h1>
        <Poem
          poem={poem}
          isHiding={isHidingWords}
          hidingStyle={hidingStyle}
          revealingStyle={revealingStyle}
          revealingMethod={revealingMethod}
          extraItemsToReveal={extraItemsToReveal}
        />

      </div>
    );
  }
}
export default App;

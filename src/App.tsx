import React from 'react';
import { useState } from 'react';
import { ArrowLeft } from 'react-bootstrap-icons';
import './App.css';
import { presetPoems, presetPoemsMap } from './poems';

enum PoemSelection {
  Custom = 0,
  Preset,
  Saved
}

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

const tokenSplitPattern = /[a-zA-Z0-9]/

function tokenize(line: string): Array<string> {
  return Array.from(line).reduce((acc, char) => {
    if (!char.match(tokenSplitPattern)) {
      acc.push(char.toString())
      acc.push("")
    } else {
      acc[acc.length - 1] += char
    }
    return acc
  }, [""])
}

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
                  if (props.revealingStyle === RevealingStyle.Line && props.revealingMethod === RevealingMethod.Click) {
                    if (JSON.stringify(selection) === JSON.stringify(thisSelection)) {
                      setSelection(NoSelection);
                    } else {
                      setSelection(thisSelection);
                    }
                  }
                }}
              >{tokenize(line).map((word, rawWordIndex) => {
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

function isTouchDevice() {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}

function App() {
  const [savedPoems, setSavedPoems] = useState<Array<{ title: string, poem: string }>>([]);
  const [poemSelection, setPoemSelection] = useState<PoemSelection>(PoemSelection.Custom);
  const [selectedPoemTitle, setSelectedPoemTitle] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [poem, setPoem] = useState<string>("");
  const [poemTmp, setPoemTmp] = useState<string>("");
  const [isHidingWords, setIsHidingWords] = useState<boolean>(true);
  const [hidingStyle, setHidingStyle] = useState<HidingStyle>(HidingStyle.FirstLetterOfWord);
  const defaultRevealingMethod = isTouchDevice() ? RevealingMethod.Click : RevealingMethod.Hover;
  const [revealingMethod, setRevealingMethod] = useState<RevealingMethod>(defaultRevealingMethod);
  const [revealingStyle, setRevealingStyle] = useState<RevealingStyle>(RevealingStyle.Line);
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

  const customPoemString = "Custom poem"

  function setPresetPoem(title: string) {
    setSelectedPoemTitle(title);
    if (title === customPoemString) {
      setPoemSelection(PoemSelection.Custom);
      setPoemTmp("");
      setTitle("");
    } else {
      setPoemSelection(PoemSelection.Preset);
      setPoemTmp(presetPoemsMap[title]);
      setTitle(title);
    }
  }
  const presetPoemOptions = presetPoems.map(p => {
    return <option value={p.title}>{p.title}</option>
  })

  // const savedPoemSelection = poemSelection !== PoemSelection.Saved ? selectedPoemTitle : "Preset poem..."
  // function setSavedPoem(title: string) {
  //   setSelectedPoemTitle(title); setPoemSelection(PoemSelection.Preset);
  // }
  // const savedPoemOptions = savedPoems.map(p => {
  //   return <option value={p.title}>{p.title}</option>
  // })


  if (poem === "") {
    return (
      <div className="App container">
        <form>
          <div className="row my-2">
            <div className="col">
              Enter a poem.
            </div>
            <div className="col">
              <div className="form-group">
                {/* <label className="mb-1" htmlFor="revealing-style-dropdown">Revealing style: </label> */}
                <select className="form-select" value={selectedPoemTitle} onChange={e => setPresetPoem(e.target.value)}>
                  <option value={customPoemString}>{customPoemString}</option>
                  {presetPoemOptions}
                </select>
              </div>
            </div>
          </div>
          <input id="poem-title" type="text" className="form-control mb-2" placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} disabled={poemSelection !== PoemSelection.Custom} />
          <textarea id="poem-field" className="form-control mb-2" placeholder="Poem" rows={10} value={poemTmp} onChange={(e) => setPoemTmp(e.target.value)} disabled={poemSelection !== PoemSelection.Custom} >{poemTmp}</textarea>
          <button className="btn btn-primary w-100" onClick={() => setPoem(poemTmp)}>Memorize!</button>
        </form >
      </div >
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
          {/* <div className="col">
            {hidingStyleDropdown}
          </div> */}
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

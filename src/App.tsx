import React from 'react';
import { useState } from 'react';
import { ArrowLeft } from 'react-bootstrap-icons';
import './App.css';
// import { presetPoems, presetPoemsMap, Poem } from './poems-old';
import { presetPoems } from './poems';
import { Route, Router, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';

export interface Poem {
  key: string
  title: string
  author: string
  poem: string
}

const presetPoemsMap = presetPoems.reduce((acc, poem) => {
  acc[poem.key] = poem
  return acc
}, {} as { [key: string]: Poem })

export { presetPoems, presetPoemsMap }

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

function escapeWord(word: string): string {
  if (word === " ") return "\u00A0";
  else return word;
}

interface PoemDisplayProps {
  poem: Poem,
  isHiding: boolean,
  hidingStyle: HidingStyle,
  revealingStyle: RevealingStyle,
  revealingMethod: RevealingMethod,
  extraItemsToReveal: number,
}

function PoemDisplay({
  poem,
  isHiding,
  hidingStyle,
  revealingStyle,
  revealingMethod,
  extraItemsToReveal
}: PoemDisplayProps) {
  const [selection, setSelection] = useState<Selection>(NoSelection);

  // align text left via bootstrap class on this div
  return (<>
    <h1>{poem.title}</h1>
    <div className="poem text-start">
      {poem.poem.split("\n\n").map((stanza, stanzaIndex) => {
        const stanzaIsHidden = isHiding
          && revealingStyle === RevealingStyle.Stanza
          && isHiding
          && !(stanzaIndex >= selection.stanza
            && stanzaIndex <= selection.stanza + extraItemsToReveal);

        return (
          <div
            key={`stanza-${stanzaIndex}`}
            onMouseEnter={e => {
              if (revealingStyle === RevealingStyle.Stanza && revealingMethod === RevealingMethod.Hover) {
                setSelection({ stanza: stanzaIndex, line: -Infinity, word: -Infinity })
              }
            }}
            onMouseLeave={e => {
              if (revealingStyle === RevealingStyle.Stanza && revealingMethod === RevealingMethod.Hover) {
                setSelection(NoSelection)
              }
            }}
            onClick={e => {
              const thisSelection = { stanza: stanzaIndex, line: -Infinity, word: -Infinity }
              if (revealingStyle === RevealingStyle.Stanza && revealingMethod === RevealingMethod.Click) {
                if (JSON.stringify(selection) === JSON.stringify(thisSelection)) {
                  setSelection(NoSelection)
                } else {
                  setSelection(thisSelection)
                }
              }
            }}
          >{stanza.split("\n").map((line, lineIndex) => {
            const lineIsHidden = isHiding
              && revealingStyle === RevealingStyle.Line
              && isHiding
              && !(selection.stanza === stanzaIndex
                && lineIndex >= selection.line
                && lineIndex <= selection.line + extraItemsToReveal);

            var numSpacesSoFar = 0
            return (
              <p key={`stanza-${stanzaIndex} line-${lineIndex}`} className="mb-0"
                onMouseEnter={e => {
                  if (revealingStyle === RevealingStyle.Line && revealingMethod === RevealingMethod.Hover) {
                    setSelection({ stanza: stanzaIndex, line: lineIndex, word: -Infinity })
                  }
                }}
                onMouseLeave={e => {
                  if (revealingStyle === RevealingStyle.Line && revealingMethod === RevealingMethod.Hover) {
                    setSelection({ stanza: stanzaIndex, line: -Infinity, word: -Infinity })
                  }
                }}
                onClick={e => {
                  const thisSelection = { stanza: stanzaIndex, line: lineIndex, word: -Infinity }
                  if (revealingStyle === RevealingStyle.Line && revealingMethod === RevealingMethod.Click) {
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
                const wordsAreHidden = revealingStyle === RevealingStyle.Word && isHiding
                const wordIsRevealed = selection.stanza === stanzaIndex
                  && selection.line === lineIndex
                  && wordIndex >= selection.word
                  && wordIndex <= selection.word + extraItemsToReveal;
                const wordIsHidden = stanzaIsHidden
                  || lineIsHidden
                  || (isWordHideable(word) && wordsAreHidden && !wordIsRevealed);
                var hiddenWord = word;
                if (hidingStyle === HidingStyle.FirstLetterOfWord) {
                  hiddenWord = word.charAt(0).toString()
                }
                return (
                  <span
                    key={`stanza-${stanzaIndex} line-${lineIndex} word-${rawWordIndex}`}
                    onMouseEnter={e => {
                      if (revealingStyle === RevealingStyle.Word && revealingMethod === RevealingMethod.Hover) {
                        setSelection({ stanza: stanzaIndex, line: lineIndex, word: wordIndex })
                      }
                    }}
                    onMouseLeave={e => {
                      if (revealingStyle === RevealingStyle.Word && revealingMethod === RevealingMethod.Hover) {
                        setSelection(NoSelection)
                      }
                    }}
                    onClick={e => {
                      const thisSelection = { stanza: stanzaIndex, line: lineIndex, word: wordIndex }
                      if (revealingStyle === RevealingStyle.Word && revealingMethod === RevealingMethod.Click) {
                        if (JSON.stringify(selection) === JSON.stringify(thisSelection)) {
                          setSelection(NoSelection);
                        } else {
                          setSelection(thisSelection);
                        }
                      }
                    }}
                  >{escapeWord(wordIsHidden ? hiddenWord : word)}</span>
                )
              }
              )}</p>
            )
          })}</div>
        )
      })}
    </div>
  </>);
}

function isTouchDevice() {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}

function App() {
  const [location, setLocation] = useHashLocation();
  // const [savedPoems, setSavedPoems] = useState<Array<{ title: string, poem: string }>>([]);

  const presetPoemOptions = presetPoems.map(p => {
    return <option key={p.key} value={p.key}>{p.title}</option>
  })
  const [presetPoemKey, setPresetPoemKey] = useState<string>("custom");
  const presetPoem = presetPoemKey === "custom" ? null : presetPoemsMap[presetPoemKey];

  // const [poemSelection, setPoemSelection] = useState<PoemSelection>(PoemSelection.Custom);
  // const [poem, setPoem] = useState<Poem | null>(null);
  // const [selectedPoemTitle, setSelectedPoemTitle] = useState<string>("");
  const [customTitle, setCustomTitle] = useState<string>("");
  const [customPoemText, setCustomPoemText] = useState<string>("");

  const [isHidingWords, setIsHidingWords] = useState<boolean>(true);
  const [hidingStyle, setHidingStyle] = useState<HidingStyle>(HidingStyle.FirstLetterOfWord);
  const defaultRevealingMethod = isTouchDevice() ? RevealingMethod.Click : RevealingMethod.Hover;
  const [revealingMethod, setRevealingMethod] = useState<RevealingMethod>(defaultRevealingMethod);
  const [revealingStyle, setRevealingStyle] = useState<RevealingStyle>(RevealingStyle.Line);
  const [extraItemsToReveal, setExtraItemsToReveal] = useState<number>(0);

  const poem = presetPoem ?? {
    title: customTitle,
    poem: customPoemText
  }

  // bootstrap dropdown for hiding style
  const isHidingCheckbox = (
    <div className="form-check">
      <input className="form-check-input" type="checkbox" value="" id="is-hiding-checkbox" checked={isHidingWords} onChange={e => setIsHidingWords(e.target.checked)} />
      <label className="form-check-label" htmlFor="is-hiding-checkbox">
        Hide words
      </label>
    </div>
  )
  // const hidingStyleDropdown = (
  //   <div className="form-group">
  //     <label className="mb-1" htmlFor="hiding-style-dropdown">Hiding style: </label>
  //     <select className="form-select" value={hidingStyle} onChange={e => setHidingStyle(parseInt(e.target.value))}>
  //       <option value={HidingStyle.FirstLetterOfWord}>First letter of word</option>
  //       {/* <option value={HidingStyle.RandomLetters}>Random letters</option> */}
  //     </select>
  //   </div>
  // );
  const revealingMethodDropdown = (
    <div className="form-group">
      <label className="mb-1" htmlFor="revealing-method-dropdown">Revealing method: </label>
      <select className="form-select" id="revealing-method-dropdown" value={revealingMethod} onChange={e => setRevealingMethod(parseInt(e.target.value))}>
        <option value={RevealingMethod.Hover}>Hover</option>
        <option value={RevealingMethod.Click}>Click</option>
      </select>
    </div>
  );
  const revealingStyleDropdown = (
    <div className="form-group">
      <label className="mb-1" htmlFor="revealing-style-dropdown">Revealing style: </label>
      <select className="form-select" id="revealing-style-dropdown" value={revealingStyle} onChange={e => setRevealingStyle(parseInt(e.target.value))}>
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

  // function setPresetPoem(key: string | null) {
  //   if (key === null) {
  //     setPoemSelection(PoemSelection.Custom);
  //     setSelectedPoemTitle("");
  //     setTitle("");
  //     setPoemTextTmp("");
  //   } else {
  //     const thisPoem = presetPoemsMap[key];
  //     setPoemSelection(PoemSelection.Preset);
  //     setSelectedPoemTitle(thisPoem.title);
  //     setTitle(thisPoem.title);
  //     setPoemTextTmp(thisPoem.poem);
  //   }
  // }

  // const savedPoemSelection = poemSelection !== PoemSelection.Saved ? selectedPoemTitle : "Preset poem..."
  // function setSavedPoem(title: string) {
  //   setSelectedPoemTitle(title); setPoemSelection(PoemSelection.Preset);
  // }
  // const savedPoemOptions = savedPoems.map(p => {
  //   return <option value={p.title}>{p.title}</option>
  // })

  function goMemorize() {
    if (presetPoem !== null) {
      setLocation(`/${presetPoem.key}`)
    } else {
      setLocation(`/custom/${encodeURIComponent(JSON.stringify(poem))}`)
    }
  }



  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/">
          <div className="App container">
            <form>
              <div className="row my-2">
                <div className="col">
                  Enter a poem.
                </div>
                <div className="col">
                  <div className="form-group">
                    {/* <label className="mb-1" htmlFor="revealing-style-dropdown">Revealing style: </label> */}
                    <select className="form-select" value={presetPoem?.key ?? "custom"} onChange={e => setPresetPoemKey(e.target.value)}>
                      <option value="custom">{customPoemString}</option>
                      {presetPoemOptions}
                    </select>
                  </div>
                </div>
              </div>
              <input id="poem-title" type="text" className="form-control mb-2" placeholder="Title" value={poem.title} onChange={(e) => setCustomTitle(e.target.value)} disabled={presetPoem !== null} />
              <textarea id="poem-field" className="form-control mb-2" placeholder="Poem" rows={10} value={poem.poem} onChange={(e) => setCustomPoemText(e.target.value)} disabled={presetPoem !== null} >{poem.poem}</textarea>
              <button className="btn btn-primary w-100" onClick={() => goMemorize()}>Memorize!</button>
            </form >
          </div >
        </Route>
        <Route path="/custom/:poem">{params =>
          <div className="App container">
            <div className="row text-start mt-1 mb-2">
              <div className="col">
                <button className="btn btn-outline-secondary" onClick={() => setLocation("/")}><ArrowLeft /> Change poem</button>
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
            <PoemDisplay
              poem={JSON.parse(decodeURIComponent(params.poem))}
              isHiding={isHidingWords}
              hidingStyle={hidingStyle}
              revealingStyle={revealingStyle}
              revealingMethod={revealingMethod}
              extraItemsToReveal={extraItemsToReveal}
            />
          </div>
        }
        </Route>
        <Route path="/:poemKey">{params =>
          <div className="App container">
            <div className="row text-start mt-1 mb-2">
              <div className="col">
                <button className="btn btn-outline-secondary" onClick={() => setLocation("/")}><ArrowLeft /> Change poem</button>
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
            <PoemDisplay
              poem={presetPoemsMap[params.poemKey] ?? poem}
              isHiding={isHidingWords}
              hidingStyle={hidingStyle}
              revealingStyle={revealingStyle}
              revealingMethod={revealingMethod}
              extraItemsToReveal={extraItemsToReveal}
            />
          </div>
        }
        </Route>
      </Switch>
    </Router>
  );
}
export default App;

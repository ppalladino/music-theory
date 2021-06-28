import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import MainNav from "./MainNav"
import HomePage from "./HomePage"
import ScalePicker from "./ScalePicker";
import { CHROMATIC_SCALE, MODES } from "./lib/constants";

const NOTES = {
  C: "C ",
  D_FLAT: "D♭",
  D: "D ",
  E_FLAT: "E♭",
  E: "E ",
  F: "F ",
  G_FLAT: "G♭",
  G: "G ",
  A_FLAT: "A♭",
  A: "A ",
  B_FLAT: "B♭",
  B: "B ",
};

const MAJOR_SCALE_PATTERN = [2, 2, 1, 2, 2, 2, 1];

const CHORD_PATTERNS = {
  TRIAD: [2, 2],
  SEVENTH: [2, 2, 2],
};

const statefulLoop = (arr, initPos) => {
  let pos = initPos;
  const getValue = () => arr[pos % arr.length];
  const skip = (steps) => {
    pos = pos + steps;
    return getValue();
  };
  const skipOne = () => skip(1);
  return {
    getValue,
    skip,
    skipOne,
  };
  // this.pos = initPos;
  // this.getValue = () => arr[this.pos % arr.length];
  // this.skip = (steps) => {
  //   this.pos = this.pos + steps;
  //   return this.getValue();
  // };
  // this.skipOne = () => this.skip(1);
  // return this;
};

// returns new array using pattern to skip over looped array starting at offset
const patternReducer = (arr, pattern, offset) => {
  let loop = statefulLoop(arr, offset);

  return pattern.reduce(
    (acc, patternValue) => {
      acc.push(loop.skip(patternValue));
      return acc;
    },
    [loop.getValue()]
  );
};

const modalizePattern = (mode, pattern) => {
  let loop = statefulLoop(pattern, mode.offset);

  return pattern.reduce((acc) => {
    acc.push(loop.getValue());
    loop.skipOne();
    return acc;
  }, []);
};

const createScale = (chromaticScale, pattern, root) => {
  let scale = patternReducer(
    chromaticScale,
    pattern,
    chromaticScale.indexOf(root)
  );
  scale.pop(); // pattern includes the root's octave, remove it!
  return scale;
};

const getInterval = (chromaticScale, note1, note2) => {
  const idx1 = chromaticScale.indexOf(note1);
  const idx2 = chromaticScale.indexOf(note2);
  const interval = idx2 - idx1;
  return interval < 0 ? interval + chromaticScale.length : interval;
};

const analyzeChord = (chromaticScale, chordNotes) => {
  const root = chordNotes[0];
  const thirdInterval = getInterval(
    chromaticScale,
    chordNotes[0],
    chordNotes[1]
  );
  const third =
    thirdInterval === 3
      ? "min"
      : thirdInterval === 4
      ? "maj"
      : `3rd? ${thirdInterval}`;
  const fifthInterval = getInterval(
    chromaticScale,
    chordNotes[0],
    chordNotes[2]
  );
  const fifth =
    fifthInterval === 7
      ? ""
      : fifthInterval === 6
      ? "dim"
      : `5th? ${fifthInterval}`;
  return `${root} ${third} ${fifth}`;
};

const createChord = (chromaticScale, scale, chordPattern, idx) => {
  const notes = patternReducer(scale, chordPattern, idx);
  return {
    notes,
    name: analyzeChord(chromaticScale, notes),
  };
};

const getScaleChords = (chromaticScale, scale, chordPattern) => {
  return scale.reduce((chordInfos, scaleNote) => {
    chordInfos.push(
      createChord(chromaticScale, scale, chordPattern, scale.indexOf(scaleNote))
    );
    return chordInfos;
  }, []);
};

const theScale = createScale(
  CHROMATIC_SCALE,
  modalizePattern(MODES[4], MAJOR_SCALE_PATTERN),
  NOTES[0]
);

console.log("THE SCALE", theScale);

const theChordInfos = getScaleChords(
  CHROMATIC_SCALE,
  theScale,
  CHORD_PATTERNS.TRIAD
);

console.log("THE CHORD INFO", theChordInfos);

// const Scale = (props) => {
//     return React.createElement("div", {}, [
//         React.createElement("h2", {}, props.name),
//     ])
// }

// const App = () => {
//   return React.createElement("div", {}, [
//     React.createElement("h1", {}, "Music Theory"),
//     ...theChordInfos.map((i) => React.createElement(Chord, { chord: i })),
//   ]);
// };

const App = () => {
  return (
    <div>
      <Router>
        <header>
          <Link to="/">Hiya App</Link>
        </header>
        <MainNav></MainNav> 
        <Switch>
          <Route path="/music-theory/guitar-scales">
            <ScalePicker />
          </Route>
          <Route path="/">
            <HomePage></HomePage>
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

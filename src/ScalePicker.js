import { useState } from "react";
import { CHROMATIC_SCALE, MODES } from "./lib/constants";

const modeLabels = MODES.map((i) => i.label);

const ScalePicker = () => {
  const [key, setKey] = useState(CHROMATIC_SCALE[0]);
  const [modeLabel, setModeLabel] = useState(modeLabels[0]);

  return (
    <div className="scale-picker">
      <form>
        <label htmlFor="key">
          Key
          <select
            id="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onBlur={(e) => setKey(e.target.value)}
          >
            {CHROMATIC_SCALE.map((key) => (
              <option value={key} key={key}>
                {key}                
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="mode">
          Mode
          <select
            id="mode"
            value={modeLabel}
            onChange={(e) => setModeLabel(e.target.value)}
            onBlur={(e) => setModeLabel(
                e.target.value)}
          >
            {modeLabels.map((m) => (
              <option value={m} key={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <button>Submit</button>
      </form>
    </div>
  );
};

export default ScalePicker;

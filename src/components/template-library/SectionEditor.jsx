import React from 'react';

const generateFontSizeOptions = () => {
  let options = [];
  for (let i = 7; i <= 50; i++) {
    options.push(<option key={i} value={`${i}px`}>{`${i}px`}</option>);
  }
  return options;
};

const generateSectionOptions = () => {
  let options = [];
  for (let i = 1; i <= 30; i++) {
    options.push(<option key={i} value={`section-${i}`}>{`Section - ${i}`}</option>);
  }
  return options;
};

const SectionEditor = ({
                         section, setSection, fontFamily, setFontFamily, fontSize, setFontSize,
                         fontWeight, setFontWeight, containerWidth, setContainerWidth,
                         bgColor, setBgColor, alignment, setAlignment,
                         paddingTop, setPaddingTop, paddingBottom, setPaddingBottom,
                         handleApplyStyle, updateFontWeight
                       }) => (
  <div className="container">
    <h2>Section Editor with Variables Inputs</h2>
    <form>
      <div className="form-group">
        <label htmlFor="sectionSelect">Choose a Section</label>
        <select id="sectionSelect" name="section" value={section} onChange={e => setSection(e.target.value)}>
          <option value="" disabled>-- Select Section --</option>
          {generateSectionOptions()}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="fontFamily">Font Family</label>
        <select id="fontFamily" name="font-family" value={fontFamily} onChange={e => setFontFamily(e.target.value)}>
          <option value="" disabled>-- Select --</option>
          <option>Arial</option>
          <option>Georgia</option>
          <option>Tahoma</option>
          <option>Verdana</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="fontSizeSelect">Font Size(px)</label>
        <select id="fontSizeSelect" value={fontSize} onChange={e => setFontSize(e.target.value)}>
          <option value="">-- Select --</option>
          {generateFontSizeOptions()}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="fontWeight">Font Weight</label>
        <select id="fontWeight" name="fontWeight" value={fontWeight} onChange={e => updateFontWeight(e.target.value)}>
          <option value="" disabled>-- Select --</option>
          {[100,200,300,400,500,600,700,800,900].map(w => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="containerWidth">Container Width(px)</label>
        <input id="containerWidth" type="text" value={containerWidth} onChange={e => setContainerWidth(e.target.value)}/>
      </div>
      <div className="form-group">
        <label htmlFor="bgColor">Fill Color</label>
        <input type="color" id="bgColor" name="bgColor" value={bgColor} onChange={e => setBgColor(e.target.value)}/>
      </div>
      <div className="form-group">
        <label htmlFor="paddingTop">Padding Top</label>
        <input type="text" id="paddingTop" value={paddingTop} onChange={e => setPaddingTop(e.target.value)}/>
      </div>
      <div className="form-group">
        <label htmlFor="paddingBottom">Padding Bottom</label>
        <input type="text" id="paddingBottom" value={paddingBottom} onChange={e => setPaddingBottom(e.target.value)}/>
      </div>
      <div className="form-group">
        <label htmlFor="alignment">Alignment</label>
        <select id="alignment" name="alignment" value={alignment} onChange={e => setAlignment(e.target.value)}>
          <option value="" disabled>-- Select --</option>
          <option>Left</option>
          <option>Center</option>
          <option>Right</option>
        </select>
      </div>
    </form>
    <div className="buttons-container">
      <button type="button" onClick={handleApplyStyle}>Apply Style</button>
      <button type="button">Preview Saved HTML</button>
    </div>
  </div>
);

export default SectionEditor;

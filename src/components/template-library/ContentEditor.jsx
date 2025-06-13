import React, { forwardRef } from "react";

const ContentEditor = forwardRef(({
                                    content,
                                    setContent,
                                    fontFamily,
                                    fontSize,
                                    fontWeight,
                                    containerWidth,
                                    bgColor,
                                    alignment,
                                    paddingTop,
                                    paddingBottom
                                  }, ref) => (
  <div
    ref={ref}
    id="editor"
    contentEditable
    suppressContentEditableWarning
    style={{
      fontFamily,
      fontSize: `${fontSize}px`,
      fontWeight,
      width: containerWidth ? `${containerWidth}px` : "100%",
      background: bgColor,
      textAlign: alignment,
      paddingTop: `${paddingTop}px`,
      paddingBottom: `${paddingBottom}px`,
      minHeight: "120px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      marginBottom: "1rem"
    }}
    onInput={e => setContent(e.currentTarget.innerHTML)}
    dangerouslySetInnerHTML={{ __html: content }}
  />
));

export default ContentEditor;

import React from 'react';

const EditorArea = ({ editorRef, content, handleEditorChange }) => (
  <div
    id="editor"
    ref={editorRef}
    contentEditable
    placeholder="Type your content with {{variables}} here..."
    onInput={handleEditorChange}
    style={{ minHeight: '300px', border: '1px solid #ccc', padding: '10px' }}
    suppressContentEditableWarning
  >
    <div dangerouslySetInnerHTML={{ __html: content || '<h2 style="text-align:center;color:#c2c2c2">Preview Here</h2>' }} />
  </div>
);

export default EditorArea;

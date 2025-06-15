---
title: Playground
layout: fullscreen
---

<!-- No title needed - it's in the header -->

<div id="playground-container">
  <div id="playground-toolbar">
    <button id="run-btn">▶ Run</button>
    <button id="clear-btn">Clear</button>
    <select id="example-select">
      <option value="">Select Example...</option>
      <option value="basic-fade">Basic Fade</option>
      <option value="move-and-scale">Move & Scale</option>
      <option value="scenes">Multiple Scenes</option>
      <option value="complex">Complex Animation</option>
    </select>
  </div>
  
  <div id="playground-layout">
    <div id="editor-panel">
      <h4>Glimma Code</h4>
      <div id="monaco-editor"></div>
    </div>
    
    <div id="output-panel">
      <div id="preview-section">
        <h4>Preview</h4>
        <div id="svg-preview">
          <div id="loading">Click "Run" to compile and preview your animation</div>
        </div>
      </div>
      
      <div id="svg-source-section">
        <h4>Generated SVG</h4>
        <textarea id="svg-output" readonly placeholder="SVG output will appear here after compilation"></textarea>
      </div>
    </div>
  </div>
</div>

<script src="https://unpkg.com/monaco-editor@0.45.0/min/vs/loader.js"></script>
<script src="{{ '/assets/js/glimma-playground.js' | relative_url }}"></script>

<style>
/* Playground styles for fullscreen layout */
#playground-toolbar {
  background: #f8f9fa;
  padding: 12px 20px;
  border-bottom: 1px solid #d0d7de;
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

#playground-toolbar button {
  padding: 8px 16px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

#playground-toolbar button:hover {
  background: #f3f4f6;
  border-color: #8b949e;
}

#run-btn {
  background: #238636 !important;
  color: white !important;
  border-color: #238636 !important;
}

#run-btn:hover {
  background: #2ea043 !important;
  border-color: #2ea043 !important;
}

#playground-toolbar select {
  padding: 8px 12px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

#playground-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

#editor-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #d0d7de;
  overflow: hidden;
}

#editor-panel h4 {
  margin: 0;
  padding: 12px 20px;
  background: #f6f8fa;
  border-bottom: 1px solid #d0d7de;
  font-size: 14px;
  font-weight: 600;
  color: #24292f;
}

#monaco-editor {
  flex: 1;
  min-height: 0;
}

#output-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

#preview-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #d0d7de;
  overflow: hidden;
}

#preview-section h4 {
  margin: 0;
  padding: 12px 20px;
  background: #f6f8fa;
  border-bottom: 1px solid #d0d7de;
  font-size: 14px;
  font-weight: 600;
  color: #24292f;
}

#svg-preview {
  flex: 1;
  padding: 20px;
  overflow: auto;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-preview svg {
  max-width: 100%;
  max-height: 100%;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  background: white;
}

#loading {
  color: #656d76;
  font-style: italic;
  font-size: 14px;
}

#svg-source-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

#svg-source-section h4 {
  margin: 0;
  padding: 12px 20px;
  background: #f6f8fa;
  border-bottom: 1px solid #d0d7de;
  font-size: 14px;
  font-weight: 600;
  color: #24292f;
}

#svg-output {
  flex: 1;
  margin: 0;
  padding: 16px;
  border: none;
  font-family: 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', monospace;
  font-size: 12px;
  line-height: 1.45;
  resize: none;
  background: #f6f8fa;
  color: #24292f;
  overflow: auto;
}

.error {
  color: #d1242f;
  background: #ffebe9;
  border: 1px solid #fd8c73;
  padding: 16px;
  border-radius: 6px;
  margin: 16px;
  font-size: 14px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  #playground-layout {
    flex-direction: column;
  }
  
  #editor-panel {
    border-right: none;
    border-bottom: 1px solid #d0d7de;
    flex: none;
    height: 40vh;
  }
  
  #output-panel {
    flex: none;
    height: 60vh;
  }
  
  #preview-section, #svg-source-section {
    flex: 1;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  #playground-toolbar {
    background: #21262d;
    border-color: #30363d;
  }
  
  #playground-toolbar button {
    background: #21262d;
    border-color: #30363d;
    color: #f0f6fc;
  }
  
  #playground-toolbar button:hover {
    background: #30363d;
    border-color: #8b949e;
  }
  
  #playground-toolbar select {
    background: #21262d;
    border-color: #30363d;
    color: #f0f6fc;
  }
  
  #editor-panel h4,
  #preview-section h4,
  #svg-source-section h4 {
    background: #161b22;
    color: #f0f6fc;
    border-color: #30363d;
  }
  
  #editor-panel,
  #preview-section,
  #svg-source-section {
    border-color: #30363d;
  }
  
  #svg-preview {
    background: #0d1117;
  }
  
  #svg-output {
    background: #161b22;
    color: #f0f6fc;
  }
  
  #loading {
    color: #8b949e;
  }
}
</style>
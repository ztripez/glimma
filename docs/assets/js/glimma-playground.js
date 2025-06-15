// Glimma Playground - Browser-compatible parser and renderer
(function() {
  'use strict';

  // Example templates
  const examples = {
    'basic-fade': `scene demo {
  shape box rect x=10 y=10 width=100 height=50 fill="skyblue"
  shape label text content="Hello" x=20 y=40
  timeline:
    0s: box fadeIn over 1s
    0.5s: label fadeIn over 1s
}`,
    'move-and-scale': `scene intro {
  shape circle circle cx=50 cy=50 r=20 fill="#ff6b6b"
  shape box rect x=100 y=30 width=60 height=40 fill="#4ecdc4"
  timeline:
    0s: circle fadeIn over 0.5s
    0.5s: circle move x=150 over 2s ease="ease-out"
    1s: box fadeIn over 0.5s
    1.5s: box scale factor=1.5 over 1s ease="ease-in-out"
    2.5s: circle scale factor=0.8 over 1s
}`,
    'scenes': `scene first {
  shape box rect x=50 y=50 width=100 height=60 fill="#e74c3c"
  timeline:
    0s: box fadeIn over 1s
    2s: box fadeOut over 1s
}

scene second {
  shape circle circle cx=100 cy=100 r=30 fill="#3498db"
  timeline:
    0s: circle fadeIn over 1s
}`,
    'complex': `scene showcase {
  group particles {
    shape p1 circle cx=50 cy=30 r=3 fill="#ff9ff3"
    shape p2 circle cx=150 cy=40 r=4 fill="#54a0ff"
    shape p3 circle cx=250 cy=35 r=3 fill="#5f27cd"
  }
  
  shape title text content="Glimma Demo" x=150 y=100 fill="#2c2c54"
  shape subtitle text content="Animation Made Simple" x=150 y=130 fill="#40407a"
  
  timeline:
    0s: p1 fadeIn over 0.5s ease="ease-out"
    0.2s: p2 fadeIn over 0.5s ease="ease-out"
    0.4s: p3 fadeIn over 0.5s ease="ease-out"
    1s: title fadeIn over 1s ease="ease-out"
    1s: title scale factor=1.2 over 0.3s ease="ease-out"
    1.3s: title scale factor=1 over 0.5s ease="ease-in-out"
    2s: subtitle fadeIn over 1s ease="ease-out"
    3s: particles rotate angle=360 over 3s ease="ease-in-out"
    3s: p1 move x=250 y=30 over 3s ease="ease-in-out"
    3s: p3 move x=50 y=35 over 3s ease="ease-in-out"
}`
  };

  // Monaco Editor instance
  let editor = null;

  // Initialize playground
  function initPlayground() {
    require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.45.0/min/vs' }});
    
    require(['vs/editor/editor.main'], function () {
      // Register Glimma language
      monaco.languages.register({ id: 'glimma' });
      
      // Define syntax highlighting
      monaco.languages.setMonarchTokensProvider('glimma', {
        tokenizer: {
          root: [
            [/scene|shape|group|timeline/, 'keyword'],
            [/rect|circle|text|path/, 'type'],
            [/fadeIn|fadeOut|move|rotate|scale/, 'builtin'],
            [/over|ease/, 'operator'],
            [/[0-9]+(\.[0-9]+)?s?/, 'number'],
            [/"[^"]*"/, 'string'],
            [/#[0-9a-fA-F]{3,6}/, 'string.hex'],
            [/[{}:]/, 'delimiter'],
            [/#.*/, 'comment']
          ]
        }
      });

      // Detect if user prefers dark mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'vs-dark' : 'vs';

      // Create editor with appropriate initial theme
      editor = monaco.editor.create(document.getElementById('monaco-editor'), {
        value: examples['basic-fade'],
        language: 'glimma',
        theme: initialTheme,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true
      });

      // Apply custom themes after editor is created
      setTimeout(() => {
        try {
          // Define light theme
          monaco.editor.defineTheme('glimma-light', {
            base: 'vs',
            inherit: true,
            rules: [
              { token: 'keyword', foreground: '0969da', fontStyle: 'bold' },
              { token: 'type', foreground: '8250df' },
              { token: 'builtin', foreground: 'cf222e' },
              { token: 'operator', foreground: '116329' },
              { token: 'number', foreground: '0550ae' },
              { token: 'string', foreground: '0a3069' },
              { token: 'string.hex', foreground: '0a3069' },
              { token: 'comment', foreground: '656d76', fontStyle: 'italic' }
            ],
            colors: {
              'editor.background': '#ffffff',
              'editor.foreground': '#24292f'
            }
          });

          // Define dark theme
          monaco.editor.defineTheme('glimma-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
              { token: 'keyword', foreground: '79c0ff', fontStyle: 'bold' },
              { token: 'type', foreground: 'd2a8ff' },
              { token: 'builtin', foreground: 'ffa657' },
              { token: 'operator', foreground: '7ee787' },
              { token: 'number', foreground: '79c0ff' },
              { token: 'string', foreground: 'a5d6ff' },
              { token: 'string.hex', foreground: 'a5d6ff' },
              { token: 'comment', foreground: '8b949e', fontStyle: 'italic' }
            ],
            colors: {
              'editor.background': '#0d1117',
              'editor.foreground': '#f0f6fc'
            }
          });

          // Apply the appropriate theme
          const currentTheme = prefersDark ? 'glimma-dark' : 'glimma-light';
          monaco.editor.setTheme(currentTheme);
        } catch (error) {
          console.warn('Could not apply custom theme, using default:', error);
        }
      }, 100);

      // Listen for theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        try {
          const newTheme = e.matches ? 'glimma-dark' : 'glimma-light';
          monaco.editor.setTheme(newTheme);
        } catch (error) {
          console.warn('Could not switch theme:', error);
        }
      });

      // Setup event handlers
      setupEventHandlers();
      
      // Run initial compilation
      compileGlimma();
    });
  }

  function setupEventHandlers() {
    // Run button
    document.getElementById('run-btn').addEventListener('click', compileGlimma);
    
    // Clear button
    document.getElementById('clear-btn').addEventListener('click', function() {
      editor.setValue('');
      clearOutput();
    });
    
    // Example selector
    document.getElementById('example-select').addEventListener('change', function(e) {
      if (e.target.value && examples[e.target.value]) {
        editor.setValue(examples[e.target.value]);
        compileGlimma();
      }
    });

    // Auto-compile on editor change (debounced)
    let timeout;
    editor.onDidChangeModelContent(function() {
      clearTimeout(timeout);
      timeout = setTimeout(compileGlimma, 1000);
    });
  }

  function clearOutput() {
    document.getElementById('svg-preview').innerHTML = '<div id="loading">Click "Run" to compile and preview your animation</div>';
    document.getElementById('svg-output').value = '';
  }

  function showError(message) {
    document.getElementById('svg-preview').innerHTML = `<div class="error">Error: ${message}</div>`;
    document.getElementById('svg-output').value = `Error: ${message}`;
  }

  function compileGlimma() {
    const code = editor.getValue().trim();
    if (!code) {
      clearOutput();
      return;
    }

    try {
      // Simple client-side parser for demo purposes
      // This is a basic implementation - in a real scenario you'd want the full parser
      const svg = generateSVGFromGlimma(code);
      
      // Show preview
      document.getElementById('svg-preview').innerHTML = svg;
      
      // Show source
      document.getElementById('svg-output').value = formatXML(svg);
      
    } catch (error) {
      showError(error.message || 'Failed to compile Glimma code');
    }
  }

  // Basic Glimma-to-SVG compiler for playground demo
  function generateSVGFromGlimma(code) {
    const scenes = parseScenes(code);
    if (scenes.length === 0) {
      throw new Error('No scenes found');
    }

    let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">\n';
    
    // Add basic CSS for animations
    svg += '<style>\n';
    svg += '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }\n';
    svg += '@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }\n';
    
    // Scene transitions
    for (let i = 0; i < scenes.length; i++) {
      const sceneDuration = calculateSceneDuration(scenes[i]);
      const startTime = i * (sceneDuration + 1);
      const fadeInPercent = (1 / (sceneDuration + 2)) * 100;
      const fadeOutPercent = ((sceneDuration + 1) / (sceneDuration + 2)) * 100;
      
      svg += `#${scenes[i].name} { opacity: 0; animation: scene-${i} ${sceneDuration + 2}s ease-in-out ${startTime}s; animation-fill-mode: both; }\n`;
      svg += `@keyframes scene-${i} { 0% { opacity: 0; } ${fadeInPercent.toFixed(1)}% { opacity: 1; } ${fadeOutPercent.toFixed(1)}% { opacity: 1; } 100% { opacity: 0; } }\n`;
    }
    
    svg += '</style>\n';

    // Render scenes
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      svg += `<g id="${scene.name}">\n`;
      
      for (const shape of scene.shapes) {
        svg += renderShape(shape, scene, i);
      }
      
      svg += '</g>\n';
    }

    svg += '</svg>';
    return svg;
  }

  function parseScenes(code) {
    const scenes = [];
    // Fixed regex - removed extra backslashes
    const sceneRegex = /scene\s+(\w+)\s*\{([^}]*)\}/g;
    let match;

    while ((match = sceneRegex.exec(code)) !== null) {
      const sceneName = match[1];
      const sceneContent = match[2];
      
      const shapes = parseShapes(sceneContent);
      const timeline = parseTimeline(sceneContent);
      
      scenes.push({
        name: sceneName,
        shapes: shapes,
        timeline: timeline
      });
    }

    return scenes;
  }

  function parseShapes(content) {
    const shapes = [];
    const shapeRegex = /shape\s+(\w+)\s+(\w+)\s+([^\n]*)/g;
    let match;

    while ((match = shapeRegex.exec(content)) !== null) {
      const id = match[1];
      const type = match[2];
      const attrs = parseAttributes(match[3]);
      
      shapes.push({ id, type, attrs });
    }

    return shapes;
  }

  function parseTimeline(content) {
    const timeline = [];
    const timelineMatch = content.match(/timeline:\s*([\s\S]*?)(?=\n\s*\w|$)/);
    
    if (timelineMatch) {
      const timelineContent = timelineMatch[1];
      const entryRegex = /(\d+(?:\.\d+)?)s:\s*(\w+)\s+(\w+)\s*([^\n]*)/g;
      let match;

      while ((match = entryRegex.exec(timelineContent)) !== null) {
        const time = parseFloat(match[1]);
        const target = match[2];
        const action = match[3];
        const params = parseTimelineParams(match[4]);
        
        timeline.push({ time, target, action, ...params });
      }
    }

    return timeline;
  }

  function parseAttributes(attrString) {
    const attrs = {};
    const attrRegex = /(\w+)=([^\s]+)/g;
    let match;

    while ((match = attrRegex.exec(attrString)) !== null) {
      let value = match[2];
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (!isNaN(value)) {
        value = parseFloat(value);
      }
      attrs[match[1]] = value;
    }

    return attrs;
  }

  function parseTimelineParams(paramString) {
    const params = {};
    const overMatch = paramString.match(/over\s+(\d+(?:\.\d+)?)s/);
    if (overMatch) {
      params.duration = parseFloat(overMatch[1]);
    }
    
    const easeMatch = paramString.match(/ease="([^"]+)"/);
    if (easeMatch) {
      params.ease = easeMatch[1];
    }
    
    // Parse move/scale/rotate parameters
    const xMatch = paramString.match(/x=(\d+(?:\.\d+)?)/);
    if (xMatch) params.x = parseFloat(xMatch[1]);
    
    const yMatch = paramString.match(/y=(\d+(?:\.\d+)?)/);
    if (yMatch) params.y = parseFloat(yMatch[1]);
    
    const factorMatch = paramString.match(/factor=(\d+(?:\.\d+)?)/);
    if (factorMatch) params.factor = parseFloat(factorMatch[1]);
    
    const angleMatch = paramString.match(/angle=(\d+(?:\.\d+)?)/);
    if (angleMatch) params.angle = parseFloat(angleMatch[1]);

    return params;
  }

  function renderShape(shape, scene, sceneIndex) {
    const { id, type, attrs } = shape;
    const timeline = scene.timeline.filter(entry => entry.target === id);
    const sceneDuration = calculateSceneDuration(scene);
    const sceneStartTime = sceneIndex * (sceneDuration + 1);
    
    let element = '';
    let style = '';
    let animations = [];

    // Create SVG element
    switch (type) {
      case 'rect':
        element = `<rect id="${id}"`;
        ['x', 'y', 'width', 'height', 'fill'].forEach(attr => {
          if (attrs[attr] !== undefined) {
            element += ` ${attr}="${attrs[attr]}"`;
          }
        });
        break;
      case 'circle':
        element = `<circle id="${id}"`;
        ['cx', 'cy', 'r', 'fill'].forEach(attr => {
          if (attrs[attr] !== undefined) {
            element += ` ${attr}="${attrs[attr]}"`;
          }
        });
        break;
      case 'text':
        element = `<text id="${id}"`;
        ['x', 'y', 'fill'].forEach(attr => {
          if (attrs[attr] !== undefined) {
            element += ` ${attr}="${attrs[attr]}"`;
          }
        });
        break;
      case 'path':
        element = `<path id="${id}"`;
        ['d', 'stroke', 'fill'].forEach(attr => {
          if (attrs[attr] !== undefined) {
            element += ` ${attr}="${attrs[attr]}"`;
          }
        });
        break;
    }

    // Add initial opacity for fade animations
    const hasFadeIn = timeline.some(entry => entry.action === 'fadeIn');
    const hasFadeOut = timeline.some(entry => entry.action === 'fadeOut');
    
    if (hasFadeIn) {
      style += 'opacity: 0; ';
    }

    // Process timeline animations
    for (const entry of timeline) {
      const adjustedTime = sceneStartTime + entry.time + 1; // +1 for scene fade-in
      const duration = entry.duration || 1;
      const ease = entry.ease || 'ease-in-out';

      switch (entry.action) {
        case 'fadeIn':
          animations.push(`fadeIn ${duration}s ${ease} ${adjustedTime}s`);
          break;
        case 'fadeOut':
          animations.push(`fadeOut ${duration}s ${ease} ${adjustedTime}s`);
          break;
        case 'move':
          // Simple transform animation (would need more complex keyframes in real implementation)
          animations.push(`move-${id} ${duration}s ${ease} ${adjustedTime}s`);
          break;
        case 'scale':
          animations.push(`scale-${id} ${duration}s ${ease} ${adjustedTime}s`);
          break;
        case 'rotate':
          animations.push(`rotate-${id} ${duration}s ${ease} ${adjustedTime}s`);
          break;
      }
    }

    if (animations.length > 0) {
      style += `animation: ${animations.join(', ')}; animation-fill-mode: both; `;
    }

    if (style) {
      element += ` style="${style}"`;
    }

    if (type === 'text' && attrs.content) {
      element += `>${attrs.content}</text>`;
    } else {
      element += ' />';
    }

    return element + '\n';
  }

  function calculateSceneDuration(scene) {
    if (scene.timeline.length === 0) return 5;
    
    return Math.max(...scene.timeline.map(entry => 
      entry.time + (entry.duration || 1)
    ));
  }

  function formatXML(xml) {
    const tab = '  ';
    let formatted = '';
    let indent = '';

    xml.split(/>[^<]*</).forEach(function(node) {
      if (node.match(/^\/\w/)) {
        indent = indent.substring(tab.length);
      }
      formatted += indent + '<' + node + '>\r\n';
      if (node.match(/^<?\w[^>]*[^/]$/)) {
        indent += tab;
      }
    });

    return formatted.substring(1, formatted.length - 3);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlayground);
  } else {
    initPlayground();
  }

})();
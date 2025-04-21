import { html2md } from '@adobe/helix-importer';

// Initialize CodeMirror
const editor = CodeMirror.fromTextArea(document.getElementById('jsonEditor'), {
  mode: 'javascript',
  theme: 'monokai',
  lineNumbers: true,
  autoCloseBrackets: true,
  matchBrackets: true,
  indentUnit: 2,
  tabSize: 2,
  lineWrapping: true
});

// Function to generate HTML table from model data
function generateTable(models) {
  const model = models[0];
  let html = '<table>\n';

  // Add header row
  html += '  <tr>\n';
  html += `    <th>${model.id}</th>\n`;
  html += '  </tr>\n';

  // Add content row
  html += '  <tr>\n';
  html += '    <td>\n';
  html += '      <p>\n';

  // Process each field
  model.fields.forEach(field => {
    switch (field.component) {
      case 'text':
        if (field.name.includes('title')) {
          html += `        <h1>${field.value || ''}</h1>\n`;
        } else if (field.name.includes('description')) {
          html += `        <p>${field.value || ''}</p>\n`;
        }
        break;
      case 'reference':
        if (field.name.includes('image')) {
          const altField = model.fields.find(f => f.name === `${field.name}Alt`);
          const altText = altField?.value || 'Hero image';
          html += `        <img loading="lazy" alt="${altText}" src="${field.value || ''}" width="1600" height="914">\n`;
        }
        break;
    }
  });

  html += '      </p>\n';
  html += '    </td>\n';
  html += '  </tr>\n';
  html += '</table>';

  return html;
}

// Function to update preview
function updatePreview() {
  try {
    const modelData = JSON.parse(editor.getValue());
    const html = generateTable(modelData);
    document.getElementById('markdownPreview').innerHTML = html2md(html);

  } catch (error) {
    document.getElementById('markdownPreview').innerHTML =
      `<div class="error">Error parsing JSON: ${error.message}</div>`;
  }
}

// Add event listener for editor changes
editor.on('change', updatePreview);

// Set initial value
editor.setValue(JSON.stringify([
  {
    "id": "hero",
    "fields": [
      {
        "component": "text",
        "name": "hero_title",
        "label": "Title",
        "value": "Rock'n Roll Plush"
      },
      {
        "component": "text",
        "name": "hero_titleType",
        "label": "Type"
      },
      {
        "component": "text",
        "name": "hero_description",
        "label": "Description"
      },
      {
        "component": "reference",
        "name": "hero_image",
        "label": "Image",
        "value": "https://main--stini--bhellema.aem.live/media_1b50a0b66ff593398f892cc5a375cf708fac7141e.jpeg"
      },
      {
        "component": "text",
        "name": "hero_imageAlt",
        "label": "Alt",
        "value": "Hero image"
      }
    ]
  }
], null, 2)); 
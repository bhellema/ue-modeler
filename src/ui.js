import { createMarkdown } from './markdown.js';

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

editor.setSize('100%', '100%');

const markdownPreview = CodeMirror.fromTextArea(document.getElementById('import-markdown-source'), {
  mode: 'markdown',
  theme: 'monokai',
  lineNumbers: true,
});

markdownPreview.setSize('100%', '100%');

function groupModelFields(model) {
  const fields = [];

  const suffixes = ['Alt', 'MimeType', 'Type', 'Text', 'Title'];

  model.fields
    .filter((field) => field.name !== 'classes')
    .forEach((field) => {
      if (field.name.includes('_')) {
        const groupName = field.name.split('_')[0];
        const groupObj = fields.find((item) => item.name === groupName) || {
          name: groupName,
          fields: [],
        };

        if (!fields.includes(groupObj)) {
          fields.push(groupObj);
        }

        const suffix = suffixes.find((s) => field.name.endsWith(s));
        const collapsedName = field.name.substring(0, field.name.lastIndexOf(suffix));
        const collapsedField = groupObj.fields.find((item) => item.name === collapsedName);

        if (collapsedField) {
          collapsedField.collapsed = collapsedField.collapsed || [];
          collapsedField.collapsed.push(field);
        } else {
          groupObj.fields.push(field);
        }
      } else {
        const suffix = suffixes.find((s) => field.name.endsWith(s));
        const groupName = field.name.substring(0, field.name.indexOf(suffix));
        let groupObj = fields.find((item) => item.name === groupName);

        if (!groupObj) {
          groupObj = {
            name: field.name,
            fields: [field],
          };
          fields.push(groupObj);
        } else {
          // find the field in the group that has a name that starts with the field.name
          const collapsedField = groupObj.fields.find((item) => field.name.startsWith(item.name));
          if (!collapsedField) {
            throw new Error(`Unable to find the collapsed field for field: ${field.name}`);
          }
          collapsedField.collapsed = collapsedField.collapsed || [];
          collapsedField.collapsed.push(field);
        }
      }
    });

  return fields;
}

// Function to generate HTML table from model data
function generateTable(fields, modelId) {

  let html = '<table>\n';

  // Add header row
  html += '  <tr>\n';
  html += `    <th>${modelId.charAt(0).toUpperCase() + modelId.slice(1)}</th>\n`;
  html += '  </tr>\n';

  // Add content row
  // for each field group, add a row  
  fields.forEach(fieldGrouping => {
    html += '  <tr>\n';
    html += '    <td>\n';
    html += renderField(fieldGrouping);
    html += '    </td>\n';
    html += '  </tr>\n';
  });

  html += '</table>';

  return html;
}

function renderField(fieldGrouping) {
  let html = '';
  let hasCollapsed = fieldGrouping.fields[0].collapsed;

  if (hasCollapsed) {
    // if the field has a name that ends in Type, then add a <h> element with the value of the field grouping field
    if (fieldGrouping.fields[0].collapsed[0].name.endsWith('Type')) {
      html += `<${fieldGrouping.fields[0].collapsed[0].value}>`;
    }
    html += `${fieldGrouping.fields[0].value}`;
    if (fieldGrouping.fields[0].collapsed[0].name.endsWith('Type')) {
      html += `</${fieldGrouping.fields[0].collapsed[0].value}>`;
    }
  } else {
    html += `${fieldGrouping.fields[0].value}`;
  }

  return html;
}

// Function to update preview
async function updatePreview() {
  console.log('updatePreview');
  try {
    const modelData = JSON.parse(editor.getValue());
    const fieldGroup = groupModelFields(modelData[0]);
    const html = generateTable(fieldGroup, modelData[0].id);
    const { content } = await createMarkdown(html);
    markdownPreview.setValue(content);

  } catch (error) {
    markdownPreview.setValue(error.message);
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
        "name": "title",
        "value": "Rock'n Roll Plush"
      },
      {
        "component": "text",
        "name": "titleType",
        "value": "h2"
      },
      {
        "component": "text",
        "name": "description",
        "value": "Description Goes here"
      },
      {
        "component": "text",
        "name": "description_cta",
        "value": "Description Goes here"
      },
      {
        "component": "text",
        "name": "description_cta2",
        "value": "Description Goes here"
      },
      {
        "component": "reference",
        "name": "image",
        "value": "https://main--stini--bhellema.aem.live/media_1b50a0b66ff593398f892cc5a375cf708fac7141e.jpeg"
      },
      {
        "component": "text",
        "name": "imageAlt",
        "value": "Hero image"
      }
    ]
  }
], null, 2)); 
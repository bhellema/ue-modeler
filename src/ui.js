import { createMarkdown } from './markdown.js';
import headingField from './fields/headingField.js';
import imageField from './fields/imageField.js';
import linkField from './fields/linkField.js';

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
function generateTable(fields, modelId, classes) {

  let html = '<table>\n';

  // Add header row
  html += '  <tr>\n';
  html += `    <th>${modelId.charAt(0).toUpperCase() + modelId.slice(1)} ${classes[0] ? `(${classes[0].value})` : ''}</th>\n`;
  html += '  </tr>\n';

  // Add content row
  // for each field group, add a row  
  fields.forEach(fieldGrouping => {
    html += '  <tr>\n';
    html += '    <td>\n';
    // for each field in the fieldGrouping add it to the same td cell
    fieldGrouping.fields.forEach((field, index) => {
      // for each fiedl wrap in a <p> tag
      // if there are more fields to follow add a </p> tag
      html += `<p>${renderField(field)}</p>`;
      if (index < fieldGrouping.fields.length - 1) {
        html += '</p>';
      }

    });
    html += '    </td>\n';
    html += '  </tr>\n';
  });

  html += '</table>';

  return html;
}

function renderField(field) {
  let html = '';

  html = headingField(field, html);
  html = imageField(field, html);
  html = linkField(field, html);

  if (html == '') {
    html = field.value;
  }

  return html;
}

// Function to update preview
async function updatePreview() {
  try {
    const modelData = JSON.parse(editor.getValue());
    const classes = modelData[0].fields.filter((field) => field.name === 'classes')
    const fieldGroup = groupModelFields(modelData[0]);
    const html = generateTable(fieldGroup, modelData[0].id, classes);
    const { content } = await createMarkdown(html);
    markdownPreview.setValue(content);

  } catch (error) {
    markdownPreview.setValue(error.message);
  }
}

// Add event listener for editor changes
// debounce the updatePreview function
editor.on('change', updatePreview);

export {
  editor,
  markdownPreview
}

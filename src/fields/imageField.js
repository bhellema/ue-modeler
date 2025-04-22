import { isImage } from './fieldhelper.js';

export default function imageField(field, html) {
  if (field.value.startsWith('http') && isImage(field.value)) {
    const collapsedField = field?.collapsed?.find((f) => f.name.endsWith('Alt'));
    if (collapsedField) {
      html += `<img src="${field.value}" alt="${collapsedField.value}" />`;
    } else {
      html += `<img src="${field.value}"/>`;
    }
  }

  return html;
}
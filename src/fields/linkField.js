import { isImage } from './fieldhelper.js';

export default function linkField(field, html) {

  if (field.value.startsWith('http') && !isImage(field.value)) {
    const textField = field?.collapsed?.find((f) => f.name.endsWith('Text'));
    const typeField = field?.collapsed?.find((f) => f.name.endsWith('Type'));
    if (textField) {
      let el = '';
      if (typeField && typeField.value) {
        el = typeField.value === 'primary' ? 'strong' : 'em';
      }
      if (el) {
        html += `<${el}><a href="${field.value}">${textField.value}</a></${el}>`;
      } else {
        html += `<a href="${field.value}">${textField.value}</a>`;
      }
    } else {
      html += `<a href="${field.value}"></a>`;
    }
  }
  return html;
}
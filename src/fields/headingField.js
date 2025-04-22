export default function headingField(field, html) {

  const collapsedField = field?.collapsed?.find((f) => f.name.endsWith('Type'));

  if (collapsedField && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(collapsedField.value)) {
    html += `<${collapsedField.value}>`;
    html += `${field.value || ''}`;
    html += `</${collapsedField.value}>`;
  }
  return html;
}
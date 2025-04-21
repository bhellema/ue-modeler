# JSON to Markdown Table Converter

This Node.js application converts JSON model definitions into markdown tables, following specific field grouping rules.

## Installation

```bash
npm install
```

## Usage

```javascript
import { convertJsonToMarkdownTable } from './src/index.js';

const jsonData = {
    "models": [
        {
            "fields": [
                {
                    "component": "text",
                    "name": "hero_description",
                    "label": "Hero Description"
                },
                {
                    "component": "text",
                    "name": "hero_label",
                    "label": "Hero Label"
                }
            ]
        }
    ]
};

const markdownTable = convertJsonToMarkdownTable(jsonData);
console.log(markdownTable);
```

## Field Grouping Rules

1. Fields are listed under the `fields` node in the JSON
2. Each field has a `name` property
3. A unique name property creates a new row in the markdown table
4. Fields with names containing underscores (e.g., `hero_description`, `hero_label`) are grouped in the same cell
5. Fields with names ending in Text, MimeType, Type, Alt, or Title are collapsed with other fields that share the same name prefix

## Example Output

| Field Name | Properties |
|------------|------------|
| hero | Component: text<br>Label: Hero Description<br>Component: text<br>Label: Hero Label |
| text | Component: text<br>Label: Text |
| image | Component: image<br>Label: Image<br>Component: text<br>Label: Image Alt Text |

## Running the Example

```bash
node test/example.js
```

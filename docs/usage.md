# UE Modeler
Visualize and generate Markdown content by modeling your data in JSON. This tool helps you understand the relationship between your JSON model, data, and the resulting Markdown output.
The primary goal of this tool is to demonstrate how model field naming affects the generated Markdown.

## Interface Overview

The UE Modeler features a three-panel layout:

1. **JSON Model** (Left Panel): Defines the structure and field types of your content model
2. **Data** (Middle Panel): Contains the actual values for your content
3. **Markdown Preview** (Right Panel): Shows the generated Markdown output

This separation allows you to maintain clean model definitions while easily updating content values.

## Basics
The core concept of the UE Modeler is to let you explore how field names influence Markdown generation. 
The tool supports a simple model structure that requires two components: a model definition and corresponding data.

### Model Definition
```json
[
  {
    "id": "hero",
    "fields": [
      {
        "component": "reference",
        "name": "image"
      },
      {
        "component": "text",
        "name": "imageAlt"
      },
      {
        "component": "richtext",
        "name": "text"
      }
    ]
  }
]
```

### Data Values
```json
{
  "image": "https://www.dogs.com/dog.jpeg",
  "imageAlt": "Man with a dog",
  "text": "Woof!"
}
```

The above model and data will generate the following markdown:

```markdown
+---------------------------+
| Hero                      |
+===========================+
| ![Man with a dog][image0] |
+---------------------------+
| Woof!                     |
+---------------------------+

[image0]: https://www.dogs.com/dog.jpeg
```
   
## Fundamental Concepts

There are three concepts that need to be understood.

1. Defining a Model
2. Field Collapsing
3. Element Grouping

### Defining a Model
[Official Documentation](https://www.aem.live/developer/component-model-definitions)

When defining a model for the Universal Editor, a wide range of properties are available. However, this tool requires two main properties: component and name.

* **component** represents the field type (e.g., "text", "richtext", "reference", "aem-content")
* **name** represents the field name that will be used to match with data values

All models must be wrapped in the following JSON structure:

```JSON
[
  {
    "id": "myModel",
    "fields": [
      {
        "component": "text",
        "name": "fieldName"
      }
    ]
  }
]
```

You may define multiple models in the same JSON structure. The first model is treated as the primary model 
(typically used for block components), while subsequent models are considered child models 
(commonly used in container blocks). A sample block can be found in the block model example.

### Data Structure
The data panel contains a simple JSON object where keys match the field names defined in your model:

```JSON
{
  "fieldName": "field value",
  "anotherField": "another value"
}
```

The tool automatically merges the model structure with the data values to generate the final content.

### Field Collapsing

[Official Documentation](https://www.aem.live/developer/component-model-definitions#field-collapse)

Field collapsing is a naming convention used to merge multiple field values into a single semantic element. If a field name ends with a specific suffix—Title, Type, MimeType, Alt, or Text (case-sensitive)—it is not treated as a standalone value but rather as metadata for another field.

**Model:**
```json
[
  {
    "id": "example",
    "fields": [
      {
        "component": "text",
        "name": "heading"
      },
      {
        "component": "text",
        "name": "headingType"
      }
    ]
  }
]
```

**Data:**
```json
{
  "heading": "My Heading",
  "headingType": "h2"
}
```

In this example, headingType is collapsed into heading as an attribute. Every field with a suffix must be associated with a corresponding base field.

### Element Grouping

[Official Documentation](https://www.aem.live/developer/component-model-definitions#element-grouping)

Element grouping uses a naming convention where the group name is prefixed and separated from each field by an underscore (_). Grouped fields can also be collapsed using the suffix rules described above.

**Model:**
```json
[
  {
    "id": "example",
    "fields": [
      {
        "component": "text",
        "name": "author_name"
      },
      {
        "component": "text",
        "name": "author_position"
      },
      {
        "component": "text",
        "name": "author_picture"
      }
    ]
  }
]
```

**Data:**
```json
{
  "author_name": "John Doe",
  "author_position": "Developer",
  "author_picture": "https://example.com/john.jpg"
}
```

## Features

### Theme Switching
The application includes a theme switcher that allows you to toggle between:
- **Matrix Theme**: A dark, cyberpunk-inspired interface with green accents
- **Default Theme**: A clean, modern interface with blue accents

Your theme preference is automatically saved and restored on subsequent visits.

### Resizable Panels
All three panels can be resized by dragging the resize bars between them. Double-click any resize bar to automatically center all panels.

### Sample Models
The application includes several pre-built sample models that demonstrate different use cases:
- **Hero**: Simple hero section with image and text
- **Modal**: Modal dialog with link
- **Quote**: Quote block with attribution
- **Search**: Search component with classes
- **Mixbag**: Complex example with multiple field types
- **Block**: Container block with child items
- **Block with Classes**: Container block with CSS classes

## Tips for Effective Modeling

1. **Keep Models Clean**: Define only the structure in your model, keeping values separate in the data panel
2. **Use Descriptive Names**: Field names should clearly indicate their purpose
3. **Leverage Field Collapsing**: Use suffixes to add metadata to your fields
4. **Group Related Fields**: Use underscores to group related fields together
5. **Test Different Structures**: Experiment with different model structures to see how they affect the output

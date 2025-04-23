# UE Modeler
Visualize and generate Markdown content by modeling your data in JSON. This tool helps you understand the relationship between your JSON model and the resulting Markdown output.
The primary goal of this tool is to demonstrate how model field naming affects the generated Markdown.

## Basics
The core concept of the UE Modeler is to let you explore how field names influence Markdown generation. 
The tool is currently basic in functionality, supporting a simple model structure that requires two fields: name and value.

```json
[
  {
    "id": "hero",
    "fields": [
      {
        "name": "image",
        "value": "https://www.dogs.com/dog.jpeg"
      },
      {
        "name": "imageAlt",
        "value": "Man with a dog"
      },
      {
        "name": "text",
        "value": "Woof!"
      }
    ]
  }
]
``` 

The above model will generate the following markdown:

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

When defining a model for the Universal Editor, a wide range of properties are available. However, this tool only requires two: name and value.

* name represents the field name.
* value holds the corresponding data.

All models must be wrapped in the following JSON structure:

```JSON
[
  {
    "id": "myModel",
    "fields": []
  }
]
```

You may define multiple models in the same JSON structure. The first model is treated as the primary model 
(typically used for block components), while subsequent models are considered child models 
(commonly used in container blocks). As sample block can be found in this [git](https://raw.githubusercontent.com/bhellema/ue-modeler/refs/heads/main/src/samples/block.json) example.

### Field Collapsing

[Official Documentation](https://www.aem.live/developer/component-model-definitions#field-collapse)

Field collapsing is a naming convention used to merge multiple field values into a single semantic element. If a field name ends with a specific suffix—Title, Type, MimeType, Alt, or Text (case-sensitive)—it is not treated as a standalone value but rather as metadata for another field.

```
{
  "name": "heading"
},
{
  "name": "headingType"
}
```

In this example, headingType is collapsed into heading as an attribute. Every field with a suffix must be associated with a corresponding base field.

### Element Grouping

[Official Documentation](https://www.aem.live/developer/component-model-definitions#element-grouping)

Element grouping uses a naming convention where the group name is prefixed and separated from each field by an underscore (_). Grouped fields can also be collapsed using the suffix rules described above.

 

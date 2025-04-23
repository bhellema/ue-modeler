# UE Modeler
Visualize and create Markdown content by modeling your data in JSON. This tool helps you see the connection between the JSON model and the Markdown output.
The primary goal of this tool is to show the impact of model field naming and the impact on the markdown.

## Basics
The basic idea of the UE Modeler is to allow you to view the impact of modeling fields, and how the names impact the markdown generation.  This tool is
simplistic in what it currently supports. A basic model structure must contain a name, and value field.

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

There are two concepts that need to be understood.

1. Defining a Model
2. Field Collapsing
3. Element Grouping

### Defining a Model
Official Documentation can be found [here](https://www.aem.live/developer/component-model-definitions).

When defining a model for the Universal Editor there are a large set of properties that can be used to define the model. For the sake of this 
tooling, only two properties are required, `name` and `value`.  The `name` property is the name of the field, and the `value` property is the value of the field.

A model must be placed inside the following JSON structure:

```JSON
[
  {
    "id": "myModel",
    "fields": []
  }
]
```

You may define multiple models in the same JSON structure.  The first model is considered the primary model the scenario for block components.
The second model is considered the child model for the container block.  Details on container blocks can be found [here](https://www.aem.live/developer/component-model-definitions#container-blocks).
For an example of a container block, see the [block](../src/samples/block.json) example.

### Field Collapsing

Official Documentation can be found [here](https://www.aem.live/developer/component-model-definitions#field-collapse).

Field collapse is the mechanism to combine multiple field values into a single semantic element based on a naming convention using the suffixes Title, Type, MimeType, Alt, and Text (all case sensitive). Any property ending with any of those suffixes will not be considered a value, but rather as an attribute of another property.

```
{
  "name": "heading"
},
{
  "name": "headingType"
}
```

When naming a field with one of the following suffixes they are collapsed with their primary field.  The available suffixes are "Alt", "Text", "Title", "Type", and "MimeType".  A field with a suffix must have an associated primary field.

### Element Grouping

Official Documentation can be found [here](https://www.aem.live/developer/component-model-definitions#element-grouping).

Element grouping uses a naming convention, where the group name is separated from each property in the group by an underscore. Field collapse of the properties in a group works as previously described.

 

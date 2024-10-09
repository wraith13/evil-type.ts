# evil-type.ts

... for TypeScript

## Features

Generate the following TypeScript code from the JSON definition file.

- type definitions
- validator functions

## How to install for your project by npm

```sh
npm install @wraith13/evil-type.ts --save-dev
```

## How to use

## Development environment construction

0. Install [Visual Studio Code](https://code.visualstudio.com/) ( Not required, but recommended. )
1. Install [Node.js](https://nodejs.org/)
2. Execute `npm install`.

## How to build

requires: [Node.js](https://nodejs.org/), [TypeScript Compiler](https://www.npmjs.com/package/typescript)

`tsc -P .` or `tsc -P . -w`

## Error information example

```json
{
  "path": "./resource/type.json",
  "matchRate": {
    "./resource/type.json#comment": true,
    "./resource/type.json#$ref": true,
    "./resource/type.json#imports": true,
    "./resource/type.json#defines.Types.$type": true,
    "./resource/type.json#defines.Types.export": true,
    "./resource/type.json#defines.Types.members.schema": true,
    "./resource/type.json#defines.Types.members.CommentProperty.$type": true,
    "./resource/type.json#defines.Types.members.CommentProperty.export": true,
    "./resource/type.json#defines.Types.members.CommentProperty.members.comment?.$type": true,
    "./resource/type.json#defines.Types.members.CommentProperty.members.comment?.items.$type": true,
    "./resource/type.json#defines.Types.members.CommentProperty.members.comment?.items.type": false,
    "./resource/type.json#defines.Types.members.CommentProperty.members.comment?.items": 0.5,
    "./resource/type.json#defines.Types.members.CommentProperty.members.comment?": 0.75,
    "./resource/type.json#defines.Types.members.CommentProperty.members": 0.75,
    "./resource/type.json#defines.Types.members.CommentProperty": 0.9166666666666666,
    "./resource/type.json#defines.Types.members.OutputOptions": true,
    "./resource/type.json#defines.Types.members.SchemaOptions": true,
    "./resource/type.json#defines.Types.members.indentStyleTypeMember": true,
    "./resource/type.json#defines.Types.members.IndentStyleType": true,
    "./resource/type.json#defines.Types.members.ValidatorOptionType": true,
    "./resource/type.json#defines.Types.members.AlphaElement": true,
    "./resource/type.json#defines.Types.members.AlphaDefinition": true,
    "./resource/type.json#defines.Types.members.ImportDefinition": true,
    "./resource/type.json#defines.Types.members.Definition": true,
    "./resource/type.json#defines.Types.members.CodeDefinition": true,
    "./resource/type.json#defines.Types.members.NamespaceDefinition": true,
    "./resource/type.json#defines.Types.members.ValueDefinition": true,
    "./resource/type.json#defines.Types.members.InterfaceDefinition": true,
    "./resource/type.json#defines.Types.members.DictionaryDefinition": true,
    "./resource/type.json#defines.Types.members.ArrayElement": true,
    "./resource/type.json#defines.Types.members.OrElement": true,
    "./resource/type.json#defines.Types.members.AndElement": true,
    "./resource/type.json#defines.Types.members.LiteralElement": true,
    "./resource/type.json#defines.Types.members.ReferElement": true,
    "./resource/type.json#defines.Types.members.PrimitiveTypeEnum": true,
    "./resource/type.json#defines.Types.members.PrimitiveTypeElement": true,
    "./resource/type.json#defines.Types.members.Type": true,
    "./resource/type.json#defines.Types.members.EnumTypeElement": true,
    "./resource/type.json#defines.Types.members.TypeofElement": true,
    "./resource/type.json#defines.Types.members.ItemofElement": true,
    "./resource/type.json#defines.Types.members.TypeOrRefer": true,
    "./resource/type.json#defines.Types.members.TypeOrValue": true,
    "./resource/type.json#defines.Types.members.TypeOrValueOfRefer": true,
    "./resource/type.json#defines.Types.members": 0.9972222222222221,
    "./resource/type.json#defines.Types": 0.9990740740740741,
    "./resource/type.json#defines": 0.9990740740740741,
    "./resource/type.json#options.outputFile": true,
    "./resource/type.json#options.indentUnit": false,
    "./resource/type.json#options.indentStyle": true,
    "./resource/type.json#options.validatorOption": true,
    "./resource/type.json#options": 0.75,
    "./resource/type.json": 0.9498148148148149
  },
  "errors": [
    {
      "type": "fragment",
      "path": "./resource/type.json#defines.Types.members.CommentProperty.members.comment?.items.type",
      "requiredType": "\"null\" | \"boolean\" | \"number\" | \"string\"",
      "actualValue": "\"stringx\""
    },
    {
      "type": "solid",
      "path": "./resource/type.json#options.indentUnit",
      "requiredType": "number | \"\\t\"",
      "actualValue": "\"text\""
    }
  ]
}
```

### No error result

```json
{
  "path": "./resource/type.json",
  "matchRate": { "./resource/type.json": true },
  "errors": []
}
```

## License

[Boost Software License](./LICENSE_1_0.txt)

# ImageEditor

ImageEditor component is used to encompasses the processes of altering the images sizes, image cropping, copying the images, contrast changes and brightening for the images.

## Dependencies

The list of dependencies required to use the ImageEditor component in your application is given below:

```javascript
|-- @syncfusion/ej2-image-editor
    |-- @syncfusion/ej2-dialog
    |-- @syncfusion/ej2-toolbar
```

## Setup your development environment

To get started with the `ImageEditor`, you can clone the
[ImageEditor quickstart](https://github.com/AbinayaSubbiah/ImageEditor) project using the following commands:

```cmd
git clone https://github.com/AbinayaSubbiah/ImageEditor
cd ImageEditor
npm install
gulp build
```

## Initialize the ImageEditor

Add the HTML input element that needs to be initialized as ImageEditor in `index.html`.

`[index.html]`

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <title>Default</title>

    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Typescript UI Controls" />
    <meta name="author" content="Syncfusion" />
    <link href="../../styles/material.css" rel="stylesheet" />
    <link href="../../node_modules/@syncfusion/ej2-base/styles/material.css" rel="stylesheet" />

    <link href="http://npmci.syncfusion.com/packages/development/ej2-navigations/styles/material.css" rel="stylesheet" />
    <link href="../../node_modules/@syncfusion/ej2-buttons/styles/material.css" rel="stylesheet" />
    <script data-main="default" src="../../node_modules/requirejs/require.js"></script>
    <script src="./../require-config.js"></script>
</head>
<body>
    .content { width: 50%; margin: 100px; }
    </style>

    <div class='content'>
        <div id="sample_area">
            <div id="toolbar">

                <img id="imgeedit" />
            </div>
        </div>
    </div>
</body>

</html>
```

Now, import the  ImageEditor component to your `app.ts` and initialize it to the element `#imageedit` as shown below.

`[app.ts]`

```typescript

import { MultiSelect } from '../../src/multi-select/index';

let imgObj: ImageEditor = new ImageEditor({
    src: "../image/myimage.jpg",
    width: 500,
    height: 500
});
imgObj.appendTo("#imgeedit"); 

```

## Goal

To implement the ImageEditor component with details provided in specification document.

## Key features

* Image cropping.
* Image size alteration.
* Image theme changes.
* Exporting image.

## References

https://demos.telerik.com/aspnet-ajax/imageeditor/examples/overview/defaultcs.aspx

define(["require", "exports", "../../src/image-editor/image-editor"], function (require, exports, image_editor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var imgObj = new image_editor_1.ImageEditor({
        src: "",
    });
    imgObj.appendTo("#imgedit");
});

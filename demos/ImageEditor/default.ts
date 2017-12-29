/**
 * dropdownlist Sample
 */
import { MultiSelect } from '../../src/multi-select/index';
import { ImageEditor } from '../../src/multi-select/image-editor';
import { L10n, setCulture} from '@syncfusion/ej2-base';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from './../../src/drop-down-list/index';
import { DropDownList } from '../../src/drop-down-list/index';




let imgObj: ImageEditor = new ImageEditor({
    src: "../image/1.jpg",
    width: 500,
    height: 500
});
imgObj.appendTo("#imgedit"); 

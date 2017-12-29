
import { DropDownBase, SelectEventArgs, dropDownBaseClasses, FieldSettings, SPINNER_SIZE } from '../drop-down-base/drop-down-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { IInput } from '@syncfusion/ej2-inputs';
import { EventHandler, Property, Event } from '@syncfusion/ej2-base';
import { DropDownList } from '../drop-down-list/drop-down-list';
import { ImageEditorModel } from './image-editor-model';
import { createElement,isNullOrUndefined, Component} from '@syncfusion/ej2-base';
/* tslint:disable */
import { SortOrder } from '@syncfusion/ej2-lists';
import { Toolbar } from '@syncfusion/ej2-navigations'


export class ImageEditor extends Component<HTMLImageElement> {
    public toolbar: Toolbar;
    public dialogObj: Dialog;
    public image64Str: string;
    /**
     * Sets the CSS classes to root element of this component which helps to customize the
     * complete styles.
     * @default null
     */
    @Property(null)
    public src: string;
    /**
     * Gets or sets the width of the component. By default, it sizes based on its parent.
     * container dimension.
     * @default 1000
     */
    @Property(800)
    public width: number;
    /**
     * Gets or sets the height of the component. By default, it sizes based on its parent.
     * container dimension.
     * @default 1000
     */
    @Property(800)
    public height: number;
    /**
     * Gets or sets the imagestyle of the component. By default, it sizes based on its parent.
     * container dimension.
     * @default 
     */
    @Property(null)
    public negative: number;
    /**
    * An array of items that is used to configure Toolbar commands.
    * @default [].
    */

    public items: Array<object>;

    constructor(option?: ImageEditorModel, element?: HTMLImageElement) {
        super(option, element)
    }
    private wrapper: HTMLElement;
    private toolbarwrapper: HTMLElement;
    private tbarObj: Toolbar;
    private upload: HTMLElement
    private canvas: HTMLCanvasElement;
    private exportElem: HTMLElement

    protected preRender(): void {
        // pre render code snippets
    }
    /**
    * Get component name.
    * @returns string
    * @private
    */
    public getModuleName(): string {
        return 'ImageEditor';
    }
    /**
    * Get the properties to be maintained in the persisted state.
    * @returns string
    */
    public getPersistData(): string {
        return this.addOnPersist([]);
    }
    public render(): void {
        this.wrapper = createElement('div', { className: 'e-img-wrapper' });
        this.wrapper.style.overflow='auto';
        this.wrapper.style.height='600px';
        this.wrapper.appendChild(this.element);
        this.upload = createElement('input', { className: 'e-upload' });
        this.upload.setAttribute("type", "file");
        this.upload.style.display = 'none';
        EventHandler.add(this.upload, "change", this.imageUpload, this);
        this.wrapper.appendChild(this.upload);
        this.wrapper.style.backgroundImage = "url('../../src/multi-select/image/preview.gif')";
        if(this.src.length){
            this.element.src = this.src;
        }
        else{
            this.element.style.display = 'none';
        } 
        this.element.height = this.height;
        this.element.width = this.height;
        this.exportElem = createElement('a', { className: 'e-export' });
        this.wrapper.appendChild(this.exportElem);
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.image64Str = "";
        let toolbar = new Toolbar({
            items: [
                {
                    prefixIcon: 'e-picture-icon tb-icons', tooltipText: 'import'
                },
                {
                    prefixIcon: 'e-copy-icon tb-icons', tooltipText: 'size'
                },
                {
                    prefixIcon: 'e-paste-icon tb-icons', tooltipText: 'rotate'
                },
                {
                    prefixIcon: 'e-export-icon tb-icons', tooltipText: 'Export'
                },
                {
                    prefixIcon: 'e-text-icon tb-icons', tooltipText: 'text'
                },
                { template: "<div><input type='text' id='list'/></div>" },
            ],

            created: this.data.bind(this),
            clicked: this.data1.bind(this)
        }, );
        this.tbarObj = toolbar;
        toolbar.appendTo('#toolbar');
        let dialogEle: HTMLElement = createElement('div', { id: 'modalDialog' });
        this.wrapper.parentElement.appendChild(dialogEle);
        this.dialogObj = new Dialog({
            width: "200px",
            header: 'Image Editor',
            content: '<span>width: <input type="text" id="imagewidth"></span><br/><span>height: <input type="text" id="imageheight"></span> ',
            target: this.element.parentElement,
            isModal: true,
            animationSettings: { effect: 'None' },
            buttons: [{
                click: this.dlgButtonClick.bind(this),
                buttonModel: { content: 'OK', cssClass: 'e-flat', isPrimary: true }
            }],
            open: this.dialogOpen.bind(this),
            close: this.dialogClose.bind(this)
        });
        this.dialogObj.appendTo('#modalDialog');
        this.dialogObj.hide();
        this.wireEvents();

        let datasource: { [key: string]: Object }[] = [
            { text: "Blur" },
            { text: "Brightness" },
            { text: "BlackandWhite" },
            { text: "Nagative" },
            { text: "Shadow" },
            { text: "Default" }
        ];
        let listObj: DropDownList = new DropDownList({
            dataSource: datasource,
            width: "70%",
            fields: { text: 'text' },
            placeholder: 'Image Briteness',
            select: this.onSelect.bind(this)

        });
        listObj.appendTo('#list');
    }
    private dialogClose(): void {
    }

    private dialogOpen(): void {
    }

    private dlgButtonClick(e: any): void {
        this.element.width = parseInt((document.getElementById('imagewidth') as HTMLInputElement).value);
        this.element.height = parseInt((document.getElementById('imageheight') as HTMLInputElement).value);
        this.dialogObj.hide();
    }
    private onSelect(e: any): void {
        if (e.itemData.text == "Blur") {
            this.element.style.filter = 'blur(5px)';
        }
        if (e.itemData.text == "Brightness") {
            this.element.style.filter = 'brightness(200%)';
        }
        if (e.itemData.text == "BlackandWhite") {
            this.element.style.filter = 'grayscale(100%)';
        }
        if (e.itemData.text == "Nagative") {
            this.element.style.filter = 'invert(100%)';
        }
        if (e.itemData.text == "Shadow") {
            this.element.style.filter = 'drop-shadow(8px 8px 10px red)';
        }
        if (e.itemData.text == "Default") {
            this.element.style.filter = 'initial';
        }
    }
    private imageUpload(e: Event): void {
        let reader = new FileReader();
        let proxy = this;
        reader.addEventListener('load', function () {
            let imgElement = (document.getElementById('imgedit') as HTMLImageElement);
            if(imgElement.style.display == 'none'){
                imgElement.style.display ='block';
            }
            imgElement.src = reader.result;
            proxy.image64Str = reader.result;
        });
        reader.readAsDataURL((e.target as HTMLInputElement).files[0]);
    }
    public data(): void {
        this.tbarObj.element.appendChild(this.wrapper);

    }
    public data1(e: any): void {
        this.wrapper;
        if (e.item.properties.prefixIcon == "e-picture-icon tb-icons") {
            this.upload.click();
        }
        if (e.item.properties.prefixIcon == "e-copy-icon tb-icons") {
            this.onCrop(e);
        }
        if (e.item.properties.prefixIcon == "e-paste-icon tb-icons") {
            this.onRotate(e);
        }
        if (e.item.properties.prefixIcon == "e-export-icon tb-icons") {
            this.onExport(e);
        }
        if (e.item.properties.prefixIcon == "e-text-icon tb-icons") {
            this.onText(e);
        }

    }
    private onExport(e: any): void {
        let image = new Image();
        image.src = this.element.src;
        image.style.width = this.width + "px";
        image.style.height = this.height + "px";
        if (isNullOrUndefined(this.canvas)) {
            this.canvas = document.createElement('canvas');
            document.body.appendChild(this.canvas);
        }
        let context = this.canvas.getContext('2d');
        let proxy = this;
        image.onload = function () {
            proxy.canvas.width = proxy.element.width;
            proxy.canvas.height = proxy.element.height;
            context.imageSmoothingEnabled = true;
            context.drawImage(image, 0, 0, proxy.element.width, proxy.element.height);
            var url = proxy.canvas.toDataURL('image/jpeg');
            proxy.canvas.remove();
            proxy.exportElem.setAttribute('href', url);
            proxy.exportElem.setAttribute('download', "sample.jpg");
            proxy.exportElem.click();
        }
    }

    private onText(e: any): void {

        let textwraper = createElement('input', { className: 'e-text' });
        this.wrapper.appendChild(textwraper);
        textwraper.style.position = 'absolute';
        textwraper.style.top = '50px';
        textwraper.style.left = '10px';
        textwraper.style.background='transparent';
        textwraper.style.borderWidth='0px 0px 2px 0';
        EventHandler.add(textwraper, "keyup", this.keyUp, this);
    }
    private keyUp(e: any): void {
        if (e.keyCode == 13) {
            debugger
            let textVal = e.target.value;
            e.target.remove();
            let image = new Image();
            image.src = this.element.src;
            image.style.width = this.width + "px";
            image.style.height = this.height + "px";
            if (isNullOrUndefined(this.canvas)) {
                this.canvas = document.createElement('canvas');
                document.body.appendChild(this.canvas);
            }
            let context = this.canvas.getContext('2d');
            let proxy = this;
            image.onload = function () {
                proxy.canvas.width = proxy.element.width;
                proxy.canvas.height = proxy.element.height;
                context.drawImage(image, 0, 0, proxy.element.width, proxy.element.height);
                context.font = "20px calibri";
                context.fillText(textVal, 100, 100);
                var url = proxy.canvas.toDataURL();
                proxy.canvas.remove();
                proxy.element.src = url;
            }
        }
    }
    private onCrop(e: any): void {
        this.dialogObj.show();
    }
    private onRotate(e: any): void {
        let degreeVal = this.element.style.transform.length ? parseInt(this.element.style.transform.replace(/\D+/g, '')) : 0;
        this.element.style.transform = 'rotate(' + (degreeVal + 90) + 'deg)';
    }
    public destroy(): void { }

    protected wireEvents(): void {

    }
    public onPropertyChanged(newProp: ImageEditor, oldProp: ImageEditor): void {
    }
}
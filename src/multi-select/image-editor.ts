
import { DropDownBase, SelectEventArgs, dropDownBaseClasses, FieldSettings, SPINNER_SIZE } from '../drop-down-base/drop-down-base';
import { Popup, createSpinner, showSpinner, hideSpinner, Dialog } from '@syncfusion/ej2-popups';
import { IInput } from '@syncfusion/ej2-inputs';
import { attributes } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { NotifyPropertyChanges } from '@syncfusion/ej2-base';
import { EventHandler, Property, Event, compile, L10n, EmitType, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Animation, AnimationModel, Browser, Component, } from '@syncfusion/ej2-base';
import { PopupEventArgs, FilteringEventArgs, DropDownList } from '../drop-down-list/drop-down-list';
import { MultiSelectModel } from '../multi-select';
import { ImageEditorModel } from '../multi-select/image-editor-model'
import { Search } from '../common/incremental-search';
import { createElement, append, addClass, removeClass, setStyleAttribute, closest, detach, remove } from '@syncfusion/ej2-base';
import { getUniqueID, formatUnit, isNullOrUndefined, isUndefined } from '@syncfusion/ej2-base';
/* tslint:disable */
import { DataManager, Query } from '@syncfusion/ej2-data';
import { SortOrder } from '@syncfusion/ej2-lists';
import { Toolbar } from '@syncfusion/ej2-navigations'


export class ImageEditor extends Component<HTMLImageElement> {
    public toolbar: Toolbar;
    public dialogObj: Dialog;
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
    @Property(1000)
    public width: number;
    /**
     * Gets or sets the height of the component. By default, it sizes based on its parent.
     * container dimension.
     * @default 1000
     */
    @Property(1000)
    public height: number;
    /**
     * Gets or sets the imagestyle of the component. By default, it sizes based on its parent.
     * container dimension.
     * @default 
     */
    @Property(null)
    public negative: number;

    constructor(option?: ImageEditorModel, element?: HTMLImageElement) {
        super(option, element)
    }
    private wrapper: HTMLElement;
    private toolbarwrapper: HTMLElement;
    private tbarObj: Toolbar;
    private upload: HTMLElement

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
        this.wrapper.appendChild(this.element);
        this.upload = createElement('input', { className: 'e-upload' });
        this.upload.setAttribute("type", "file");
        this.upload.style.display = 'none';
        EventHandler.add(this.upload, "change", this.imageUpload);
        this.wrapper.appendChild(this.upload);
        this.wrapper.style.backgroundImage = "url('../../src/multi-select/image/preview.gif')";
        this.element.src = this.src;
        this.element.height = this.height;
        this.element.width = this.height;
        let toolbar = new Toolbar({
            items: [
                {
                    prefixIcon: 'e-picture-icon tb-icons', tooltipText: 'Picture'
                },
                {
                    prefixIcon: 'e-copy-icon tb-icons', tooltipText: 'Copy'
                },
                {
                    prefixIcon: 'e-paste-icon tb-icons', tooltipText: 'Paste'
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
        reader.addEventListener('load', function () {
            (document.getElementById('imgedit') as HTMLImageElement).src = reader.result;
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

    }
    private onCrop(e: any): void {
        this.dialogObj.show();
    }
    private onRotate(e: any): void {

        this.element.style.transform = 'rotate(180deg)';
    }
    public destroy(): void { }

    protected wireEvents(): void {

    }
    public onPropertyChanged(newProp: ImageEditor, oldProp: ImageEditor): void {
    }
}
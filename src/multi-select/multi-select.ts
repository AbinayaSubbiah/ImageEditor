/// <reference path='../drop-down-base/drop-down-base-model.d.ts'/>
import { DropDownBase, SelectEventArgs, dropDownBaseClasses, FieldSettings, SPINNER_SIZE } from '../drop-down-base/drop-down-base';
import { Popup, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { IInput } from '@syncfusion/ej2-inputs';
import { attributes } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges } from '@syncfusion/ej2-base';
import { EventHandler, Property, Event, compile, L10n, EmitType, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Animation, AnimationModel, Browser } from '@syncfusion/ej2-base';
import { PopupEventArgs, FilteringEventArgs } from '../drop-down-list/drop-down-list';
import { MultiSelectModel } from '../multi-select';
import { Search } from '../common/incremental-search';
import { createElement, append, addClass, removeClass, setStyleAttribute, closest, detach, remove } from '@syncfusion/ej2-base';
import { getUniqueID, formatUnit, isNullOrUndefined, isUndefined } from '@syncfusion/ej2-base';
/* tslint:disable */
import { DataManager, Query } from '@syncfusion/ej2-data';
import { SortOrder } from '@syncfusion/ej2-lists';
export interface RemoveEventArgs extends SelectEventArgs { }
/* tslint:enable */
const FOCUS: string = 'e-input-focus';
const DISABLED: string = 'e-disabled';
const OVER_ALL_WRAPPER: string = 'e-multiselect e-input-group';
const ELEMENT_WRAPPER: string = 'e-multi-select-wrapper';
const ELEMENT_MOBILE_WRAPPER: string = 'e-mob-wrapper';
const HIDE_LIST: string = 'e-hide-listitem';
const DELIMITER_VIEW: string = 'e-delim-view';
const CHIP_WRAPPER: string = 'e-chips-collection';
const CHIP: string = 'e-chips';
const CHIP_CONTENT: string = 'e-chipcontent';
const CHIP_CLOSE: string = 'e-chips-close e-icon';
const CHIP_SELECTED: string = 'e-chip-selected';
const SEARCHBOX_WRAPPER: string = 'e-searcher';
const DELIMITER_VIEW_WRAPPER: string = 'e-delimiter';
const ZERO_SIZE: string = 'e-zero-size';
const REMAIN_WRAPPER: string = 'e-remain';
const CLOSEICON_CLASS: string = 'e-chips-close e-icon e-close-hooker';
const DELIMITER_WRAPPER: string = 'e-delim-values';
const POPUP_WRAPPER: string = 'e-ddl e-popup e-multi-select-list-wrapper';
const INPUT_ELEMENT: string = 'e-dropdownbase';
const RTL_CLASS: string = 'e-rtl';
const CLOSE_ICON_HIDE: string = 'e-close-icon-hide';
const MOBILE_CHIP: string = 'e-mob-chip';
const FOOTER: string = 'e-ddl-footer';
const HEADER: string = 'e-ddl-header';
const DISABLE_ICON: string = 'e-ddl-disable-icon';
const SPINNER_CLASS: string = 'e-ms-spinner-icon';
/**
 * The Multiselect allows the user to pick a more than one value from list of predefined values.
 * ```html
 * <select id="list">
 *      <option value='1'>Badminton</option>
 *      <option value='2'>Basketball</option>
 *      <option value='3'>Cricket</option>
 *      <option value='4'>Football</option>
 *      <option value='5'>Tennis</option>
 * </select>
 * ```
 * ```typescript
 * <script>
 *   var multiselectObj = new Multiselect();
 *   multiselectObj.appendTo("#list");
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class MultiSelect extends DropDownBase implements IInput {
    private spinnerElement: HTMLElement;
    private selectAllAction: Function;
    private setInitialValue: Function;
    /**
     * Sets the CSS classes to root element of this component which helps to customize the
     * complete styles.
     * @default null
     */
    @Property(null)
    public cssClass: string;
    /**
     * Gets or sets the width of the component. By default, it sizes based on its parent.
     * container dimension.
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;
    /**
     * Gets or sets the height of the popup list. By default it renders based on its list item.
     * @default '300px'
     */
    @Property('300px')
    public popupHeight: string | number;
    /**
     * Gets or sets the width of the popup list and percentage values has calculated based on input width.
     * @default '100%'
     */
    @Property('100%')
    public popupWidth: string | number;
    /**
     * Gets or sets the placeholder in the component to display the given information
     * in input when no item selected. 
     * @default null
     */
    @Property(null)
    public placeholder: string;
    /**
     * Gets or sets the additional attribute to `HtmlAttributes` property in DropDownList,
     * which helps to add attribute like title, name etc, input should be key value pair.
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string; };
    /**
     * Accepts the template design and assigns it to the selected list item in the input element of the component.
     * @default null
     */
    @Property(null)
    public valueTemplate: string;
    /**
     * Accepts the template design and assigns it to the header container of the popup list.
     * @default null
     */
    @Property(null)
    public headerTemplate: string;
    /**
     * Accepts the template design and assigns it to the footer container of the popup list.
     * @default null
     */
    @Property(null)
    public footerTemplate: string;
    /**
     * Accepts the template design and assigns it to each list item present in the popup.
     * @default null
     */
    @Property(null)
    public itemTemplate: string;
    /**
     * To enable the filtering option in this component. 
     * Filter action performs when type in search box and collect the matched item through `filtering` event.
     * If searching character does not match, `noRecordsTemplate` property value will be shown. 
     * @default false
     */
    @Property(false)
    public allowFiltering: boolean;
    /**
     * Allows user to add a custom value, the value which is not present in the suggestion list. 
     * @default false
     */
    @Property(false)
    public allowCustomValue: boolean;
    /**
     * Enables close icon with the each selected item.
     * @default true
     */
    @Property(true)
    public showClearButton: boolean;
    /**
     * Sets limitation to the value selection.
     * based on the limitation, list selection will be prevented.
     * @default 1000
     */
    @Property(1000)
    public maximumSelectionLength: number;
    /**
     * Gets or sets the `readonly` to input or not. Once enabled, just you can copy or highlight 
     * the text however tab key action will perform.
     * 
     * @default false
     */
    @Property(false)
    public readonly: boolean;
    /**
     * Selects the list item which maps the data `text` field in the component.
     * @default null
     */
    @Property(null)
    public text: string;
    /**
     * Selects the list item which maps the data `value` field in the component.
     * @default null
     */
    @Property(null)
    public value: [number | string];
    /**
     * Hides the selected item from the list item.
     * @default false
     */
    @Property(false)
    public hideSelectedItem: boolean;
    /**
     * Based on the property, when item get select popup visibility state will changed.
     * @default true
     */
    @Property(true)
    public closePopupOnSelect: boolean;
    /**
     * configures visibility mode for component interaction.
     * 
     *   - `box` - selected items will be visualized in chip.
     * 
     *   - `delimiter` - selected items will be visualized in text content.
     * 
     *   - `default` - on `focus in` component will act in `box` mode.
     *    on `blur` component will act in `delimiter` mode.
     * @default default
     */
    @Property('default')
    public mode: visualMode;
    /**
     * Sets the delimiter character for 'default' and 'delimiter' visibility modes.
     * @default ,
     */
    @Property(',')
    public delimiterChar: string;
    /**
     * Sets case sensitive option for filter operation.
     * @default false
     */
    @Property(true)
    public ignoreCase: boolean;
    /**
     * Fires each time when selection changes happened in list items after model and input value get affected.
     * @event
     */
    @Event()
    public change: EmitType<MultiSelectChangeEventArgs>;
    /**
     * Fires before the selected item removed from the widget.
     * @event
     */
    @Event()
    public removing: EmitType<RemoveEventArgs>;
    /**
     * Fires after the selected item removed from the widget.
     * @event
     */
    @Event()
    public removed: EmitType<RemoveEventArgs>;
    /**
     * Fires when popup opens after animation completion.
     * @event
     */
    @Event()
    public open: EmitType<PopupEventArgs>;
    /**
     * Fires when popup close after animation completion.
     * @event
     */
    @Event()
    public close: EmitType<PopupEventArgs>;
    /**
     * Event triggers when the input get focus-out.
     * @event
     */
    @Event()
    public blur: EmitType<Object>;
    /**
     * Event triggers when the input get focused.
     * @event
     */
    @Event()
    public focus: EmitType<Object>;
    /**
     * Triggers event,when user types a text in search box.
     * @event
     */
    @Event()
    public filtering: EmitType<FilteringEventArgs>;
    /**
     * Fires before set the selected item as chip in the component.
     * @event
     */
    @Event()
    public tagging: EmitType<TaggingEventArgs>;
    /**
     * Triggers when the customValue is selected.
     * @event
     */
    @Event()
    public customValueSelection: EmitType<CustomValueEventArgs>;
    /**
     * Constructor for creating the DropDownList widget.
     */
    constructor(option?: MultiSelectModel, element?: string | HTMLElement) {
        super(option, element);
    };
    private isValidKey: boolean = false;
    private mainList: HTMLElement;
    private mainData: { [key: string]: Object }[];
    private mainListCollection: HTMLElement[] = [];
    private customValueFlag: boolean;
    private inputElement: HTMLInputElement;
    private componentWrapper: HTMLDivElement;
    private overAllWrapper: HTMLDivElement;
    private searchWrapper: HTMLElement;
    private viewWrapper: HTMLElement;
    private chipCollectionWrapper: HTMLElement;
    private overAllClear: HTMLElement;
    private hiddenElement: HTMLSelectElement;
    private delimiterWrapper: HTMLElement;
    private popupObj: Popup;
    private inputFocus: boolean;
    private header: HTMLElement;
    private footer: HTMLElement;
    private initStatus: boolean;
    private popupWrapper: HTMLDivElement;
    private keyCode: number;
    private beforePopupOpen: boolean = false;
    private remoteCustomValue: boolean;
    private enableRTL(state: boolean): void {
        if (state) {
            this.overAllWrapper.classList.add(RTL_CLASS);
        } else {
            this.overAllWrapper.classList.remove(RTL_CLASS);
        }
        if (this.popupObj) {
            this.popupObj.enableRtl = state;
            this.popupObj.dataBind();
        }
    }
    private updateHTMLAttribute(): void {
        if (Object.keys(this.htmlAttributes).length) {
            for (let htmlAttr of Object.keys(this.htmlAttributes)) {
                switch (htmlAttr) {
                    case 'class':
                        this.overAllWrapper.classList.add(this.htmlAttributes[htmlAttr]);
                        this.popupWrapper.classList.add(this.htmlAttributes[htmlAttr]);
                        break;
                    case 'disabled':
                        this.enable(false);
                        break;
                    case 'placeholder':
                        this.inputElement.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                        break;
                    case 'name':
                        this.hiddenElement.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                        break;
                    default:
                        let defaultAttr: string[] = ['title', 'id', 'required'];
                        if (defaultAttr.indexOf(htmlAttr) > -1) {
                            this.element.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                        } else {
                            this.overAllWrapper.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                        }
                        break;
                }
            }
        }
    }

    private updateReadonly(state: boolean): void {
        if (state) {
            this.inputElement.setAttribute('readonly', 'true');
        } else {
            this.inputElement.removeAttribute('readonly');
        }
    }

    private updateClearButton(state: boolean): void {
        if (state) {
            if (this.overAllClear.parentNode) {
                this.overAllClear.style.display = '';
            } else {
                this.componentWrapper.appendChild(this.overAllClear);
            }
            this.componentWrapper.classList.remove(CLOSE_ICON_HIDE);
        } else {
            this.overAllClear.style.display = 'none';
            this.componentWrapper.classList.add(CLOSE_ICON_HIDE);
        }
    }
    private updateCssClass(): void {
        if (this.cssClass) {
            this.popupWrapper.classList.add(this.cssClass);
            this.overAllWrapper.classList.add(this.cssClass);
        }
    }
    private onPopupShown(): void {
        let animModel: AnimationModel = { name: 'FadeIn', duration: 100 };
        this.focusAtFirstListItem();
        document.body.appendChild(this.popupObj.element);
        this.refreshPopup();
        this.popupObj.show(animModel);
        attributes(this.inputElement, { 'aria-expanded': 'true' });
        let eventArgs: PopupEventArgs = { popup: this.popupObj };
        this.refreshListItems(null);
        this.trigger('open', eventArgs);
    }
    private focusAtFirstListItem(): void {
        if (this.ulElement && this.ulElement.querySelector('li.'
            + dropDownBaseClasses.li)) {
            let element: HTMLElement = <HTMLElement>this.ulElement.querySelector('li.'
                + dropDownBaseClasses.li + ':not(.'
                + HIDE_LIST + ')');
            if (element !== null) {
                this.removeFocus();
                this.addListFocus(element);
            }
        }
    }
    private focusAtLastListItem(data: string): void {
        let activeElement: { [key: string]: Element | number };
        if (data) {
            activeElement = Search(data, this.liCollections, 'StartsWith', this.ignoreCase);
        } else {
            if (this.value && this.value.length) {
                Search(<string>this.value[this.value.length - 1], this.liCollections, 'StartsWith', this.ignoreCase);
            } else {
                activeElement = null;
            }
        }
        if (activeElement && activeElement.item !== null) {
            this.addListFocus((<HTMLElement>activeElement.item));
            this.scrollBottom((<HTMLElement>activeElement.item), <number>activeElement.index);
        }
    }

    protected getAriaAttributes(): { [key: string]: string } {
        let ariaAttributes: { [key: string]: string } = {
            'aria-disabled': 'false',
            'aria-owns': this.element.id + '_options',
            'role': 'listbox',
            'aria-multiselectable': 'true',
            'aria-activedescendant': 'null',
            'aria-haspopup': 'true',
            'aria-expanded': 'false'
        };
        return ariaAttributes;
    }
    private updateListARIA(): void {
        attributes(this.ulElement, { 'id': this.element.id + '_options', 'role': 'listbox', 'aria-hidden': 'false' });
        attributes(this.inputElement, this.getAriaAttributes());
        let li: HTMLElement[] & NodeListOf<Element>;
        li = <HTMLElement[] & NodeListOf<Element>>this.list.querySelectorAll('li.' + dropDownBaseClasses.li);
        let temp: number = li.length;
        if (li && li.length) {
            while (temp > 0) {
                if (li[temp - 1].getAttribute('aria-selected') !== 'true') {
                    li[temp - 1].setAttribute('aria-selected', 'false');
                }
                temp--;
            }
        }
    }
    private removelastSelection(e: KeyboardEventArgs): void {
        let elements: NodeListOf<Element>;
        elements = <NodeListOf<HTMLElement>>
            this.chipCollectionWrapper.querySelectorAll('span.' + CHIP);
        let value: string = elements[elements.length - 1].getAttribute('data-value');
        this.removeValue(value, e);
        this.removeChipSelection();
        this.updateDelimeter(this.delimiterChar);
        this.makeTextBoxEmpty();
        if (this.allowFiltering && this.mainList && this.listData) {
            let list: HTMLElement = this.mainList.cloneNode ? <HTMLElement>this.mainList.cloneNode(true) : this.mainList;
            this.onActionComplete(list, this.mainData);
            this.refreshSelection();
        }
        this.focusAtLastListItem(value);
    }
    protected onActionFailure(e: Object): void {
        super.onActionFailure(e);
        this.renderPopup();
        this.onPopupShown();
    }
    protected onActionComplete(ulElement: HTMLElement, list: { [key: string]: Object }[], e?: Object, isUpdated?: boolean): void {
        super.onActionComplete(ulElement, list, e);
        if (!this.mainList && !this.mainData) {
            this.mainList = ulElement.cloneNode ? <HTMLElement>ulElement.cloneNode(true) : ulElement;
            this.mainData = list;
            this.mainListCollection = this.liCollections;
        } else if (!isNullOrUndefined(this.mainData) && this.mainData.length === 0) {
            this.mainData = list;
        }
        if (this.remoteCustomValue && this.allowCustomValue && this.inputFocus && !this.allowFiltering) {
            this.checkForCustomValue(this.tempQuery, this.fields);
            return;
        }
        if (this.value && this.value.length) {
            this.refreshSelection();
        }
        this.updateListARIA();
        this.unwireListEvents();
        this.wireListEvents();
        if (!isNullOrUndefined(this.setInitialValue)) { this.setInitialValue(); }
        if (!isNullOrUndefined(this.selectAllAction)) { this.selectAllAction(); }
        this.renderPopup();
        this.refreshPopup();
        if (this.beforePopupOpen) {
            this.beforePopupOpen = false;
            this.onPopupShown();
        }
    }
    private refreshSelection(): void {
        let value: string | number;
        let element: HTMLElement;
        let className: string = this.hideSelectedItem ?
            HIDE_LIST :
            dropDownBaseClasses.selected;
        for (let index: number = 0; this.value[index]; index++) {
            value = this.value[index];
            element = <HTMLElement>this.ulElement.querySelector('li[data-value="' + value + '"]');
            if (element) {
                addClass([element], className);
            }
        }
    }
    private KeyUp(e: KeyboardEventArgs): void {
        this.isValidKey = e.keyCode === 8 || this.isValidKey;
        if (this.isValidKey) {
            this.isValidKey = false;
            this.expandTextbox();
            switch (e.keyCode) {
                default:
                    if (!this.isPopupOpen()) {
                        this.showPopup();
                    }
                    if (this.liCollections) {
                        if (this.checkTextLength() && !this.allowFiltering && (e.keyCode !== 8)) {
                            this.focusAtFirstListItem();
                        } else {
                            let text: string = this.inputElement.value;
                            this.keyCode = e.keyCode;
                            if (this.allowFiltering) {
                                this.trigger('filtering', {
                                    text: this.inputElement.value,
                                    updateData: this.dataUpdater.bind(this),
                                    event: e
                                });
                            } else if (this.allowCustomValue) {
                                let query: Query = new Query();
                                query = (text !== '') ? query.where(this.fields.text, 'startswith', text, true) : query;
                                this.dataUpdater(this.mainData, query, this.fields);
                                break;
                            } else {
                                let liCollections: HTMLElement[];
                                liCollections = <HTMLElement[] & NodeListOf<Element>>
                                    this.list.querySelectorAll('li.' + dropDownBaseClasses.li);
                                let activeElement: { [key: string]: Element | number } =
                                    Search(this.inputElement.value, liCollections, 'StartsWith', this.ignoreCase);

                                if (activeElement && activeElement.item !== null) {
                                    this.addListFocus((<HTMLElement>activeElement.item));
                                    this.list.scrollTop =
                                        (<HTMLElement>activeElement.item).getBoundingClientRect().height * (<number>activeElement.index);
                                }
                            }
                        }
                    }
            }
        }
    }
    private dataUpdater(
        dataSource: { [key: string]: Object }[] | DataManager | string[],
        query?: Query, fields?: FieldSettings): void {
        if (this.inputElement.value.trim() === '') {
            let list: HTMLElement = this.mainList.cloneNode ? <HTMLElement>this.mainList.cloneNode(true) : this.mainList;
            this.onActionComplete(list, this.mainData);
            if (this.value && this.value.length) {
                this.refreshSelection();
            }
            if (this.keyCode !== 8) {
                this.focusAtFirstListItem();
            }
        } else {
            this.resetList(dataSource, fields, query);
            if (this.allowCustomValue) {
                if (!(dataSource instanceof DataManager)) {
                    this.checkForCustomValue(query, fields);
                } else {
                    this.remoteCustomValue = true;
                    this.tempQuery = query;
                }
            }
        }
        this.refreshPopup();
    }
    private tempQuery: Query;
    private tempValues: [number | string];
    private checkForCustomValue(query?: Query, fields?: FieldSettings): void {
        let dataChecks: boolean = !this.getValueByText(this.inputElement.value, this.ignoreCase);
        if (this.allowCustomValue && dataChecks) {
            let text: string = this.fields.text;
            let value: string = this.fields.value;
            let data: { [key: string]: Object } = {};
            let dataSource: string[] = Object.keys((this.mainData as { [key: string]: Object; }[])[0]);
            for (let i: number = 0; i < dataSource.length; i++) {
                data[dataSource[i]] = '';
            }
            data[value] =  data[text] = this.inputElement.value;
            let tempData: [{ [key: string]: Object }] = JSON.parse(JSON.stringify(this.listData));
            tempData.splice(0, 0, data);
            this.resetList(tempData, fields ? fields : this.fields, query);
        }
        if (this.value && this.value.length) {
            this.refreshSelection();
        }
    }
    protected getNgDirective(): string {
        return 'EJ-MULTISELECT';
    }
    private wrapperClick(e: MouseEvent): void {
        if (this.readonly || !this.enabled) {
            return;
        }
        if ((<HTMLElement>e.target) === this.overAllClear) {
            e.preventDefault();
            return;
        }
        if (!this.inputFocus) {
            this.inputElement.focus();
        }
        if (e.target && (<HTMLElement>e.target).classList.toString().indexOf(CHIP_CLOSE) !== -1) {
            if (this.isPopupOpen()) {
                this.refreshPopup();
            }
            return;
        }
        if (!this.isPopupOpen()) {
            this.showPopup();
        } else {
            this.hidePopup();
        }
        e.preventDefault();
    }
    private enable(state: boolean): void {
        if (state) {
            this.overAllWrapper.classList.remove(DISABLED);
            this.inputElement.removeAttribute('disabled');
            attributes(this.inputElement, { 'aria-disabled': 'false' });
        } else {
            this.overAllWrapper.classList.add(DISABLED);
            this.inputElement.setAttribute('disabled', 'true');
            attributes(this.inputElement, { 'aria-disabled': 'true' });
        }
        if (this.enabled !== state) {
            this.enabled = state;
        }
        this.hidePopup();
    }
    private scrollFocusStatus: boolean = false;
    private keyDownStatus: boolean = false;
    private onBlur(eve: MouseEvent): void {
        let target: HTMLElement = !isNullOrUndefined(eve) && <HTMLElement>eve.relatedTarget;
        if (document.body.contains(this.popupObj.element) && this.popupObj.element.contains(target)) {
            this.inputElement.focus();
            return;
        }
        if (this.scrollFocusStatus) {
            eve.preventDefault();
            this.inputElement.focus();
            this.scrollFocusStatus = false;
            return;
        }
        this.inputFocus = false;
        this.overAllWrapper.classList.remove(FOCUS);
        if (this.mode !== 'box') {
            this.refreshListItems(null);
            this.updateDelimView();
        }
        this.updateValueState(eve, this.value, this.tempValues);
        this.dispatchEvent(this.hiddenElement as HTMLElement, 'change');
        this.overAllClear.style.display = 'none';
        if (this.isPopupOpen()) {
            this.hidePopup();
            this.makeTextBoxEmpty();
        }
        this.trigger('blur');
        if (Browser.isDevice && this.mode !== 'delimiter') {
            this.removeChipFocus();
        }
        this.removeChipSelection();
        this.refreshInputHight();
        this.refreshPlaceHolder();
    }
    private refreshInputHight(): void {
        if (!this.value || !this.value.length) {
            this.searchWrapper.classList.remove(ZERO_SIZE);
        } else {
            this.searchWrapper.classList.add(ZERO_SIZE);
        }
    }
    private validateValues(newValue: [string | number], oldValue: [string | number]): boolean {
        return JSON.stringify(newValue.slice().sort()) !== JSON.stringify(oldValue.slice().sort());
    }
    private updateValueState(event: KeyboardEventArgs | MouseEvent, newVal: [string | number], oldVal: [string | number]): void {
        let newValue: [string | number] = newVal ? newVal : <[string]>[];
        let oldValue: [string | number] = oldVal ? oldVal : <[string]>[];
        if (this.validateValues(newValue, oldValue)) {
            let eventArgs: MultiSelectChangeEventArgs = {
                e: event,
                oldValue: <[string]>oldVal,
                value: <[string]>newVal,
                isInteracted: event ? true : false
            };
            this.trigger('change', eventArgs);
        }
    }
    private getPagingCount(): number {
        let height: string = this.list.classList.contains(dropDownBaseClasses.noData) ? null :
            getComputedStyle(this.getItems()[0], null).getPropertyValue('height');
        return Math.round(this.list.getBoundingClientRect().height / parseInt(height, 10));
    }

    private pageUpSelection(steps: number): void {
        let previousItem: Element = steps >= 0 ? this.liCollections[steps + 1] : this.liCollections[0];
        this.addListFocus(<HTMLElement>previousItem);
        this.scrollBottom(<HTMLElement>previousItem, this.getIndexByValue(previousItem.getAttribute('data-value')));
    };

    private pageDownSelection(steps: number): void {
        let list: Element[] = this.getItems();
        let previousItem: Element = steps <= list.length ? this.liCollections[steps - 1] : this.liCollections[list.length - 1];
        this.addListFocus(<HTMLElement>previousItem);
        this.scrollBottom(<HTMLElement>previousItem, this.getIndexByValue(previousItem.getAttribute('data-value')));
    }
    private focusIn(): boolean {
        if (this.enabled && !this.readonly) {
            this.inputFocus = true;
            if (!this.value) {
                this.tempValues = this.value;
            } else {
                this.tempValues = <[string]>this.value.slice();
            }
            if (this.value && this.value.length) {
                if (this.mode !== 'delimiter') {
                    this.chipCollectionWrapper.style.display = '';
                } else {
                    this.showDelimWrapper();
                }
                this.viewWrapper.style.display = 'none';
            }
            this.searchWrapper.classList.remove(ZERO_SIZE);
            this.trigger('focus');
            if (!this.overAllWrapper.classList.contains(FOCUS)) {
                this.overAllWrapper.classList.add(FOCUS);
            }
            if (this.isPopupOpen()) {
                this.refreshPopup();
            }
            return true;
        } else {
            return false;
        }
    }
    private showDelimWrapper(): void {
        this.delimiterWrapper.style.display = '';
        this.componentWrapper.classList.add(DELIMITER_VIEW_WRAPPER);
    }
    private hideDelimWrapper(): void {
        this.delimiterWrapper.style.display = 'none';
        this.componentWrapper.classList.remove(DELIMITER_VIEW_WRAPPER);
    }
    private expandTextbox(): void {
        let size: number = 5;
        if (this.placeholder) {
            size = size > this.inputElement.placeholder.length ? size : this.inputElement.placeholder.length;
        }
        if (this.inputElement.value.length > size) {
            this.inputElement.size = this.inputElement.value.length;
        } else {
            this.inputElement.size = size;
        }
    }
    private isPopupOpen(): boolean {
        return ((this.popupWrapper !== null) && (this.popupWrapper.parentElement !== null));
    }
    private refreshPopup(): void {
        if (this.popupObj) {
            this.popupObj.setProperties({ width: this.calcPopupWidth() });
            this.popupObj.refreshPosition(this.overAllWrapper);
            this.popupObj.show();
        }
    }
    private checkTextLength(): boolean {
        return this.inputElement.value.length < 1;
    }
    private popupKeyActions(keyCode: number): void {
        switch (keyCode) {
            case 38:
                this.hidePopup();
                break;
            case 40:
                if (!this.isPopupOpen()) {
                    this.showPopup();
                }
                break;
        }
    }

    private updateAriaAttribute(): void {
        let focusedItem: HTMLElement = <HTMLElement>this.list.querySelector('.' + dropDownBaseClasses.focus);
        if (!isNullOrUndefined(focusedItem)) {
            this.inputElement.setAttribute('aria-activedescendant', focusedItem.id);
        }
    }

    private onKeyDown(e: KeyboardEventArgs): void {
        this.keyDownStatus = true;
        if (e.keyCode > 111 && e.keyCode < 124) { return; }
        if (e.altKey) {
            this.popupKeyActions(e.keyCode);
            e.preventDefault();
            return;
        } else if (this.isPopupOpen()) {
            let focusedItem: Element = this.list.querySelector('.' + dropDownBaseClasses.focus);
            let activeIndex: number;
            switch (e.keyCode) {
                case 36:
                case 35:
                    break;
                case 33:
                    e.preventDefault();
                    if (focusedItem) {
                        this.getIndexByValue(focusedItem.getAttribute('data-value'));
                        this.pageUpSelection(activeIndex - this.getPagingCount());
                        this.updateAriaAttribute();
                    }
                    return;
                case 34:
                    e.preventDefault();
                    if (focusedItem) {
                        this.getIndexByValue(focusedItem.getAttribute('data-value'));
                        this.pageDownSelection(activeIndex + this.getPagingCount());
                        this.updateAriaAttribute();
                    }
                    return;
                case 38:
                    e.preventDefault();
                    this.moveByList(-1);
                    this.updateAriaAttribute();
                    break;
                case 40:
                    e.preventDefault();
                    this.moveByList(1);
                    this.updateAriaAttribute();
                    break;
                case 27:
                    e.preventDefault();
                    this.hidePopup();
                    return;
                case 13:
                    e.preventDefault();
                    this.selectByKey(e);
                    return;
            }
        } else {
            switch (e.keyCode) {
                case 13:
                case 9:
                case 16:
                case 17:
                case 20:
                    return;
                case 40:
                    this.showPopup();
                    break;
                case 27:
                    e.preventDefault();
                    this.escapeAction();
                    return;
            }
        }
        if (this.checkTextLength()) {
            if ((this.mode !== 'delimiter') && this.value && this.value.length) {
                switch (e.keyCode) {
                    case 37: //left arrow
                        e.preventDefault();
                        this.moveBy(-1);
                        break;
                    case 39: //right arrow 
                        e.preventDefault();
                        this.moveBy(1);
                        break;
                    case 8:
                        this.removelastSelection(e);
                        break;
                    case 46: //del
                        this.removeSelectedChip(e);
                        break;
                }
            } else if (e.keyCode === 8 && this.mode === 'delimiter') {
                if (this.value && this.value.length) {
                    e.preventDefault();
                    let temp: string | number = this.value[this.value.length - 1];
                    this.removeValue(temp, e);
                    this.updateDelimeter(this.delimiterChar);
                    this.focusAtLastListItem(<string>temp);
                }
            }
        }
        this.expandTextbox();
        this.refreshPopup();
    }
    private selectByKey(e: KeyboardEventArgs): void {
        this.removeChipSelection();
        this.selectListByKey(e);
        if (this.hideSelectedItem) {
            this.focusAtFirstListItem();
        }
    }
    private escapeAction(): void {
        let temp: [string | number] = this.tempValues ? <[string]>this.tempValues.slice() : <[string]>[];
        if (this.value && this.validateValues(this.value, temp)) {
            this.value = temp;
            this.initialValueUpdate();
            if (this.mode !== 'delimiter') {
                this.chipCollectionWrapper.style.display = '';
            } else {
                this.showDelimWrapper();
            }
            this.refreshPlaceHolder();
            if (this.value.length) {
                this.showOverAllClear();
            } else {
                this.hideOverAllClear();
            }
        }
        this.makeTextBoxEmpty();
    }
    private scrollBottom(selectedLI: HTMLElement, activeIndex: number): void {
        let currentOffset: number = this.list.getBoundingClientRect().height;
        let nextBottom: number = selectedLI.offsetTop + selectedLI.getBoundingClientRect().height - this.list.scrollTop;
        let nextOffset: number = this.list.scrollTop + nextBottom - currentOffset;
        let boxRange: number = (selectedLI.offsetTop + selectedLI.getBoundingClientRect().height - this.list.scrollTop);
        boxRange = this.fields.groupBy && !isUndefined(this.fixedHeaderElement) ?
            boxRange - this.fixedHeaderElement.getBoundingClientRect().height : boxRange;
        if (activeIndex === 0) {
            this.list.scrollTop = 0;
        } else if (nextBottom > currentOffset) {
            this.list.scrollTop = nextOffset;
        } else if (!(boxRange > 0 && this.list.getBoundingClientRect().height > boxRange)) {
            this.list.scrollTop = nextOffset;
        }
    }
    private scrollTop(selectedLI: HTMLElement, activeIndex: number): void {
        let nextOffset: number = selectedLI.offsetTop - this.list.scrollTop;
        let nextBottom: number = selectedLI.offsetTop + selectedLI.getBoundingClientRect().height - this.list.scrollTop;
        nextOffset = this.fields.groupBy && !isUndefined(this.fixedHeaderElement) ?
            nextOffset - this.fixedHeaderElement.getBoundingClientRect().height : nextOffset;
        let boxRange: number = (selectedLI.offsetTop + selectedLI.getBoundingClientRect().height - this.list.scrollTop);
        if (activeIndex === 0) {
            this.list.scrollTop = 0;
        } else if (nextOffset < 0) {
            this.list.scrollTop = this.list.scrollTop + nextOffset;
        } else if (!(boxRange > 0 && this.list.getBoundingClientRect().height > boxRange)) {
            this.list.scrollTop = selectedLI.offsetTop - (this.fields.groupBy && !isUndefined(this.fixedHeaderElement) ?
                this.fixedHeaderElement.getBoundingClientRect().height : 0);
        }
    }
    private selectListByKey(e: KeyboardEventArgs): void {
        let li: HTMLElement = <HTMLElement>this.list.querySelector('li.' + dropDownBaseClasses.focus);
        let limit: number = this.value && this.value.length ? this.value.length : 0;
        if (li !== null) {
            if (this.isValidLI(li) && limit < this.maximumSelectionLength) {
                this.updateListSelection(li, e);
                this.addListFocus(<HTMLElement>li);
                this.updateDelimeter(this.delimiterChar);
                this.makeTextBoxEmpty();
                this.refreshListItems(li.getAttribute('data-Value'));
                this.refreshPopup();
                if (this.value && this.value.length) {
                    this.removeListSelection();
                    this.refreshSelection();
                }
            }
            if (this.closePopupOnSelect) {
                this.hidePopup();
            }
        }
        this.refreshPlaceHolder();
    }
    private refreshListItems(data: string): void {
        if ((this.allowFiltering || this.allowCustomValue) && this.mainList && this.listData) {
            let list: HTMLElement = this.mainList.cloneNode ? <HTMLElement>this.mainList.cloneNode(true) : this.mainList;
            this.onActionComplete(list, this.mainData);
            this.focusAtLastListItem(data);
            if (this.value && this.value.length) {
                this.refreshSelection();
            }
        }
    }
    private removeSelectedChip(e: KeyboardEventArgs): void {
        let selectedElem: Element = <HTMLElement>this.chipCollectionWrapper.querySelector('span.' + CHIP_SELECTED);
        let temp: Element;
        if (selectedElem !== null) {
            temp = selectedElem.nextElementSibling;
            if (temp !== null) {
                this.removeChipSelection();
                this.addChipSelection(temp);
            }
            this.removeValue(selectedElem.getAttribute('data-value'), e);
            this.makeTextBoxEmpty();
        }
        if (this.closePopupOnSelect) {
            this.hidePopup();
        }
    }
    private moveByTop(state: boolean): void {
        let elements: NodeListOf<Element> = <NodeListOf<HTMLElement>>this.list.querySelectorAll('li.' + dropDownBaseClasses.li);
        let index: number;
        if (elements.length > 1) {
            this.removeFocus();
            index = state ? 0 : (elements.length - 1);
            this.addListFocus(<HTMLElement>elements[index]);
            this.scrollBottom(<HTMLElement>elements[index], index);
        }
        this.updateAriaAttribute();
    }
    private moveByList(position: number): void {
        if (this.list) {
            let elements: NodeListOf<Element> = <NodeListOf<HTMLElement>>this.list.querySelectorAll('li.'
                + dropDownBaseClasses.li
                + ':not(.' + HIDE_LIST + ')');
            let selectedElem: Element = <HTMLElement>this.list.querySelector('li.' + dropDownBaseClasses.focus);
            let temp: number = -1;
            if (elements.length) {
                for (let index: number = 0; index < elements.length; index++) {
                    if (elements[index] === selectedElem) {
                        temp = index;
                        break;
                    }
                }
                if (position > 0) {
                    if (temp < (elements.length - 1)) {
                        this.removeFocus();
                        this.addListFocus(<HTMLElement>elements[++temp]);
                        this.scrollBottom(<HTMLElement>elements[temp], temp);
                    }
                } else {
                    if (temp > 0) {
                        this.removeFocus();
                        this.addListFocus(<HTMLElement>elements[--temp]);
                        this.scrollTop(<HTMLElement>elements[temp], temp);
                    }
                }

            }
        }
    }
    private moveBy(position: number): void {
        let elements: NodeListOf<Element>;
        let selectedElem: Element;
        let temp: Element;
        elements = <NodeListOf<HTMLElement>>this.chipCollectionWrapper.querySelectorAll('span.' + CHIP);
        selectedElem = <HTMLElement>this.chipCollectionWrapper.querySelector('span.' + CHIP_SELECTED);
        if (selectedElem === null) {
            if (position < 0) {
                this.addChipSelection(elements[elements.length - 1]);
            }
        } else {
            if (position < 0) {
                temp = selectedElem.previousElementSibling;
                if (temp !== null) {
                    this.removeChipSelection();
                    this.addChipSelection(temp);
                }
            } else {
                temp = selectedElem.nextElementSibling;
                this.removeChipSelection();
                if (temp !== null) {
                    this.addChipSelection(temp);
                }
            }
        }
    }
    private chipClick(e: MouseEvent): void {
        if (this.enabled) {
            let elem: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, '.' + CHIP);
            this.removeChipSelection();
            this.addChipSelection(elem);
        }
    }
    private removeChipSelection(): void {
        if (this.chipCollectionWrapper) {
            this.removeChipFocus();
        }
    }
    private addChipSelection(element: Element): void {
        addClass([element], CHIP_SELECTED);
    }
    private onChipRemove(e: MouseEvent): void {
        if (e.which === 3 || e.button === 2) { return; }
        if (this.enabled && !this.readonly) {
            let element: HTMLElement = (<HTMLElement>e.target).parentElement;
            let value: string | number = this.getFormattedValue(element.getAttribute('data-value'));
            if (this.isPopupOpen()) {
                this.hidePopup();
            }
            this.removeValue(value, e);
            this.updateDelimeter(this.delimiterChar);
            this.makeTextBoxEmpty();
            if (!this.inputFocus) {
                this.inputElement.focus();
            }
            e.preventDefault();
        }
    }
    private makeTextBoxEmpty(): void {
        this.inputElement.value = '';
        this.refreshPlaceHolder();
    }
    private refreshPlaceHolder(): void {
        if (this.placeholder) {
            if (this.value && this.value.length) {
                this.inputElement.placeholder = '';
            } else {
                this.inputElement.placeholder = this.placeholder;
            }
        }
        this.expandTextbox();
    }
    private removeValue(value: string | number, eve: MouseEvent | KeyboardEventArgs): void {
        let index: number = this.value.indexOf(this.getFormattedValue(<string>value));
        let className: string = this.hideSelectedItem ?
            HIDE_LIST :
            dropDownBaseClasses.selected;
        if (index !== -1) {
            let element: HTMLElement = <HTMLElement>this.list.querySelector('li[data-value="' + value + '"]');
            let eventArgs: RemoveEventArgs = {
                e: eve,
                item: <HTMLLIElement>element,
                itemData: this.getDataByValue(value),
                isInteracted: eve ? true : false
            };
            this.trigger('removing', eventArgs);
            this.value.splice(index, 1);
            this.setProperties({ value: <[number | string]>[].concat([], this.value) }, true);
            if (element !== null) {
                element.setAttribute('aria-selected', 'false');
                removeClass([element], className);
                attributes(this.inputElement, { 'aria-activedescendant': element.id });
            }
            this.updateMainList(true, <string>value);
            this.removeChip(value);
            this.updateChipStatus();
            this.trigger('removed', eventArgs);
        }
    }
    private updateMainList(state: boolean, value: string): void {
        if (this.allowFiltering) {
            let element2: HTMLElement = <HTMLElement>this.mainList.querySelector('li[data-value="' + value + '"]');
            if (element2) {
                if (state) {
                    element2.setAttribute('aria-selected', 'false');
                    removeClass([element2], this.hideSelectedItem ?
                        HIDE_LIST :
                        dropDownBaseClasses.selected);
                } else {
                    element2.setAttribute('aria-selected', 'true');
                    addClass([element2], this.hideSelectedItem ?
                        HIDE_LIST :
                        dropDownBaseClasses.selected);
                }
            }
        }
    }
    private removeChip(value: string | number): void {
        if (this.chipCollectionWrapper) {
            let element: HTMLElement = <HTMLElement>this.chipCollectionWrapper.querySelector('span[data-value="' + value + '"]');
            if (element) {
                remove(element);
            }
        }

    }
    private updateChipStatus(): void {
        if (this.value.length) {
            if (!isNullOrUndefined(this.chipCollectionWrapper)) {
                (this.chipCollectionWrapper.style.display = '');
            }
            if (this.mode === 'delimiter') {
                this.showDelimWrapper();
            }
            this.showOverAllClear();
        } else {
            if (!isNullOrUndefined(this.chipCollectionWrapper)) {
                this.chipCollectionWrapper.style.display = 'none';
            }
            if (!isNullOrUndefined(this.delimiterWrapper)) {
                (this.delimiterWrapper.style.display = 'none');
            }
            this.hideOverAllClear();
        }
    }
    private addValue(value: string | number, text: string, eve: MouseEvent | KeyboardEventArgs): void {
        if (!this.value) {
            this.value = <[string]>[];
        }
        this.setProperties({ value: <[number | string]>[].concat([], this.value, [value]) }, true);
        let element: HTMLElement = <HTMLElement>this.list.querySelector('li[data-value="' + value + '"]');
        this.removeFocus();
        if (element) {
            this.addListFocus(element);
            this.addListSelection(element);
        }
        if (this.mode !== 'delimiter') {
            this.addChip(text, value, eve);
        }
        this.updateChipStatus();
    }
    private dispatchSelect(value: string | number, eve: MouseEvent | KeyboardEventArgs, element: HTMLElement, isNotTrigger: boolean): void {
        if (this.initStatus && !isNotTrigger) {
            let eventArgs: SelectEventArgs = {
                e: eve,
                item: <HTMLLIElement>element,
                itemData: this.getDataByValue(value),
                isInteracted: eve ? true : false
            };
            this.trigger('select', eventArgs);
        }
    }
    private addChip(text: string, value: string | number, e?: MouseEvent | KeyboardEventArgs): void {
        if (this.chipCollectionWrapper) {
            this.chipCollectionWrapper.appendChild(this.getChip(text, value, e));
        }
    }
    private removeChipFocus(): void {
        let elements: NodeListOf<Element>;
        let closeElements: NodeListOf<Element>;
        elements = <NodeListOf<HTMLElement>>
            this.chipCollectionWrapper.querySelectorAll('span.' + CHIP);
        closeElements = <NodeListOf<HTMLElement>>
            this.chipCollectionWrapper.querySelectorAll('span.' + CHIP_CLOSE.split(' ')[0]);
        removeClass(elements, CHIP_SELECTED);
        if (Browser.isDevice) {
            for (let index: number = 0; index < closeElements.length; index++) {
                (<HTMLElement>closeElements[index]).style.display = 'none';
            }
        }

    }
    private onMobileChipInteraction(e: MouseEvent): void {
        let chipElem: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, '.' + CHIP);
        let chipClose: HTMLElement = <HTMLElement>chipElem.querySelector('span.' + CHIP_CLOSE.split(' ')[0]);
        if (this.enabled && !this.readonly) {
            if (!chipElem.classList.contains(CHIP_SELECTED)) {
                this.removeChipFocus();
                chipClose.style.display = '';
                chipElem.classList.add(CHIP_SELECTED);
            }
            this.refreshPopup();
            e.preventDefault();
        }
    }
    private getChip(data: string, value: string | number, e?: MouseEvent | KeyboardEventArgs): HTMLElement {
        let itemData: { [key: string]: Object } = { text: value, value: value };
        let chip: HTMLElement = createElement('span', {
            className: CHIP,
            attrs: { 'data-value': <string>value, 'title': data }
        });
        let chipContent: HTMLElement = createElement('span', { className: CHIP_CONTENT });
        let chipClose: HTMLElement = createElement('span', { className: CHIP_CLOSE });
        if (this.mainData) {
            itemData = this.getDataByValue(value);
        }
        if (this.valueTemplate && itemData) {
            let compiledString: Function = compile(this.valueTemplate);
            for (let item of compiledString(itemData)) {
                chipContent.appendChild(item);
            }
        } else {
            chipContent.innerHTML = data;
        }
        chip.appendChild(chipContent);
        this.trigger('tagging', {
            isInteracted: e ? true : false,
            itemData: itemData,
            e: e,
            setClass: (classes: string) => {
                addClass([chip], classes);
            }
        });
        if (Browser.isDevice) {
            chip.classList.add(MOBILE_CHIP);
            append([chipClose], chip);
            chipClose.style.display = 'none';
            EventHandler.add(chip, 'click', this.onMobileChipInteraction, this);
        } else {
            EventHandler.add(chip, 'mousedown', this.chipClick, this);
            if (this.showClearButton) {
                chip.appendChild(chipClose);
            }
        }
        EventHandler.add(chipClose, 'mousedown', this.onChipRemove, this);
        return chip;
    }
    private calcPopupWidth(): string {
        let width: string = formatUnit(this.popupWidth);
        if (width.indexOf('%') > -1) {
            let inputWidth: number = (this.componentWrapper.getBoundingClientRect().width) * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        return width;
    }
    private mouseIn(): void {
        if (this.enabled && !this.readonly) {
            this.showOverAllClear();
        }
    }
    private mouseOut(): void {
        if (!this.inputFocus) {
            this.overAllClear.style.display = 'none';
        }
    }
    private renderPopup(): void {
        if (!this.list) {
            super.render();
        }
        if (!this.popupObj) {
            document.body.appendChild(this.popupWrapper);
            let overAllHeight: number = parseInt(<string>this.popupHeight, 10);
            this.popupWrapper.style.visibility = 'hidden';
            if (this.headerTemplate) {
                let compiledString: Function;
                this.header = document.createElement('div');
                addClass([this.header], HEADER);
                compiledString = compile(this.headerTemplate);
                let elements: [Element] = compiledString({});
                for (let temp: number = 0; temp < elements.length; temp++) {
                    this.header.appendChild(elements[temp]);
                }
                append([this.header], this.popupWrapper);
                EventHandler.add(this.header, 'mousedown', this.onListMouseDown, this);
                overAllHeight -= this.header.getBoundingClientRect().height;
            }
            append([this.list], this.popupWrapper);
            if (this.footerTemplate) {
                let compiledString: Function;
                this.footer = document.createElement('div');
                addClass([this.footer], FOOTER);
                compiledString = compile(this.footerTemplate);
                let elements: [Element] = compiledString({});
                for (let temp: number = 0; temp < elements.length; temp++) {
                    this.footer.appendChild(elements[temp]);
                }
                append([this.footer], this.popupWrapper);
                EventHandler.add(this.footer, 'mousedown', this.onListMouseDown, this);
                overAllHeight -= this.footer.getBoundingClientRect().height;
            }
            if (this.popupHeight !== 'auto') {
                this.list.style.maxHeight = formatUnit(overAllHeight);
                this.popupWrapper.style.maxHeight = formatUnit(this.popupHeight);
            } else {
                this.list.style.maxHeight = formatUnit(this.popupHeight);
            }
            this.popupObj = new Popup(this.popupWrapper, {
                width: this.calcPopupWidth(), targetType: 'relative', position: { X: 'left', Y: 'bottom' },
                relateTo: this.overAllWrapper, collision: { X: 'flip', Y: 'flip' }, offsetY: 1,
                enableRtl: this.enableRtl,
                close: () => {
                    if (this.popupObj.element.parentElement) {
                        detach(this.popupObj.element);
                    }
                }
            });
            this.popupObj.close();
            this.popupWrapper.style.visibility = '';
        }
    }
    private ClearAll(e: MouseEvent): void {
        if (this.enabled && !this.readonly) {
            let temp: string | number;
            let tempValues: [string | number] = this.value ? <[string]>this.value.slice() : <[string]>[];
            for (temp = this.value[0]; this.value.length !== 0; temp = this.value[0]) {
                this.removeValue(temp, e);
            }
            this.updateDelimeter(this.delimiterChar);
            if (this.mode !== 'box') {
                this.updateDelimView();
            }
            this.makeTextBoxEmpty();
            if (this.isPopupOpen()) {
                this.refreshPopup();
            }
            this.removeFocus();
            if (!this.inputFocus) {
                this.updateValueState(e, this.value, tempValues);
                this.inputElement.focus();
            }
            e.preventDefault();
        }
    }
    private windowResize(): void {
        this.refreshPopup();
        if (!this.inputFocus && this.viewWrapper && this.viewWrapper.parentElement) {
            this.updateDelimView();
        }
    }
    protected wireEvent(): void {
        EventHandler.add(this.componentWrapper, 'mousedown', this.wrapperClick, this);
        EventHandler.add(<HTMLElement & Window>window, 'resize', this.windowResize, this);
        EventHandler.add(this.inputElement, 'focus', this.focusIn, this);
        EventHandler.add(this.inputElement, 'keydown', this.onKeyDown, this);
        EventHandler.add(this.inputElement, 'keyup', this.KeyUp, this);
        EventHandler.add(this.inputElement, 'input', this.onInput, this);
        EventHandler.add(this.inputElement, 'blur', this.onBlur, this);
        EventHandler.add(this.componentWrapper, 'mousemove', this.mouseIn, this);
        EventHandler.add(this.componentWrapper, 'mouseout', this.mouseOut, this);
        EventHandler.add(this.overAllClear, 'mouseup', this.ClearAll, this);
    }
    private onInput(): void {
        if (this.keyDownStatus) {
            this.isValidKey = true;
        } else {
            this.isValidKey = false;
        }
        this.keyDownStatus = false;
    }
    protected preRender(): void {
        super.preRender();
    }
    private updateData(delimiterChar: string): void {
        let data: string = '';
        let delim: boolean = this.mode === 'delimiter';
        let text: [string] = <[string]>[];
        let temp: string;
        let tempData: Object = this.listData;
        this.listData = this.mainData;
        this.hiddenElement.innerHTML = '';
        for (let index: number = 0; this.value[index]; index++) {
            if (this.listData) {
                temp = this.getTextByValue(this.value[index]);
            } else {
                temp = <string>this.value[index];
            }
            data += temp + delimiterChar + ' ';
            text.push(temp);
            this.hiddenElement.innerHTML += '<option selected value =' + this.value[index] + '>' + index + '</option>';
        }
        this.text = text.toString();
        if (delim) {
            this.delimiterWrapper.innerHTML = data;
        }
        this.listData = <{ [key: string]: Object }[]>tempData;
    }
    private initialValueUpdate(): void {
        if (this.list) {
            let text: string;
            let textField: string;
            let valueField: string | number;
            let element: HTMLElement;
            let value: string | number;
            if (this.chipCollectionWrapper) {
                this.chipCollectionWrapper.innerHTML = '';
            }
            this.removeListSelection();
            for (let index: number = 0; this.value[index]; index++) {
                value = this.value[index];
                element = <HTMLElement>this.list.querySelector('li[data-value="' + value + '"]');
                if (element && (element.getAttribute('aria-selected') !== 'true')) {
                    text = this.getTextByValue(value);
                    this.addChip(text, value);
                    this.addListSelection(element);
                }
            }
            this.updateDelimeter(this.delimiterChar);
            if (!this.inputFocus) {
                if (this.mode === 'box') {
                    this.chipCollectionWrapper.style.display = '';
                } else if (this.mode === 'delimiter') {
                    this.showDelimWrapper();
                }
            }
        }
    }
    protected isValidLI(li: Element | HTMLElement): boolean {
        return (li && !li.classList.contains(dropDownBaseClasses.disabled) && !li.classList.contains(dropDownBaseClasses.group) &&
            li.classList.contains(dropDownBaseClasses.li));
    };
    protected updateListSelection(li: Element, e: MouseEvent | KeyboardEventArgs): void {
        let value: string | number = this.getFormattedValue(li.getAttribute('data-value'));
        let text: string = this.getTextByValue(value);
        this.removeHover();
        if (!this.value || this.value.indexOf(value) === -1) {
            this.dispatchSelect(value, e, <HTMLElement>li, (li.getAttribute('aria-selected') === 'true'));
            if ((this.allowCustomValue || this.allowFiltering) && !this.mainList.querySelector('li[data-value="' + value + '"]')) {
                let temp: HTMLElement = <HTMLElement>li.cloneNode(true);
                let data: Object = this.getDataByValue(value);
                append([temp], this.mainList);
                this.mainData.push(this.getDataByValue(value));
                let eventArgs: CustomValueEventArgs = {
                    newData: data
                };
                this.trigger('customValueSelection', eventArgs);
            }
            this.remoteCustomValue = false;
            this.addValue(value, text, e);
        } else {
            this.removeValue(value, e);
        }
    }
    protected removeListSelection(): void {
        let className: string = this.hideSelectedItem ?
            HIDE_LIST :
            dropDownBaseClasses.selected;
        let selectedItems: Element[] = <NodeListOf<Element> & Element[]>this.list.querySelectorAll('.' + className);
        let temp: number = selectedItems.length;
        if (selectedItems && selectedItems.length) {
            removeClass(selectedItems, className);
            while (temp > 0) {
                selectedItems[temp - 1].setAttribute('aria-selected', 'false');
                temp--;
            }
        }
    };
    private removeHover(): void {
        let hoveredItem: Element[] = <NodeListOf<Element> & Element[]>this.list.querySelectorAll('.' + dropDownBaseClasses.hover);
        if (hoveredItem && hoveredItem.length) {
            removeClass(hoveredItem, dropDownBaseClasses.hover);
        }
    };
    private removeFocus(): void {
        let hoveredItem: Element[] = <NodeListOf<Element> & Element[]>this.list.querySelectorAll('.' + dropDownBaseClasses.focus);
        let mainlist: Element[] = <NodeListOf<Element> & Element[]>this.mainList.querySelectorAll('.' + dropDownBaseClasses.focus);
        if (hoveredItem && hoveredItem.length) {
            removeClass(hoveredItem, dropDownBaseClasses.focus);
            removeClass(mainlist, dropDownBaseClasses.focus);
        }
    };
    private addListHover(li: HTMLElement): void {
        if (this.enabled && this.isValidLI(li)) {
            this.removeHover();
            addClass([li], dropDownBaseClasses.hover);
        }
    };
    private addListFocus(element: HTMLElement): void {
        if (this.enabled && this.isValidLI(element)) {
            this.removeFocus();
            addClass([element], dropDownBaseClasses.focus);
        }
    }
    private addListSelection(element: HTMLElement): void {
        let className: string = this.hideSelectedItem ?
            HIDE_LIST :
            dropDownBaseClasses.selected;
        if (this.isValidLI(element) && !element.classList.contains(dropDownBaseClasses.hover)) {
            addClass([element], className);
            this.updateMainList(false, <string>element.getAttribute('data-value'));
            element.setAttribute('aria-selected', 'true');
            if (this.chipCollectionWrapper !== null) {
                this.removeChipSelection();
            }
            attributes(this.inputElement, { 'aria-activedescendant': element.id });
        }
    }
    private updateDelimeter(delimChar: string): void {
        this.updateData(delimChar);
    }
    private onMouseClick(e: MouseEvent): void {
        this.scrollFocusStatus = false;
        let target: Element = <Element>e.target;
        let li: HTMLElement = <HTMLElement>closest(target, '.' + dropDownBaseClasses.li);
        if (this.isValidLI(li)) {
            let limit: number = this.value && this.value.length ? this.value.length : 0;
            if (limit < this.maximumSelectionLength) {
                this.updateListSelection(li, e);
                this.addListFocus(<HTMLElement>li);
                if ((this.allowCustomValue || this.allowFiltering) && this.mainList && this.listData) {
                    this.focusAtLastListItem(<string>li.getAttribute('data-value'));
                    this.refreshSelection();
                } else {
                    this.makeTextBoxEmpty();
                }
            }
            this.updateDelimeter(this.delimiterChar);
            this.refreshPopup();
            if (this.hideSelectedItem) {
                this.focusAtFirstListItem();
            }
            if (this.closePopupOnSelect) {
                this.hidePopup();
                this.makeTextBoxEmpty();
            } else {
                e.preventDefault();
            }

        } else {
            e.preventDefault();
        }
        this.refreshPlaceHolder();
    }
    private onMouseOver(e: MouseEvent): void {
        let currentLi: HTMLElement = <HTMLElement>closest(<Element>e.target, '.' + dropDownBaseClasses.li);
        this.addListHover(currentLi);
    }
    private onMouseLeave(e: MouseEvent): void {
        this.removeHover();
    }
    private onListMouseDown(e: MouseEvent): void {
        e.preventDefault();
        this.scrollFocusStatus = true;
    }
    private wireListEvents(): void {
        EventHandler.add(this.list, 'mousedown', this.onListMouseDown, this);
        EventHandler.add(this.list, 'mouseup', this.onMouseClick, this);
        EventHandler.add(this.list, 'mouseover', this.onMouseOver, this);
        EventHandler.add(this.list, 'mouseout', this.onMouseLeave, this);
    };
    private unwireListEvents(): void {
        if (this.list) {
            EventHandler.remove(this.list, 'mousedown', this.onListMouseDown);
            EventHandler.remove(this.list, 'mouseup', this.onMouseClick);
            EventHandler.remove(this.list, 'mouseover', this.onMouseOver);
            EventHandler.remove(this.list, 'mouseout', this.onMouseLeave);

        }

    };
    private hideOverAllClear(): void {
        if (!this.value || !this.value.length) {
            this.overAllClear.style.display = 'none';
        }
    }
    private showOverAllClear(): void {
        if (this.value && this.value.length) {
            this.overAllClear.style.display = '';
        }
    }
    protected showSpinner(): void {
        if (isNullOrUndefined(this.spinnerElement)) {
            if (this.overAllClear.style.display !== 'none') {
                this.spinnerElement = this.overAllClear;
            } else {
                this.spinnerElement = createElement('span', { className: CLOSEICON_CLASS + ' ' + SPINNER_CLASS });
                this.componentWrapper.appendChild(this.spinnerElement);
            }
            addClass([this.spinnerElement], DISABLE_ICON);
            createSpinner({
                target: this.spinnerElement,
                width: SPINNER_SIZE
            });
            showSpinner(this.spinnerElement);
        }
    }

    protected hideSpinner(): void {
        if (!isNullOrUndefined(this.spinnerElement)) {
            hideSpinner(this.spinnerElement);
            removeClass([this.spinnerElement], DISABLE_ICON);
            if (this.spinnerElement.classList.contains(SPINNER_CLASS)) {
                detach(this.spinnerElement);
            } else {
                this.spinnerElement.innerHTML = '';
            }
            this.spinnerElement = null;
        }
    }
    private updateDelimView(): void {
        if (this.delimiterWrapper) {
            this.hideDelimWrapper();
        }
        if (this.chipCollectionWrapper) {
            this.chipCollectionWrapper.style.display = 'none';
        }
        this.viewWrapper.style.display = '';

        if (this.value && this.value.length) {
            let data: string = '';
            let temp: string;
            let tempData: string;
            let tempIndex: number = 1;
            let wrapperleng: number;
            let remaining: number;
            this.viewWrapper.innerHTML = '';
            let l10nLocale: Object = {
                noRecordsTemplate: 'No Records Found',
                actionFailureTemplate: 'The Request Failed',
                overflowCountTemplate: '+${count} more..'
            };
            let l10n: L10n = new L10n('dropdowns', l10nLocale, this.locale);
            let remainContent: string = l10n.getConstant('overflowCountTemplate');
            let raminElement: HTMLElement = createElement('span', {
                className: REMAIN_WRAPPER
            });
            let compiledString: Function = compile(remainContent);
            raminElement.appendChild(compiledString({ 'count': this.value.length })[0]);
            this.viewWrapper.appendChild(raminElement);
            let remainSize: number = raminElement.getBoundingClientRect().width;
            remove(raminElement);
            this.viewWrapper.innerHTML = '';
            let inputleng: number = this.searchWrapper.getBoundingClientRect().width;
            let overAllContainer: number = parseInt(window.getComputedStyle(this.componentWrapper).width, 10) -
                parseInt(window.getComputedStyle(this.componentWrapper).paddingLeft, 10) -
                parseInt(window.getComputedStyle(this.componentWrapper).paddingRight, 10);
            for (let index: number = 0; this.value[index]; index++) {
                data += (index === 0) ? '' : this.delimiterChar + ' ';
                if (this.mainData && this.mainData.length) {
                    temp = this.getTextByValue(this.value[index]);
                } else {
                    temp = <string>this.value[index];
                }
                data += temp;
                temp = this.viewWrapper.innerHTML;
                this.viewWrapper.innerHTML = data;
                wrapperleng = this.viewWrapper.getBoundingClientRect().width;
                if ((wrapperleng) > overAllContainer) {
                    if (tempData !== undefined) {
                        temp = tempData;
                        index = tempIndex + 1;
                    }
                    this.viewWrapper.innerHTML = temp;
                    remaining = this.value.length - index;
                    break;
                } else if ((wrapperleng + remainSize) <= overAllContainer) {
                    tempData = data;
                    tempIndex = index;
                } else if (index === 0) {
                    tempData = '';
                    tempIndex = -1;
                }
            }
            if (remaining > 0) {
                raminElement.innerHTML = '';
                raminElement.appendChild(compiledString({ 'count': remaining })[0]);
                this.viewWrapper.appendChild(raminElement);
            }
        } else {
            this.viewWrapper.innerHTML = '';
            this.viewWrapper.style.display = 'none';
        }
    }
    private unWireEvent(): void {
        EventHandler.remove(this.componentWrapper, 'mousedown', this.wrapperClick);
        EventHandler.remove(<HTMLElement & Window>window, 'resize', this.windowResize);
        EventHandler.remove(this.inputElement, 'focus', this.focusIn);
        EventHandler.remove(this.inputElement, 'keydown', this.onKeyDown);
        EventHandler.remove(this.inputElement, 'input', this.onInput);
        EventHandler.remove(this.inputElement, 'keyup', this.KeyUp);
        EventHandler.remove(this.inputElement, 'blur', this.onBlur);
        EventHandler.remove(this.componentWrapper, 'mousemove', this.mouseIn);
        EventHandler.remove(this.componentWrapper, 'mouseout', this.mouseOut);
        EventHandler.remove(this.overAllClear, 'mousedown', this.ClearAll);
    }
    private selectAllItem(state: boolean): void {
        let li: HTMLElement[] & NodeListOf<Element>;
        li = <HTMLElement[] & NodeListOf<Element>>this.list.querySelectorAll(state ?
            'li[aria-selected="false"]' :
            'li[aria-selected="true"]');
        let length: number = li.length;
        if (li && li.length) {
            while (length > 0) {
                this.updateListSelection(li[length - 1], null);
                length--;
            }
        }
        if (this.mode !== 'box' && !this.isPopupOpen()) {
            this.updateDelimView();
        } else {
            this.searchWrapper.classList.remove(ZERO_SIZE);
        }
        this.updateData(this.delimiterChar);
        this.refreshPlaceHolder();
    }
    protected updateDataSource(prop?: string): void {
        this.resetList(this.dataSource);
        if (this.value && this.value.length) {
            this.refreshSelection();
        }
    }
    /**
     * Get the properties to be maintained in the persisted state.
     */
    protected getPersistData(): string {
        return this.addOnPersist(['value']);
    };

    /**
     * Dynamically change the value of properties.
     * @private
     */
    public onPropertyChanged(newProp: MultiSelectModel, oldProp: MultiSelectModel): void {
        this.setUpdateInitial(['query', 'dataSource'], newProp as { [key: string]: string; });
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'query':
                case 'dataSource':
                    break;
                case 'htmlAttributes':
                    this.updateHTMLAttribute();
                    break;
                case 'showClearButton':
                    this.updateClearButton(newProp.showClearButton);
                    break;
                case 'value':
                    if (!this.inputFocus) {
                        this.initialValueUpdate();
                        if (this.mode !== 'box') {
                            this.updateDelimView();
                        }
                        this.refreshInputHight();
                        this.refreshPlaceHolder();
                        this.updateValueState(null, this.value, oldProp.value);
                    }
                    break;
                case 'width':
                    setStyleAttribute(this.overAllWrapper, { 'width': formatUnit(newProp.width) });
                    this.popupObj.setProperties({ width: this.calcPopupWidth() });
                    break;
                case 'placeholder':
                    this.refreshPlaceHolder();
                    break;
                case 'delimiterChar':
                    if (this.mode !== 'box') {
                        this.updateDelimView();
                    }
                    this.updateData(newProp.delimiterChar);
                    break;
                case 'cssClass':
                    this.popupWrapper.classList.remove(oldProp.cssClass);
                    this.overAllWrapper.classList.remove(oldProp.cssClass);
                    this.updateCssClass();
                    break;
                case 'enableRtl':
                    this.enableRTL(newProp.enableRtl);
                    super.onPropertyChanged(newProp, oldProp);
                    break;
                case 'readonly':
                    this.updateReadonly(newProp.readonly);
                    this.hidePopup();
                    break;
                case 'enabled':
                    this.hidePopup();
                    this.enable(newProp.enabled);
                    break;
            }
        }
    }
    /**
     * Hides the popup, if the popup in a open state.
     * @returns void
     */
    public hidePopup(): void {
        let delay: number = 100;
        if (this.isPopupOpen()) {
            let animModel: AnimationModel = {
                name: 'FadeOut',
                duration: 100,
                delay: delay ? delay : 0
            };
            this.beforePopupOpen = false;
            this.popupObj.hide(new Animation(animModel));
            attributes(this.inputElement, { 'aria-expanded': 'false' });
            this.popupObj.hide();
            let eventArgs: PopupEventArgs = { popup: this.popupObj };
            this.trigger('close', eventArgs);
        }
    }
    /**
     * Shows the popup, if the popup in a closed state.
     * @returns void
     */
    public showPopup(): void {
        if (!this.ulElement) {
            this.beforePopupOpen = true;
            super.render();
            return;
        }
        this.onPopupShown();
    }
    /**
     * Based on the state parameter, entire list item will be selected/deselected.
     * parameter
     * `true`   - Selects entire list items.
     * `false`  - Un Selects entire list items.
     * @returns void
     */
    public selectAll(state: boolean): void {
        if (isNullOrUndefined(this.list)) {
            this.selectAllAction = () => {
                this.selectAllItem(state);
                this.selectAllAction = null;
            };
            super.render();
        } else {
            this.selectAllAction = null;
            this.selectAllItem(state);
        }
    }

    public getModuleName(): string {
        return 'multiselect';
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    public render(): void {
        this.initStatus = false;
        this.searchWrapper = createElement('span', { className: SEARCHBOX_WRAPPER });
        this.viewWrapper = createElement('span', {
            className: DELIMITER_VIEW + ' ' + DELIMITER_WRAPPER,
            styles: 'display:none;'
        });
        this.overAllClear = createElement('span', { className: CLOSEICON_CLASS, styles: 'display:none;' });
        this.componentWrapper = createElement('div', { className: ELEMENT_WRAPPER }) as HTMLDivElement;
        this.overAllWrapper = createElement('div', { className: OVER_ALL_WRAPPER }) as HTMLDivElement;
        if (Browser.isDevice) {
            this.componentWrapper.classList.add(ELEMENT_MOBILE_WRAPPER);
        }
        this.overAllWrapper.style.width = formatUnit(this.width);
        this.overAllWrapper.appendChild(this.componentWrapper);
        this.popupWrapper = createElement('div', {
            id: this.element.id + '_popup',
            className: POPUP_WRAPPER
        }) as HTMLDivElement;
        if (this.mode === 'delimiter') {
            this.delimiterWrapper = createElement('span', { className: DELIMITER_WRAPPER, styles: 'display:none' });
            this.componentWrapper.appendChild(this.delimiterWrapper);
        } else {
            this.chipCollectionWrapper = createElement('span', {
                className: CHIP_WRAPPER,
                styles: 'display:none'
            });
            this.componentWrapper.appendChild(this.chipCollectionWrapper);
        }
        if (this.mode !== 'box') {
            this.componentWrapper.appendChild(this.viewWrapper);
        }
        this.componentWrapper.appendChild(this.searchWrapper);
        if (this.showClearButton && !Browser.isDevice) {
            this.componentWrapper.appendChild(this.overAllClear);
        } else {
            this.componentWrapper.classList.add(CLOSE_ICON_HIDE);
        }
        this.inputElement = createElement('input', {
            className: INPUT_ELEMENT,
            attrs: {
                spellcheck: 'false',
                type: 'text',
                autocomplete: 'off',
                tabindex: '0'
            }
        }) as HTMLInputElement;
        this.refreshPlaceHolder();
        if (this.element.tagName !== this.getNgDirective()) {
            this.element.style.display = 'none';
        }
        if (this.element.tagName === this.getNgDirective()) {
            this.element.appendChild(this.overAllWrapper);
            this.searchWrapper.appendChild(this.inputElement);
        } else {
            this.element.parentElement.insertBefore(this.overAllWrapper, this.element);
            this.searchWrapper.appendChild(this.inputElement);
            this.searchWrapper.appendChild(this.element);
            this.element.removeAttribute('tabindex');
        }
        let name: string = this.element.getAttribute('name') ? this.element.getAttribute('name') : this.element.getAttribute('id');
        let id: string = this.element.getAttribute('id') ? this.element.getAttribute('id') : getUniqueID('ej2_dropdownlist');
        this.element.id = id;
        this.element.style.opacity = '';
        this.hiddenElement = createElement('select', {
            attrs: { 'name': name, 'aria-hidden': 'true', 'multiple': 'true' }, styles: 'display:none'
        }) as HTMLSelectElement;
        this.element.removeAttribute('name');
        this.searchWrapper.appendChild(this.hiddenElement);
        this.hideOverAllClear();
        this.wireEvent();
        this.enable(this.enabled);
        this.enableRTL(this.enableRtl);
        if (!(this.dataSource instanceof DataManager)) {
            this.renderPopup();
        }
        if (this.value && this.value.length) {
            if (!(this.dataSource instanceof DataManager)) {
                this.initialValueUpdate();
                this.initialUpdate();
            } else {
                this.setInitialValue = () => {
                    this.initialValueUpdate();
                    this.initialUpdate();
                    this.setInitialValue = null;
                };
                super.render();
            }
        } else {
            this.initialUpdate();
        }
        this.initStatus = true;
    };
    private initialUpdate(): void {
        if (this.mode !== 'box') {
            this.updateDelimView();
        }
        this.updateCssClass();
        this.updateHTMLAttribute();
        this.updateReadonly(this.readonly);
        this.refreshInputHight();
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        if (this.popupObj) {
            this.popupObj.hide();
        }
        this.unwireListEvents();
        this.unWireEvent();
        this.list = null;
        this.popupObj = null;
        this.mainList = null;
        this.mainData = null;
        super.destroy();
        let temp: [string] = ['readonly', 'aria-disabled', 'aria-placeholder', 'placeholder'];
        let length: number = temp.length;
        while (length > 0) {
            this.inputElement.removeAttribute(temp[length - 1]);
            length--;
        }
        this.element.style.display = 'block';
        if (this.overAllWrapper.parentElement) {
            if (this.overAllWrapper.parentElement.tagName === this.getNgDirective()) {
                remove(this.overAllWrapper);
            } else {
                this.overAllWrapper.parentElement.insertBefore(this.element, this.overAllWrapper);
                remove(this.overAllWrapper);
            }
        }
    };
}
export interface CustomValueEventArgs {
    /**
     * Gets the newly added data.
     */
    newData: Object;
}

export interface TaggingEventArgs {
    /**
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted: boolean;
    /**
     * Returns the selected item as JSON Object from the data source.
     */
    itemData: FieldSettings;
    /**
     * Specifies the original event arguments.
     */
    e: MouseEvent | KeyboardEvent | TouchEvent;
    /**
     * To set the classes to chip element
     * @param  { string } classes - Specify the classes to chip element.
     * @return {void}.
     */
    setClass: Function;
}
export interface MultiSelectChangeEventArgs {
    /**
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted: boolean;
    /**
     * Returns the component initial Value.
     */
    oldValue: number[] | string[];
    /**
     * Returns the updated component Values.
     */
    value: number[] | string[];
    /**
     * Specifies the original event arguments.
     */
    e: MouseEvent | KeyboardEvent | TouchEvent;
}
export type visualMode = 'default' | 'delimiter' | 'box';

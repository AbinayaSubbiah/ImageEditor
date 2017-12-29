import { Component, EventHandler, addClass, append, Property, Event, KeyboardEvents, EmitType, L10n, compile } from '@syncfusion/ej2-base';
import { setStyleAttribute, removeClass, createElement, prepend, isNullOrUndefined, detach, Browser, getValue } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, rippleEffect, RippleOptions } from '@syncfusion/ej2-base';
import { DataManager, Query, DataOptions } from '@syncfusion/ej2-data';
import { ListBase, SortOrder, cssClass as ListBaseClasses } from '@syncfusion/ej2-lists';
import { DropDownBaseModel } from './drop-down-base-model';

export interface FieldSettings {
    /**
     * Maps the text column from data table for each list item
     */
    text?: string;
    /**
     * Maps the value column from data table for each list item
     */
    value?: string;
    /**
     * Maps the icon class column from data table for each list item.
     */
    iconCss?: string;
    /** 
     * Group the list items with it's related items by mapping groupBy field.
     */
    groupBy?: string;
}

export const SPINNER_SIZE: string = Browser.isDevice ? '16px' : '14px';

export const dropDownBaseClasses: DropDownBaseClassList = {
    root: 'e-dropdownbase',
    rtl: 'e-rtl',
    content: 'e-content',
    selected: 'e-active',
    hover: 'e-hover',
    noData: 'e-nodata',
    fixedHead: 'e-fixed-head',
    focus: 'e-item-focus',
    li: ListBaseClasses.li,
    group: ListBaseClasses.group,
    disabled: ListBaseClasses.disabled,
    grouping: 'e-dd-group'
};

export interface DropDownBaseClassList {
    root: string;
    rtl: string;
    content: string;
    selected: string;
    hover: string;
    noData: string;
    fixedHead: string;
    focus: string;
    li: string;
    disabled: string;
    group: string;
    grouping: string;
}

export interface SelectEventArgs {
    /**
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted: boolean;
    /**
     * Returns the selected list item
     */
    item: HTMLLIElement;
    /**
     * Returns the selected item as JSON Object from the data source.
     */
    itemData: FieldSettings;
    /**
     * Specifies the original event arguments.
     */
    e: MouseEvent | KeyboardEvent | TouchEvent;
}
/**
 * DropDownBase component will generate the list items based on given data and act as base class to drop-down related components
 */
@NotifyPropertyChanges
export class DropDownBase extends Component<HTMLElement> implements INotifyPropertyChanged {
    protected listData: { [key: string]: Object }[];
    protected ulElement: HTMLElement;
    protected liCollections: HTMLElement[];
    private bindEvent: boolean;
    private scrollTimer: number = -1;
    protected list: HTMLElement;
    protected fixedHeaderElement: HTMLElement;
    protected keyboardModule: KeyboardEvents;
    protected enableRtlElements: HTMLElement[] = [];
    protected rippleFun: Function;
    protected l10n: L10n;
    protected item: HTMLLIElement;
    protected itemData: { [key: string]: Object };
    protected isActive: boolean;
    protected isRequested: boolean = false;
    protected queryString: string;

    /**
     * The `fields` property maps the columns of the data table and binds the data to the component.
     * @default {text: null, value: null, iconCss: null, groupBy: null}
     */
    @Property<FieldSettings>({ text: null, value: null, iconCss: null, groupBy: null })
    public fields: FieldSettings;
    /**
     * When set to true, enables RTL mode of the component that 
     * displays the content in the right-to-left direction.
     * @default false.
     */
    @Property(false)
    public enableRtl: boolean;
    /**
     * Enable or disable persisting component's state between page reloads. 
     * If enabled, following list of states will be persisted.
     * 1. value
     * @default false.
     */
    @Property(false)
    public enablePersistence: boolean;
    /**
     * Accepts the template design and assigns it to each list item present in the popup.
     * @default null.
     */
    @Property(null)
    public itemTemplate: string;
    /**
     * Accepts the template design and assigns it to the group headers present in the popup list.
     * @default null.
     */
    @Property(null)
    public groupTemplate: string;
    /**
     * Accepts the template design and assigns it to popup list of component
     * when no data is available on the component.
     * @default 'No Records Found'.
     */
    @Property('No Records Found')
    public noRecordsTemplate: string;
    /**
     * Accepts the template and assigns it to the popup list content of the component
     * when the data fetch request from the remote server fails.
     * @default 'The Request Failed'.
     */
    @Property('The Request Failed')
    public actionFailureTemplate: string;
    /**
     * Specifies the `sortOrder` to sort the data source. The available type of sort orders are
     * * `None` - The data source is not sorting.
     * * `Ascending` - The data source is sorting with ascending order.
     * * `Descending` - The data source is sorting with descending order.
     * @default None.
     */
    @Property<SortOrder>('None')
    public sortOrder: SortOrder;
    /**
     * Specifies a value that indicates whether the component is enabled or not.
     * @default true.
     */
    @Property(true)
    public enabled: boolean;
    /**
     * Accepts the list items either through local or remote service and binds it to the component.
     * It can be an array of JSON Objects or an instance of
     * [`DataManager`](http://ej2.syncfusion.com/documentation/data/api-dataManager.html).
     * @default [].
     */
    @Property([])
    public dataSource: { [key: string]: Object }[] | DataManager | string[] | number[];
    /**
     * Accepts the external [`Query`](http://ej2.syncfusion.com/documentation/data/api-query.html)
     * which will execute along with the data processing.
     * @default null.
     */
    @Property(null)
    public query: Query;
    /**
     * Triggers before fetching data from the remote server.
     * @event
     */
    @Event()
    public actionBegin: EmitType<Object>;
    /**
     * Triggers after data is fetched successfully from the remote server.
     * @event
     */
    @Event()
    public actionComplete: EmitType<Object>;
    /**
     * Triggers when the data fetch request from the remote server fails.
     * @event
     */
    @Event()
    public actionFailure: EmitType<Object>;
    /**
     * Triggers when an item in the popup is selected.
     * @event
     */
    @Event()
    public select: EmitType<SelectEventArgs>;

    /**
     * * Constructor for DropDownBase class
     */
    constructor(options?: DropDownBaseModel, element?: string | HTMLElement) {
        super(options, element);
    };
    protected getPropObject(
        prop: string, newProp: { [key: string]: string; }, oldProp: { [key: string]: string; }): { [key: string]: Object; } {
        let newProperty: { [key: string]: string; } = <{ [key: string]: string; }>new Object();
        let oldProperty: { [key: string]: string; } = <{ [key: string]: string; }>new Object();
        // tslint:disable-next-line:no-function-constructor-with-string-args
        let propName: Function = new Function('prop', 'return prop');
        newProperty[propName(prop)] = (newProp as { [key: string]: string; })[propName(prop)];
        oldProperty[propName(prop)] = (oldProp as { [key: string]: string; })[propName(prop)];
        let data: { [key: string]: Object; } = <{ [key: string]: Object; }>new Object();
        data.newProperty = newProperty;
        data.oldProperty = oldProperty;
        return data;
    }

    protected getValueByText(text: string, ignoreCase?: boolean): string | number {
        let value: string | number = null;
        let dataSource: { [key: string]: Object }[] = this.listData;
        let fields: FieldSettings = this.fields;
        let type: string = this.typeOfData(dataSource).typeof as string;
        if (ignoreCase) {
            if (type === 'string' || type === 'number') {
                for (let item of dataSource) {
                    if (!isNullOrUndefined(item) && String(item).toLowerCase() === text.toString().toLowerCase()) {
                        value = type === 'string' ? String(item) : this.getFormattedValue(String(item));
                        break;
                    }
                }
            } else {
                dataSource.filter((item: { [key: string]: Object }) => {
                    let itemText: string = getValue(fields.text, item).toString();
                    if (itemText.toLowerCase() === text.toLowerCase()) {
                        value = <string>getValue(fields.value, item);
                    }
                });
            }
        } else {
            if (type === 'string' || type === 'number') {
                for (let item of dataSource) {
                    if (!isNullOrUndefined(item) && String(item) === text.toString()) {
                        value = type === 'string' ? text : this.getFormattedValue(text);
                        break;
                    }
                }
            } else {
                dataSource.filter((item: { [key: string]: Object }) => {
                    if (getValue(fields.text, item) === text) {
                        value = <string>getValue(fields.value, item);
                    }
                });
            }
        }
        return value;
    };


    private l10nUpdate(actionFailure?: boolean): void {
        if (this.noRecordsTemplate !== 'No Records Found' || this.actionFailureTemplate !== 'The Request Failed') {
            let template: string = actionFailure ? this.actionFailureTemplate : this.noRecordsTemplate;
            let compiledString: Function;
            this.list.innerHTML = '';
            compiledString = compile(template);
            for (let item of compiledString({})) {
                this.list.appendChild(item);
            }
        } else {
            let l10nLocale: Object = { noRecordsTemplate: 'No Records Found', actionFailureTemplate: 'The Request Failed' };
            this.l10n = new L10n('dropdownlist', l10nLocale, this.locale);
            this.list.innerHTML = actionFailure ?
                this.l10n.getConstant('actionFailureTemplate') : this.l10n.getConstant('noRecordsTemplate');
        }
    }

    protected getTextByValue(value: string | number): string {
        let text: string;
        let dataSource: { [key: string]: Object }[] = this.listData;
        let fields: FieldSettings = this.fields;
        let type: string = this.typeOfData(dataSource).typeof as string;
        if (type === 'string' || type === 'number') {
            for (let item of dataSource) {
                if (!isNullOrUndefined(item) && item.toString() === value.toString()) {
                    text = item.toString();
                    break;
                }
            }
        } else {
            dataSource.filter((item: { [key: string]: Object }) => {
                let itemValue: string | number = getValue(fields.value, item);
                if (!isNullOrUndefined(itemValue) && itemValue.toString() === value.toString()) {
                    text = getValue(fields.text, item) as string;
                }
            });
        }
        return text;
    }

    protected getFormattedValue(value: string): string | number {
        if (this.listData && this.listData.length) {
            let item: { [key: string]: Object } = this.typeOfData(this.listData);
            if (typeof getValue((this.fields.value ? this.fields.value : 'value'), item.item as { [key: string]: Object }) === 'number'
                || item.typeof === 'number') {
                return parseInt(value, 10);
            }
        }
        return value;
    }
    /**
     * Sets RTL to dropdownbase wrapper
     */
    protected setEnableRtl(): void {
        if (this.list) {
            this.enableRtlElements.push(this.list);
        }
        this.enableRtl ? addClass(this.enableRtlElements, dropDownBaseClasses.rtl) :
            removeClass(this.enableRtlElements, dropDownBaseClasses.rtl);
    };
    /**
     * Initialize the Component.
     */
    private initialize(): void {
        this.bindEvent = true;
        if (this.element.tagName === 'UL') {
            let jsonElement: { [key: string]: Object }[] = ListBase.createJsonFromElement(this.element);
            this.setProperties({ fields: { text: 'text', value: 'text' } }, true);
            this.resetList(jsonElement, this.fields);
        } else if (this.element.tagName === 'SELECT') {
            let dataSource: boolean = this.dataSource instanceof Array ? (this.dataSource.length > 0 ? true : false)
                : !isNullOrUndefined(this.dataSource) ? true : false;
            if (!dataSource) { this.renderItemsBySelect(); }
        } else {
            this.setListData(this.dataSource, this.fields, this.query);
        }
    };
    /**
     * Get the properties to be maintained in persisted state.
     */
    protected getPersistData(): string {
        return this.addOnPersist([]);
    };
    /**
     * Sets the enabled state to DropDownBase.
     */
    protected setEnabled(): void {
        if (this.enabled) {
            this.element.setAttribute('aria-disabled', 'false');
        } else {
            this.element.setAttribute('aria-disabled', 'true');
        }
    };

    private renderItemsBySelect(): void {
        let element: Element = this.element;
        let fields: FieldSettings = { value: 'value', text: 'text' };
        let jsonElement: { [key: string]: Object }[] = [];
        let group: HTMLElement[] = <HTMLElement[] & NodeListOf<HTMLElement>>element.querySelectorAll('select>optgroup');
        let option: HTMLOptionElement[] = <HTMLOptionElement[] & NodeListOf<HTMLOptionElement>>element.querySelectorAll('select>option');
        this.getJSONfromOption(jsonElement, option, fields);
        if (group.length) {
            for (let i: number = 0; i < group.length; i++) {
                let item: HTMLOptGroupElement = group[i] as HTMLOptGroupElement;
                let optionGroup: { [key: string]: {} } = {};
                optionGroup[fields.text] = item.label;
                optionGroup.isHeader = true;
                let child: HTMLOptionElement[] = <HTMLOptionElement[] & NodeListOf<HTMLOptionElement>>item.querySelectorAll('option');
                jsonElement.push(optionGroup);
                this.getJSONfromOption(jsonElement, child, fields);
            }
            let items: HTMLOptionElement[] = <HTMLOptionElement[] & NodeListOf<HTMLOptionElement>>element.querySelectorAll('select>option');
        }
        this.fields.text = fields.text;
        this.fields.value = fields.value;
        this.resetList(jsonElement, fields);
    }

    private getJSONfromOption(
        items: { [key: string]: Object }[],
        options: HTMLOptionElement[],
        fields: FieldSettings): void {
        for (let option of options) {
            let json: { [key: string]: {} } = {};
            json[fields.text] = option.innerText;
            json[fields.value] = option.getAttribute(fields.value) ? option.getAttribute(fields.value) : option.innerText;
            items.push(json);
        }
    }
    /**
     * Execute before render the list items
     * @private
     */
    protected preRender(): void {
        // there is no event handler
    }
    /**
     * Creates the list items of DropDownBase component.
     */
    private setListData(
        dataSource: { [key: string]: Object }[] | string[] | number[] | DataManager, fields: FieldSettings, query: Query): void {
        fields = fields ? fields : this.fields;
        let ulElement: HTMLElement;
        this.isActive = true;
        this.showSpinner();
        if (dataSource instanceof DataManager) {
            this.isRequested = true;
            this.trigger('actionBegin');
            (dataSource as DataManager).executeQuery(this.getQuery(query)).then((e: Object) => {
                this.trigger('actionComplete', e);
                let listItems: { [key: string]: Object }[] = (e as ResultData).result;
                ulElement = this.renderItems(listItems, fields);
                this.onActionComplete(ulElement, listItems, e);
                this.isRequested = false;
                this.hideSpinner();
            }).catch((e: Object) => {
                this.isRequested = false;
                this.onActionFailure(e);
                this.hideSpinner();
            });
        } else {
            let dataManager: DataManager = new DataManager(dataSource as DataOptions|JSON[]);
            let listItems: { [key: string]: Object }[] = <{ [key: string]: Object }[]>(this.getQuery(query)).executeLocal(dataManager);
            ulElement = this.renderItems(listItems, fields);
            this.onActionComplete(ulElement, listItems);
            this.hideSpinner();
        }
    }
    protected showSpinner(): void {
        // Used this method in component side.
    }
    protected hideSpinner(): void {
        // Used this method in component side.
    }
    protected onActionFailure(e: Object): void {
        this.liCollections = [];
        this.trigger('actionFailure', e);
        this.l10nUpdate(true);
        addClass([this.list], dropDownBaseClasses.noData);
    }
    protected onActionComplete(ulElement: HTMLElement, list: { [key: string]: Object }[], e?: Object): void {
        this.listData = list;
        this.list.innerHTML = '';
        this.list.appendChild(ulElement);
        this.liCollections = <HTMLElement[] & NodeListOf<Element>>this.list.querySelectorAll('.' + dropDownBaseClasses.li);
        this.ulElement = this.list.querySelector('ul');
        this.postRender(this.list, list, this.bindEvent);
    }

    protected postRender(listElement: HTMLElement, list: { [key: string]: Object }[], bindEvent: boolean): void {
        let focusItem: Element = listElement.querySelector('.' + dropDownBaseClasses.li);
        let selectedItem: Element = listElement.querySelector('.' + dropDownBaseClasses.selected);
        if (focusItem && !selectedItem) {
            addClass([focusItem], dropDownBaseClasses.focus);
        }
        if (list.length <= 0) {
            this.l10nUpdate();
            addClass([listElement], dropDownBaseClasses.noData);
        } else {
            listElement.classList.remove(dropDownBaseClasses.noData);
        }
        if (this.groupTemplate) { this.renderGroupTemplate(listElement); }
    }

    /**
     * Get the query to do the data operation before list item generation. 
     */
    protected getQuery(query: Query): Query {
        return query ? query : this.query ? this.query : new Query();
    }
    /**
     * To render the template content for group header element.
     */
    private renderGroupTemplate(listEle: HTMLElement): void {
        if (this.fields.groupBy !== null && this.dataSource || this.element.querySelector('.' + dropDownBaseClasses.group)) {
            let dataSource: { [key: string]: Object }[] = <{ [key: string]: Object }[]>this.dataSource;
            let headerItems: Element[] = <NodeListOf<Element> & Element[]>listEle.querySelectorAll('.' + dropDownBaseClasses.group);
            let tempHeaders: Element[] = ListBase.renderGroupTemplate(
                this.groupTemplate as string, <{ [key: string]: Object }[]>dataSource, this.fields, headerItems);
        }
    }
    /**
     * To create the ul li list items
     */
    private createListItems(dataSource: { [key: string]: Object }[], fields: FieldSettings): HTMLElement {
        if (dataSource && fields.groupBy || this.element.querySelector('optgroup')) {
            if (fields.groupBy) { dataSource = ListBase.groupDataSource(dataSource, fields); }
            addClass([this.list], dropDownBaseClasses.grouping);
        } else {
            dataSource = this.getSortedDataSource(dataSource);
        }
        let iconCss: boolean = isNullOrUndefined(fields.iconCss) ? false : true;
        let options: { [key: string]: Object } = (fields.text !== null || fields.value !== null) ? {
            fields: fields, showIcon: iconCss, ariaAttributes: { groupItemRole: 'presentation' }
        } : { fields: { value: 'text' } };
        return ListBase.createList(dataSource, options, true);
    };

    protected setFloatingHeader(e: Event): void {
        if (isNullOrUndefined(this.fixedHeaderElement)) {
            this.fixedHeaderElement = createElement('div', { className: dropDownBaseClasses.fixedHead });

            if (!this.list.querySelector('li').classList.contains(dropDownBaseClasses.group)) {
                this.fixedHeaderElement.style.display = 'none';
            }
            prepend([this.fixedHeaderElement], this.list);
            this.setFixedHeader();
        }
        if (!isNullOrUndefined(this.fixedHeaderElement) && this.fixedHeaderElement.style.zIndex === '0') {
            this.setFixedHeader();
        }
        this.scrollStop(e);
    }

    private scrollStop(e: Event): void {
        let target: Element = <Element>e.target;
        let liHeight: number = parseInt(getComputedStyle(this.liCollections[0], null).getPropertyValue('height'), 10);
        let topIndex: number = Math.round(target.scrollTop / liHeight);
        let liCollections: NodeListOf<Element> = <NodeListOf<Element>>this.ulElement.querySelectorAll('li');
        for (let i: number = topIndex; i > -1; i--) {
            if (!isNullOrUndefined(liCollections[i]) && liCollections[i].classList.contains(dropDownBaseClasses.group)) {
                let currentLi: HTMLElement = liCollections[i] as HTMLElement;
                this.fixedHeaderElement.innerHTML = currentLi.innerHTML;
                this.fixedHeaderElement.style.display = 'block';
                break;
            } else {
                this.fixedHeaderElement.style.display = 'none';
            }
        }
    }
    /**
     * To render the list items
     */
    private renderItems(listData: { [key: string]: Object }[], fields: FieldSettings): HTMLElement {
        let ulElement: HTMLElement;
        if (this.itemTemplate && listData) {
            let dataSource: { [key: string]: Object }[] = listData;
            if (dataSource && fields.groupBy) {
                dataSource = ListBase.groupDataSource(dataSource, fields, this.sortOrder);
            } else {
                dataSource = this.getSortedDataSource(dataSource);
            }
            ulElement = ListBase.renderContentTemplate(this.itemTemplate, dataSource, fields);
        } else {
            ulElement = this.createListItems(listData, fields);
        }
        return ulElement;
    };

    protected typeOfData(items: { [key: string]: Object }[] | string[]): { [key: string]: Object } {
        let item: { [key: string]: Object } = { typeof: null, item: null };
        for (let i: number = 0; i < items.length; i++) {
            if (!isNullOrUndefined(items[i])) {
                return item = { typeof: typeof items[i], item: items[i] };
            }
        }
        return item;
    }

    protected setFixedHeader(): void {
        this.list.parentElement.style.display = 'block';
        let liWidth: number = this.liCollections[0].offsetWidth;
        this.fixedHeaderElement.style.width = liWidth.toString() + 'px';
        setStyleAttribute(this.fixedHeaderElement, { zIndex: 10 });
        let firstLi: HTMLElement = this.ulElement.querySelector('.' + dropDownBaseClasses.group) as HTMLElement;
        this.fixedHeaderElement.innerHTML = firstLi.innerHTML;
    }
    private getSortedDataSource(dataSource: { [key: string]: Object }[]): { [key: string]: Object }[] {
        if (dataSource && this.sortOrder !== 'None') {
            let textField: string = this.fields.text ? this.fields.text : 'text';
            dataSource = ListBase.getDataSource(dataSource, ListBase.addSorting(this.sortOrder, textField));
        }
        return dataSource;
    }
    /**
     * Return the index of item which matched with given value in data source
     */
    protected getIndexByValue(value: string | number): number {
        let index: number;
        let listItems: Element[] = this.getItems();
        for (let i: number = 0; i < listItems.length; i++) {
            if (!isNullOrUndefined(value) && listItems[i].getAttribute('data-value') === value.toString()) {
                index = i;
                break;
            }
        }
        return index;
    };
    /**
     * To dispatch the event manually 
     */
    protected dispatchEvent(element: HTMLElement, type: string): void {
        let evt: Event = document.createEvent('HTMLEvents');
        evt.initEvent(type, false, true);
        element.dispatchEvent(evt);
    }
    /**
     * To set the current fields
     */
    protected setFields(): void {
        let fields: FieldSettings = this.fields;
        if (this.fields.value && !this.fields.text) {
            this.fields.text = this.fields.value;
        } else if (!fields.value && fields.text) {
            this.fields.value = this.fields.text;
        } else if (!this.fields.value && !this.fields.text) {
            this.fields.value = this.fields.text = 'text';
        }
    }
    /**
     * reset the items list.
     */
    protected resetList(
        dataSource?: { [key: string]: Object }[] | DataManager | string[] | number[], fields?: FieldSettings, query?: Query): void {
        if (this.list) {
            this.setListData(dataSource, fields, query);
        }
    }
    protected updateSelection(): void {
        // This is for after added the item, need to update the selected index values.
    }
    protected renderList(): void {
        // This is for render the list items.
        this.render();
    }
    protected updateDataSource(prop?: string): void {
        this.resetList(this.dataSource);
    }
    protected setUpdateInitial(props: string[], newProp: { [key: string]: string; }): void {
        if (!isNullOrUndefined(newProp.fields)) {
            this.setFields();
        }
        for (let j: number = 0; props.length > j; j++) {
            if ((newProp as { [key: string]: string; })[props[j]]) {
                this.updateDataSource(props[j]);
            }
        }
    }
    /**
     * When property value changes happened, then onPropertyChanged method will execute the respective changes in this component.
     * @private
     */
    public onPropertyChanged(newProp: DropDownBaseModel, oldProp: DropDownBaseModel): void {
        this.setUpdateInitial(['query', 'sortOrder', 'dataSource', 'itemTemplate'], newProp as { [key: string]: string; });
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'query':
                case 'sortOrder':
                case 'dataSource':
                case 'itemTemplate':
                    break;
                case 'enableRtl':
                    this.setEnableRtl();
                    break;
                case 'enabled':
                    this.setEnabled();
                    break;
                case 'groupTemplate':
                    this.renderGroupTemplate(this.list);
                    break;
                case 'locale':
                    if (this.list && (!isNullOrUndefined(this.liCollections) && this.liCollections.length === 0)) { this.l10nUpdate(); }
                    break;
            }
        }
    };
    /**
     * Build and render the component
     * @private
     */
    public render(isEmptyData?: boolean): void {
        this.list = createElement('div', { className: dropDownBaseClasses.content, attrs: { 'tabindex': '0' } });
        this.list.classList.add(dropDownBaseClasses.root);
        this.setFields();
        let rippleModel: RippleOptions = { duration: 300, selector: '.' + dropDownBaseClasses.li };
        this.rippleFun = rippleEffect(this.list, rippleModel);
        let group: HTMLElement = <HTMLElement>this.element.querySelector('select>optgroup');
        if (this.fields.groupBy || !isNullOrUndefined(group)) {
            EventHandler.add(this.list, 'scroll', this.setFloatingHeader, this);
        }
        if (this.getModuleName() === 'dropdownbase') {
            if (this.element.getAttribute('tabindex')) {
                this.list.setAttribute('tabindex', this.element.getAttribute('tabindex'));
            }
            removeClass([this.element], dropDownBaseClasses.root);
            this.element.style.display = 'none';
            let wrapperElement: HTMLElement = document.createElement('div');
            this.element.parentElement.insertBefore(wrapperElement, this.element);
            wrapperElement.appendChild(this.element);
            wrapperElement.appendChild(this.list);
        }
        this.setEnableRtl();
        this.setEnabled();
        if (!isEmptyData) {
            this.initialize();
        }
    };
    /**
     * Return the module name of this component.
     * @private
     */
    public getModuleName(): string {
        return 'dropdownbase';
    };
    /**
     * Gets all the list items bound on this component.
     * @returns Element[].
     */
    public getItems(): Element[] {
        return <HTMLElement[] & NodeListOf<Element>>this.ulElement.querySelectorAll('.' + dropDownBaseClasses.li);
    };
    /**
     * Adds a new item to the popup list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the popup list.
     * @return {void}.
     */
    public addItem(items: { [key: string]: Object }[] | { [key: string]: Object }, itemIndex?: number): void {
        if (!this.list || this.list.textContent === this.noRecordsTemplate) {
            this.renderList();
        }
        let itemsCount: number = this.getItems().length;
        let selectedItemValue: Element = this.list.querySelector('.' + dropDownBaseClasses.selected);
        items = items instanceof Array ? items : [items];
        let index: number;
        index = (isNullOrUndefined(itemIndex) || itemIndex < 0 || itemIndex > itemsCount - 1) ? itemsCount : itemIndex;
        let fields: FieldSettings = this.fields;
        let liCollections: HTMLElement[] = [];
        for (let i: number = 0; i < items.length; i++) {
            let item: { [key: string]: Object } = items[i];
            let li: HTMLElement = createElement('li', { className: dropDownBaseClasses.li, id: 'option-add-' + i });
            li.setAttribute('data-value', <string>getValue(fields.value, item));
            li.setAttribute('role', 'option');
            li.appendChild(document.createTextNode(<string>getValue(fields.text, item)));
            liCollections.push(li);
            this.listData.push(item);
            this.updateActionCompleteData(li, item);
        }
        if (itemsCount === 0 && isNullOrUndefined(this.list.querySelector('ul'))) {
            this.list.innerHTML = '';
            this.list.appendChild(this.ulElement);
            append(liCollections, this.ulElement);
        } else {
            for (let i: number = 0; i < items.length; i++) {
                if (this.liCollections[index]) {
                    this.liCollections[index].parentNode.insertBefore(liCollections[i], this.liCollections[index]);
                } else {
                    this.ulElement.appendChild(liCollections[i]);
                }
                let tempLi: HTMLElement[] = [].slice.call(this.liCollections);
                tempLi.splice(index, 0, liCollections[i]);
                this.liCollections = tempLi;
                index += 1;
            }
        }
        if (selectedItemValue || itemIndex === 0) {
            this.updateSelection();
        }
    }
    protected updateActionCompleteData(li: HTMLElement, item: { [key: string]: Object }): void {
        // this is for combobox custom value
    }
    /**
     * Gets the data Object that matches the given value. 
     * @param { string | number } value - Specifies the value of the list item.
     * @returns Object.
     */
    public getDataByValue(value: string | number): { [key: string]: Object } {
        let type: string = this.typeOfData(this.listData).typeof as string;
        if (type === 'string' || type === 'number') {
            for (let item of this.listData) {
                if (!isNullOrUndefined(item) && item === value as Object) {
                    return item;
                }
            }
        } else {
            for (let item of this.listData) {
                if (!isNullOrUndefined(item) && getValue((this.fields.value ? this.fields.value : 'value'), item) === value) {
                    return item;
                }
            }
        }
        return null;
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers. It also removes the attributes and classes.
     * @method destroy
     * @return {void}.
     */
    public destroy(): void {
        if (document.body.contains(this.list)) {
            EventHandler.remove(this.list, 'scroll', this.setFloatingHeader);
            if (!isNullOrUndefined(this.rippleFun)) {
                this.rippleFun();
            }
            detach(this.list);
        }
        super.destroy();
    };
}
interface ResultData {
    result: { [key: string]: Object }[];
}
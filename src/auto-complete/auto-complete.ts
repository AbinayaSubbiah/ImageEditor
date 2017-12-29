/// <reference path='../combo-box/combo-box-model.d.ts'/>
import { Property, addClass, EventHandler, KeyboardEventArgs, isNullOrUndefined, detach, Event, EmitType } from '@syncfusion/ej2-base';
import { removeClass, attributes, NotifyPropertyChanges } from '@syncfusion/ej2-base';
import { dropDownListClasses, FilteringEventArgs } from '../drop-down-list/drop-down-list';
import { ComboBox } from '../combo-box/combo-box';
import { AutoCompleteModel } from '../auto-complete/auto-complete-model';
import { highlightSearch } from '../common/highlight-search';
import { Search } from '../common/incremental-search';
import { FieldSettings, SPINNER_SIZE } from '../drop-down-base/drop-down-base';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';

/* tslint:disable */
import { FloatLabelType, Input } from '@syncfusion/ej2-inputs';
import { SortOrder } from '@syncfusion/ej2-lists';
import { DataManager, Query } from '@syncfusion/ej2-data';
/* tslint:enable */
const SPINNER_CLASS: string = 'e-atc-spinner-icon';

dropDownListClasses.root = 'e-autocomplete';
dropDownListClasses.icon = 'e-input-group-icon e-ddl-icon e-search-icon';

export type FilterType = 'Contains' | 'StartsWith' | 'EndsWith';

/**
 * The AutoComplete component provides the matched suggestion list when type into the input,
 * from which the user can select one.
 * ```html
 * <input id="list" type="text"/>
 * ```
 * ```typescript
 *   let atcObj:AutoComplete = new AutoComplete();
 *   atcObj.appendTo("#list");
 * ```
 */
@NotifyPropertyChanges
export class AutoComplete extends ComboBox {
    private isFiltered: boolean = false;
    /**
     * The `fields` property maps the columns of the data table and binds the data to the component.
     * @default { value: null, iconCss: null, groupBy: null}
     */
    @Property<FieldSettings>({ value: null, iconCss: null, groupBy: null })
    public fields: FieldSettings;
    /**
     * When set to ‘false’, consider the case-sensitive on performing the search to find suggestions.
     * By default not consider the casing.
     * @default true.
     */
    @Property(true)
    public ignoreCase: boolean;
    /**
     * Allows you to either show or hide the popup button on the component.
     * @default false.
     */
    @Property(false)
    public showPopupButton: boolean;
    /**
     * When set to ‘true’, highlight the searched characters on suggested list items.
     * @default false.
     */
    @Property(false)
    public highlight: boolean;
    /**
     * Display the specified number of list items on the suggestion popup.
     * @default 20.
     */
    @Property(20)
    public suggestionCount: number;
    /**
     * Allows additional HTML attributes such as title, name, etc., and
     * accepts n number of attributes in a key-value pair format.
     * ```html
     * <input type="text" tabindex="1" id="list"> </input>
     * ```
     * ```typescript
     *   let games: AutoComplete = new AutoComplete({
     *      dataSource: ['Tennis', 'FootBall', 'Cricket'],
     *      htmlAttributes: { title: 'List of games available here.' }
     *   });
     *   games.appendTo("#list");
     * ```
     * @default {}.
     */
    @Property({})
    public htmlAttributes: { [key: string]: string; };
    /**
     * Accepts the external [`Query`](http://ej2.syncfusion.com/documentation/data/api-query.html)
     * that execute along with data processing.
     * ```html
     * <input type="text" tabindex="1" id="list"> </input>
     * ```
     * ```typescript
     *   let searchData: { [key: string]: Object; }[] = [ {id: 's1', country: 'California'}, {id: 's2', country: 'India'},
     * {id: 's3', country: 'USA'}, {id: 's4', country: 'England'}]   
     *   let customers: AutoComplete = new AutoComplete({
     *      dataSource:new DataManager({ url:'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/' }),
     *      query: new Query().from('Customers').select(['ContactName', 'CustomerID']).take(5),
     *      fields: { text: 'ContactName', value: 'CustomerID' },
     *      placeholder: 'Select a customer'
     *   });
     *   customers.appendTo("#list");
     * ```
     * @default null.
     */
    @Property(null)
    public query: Query;
    /**
     * Allows you to set the minimum search character length, the search action will perform after typed minimum characters.
     * @default 1.
     */
    @Property(1)
    public minLength: number;
    /**   
     * Determines on which filter type, the component needs to be considered on search action. 
     * The available `filterType` and its supported data types are 
     * 
     * <table> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * FilterType<br/></td><td colSpan=1 rowSpan=1> 
     * Description<br/></td><td colSpan=1 rowSpan=1> 
     * Supported Types<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * StartsWith<br/></td><td colSpan=1 rowSpan=1> 
     * Checks whether a value begins with the specified value.<br/></td><td colSpan=1 rowSpan=1> 
     * String<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * EndsWith<br/></td><td colSpan=1 rowSpan=1> 
     * Checks whether a value ends with specified value.<br/><br/></td><td colSpan=1 rowSpan=1> 
     * <br/>String<br/></td></tr> 
     * <tr> 
     * <td colSpan=1 rowSpan=1> 
     * Contains<br/></td><td colSpan=1 rowSpan=1> 
     * Checks whether a value contains with specified value.<br/><br/></td><td colSpan=1 rowSpan=1> 
     * <br/>String<br/></td></tr> 
     * </table> 
     * 
     * The default value set to ‘Contains’, all the suggestion items which contain typed characters to listed in the suggestion popup.
     * @default 'Contains'.
     */
    @Property('Contains')
    public filterType: FilterType;
    /**
     * Triggers on typing a character in the component.
     * @event
     */
    @Event()
    public filtering: EmitType<FilteringArgs>;
    /**
     * Not applicable to this component.
     * @default null.
     * @private
     */
    @Property(null)
    public index: number;
    /**
     * Not applicable to this component.
     * @default null.
     * @private
     */
    @Property(null)
    public valueTemplate: string;
    /**
     * Not applicable to this component.
     * @default null.
     * @private
     */
    @Property(null)
    public filterBarPlaceholder: string;
    /**
     * Not applicable to this component. 
     * @default false.
     * @private
     */
    @Property(false)
    public allowFiltering: boolean;
    /**
     * Not applicable to this component. 
     * @default null.
     * @private
     */
    @Property(null)
    public text: string;
    /**
     * * Constructor for creating the widget
     */
    constructor(options?: AutoCompleteModel, element?: string | HTMLElement) {
        super(options, element);
    };
    /**
     * Initialize the event handler
     * @private
     */
    protected preRender(): void {
        super.preRender();
    }

    protected getNgDirective(): string {
        return 'EJ-AUTOCOMPLETE';
    }

    protected getQuery(query: Query): Query {
        let filterQuery: Query = query ? query.clone() : this.query ? this.query.clone() : new Query();
        if (this.isFiltered) {
            return filterQuery;
        }
        if (this.queryString !== null) {
            let dataType: string = <string>this.typeOfData(this.dataSource as { [key: string]: Object; }[]).typeof;
            if (!(this.dataSource instanceof DataManager) && dataType === 'string' || dataType === 'number') {
                filterQuery.where('', this.filterType, this.queryString, this.ignoreCase);
            } else {
                let fields: FieldSettings = this.fields;
                filterQuery.where(!isNullOrUndefined(fields.value) ? fields.value : '', this.filterType, this.queryString, this.ignoreCase);
            }
        }
        if (!isNullOrUndefined(this.suggestionCount)) {
            filterQuery.take(this.suggestionCount);
        }
        return filterQuery;
    }
    protected searchLists(e: KeyboardEventArgs): void {
        this.isTyped = true;
        this.isSelectCustom = false;
        if (isNullOrUndefined(this.list)) {
            super.renderList(true);
        }
        let isDownUpKey: boolean = e.keyCode === 40 || e.keyCode === 38;
        this.queryString = this.filterInput.value;
        if (isDownUpKey) {
            this.queryString = this.queryString === '' ? null : this.queryString;
            this.beforePopupOpen = true;
            this.resetList(this.dataSource, this.fields);
            return;
        }
        this.isSelected = false;
        this.activeIndex = null;
        let eventArgs: { [key: string]: Object } = {
            preventDefaultAction: false,
            text: this.filterInput.value,
            updateData: (
                dataSource: { [key: string]: Object }[] | DataManager | string[] | number[], query?: Query, fields?: FieldSettings) => {
                this.isFiltered = true;
                this.filterAction(dataSource, query, fields);
            }
        };
        this.trigger('filtering', eventArgs);
        if (!this.isFiltered && !eventArgs.preventDefaultAction) {
            this.filterAction(this.dataSource, null, this.fields);
        }
    }

    private filterAction(
        dataSource: { [key: string]: Object }[] | DataManager | string[] | number[], query?: Query, fields?: FieldSettings): void {
        this.beforePopupOpen = true;
        if (this.queryString !== '' && (this.queryString.length >= this.minLength || this.isFiltered)) {
            this.resetList(dataSource, fields, query);
        } else {
            this.hidePopup();
        }
    }

    protected clear(property?: string): void {
        if (isNullOrUndefined(property) || property !== 'dataSource') {
            super.clear();
        }
        if (this.beforePopupOpen) {
            this.hidePopup();
        }
    }

    protected onActionComplete(ulElement: HTMLElement, list: { [key: string]: Object }[], e?: Object, isUpdated?: boolean): void {
        this.fixedHeaderElement = null;
        super.onActionComplete(ulElement, list, e);
        let item: Element = this.list.querySelector('.' + dropDownListClasses.li);
        if (!isNullOrUndefined(item)) {
            removeClass([item], dropDownListClasses.focus);
        }
        this.postBackAction();
    }

    private postBackAction(): void {
        if (this.queryString !== null && this.queryString !== '' && this.highlight) {
            highlightSearch(this.list, this.queryString, this.ignoreCase, this.filterType);
        }
        if (this.autofill && !isNullOrUndefined(this.liCollections[0])) {
            let items: HTMLElement[] = [this.liCollections[0]];
            let searchItem: { [key: string]: number | Element } = Search(this.inputElement.value, items, 'StartsWith', this.ignoreCase);
            if (!isNullOrUndefined(searchItem.item)) {
                super.setAutoFill(this.liCollections[0], true);
            }
        }
    }

    protected setSelection(li: Element, e: MouseEvent | KeyboardEventArgs | TouchEvent): void {
        if (!this.isValidLI(li)) {
            return;
        }
        if (!isNullOrUndefined(e) && e.type === 'keydown' && (e as KeyboardEventArgs).action !== 'enter' && this.isValidLI(li)) {
            let value: string | number = this.getFormattedValue(li.getAttribute('data-value'));
            this.activeIndex = this.getIndexByValue(value);
            this.setHoverList(li);
            this.selectedLI = <HTMLElement>li;
            this.setScrollPosition(e as KeyboardEventArgs);
            if (this.autofill) {
                this.preventAutoFill = false;
                super.setAutoFill(li);
            }
            attributes(this.inputElement, { 'aria-activedescendant': this.selectedLI ? this.selectedLI.id : null });
        } else {
            super.setSelection(li, e);
        }
    }

    protected showSpinner(): void {
        if (isNullOrUndefined(this.spinnerElement)) {
            this.spinnerElement = this.inputWrapper.buttons[0] || this.inputWrapper.clearButton ||
                Input.appendSpan('e-input-group-icon ' + SPINNER_CLASS, this.inputWrapper.container);
            addClass([this.spinnerElement], dropDownListClasses.disableIcon);
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
            removeClass([this.spinnerElement], dropDownListClasses.disableIcon);
            if (this.spinnerElement.classList.contains(SPINNER_CLASS)) {
                detach(this.spinnerElement);
            } else {
                this.spinnerElement.innerHTML = '';
            }
            this.spinnerElement = null;
        }
    }

    protected isFiltering(): boolean {
        return true;
    }

    protected renderPopup(): void {
        this.list.scrollTop = 0;
        super.renderPopup();
        if (this.highlight) {
            highlightSearch(this.list, this.queryString, this.ignoreCase, this.filterType);
        }
    }

    protected isEditTextBox(): boolean {
        return true;
    }

    protected isPopupButton(): boolean {
        return this.showPopupButton;
    }

    protected isSelectFocusItem(element: Element): boolean {
        return false;
    }
    /**
     * Search the entered text and show it in the suggestion list if available.
     * @returns void.
     */
    public showPopup(): void {
        if (this.beforePopupOpen) {
            this.refreshPopup();
            return;
        }
        this.beforePopupOpen = true;
        this.preventAutoFill = true;
        if (isNullOrUndefined(this.list)) {
            this.renderList();
        } else {
            this.resetList(this.dataSource, this.fields);
        }
    }
    /**
     * Hides the popup if it is in open state.
     * @returns void.
     */
    public hidePopup(): void {
        super.hidePopup();
        this.activeIndex = -1;
    }
    /**
     * Dynamically change the value of properties.
     * @private
     */
    public onPropertyChanged(newProp: AutoCompleteModel, oldProp: AutoCompleteModel): void {
        this.setUpdateInitial(['query', 'dataSource'], newProp as { [key: string]: string; });
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'showPopupButton':
                    if (this.showPopupButton) {
                        let button: HTMLElement = Input.appendSpan(dropDownListClasses.icon, this.inputWrapper.container);
                        this.inputWrapper.buttons[0] = button;
                        EventHandler.add(this.inputWrapper.buttons[0], 'click', this.dropDownClick, this);
                    } else {
                        detach(this.inputWrapper.buttons[0]);
                        this.inputWrapper.buttons[0] = null;
                    }
                    break;
                default:
                    let atcProps: { [key: string]: Object };
                    atcProps = this.getPropObject(prop, <{ [key: string]: string; }>newProp, <{ [key: string]: string; }>oldProp);
                    super.onPropertyChanged(atcProps.newProperty, atcProps.oldProperty);
                    break;
            }
        }
    }
    /**
     * Return the module name of this component.
     * @private
     */
    public getModuleName(): string {
        return 'autocomplete';
    }
    /**
     * To initialize the control rendering
     * @private
     */
    public render(): void {
        super.render();
    };
}
export interface FilteringArgs extends FilteringEventArgs {
    /**
     * To prevent the internal filtering action.
     */
    preventDefaultAction: boolean;
}
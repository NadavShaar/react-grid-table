# react-grid-table

> A modular table, based on a CSS grid layout, optimized for customization.

[![NPM](https://img.shields.io/npm/v/@nadavshaar/react-grid-table.svg)](https://www.npmjs.com/package/@nadavshaar/react-grid-table) [![Downloads](https://img.shields.io/npm/dt/@nadavshaar/react-grid-table)](https://www.npmjs.com/package/@nadavshaar/react-grid-table) 

**Supported features:**

- Async support
- Sort by column
- Column resize
- Column reorder
- Search with highlight
- Pagination
- Row selection
- Inline row editing
- Column pinning (pre-configured)
- Column visibility management
- Virtual scroll
- Sticky header
- Dynamic row height

**Live [Demo](https://nadavshaar.github.io/react-grid-table/)**

[<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="Edit on CodeSandbox" data-canonical-src="https://codesandbox.io/static/img/play-codesandbox.svg" style="max-width:100%;">](https://codesandbox.io/s/react-grid-table-demo-3275n?file=/src/App.js)

![Demo](https://user-images.githubusercontent.com/8030614/105251406-16b98600-5b84-11eb-849e-77f43d9dd476.gif)

## Install

```bash
npm i @nadavshaar/react-grid-table
```

## Usage
By default, the table is fully featured even with just a basic configuration of rows and columns.

**Example:**

[<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="Edit on CodeSandbox" data-canonical-src="https://codesandbox.io/static/img/play-codesandbox.svg" style="max-width:100%;">](https://codesandbox.io/s/react-grid-table-usage-p6538?file=/src/App.js)

```JSX
import React from "react";
import GridTable from '@nadavshaar/react-grid-table';

// custom cell component
const Username = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
    return (
        <div className='rgt-cell-inner' style={{display: 'flex', alignItems: 'center', overflow: 'hidden'}}>
            <img src={data.avatar} alt="user avatar" />
            <span className='rgt-text-truncate' style={{marginLeft: 10}}>{value}</span>
        </div>
    )
}

const rows = [
    { 
        "id": 1, 
        "username": "wotham0", 
        "gender": "Male", 
        "last_visited": "12/08/2019", 
        "test": {"x": 1, "y": 2}, 
        "avatar":"https://robohash.org/atquenihillaboriosam.bmp?size=32x32&set=set1"
    },
    { 
        "id": 2, 
        "username": "dbraddon2", 
        "gender": "Female", 
        "last_visited": "16/07/2018", 
        "test": {"x": 3, "y": 4}, 
        "avatar":"https://robohash.org/etsedex.bmp?size=32x32&set=set1"
    },
    { 
        "id": 3, 
        "username": "dridett3", 
        "gender": "Male", 
        "last_visited": "20/11/2016", 
        "test": {"x": 5, "y": 8}, 
        "avatar":"https://robohash.org/inimpeditquam.bmp?size=32x32&set=set1"
    },
    { 
        "id": 4, 
        "username": "gdefty6", 
        "gender": "Female", 
        "last_visited": "03/08/2019", 
        "test": {"x": 7, "y": 4}, 
        "avatar":"https://robohash.org/nobisducimussaepe.bmp?size=32x32&set=set1"
    },
    { 
        "id": 5, 
        "username": "hbeyer9", 
        "gender": "Male", 
        "last_visited": "10/10/2016", 
        "test": {"x": 2, "y": 2}, 
        "avatar":"https://robohash.org/etconsequatureaque.jpg?size=32x32&set=set1"
    }
];

const columns = [
    {
        id: 1, 
        field: 'username', 
        label: 'Username',
        cellRenderer: Username,
    }, 
    {
        id: 2, 
        field: 'gender', 
        label: 'Gender',
    },
    {
        id: 3, 
        field: 'last_visited', 
        label: 'Last Visited',
        sort: ({a, b, isAscending}) => {
            let aa = a.split('/').reverse().join(),
            bb = b.split('/').reverse().join();
            return aa < bb ? isAscending ? -1 : 1 : (aa > bb ? isAscending ? 1 : -1 : 0);
        }
    },
    {
        id: 4, 
        field: 'test', 
        label: 'Score',
        getValue: ({value, column}) => value.x + value.y
    }
];

const MyAwesomeTable = () => <GridTable columns={columns} rows={rows} />;

export default MyAwesomeTable;
```

# Docs
### Table of contents
- [Main components](#main-components)
- [Props](#props)
- [Configuration props](#configuration-props)
- [Event props](#event-props)
- [Async props](#async-props)
- [The `columns` prop](#columns)
- [The `checkbox` column](#checkbox-column)
- [The `rows` prop](#rows)
- [The `components` prop](#components)
- [The `additionalProps` prop](#additionalProps)
- [The `tableManager` API](#tableManager)
- [How-To: Sync/Async](#syncasync)
- [How-To: Row-Editing](#row-editing)
- [How-To: Styling](#styling)

#### Support this package

[![paypal](https://image.flaticon.com/icons/png/128/2871/2871557.png)](https://www.paypal.com/donate?hosted_button_id=VAEHCLA692FMW)

## Main components
**HEADER (optional | customizable):** search & column visibility management. 

**TABLE-HEADER:** sort, resize & column reorder. 

**TABLE-BODY:** displaying data / loader / no-results, row editing & row selection. 

**FOOTER (optional | customizable):** rows information, rows per page & pagination. 


## Props

| name | type | description | default value |
|---|---|---|---|
| columns* | array of objects | columns configuration (<u>[details](#columns)</u>) | [ ] |
| rows | array of objects | rows data (<u>[details](#rows)</u>) | [ ] |
| selectedRowsIds | array of ids | the ids of all selected rows (<u>[details](#checkbox-column)</u>) | [ ] |
| searchText | string | text for search | "" |
| getIsRowSelectable | function | a callback function that returns whether row selection for the current row should be selectable or disabled | `row => true` |
| getIsRowEditable | function | a callback function that returns whether row editing for the current row should be allowed or not | `row => true` |
| editRowId | any | the id of the row that should switch to inline editing mode, (more <u>[details](#Row-Editing)</u> about row editing) | null |
| page | number | current page number | 1 |
| pageSize | number | the selected page size | 20 |
| sort | object | sort config. accepts `colId` for the id of the column that should be sorted, and `isAsc` to define the sort direction. example: `{ colId: 'some-column-id', isAsc: true }`, to unsort simply pass `colId` as `null` | { } |
| isLoading | boolean | whether to display the loader | false |

### Configuration props

| name | type | description | default value |
|---|---|---|---|
| rowIdField | string | the name of the field in the row's data that should be used as the row identifier - must be **unique** | 'id' |
| minColumnResizeWidth | number | minimum width for all columns while resizing (doesn't apply to 'checkbox' column)| 70 |
| minSearchChars | number | the minimum characters to type before search will apply | 2 |
| isHeaderSticky | boolean | whether the table header cells will stick to the top when scrolling, or not | true |
| isPaginated | boolean | determine whether the pagination controls sholuld be shown in the footer and if the rows data should split into pages | true |
| enableColumnsReorder | boolean | whether to allow column drag & drop for repositioning | true |
| highlightSearch | boolean | whether to highlight the search term | true |
| showSearch | boolean | whether to show the search component in the header | true |
| showRowsInformation | boolean | whether to show the rows information component (located at the left side of the footer) | true |
| showColumnVisibilityManager | boolean | whether to display the columns visibility management button (located at the top right of the header) | true |
| pageSizes | array of numbers | page size options | [20, 50, 100] |
| isVirtualScroll | boolean | whether to render items in a virtual scroll to enhance performance (useful when you have lots of rows in a page) | true |
| selectAllMode | string | controls the type of "All Selection". Available options are `page` to select / unselect only the rows in the current page, or `all` to select / unselect all rows in all pages. If using an async flow, the `all` option will select all *available* rows, and the `page` option combined with `batchSize`, will select/unselect all *available* rows in the page | 'page' |
| icons | object of nodes | custom icons config | { sortAscending, sortDescending, clearSelection, columnVisibility, search, loader } |
| texts | object | config for all UI text, useful for translations or to customize the text | { search: 'Search:', totalRows: 'Total rows:', rows: 'Rows:', selected: 'Selected', rowsPerPage: 'Rows per page:', page: 'Page:', of: 'of', prev: 'Prev', next: 'Next', columnVisibility: 'Column visibility' } |
| components | object | This prop gives you the ability to override the internal components with your own custom components (see full list of supported [components](#components)) | { [Default components](#components) } |
| additionalProps | object | This prop gives you the ability to pass props to the table's components/modules (see full list of supported [additionalProps](#additionalProps)) | `additionalProps={{ header: { ... } }}` |

### Event props

| name | type | description | usage |
|---|---|---|---|
| onColumnsChange | function | triggers when the `columns` has been changed | `columns => { ... }` |
| onSelectedRowsChange | function | triggers when rows selection has been changed | `selectedRowsIds => { ... }` |
| onPageChange | function | triggers when page is changed | `nextPage => { ... }` |
| onPageSizeChange | function | triggers when page size is changed | `newPageSize => { ... }` |
| onSearchTextChange | function | triggers when search text changed | `searchText => { ... }` |
| onSortChange | function | triggers when sort changed | `({colId, isAsc}) => { ... }` |
| onRowClick | function | triggers when a row is clicked | `({ rowIndex, data, column, isEdit, event }, tableManager) => { ... }` |
| onEditRowIdChange | function | triggers when `rowEditId` changed | `rowEditId => { ... }` |
| onLoad | function | triggers when `tableManager` is initialized (<u>[details](#tableManager)</u>) | `tableManager => { ... }` |
| onColumnResizeStart | function | triggers when column resize starts | `({event, target, column}) => { ... }` |
| onColumnResize | function | triggers when column resize occur | `({event, target, column}) => { ... }` |
| onColumnResizeEnd | function | triggers when column resize ended | `({event, target, column}) => { ... }` |
| onColumnReorderStart | function | triggers on column drag. the sort data supplied by [react-sortable-hoc](https://github.com/clauderic/react-sortable-hoc) using the `onSortStart` prop | `(sortData, tableManager) => { ... }` |
| onColumnReorderEnd | function | triggers on column drop, and only if the column changed its position. the sort data supplied by [react-sortable-hoc](https://github.com/clauderic/react-sortable-hoc) using the `onSortEnd` prop | `(sortData, tableManager) => { ... }` |

### Async props

| name | type | description | usage/default value |
|---|---|---|---|
| onRowsRequest | function | triggers when new rows should be fetched | see [example](#async-uncontrolled) |
| onRowsChange | function | triggers when the rows have changed | see [example](#async-controlled) |
| onTotalRowsChange | function | triggers when the total number of rows have changed | see [example](#async-controlled) |
| onRowsReset | function | triggers when the accumulated rows needs to be reset (when searching or sorting) | see [example](#async-managed) |
| batchSize | number | defines the amount of rows that will be requested by `onRowsRequest` prop | the page size of the table |
| requestDebounceTimeout | number | defines the amount of debouncing time for triggering the `onRowsRequest` prop | 300 |
| totalRows | number | the total number of rows | --- |

## props - detailed

### columns
**Type:** array of objects.

This prop defines the columns configuration.

Each column (except for '[checkbox](#checkbox-column)' column) has support for the following properties:

| name | type | description | default value |
|---|---|---|---|
| id* | any | a unique identifier for the column, setting it to 'checkbox' will generate a rows selction column (more [details](#checkbox-column) about checkbox column)  | --- |
| field | string | the name of the field as in the row data | --- |
| label | string | the label to display in the header cell | the `field` property |
| pinned | boolean | whether the column will be pinned to the side, **supported only in the first and last columns** | false |
| visible | boolean | whether to display the column | true |
| className | string | a custom class selector for all column cells | "" |
| width | string | the initial width of the column in grid values (full list of [values](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns)) | "200px" |
| minResizeWidth | number | the minimum width of the column when resizing | `minColumnResizeWidth` prop |
| maxResizeWidth | number, null | the maximum width of the column when resizing | null |
| getValue | function | used for getting the cell value (usefull when the cell value is not a string - [details](#rows)) | `({value, column}) => value` |
| setValue | function | used for updating the cell value (usefull when the cell value is not a string - [details](#Row-Editing)) | `({ value, data, setRow, column }) => { setRow({ ...data, [column.field]: value}) }` |
| searchable | boolean | whether to apply search filtering on the column | true |
| editable | boolean | whether to allow editing for the column | true |
| sortable | boolean | whether to allow sort for the column | true |
| resizable | boolean | whether to allow resizing for the column | true |
| search | function | the search function for the column | `({value, searchText}) => value.toString().toLowerCase().includes(searchText.toLowerCase())` |
| sort | function | the sort function for the column | `({a, b, isAscending}) => { let aa = typeof a === 'string' ? a.toLowerCase() : a; let bb = typeof b === 'string' ? b.toLowerCase() : b; if(aa > bb) return isAscending ? 1 : -1; else if(aa < bb) return isAscending ? -1 : 1; return 0; }` |
| cellRenderer | function | used for custom rendering the cell component `({ tableManager, value, data, column, colIndex, rowIndex }) => ( children )` | --- |
| headerCellRenderer | function | used for custom rendering the header cell component `({ tableManager, column }) => ( children )` | --- |
| editorCellRenderer | function | used for custom rendering the cell component in edit mode `({ tableManager, value, data, column, colIndex, rowIndex, onChange }) => ( children )` | --- |
| placeHolderRenderer | function | used for custom rendering the cell's placeholder component that is displayed when loading new rows `({ tableManager, value, data, column, colIndex, rowIndex }) => ( children )` | --- |

**Example:**
```javascript
// column config

{
  id: 'some-unique-id',
  field: 'first_name',
  label: 'First Name',
  className: '',
  pinned: false,
  width: '200px',
  getValue: ({value, column}) => value, 
  setValue: ({ value, data, setRow, column }) => { setRow({ ...data, [column.field]: value}) },
  minResizeWidth: 70,
  maxResizeWidth: null,
  sortable: true,
  editable: true,
  searchable: true,
  visible: true,
  resizable: true,
  search: ({value, searchText}) => { },
  sort: ({a, b, isAscending}) => { },
  cellRenderer: ({ tableManager, value, data, column, colIndex, rowIndex }) => ( children ),
  headerCellRenderer: ({ tableManager, column }) => ( children ),
  editorCellRenderer: ({ tableManager, value, data, column, colIndex, rowIndex, onChange }) => ( children ),
  placeHolderRenderer: ({ tableManager, value, data, column, colIndex, rowIndex }) => ( children )
}
```

#### checkbox-column
Rows selection is done by a predefined column, simply add a column with an `id` of 'checkbox'.

Checkbox column has support for the following properties:

| name | type | description | default value  |
|---|---|---|---|
| id* | 'checkbox' | will generate a rows selction column | --- |
| pinned | boolean | whether the column will be pinned to the side, **supported only in the first and last columns** | false |
| visible | boolean | whether to display the column | true |
| className | string | a custom class for all column cells | "" |
| width | string | the initial width of the column in grid values (full list of [values](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns)) | "max-content" |
| minResizeWidth | number | the minimum width of the column when resizing | 0 |
| maxResizeWidth | number, null | the maximum width of the column when resizing | null |
| resizable | boolean | whether to allow resizing for the column | false |
| cellRenderer | function | used for custom rendering the checkbox cell | `({ tableManager, value, data, column, colIndex, rowIndex, onChange, disabled}) => ( <input type="checkbox" onChange={ onChange } checked={ value } disabled={ disabled } /> )` |
| headerCellRenderer | function | used for custom rendering the checkbox header cell | `({ tableManager, column, mode, ref, checked, disabled, indeterminate, onChange }) => ( <input type="checkbox" onChange={ onChange } checked={ checked } disabled={ disabled } /> )` |

**Example:**
```javascript
// checkbox column config

{
  id: 'checkbox',
  pinned: true,
  className: '',
  width: '54px',
  minResizeWidth: 0,
  maxResizeWidth: null,
  resizable: false,
  visible: true,
  cellRenderer: ({tableManager, value, data, column, colIndex, rowIndex, onChange, disabled}) => ( children )
  headerCellRenderer: ({tableManager, column, mode, ref, checked, disabled, indeterminate, onChange}) => ( children )
}
```

### rows
**Type:** array of objects.

This prop containes the data for the rows.

Each row should have a unique identifier field, which by default is `id`, but it can be changed to a different field using the `rowIdField` prop.

```json
// Example for a single row data

{
  "id": "some-unique-id", 
  "objectValueField": {"x": 1, "y": 2}, 
  "username":"wotham0",
  "first_name":"Waldemar",
  "last_name":"Otham",
  "avatar":"https://robohash.org/atquenihillaboriosam.bmp?size=32x32&set=set1",
  "email":"wotham0@skyrock.com",
  "gender":"Male",
  "ip_address":"113.75.186.33",
  "last_visited":"12/08/2019"
}
```

**Note:** If a property value is not of type string, you'll have to use the `getValue` function on the column in order to extract the desired value. 

**Example:**

Let's say the field's value for a cell is an object: 

`{ ... , fullName: {firstName: 'some-first-name', lastName: 'some-last-name'} }`, 

Its `getValue` function for displaying the first and last name as a full name, would be: 

`getValue: ({value, column}) => value.firstName + ' ' +  value.lastName`

The returned value will be used for searching, sorting etc...

### components
**Type:** object.

This prop gives you the ability to override the internal components with your own custom components.

All components are exported so you'll be able to import them from anywhere but you'll be responsible to supply them with their props:

| component | required props | optional props |
|---|---|---|
| Header | `tableManager` | --- |
| Search | `tableManager` | `value` `onChange` |
| ColumnVisibility | `tableManager` | `columns` `onChange` |
| HeaderCell | `tableManager` | `column` |
| HeaderSelectionCell | `tableManager` | `column` `ref` `onChange` `checked` `disabled` |
| Cell | `tableManager` | `value` |
| EditorCell | `tableManager` | `value` `data` `column` `colIndex` `rowIndex` `onChange` |
| SelectionCell | `tableManager` | `value` `disabled` `onChange` |
| PlaceHolderCell | `tableManager` | --- |
| Loader | `tableManager` | --- |
| NoResults | `tableManager` | --- |
| DragHandle | --- | --- |
| Footer | `tableManager` | --- |
| Information | `tableManager` | `totalCount` `pageSize` `pageCount` `selectedCount` |
| PageSize | `tableManager` | `value` `onChange` `options` |
| Pagination | `tableManager` | `page` `onChange` |

**Example: Overriding the header component**

[<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="Edit on CodeSandbox" data-canonical-src="https://codesandbox.io/static/img/play-codesandbox.svg" style="max-width:100%;">](https://codesandbox.io/s/react-grid-table-components-64bh4?file=/src/CustomHeader.js)

<!-- [<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="Edit on CodeSandbox" data-canonical-src="https://codesandbox.io/static/img/play-codesandbox.svg" style="max-width:100%;">](#) -->

```JSX
const Header = ({tableManager}) => {

    const { searchApi, columnsVisibilityApi, columnsApi } = tableManager;

    const { searchText, setSearchText } = searchApi;
    const { toggleColumnVisibility } = columnsVisibilityApi;
    const { columns } = columnsApi;

    return (
        <div style={{display: 'flex', flexDirection: 'column', padding: '10px 20px', background: '#fff', width: '100%'}}>
            <div>
                <label htmlFor="my-search" style={{fontWeight: 500, marginRight: 10}}>
                    Search for:
                </label>
                <input 
                    name="my-search"
                    type="search" 
                    value={searchText} 
                    onChange={e => setSearchText(e.target.value)} 
                    style={{width: 300}}
                />
            </div>
            <div style={{display: 'flex', marginTop: 10}}>
                <span style={{ marginRight: 10, fontWeight: 500 }}>Columns:</span>
                {
                    columns.map((column, idx) => (
                        <div key={idx} style={{flex: 1}}>
                            <input 
                                id={`checkbox-${idx}`}
                                type="checkbox" 
                                onChange={ e => toggleColumnVisibility(column.id) } 
                                checked={ column.visible !== false } 
                            />
                            <label htmlFor={`checkbox-${idx}`} style={{flex: 1, cursor: 'pointer'}}>
                                {column.label}
                            </label>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

const MyAwesomeTable = props => {
    ...
    return (
        <GridTable
            ...
            components={{ Header }}
        />
    )
}
```

### additionalProps
**Type:** object.

This prop gives you the ability to pass props to internal components/modules.

**Example**
Passing props to the cell component:
```JSX
additionalProps={{ cell: { ... }, ... }}
```
**List of components/modules you can pass props to:**

- header
- search
- columnVisibility
- headerCell
- headerSelectionCell
- cell
- editorCell
- selectionCell
- placeHolderCell
- footer
- information
- pageSize
- pagination
- rowVirtualizer

# tableManager

This is the API object used by the internal components, you can use it to do anything that the API provides, outside of the component.

API Structure:

- **id:** A unique identifier for each table component.
- **isMounted:** Is the table mounted.
- **isInitialized:** Is the table initialized. Will be set to true once all components are initialized.
- **mode:** 'sync' or 'async', derived from the supplied props.
- **isLoading:** Is the table currently loading data.
- [**config:**](#config) All the params that defines the table's user-interface and its behavior.
- [**refs:**](#refs) ref objects for selected elements.
- [**columnsApi:**](#columnsApi) API of the columns.
- [**columnsVisibilityApi:**](#columnsVisibilityApi) API of the columns visibility.
- [**searchApi:**](#searchApi) API of the search.
- [**sortApi:**](#sortApi) API of the sort.
- [**rowsApi:**](#rowsApi) API of the rows
- [**paginationApi:**](#paginationApi) API of the pagination.
- [**rowSelectionApi:**](#rowSelectionApi) API of the rows selection.
- [**rowEditApi:**](#rowEditApi) API of the row editing.
- **rowVirtualizer:** API of the rows virtualizer (See full documentation at [**react-virtual**](https://github.com/tannerlinsley/react-virtual)).
- [**asyncApi:**](#asyncApi) API of the async functionality.

### config

| name | type | description | default value |
|---|---|---|---|
| rowIdField | string | the name of the field in the row's data that should be used as the row identifier - must be **unique** | 'id' |
| minColumnResizeWidth | number | minimum width for all columns while resizing (doesn't apply to 'checkbox' column) | 70 |
| minSearchChars | number | the minimum characters to type before search will apply | 2 |
| isHeaderSticky | boolean | whether the table header cells will stick to the top when scrolling, or not | true |
| isPaginated | boolean | 	determine whether the pagination controls sholuld be shown in the footer and if the rows data should split into pages | true |
| enableColumnsReorder | boolean | whether to allow column drag & drop for repositioning | true |
| highlightSearch | boolean | whether to highlight the search term | true |
| showSearch | boolean | whether to show the search component in the header | true |
| showRowsInformation | boolean | whether to show the rows information component (located at the left side of the footer) | true |
| showColumnVisibilityManager | boolean | whether to display the columns visibility management button (located at the top right of the header) | true |
| pageSizes | array of numbers | page size options | [20, 50, 100] |
| requestDebounceTimeout | number | defines the amount of debouning time for triggering the `onRowsRequest` prop | 300 |
| isVirtualScroll | boolean | whether to render items in a virtual scroll to enhance performance (useful when you have lots of rows in a page) | true |
| tableHasSelection | boolean | wether the table has a checkbox column to control rows selection | --- |
| components | object | the components that are in use by the table (see full list of [components](#components)) | {Header, Search, ColumnVisibility, HeaderCell, HeaderSelectionCell, Cell, EditorCell, SelectionCell, PlaceHolderCell, Loader, NoResults, Footer, Information, PageSize, Pagination} |
| additionalProps | object | additional props that are passed to the internal components (see full list of [additionalProps](#additionalProps)) | {} |
| icons | object | the icons that are in use by the table | { sortAscending, sortDescending, clearSelection, columnVisibility, search, loader } |
| texts | object | the texts that are in use by the table | { search, totalRows, rows, selected, rowsPerPage, page, of, prev, next, columnVisibility } |

### refs

| name | type | description |
|---|---|---|
| rgtRef | object | the `ref` object of the wrapper element |
| tableRef | object | the `ref` object of the table container element |

### columnsApi

| name | type | description | usage |
|---|---|---|---|
| columns | array | columns configuration | --- |
| visibleColumns | array | the columns that are visible | --- |
| setColumns | function | updates the columns | `setColumns(columns)` |

### columnsVisibilityApi

| name | type | description | usage |
|---|---|---|---|
| toggleColumnVisibility | function | toggles a column's visibility by its `id` | `toggleColumnVisibility(column.id)` |

### searchApi

| name | type | description | usage |
|---|---|---|---|
| searchText | string | text for search | --- |
| setSearchText | function | updates the search text | `setSearchText('hello')` |
| searchRows | function | filters rows based on the search text, using the search method defined on the columns | `searchRows(rows)` |
| valuePassesSearch | function | returns true if a value passes the search for a certain column | `valuePassesSearch('hello', column)` |

### sortApi

| name | type | description | usage |
|---|---|---|---|
| sort | object | the sort object holds `colId` for the id of the column that should be sorted or `null` when there is no sort, and `isAsc` that defines the sort direction | --- |
| setSort | function | updates the sort object | `setSort({colId: 5, isAsc: false})` |
| sortRows | function | sorts rows based on the selected direction using the sort method defined on the column | `sortRows(rows)` |
| toggleSort | function | toggles a column's sort steps from ascending, to descending and to none | `toggleSort(column.id)` |

### rowsApi

| name | type | description | usage |
|---|---|---|---|
| rows | array | the rows | --- |
| setRows | function | updates the rows | `setRows(rows)` |
| totalRows | number | the total number of rows | --- |
| setTotalRows | function | updates the total number of rows | `setTotalRows(1000)` |

### paginationApi

| name | type | description | usage |
|---|---|---|---|
| page | number | the current page number | --- |
| setPage | function | updates the page number | `setPage(3)` |
| pageSize | number | the selected page size | --- |
| setPageSize | function | updates the page size | `setPageSize(20)` |
| pageRows | array | the rows in the current page | --- |
| totalPages | number | the total number of pages | --- |

### rowSelectionApi

| name | type | description | usage |
|---|---|---|---|
| selectedRowsIds | array of ids | the ids of all selected rows | --- |
| setSelectedRowsIds | function | updates the selected rows | `setSelectedRowsIds([1,3,5])` |
| toggleRowSelection | function | toggles selection of a row by its `id` | `toggleRowSelection(row.id)` |
| getIsRowSelectable | function | determains whether a row can be selected | `getIsRowSelectable(row.id)` |
| selectAll.mode | string | the type of select all, possible modes are `page` which only handles selection of the page rows, or `all` which handles selection of all rows. If using an async flow, all mode will handle selection of all *available* rows, and page mode with a controlled `batchSize`, will handle selection of all *available* rows in the page | --- |
| selectAll.disabled | boolean | whether the select all button should be disabled because there are no selectable rows that match the selectAll.mode | --- |
| selectAll.checked | boolean | whether all the rows that match the selectAll.mode are selected | --- |
| selectAll.indeterminate | boolean | whether only some of the rows that match the selectAll.mode are selected | --- |
| selectAll.onChange | function | selects/unselects all rows that match the selectAll.mode | `selectAll.onChange()` |
| selectAll.ref | ref | a ref that can be added to the select all checkbox to enable auto setting of indeterminate state | --- |

### rowEditApi

| name | type | description | usage |
|---|---|---|---|
| editRow | object | the row's data that is currently being edited | --- |
| editRowId | any | the id of the row that is currently being edited | --- |
| getIsRowEditable | function | determains whether a row can be edited | `getIsRowEditable(row)` |
| setEditRow | function | updates the row's data of the currently edited row | `setEditRow(row)` |
| setEditRowId | function | updates the row id of the currently edited row, you can pass `null` to switch back from edit mode | `setEditRowId(row.id)` |

### asyncApi

| name | type | description | usage / default value |
|---|---|---|---|
| isLoading | boolean | whether a request for new rows is still pending | --- |
| mergeRowsAt | function | merges `array`s of rows at a certain index while filling "holes" with `null`s | `mergeRowsAt(rows, moreRows, atIndex)` |
| resetRows | function | drops the accumulated rows, which will trigger a new request  | `resetRows()` |
| batchSize | number | defines the amount of rows that will be requested by `onRowsRequest` prop | `paginationApi.pageSize` |

# How to...

### Sync/Async
`react-grid-table` supports 4 different data managing flows:

#### Sync: 

Use this flow if you have all the data locally.  
Just pass all the data using the `rows` prop.  

**Required props**:

| name | type | description |
|---|---|---|
| rows* | array of objects | rows data (<u>[details](#rows)</u>) |

**Example:**

[<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="Edit on CodeSandbox" data-canonical-src="https://codesandbox.io/static/img/play-codesandbox.svg" style="max-width:100%;">](https://codesandbox.io/s/react-grid-table-sync-u550u?file=/src/App.js)

```JSX
export const SyncedTable = () => {

    const rows = getRows();
    const columns = getColumns();

    return (
        <GridTable
            columns={columns}
            rows={rows}
        />
    )
}
``` 

#### Async (Uncontrolled): 

Use this flow if you need to fetch your data asynchrony, and want `react-grid-table` to manage it internally.  
All the data is supplied to the table via the `onRowsRequest` prop.  

**Required props**:

| name | type | description |
|---|---|---|
| onRowsRequest* | async function | Should return a promise that resolves to {rows, totalRows} |

**Example:**

[<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="Edit on CodeSandbox" data-canonical-src="https://codesandbox.io/static/img/play-codesandbox.svg" style="max-width:100%;">](https://codesandbox.io/s/react-grid-table-async-lpmfv?file=/src/App.js)

```JSX
export const AsyncUncontrolledTable = () => {
    
    const columns = getColumns();

    const onRowsRequest = async (requestData, tableManager) => {
        const response = await fetch(`app/api/rows`, {
            method: 'post',
            body: {
                from: requestData.from,
                to: requestData.to,
                searchText: requestData.searchText,
                sort: requestData.sort,
            },
        }).then(response => response.json()).catch(console.warn);

        if(!response?.items) return;
        
        return {
            rows: response.items,
            totalRows: response.totalItems
        };
    }

    return (
        <GridTable
            columns={columns}
            onRowsRequest={onRowsRequest}
        />
    )
}
``` 

#### Async (Controlled): 

Use this flow if you need to fetch your data asynchrony, and want `react-grid-table` to manage it internally, but still be able to use it in other places in the app.  
All the data is supplied to the table via the `onRowsRequest` prop, but is controlled by a parent component via `rows`, `onRowsChange`, `totalRows` & `onTotalRowsChange` props.   

**Required props**:

| name | type | description |
|---|---|---|
| onRowsRequest* | async function | Should return a promise that resolves to {rows, totalRows} |
| rows* | array of objects | rows data (<u>[details](#rows)</u>) |
| onRowsChange* | function | Should be used to set the current data |
| totalRows* | number | Should contain the current data length |
| onTotalRowsChange* | function | Should be used to set the current data length |

**Example:**

[<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="Edit on CodeSandbox" data-canonical-src="https://codesandbox.io/static/img/play-codesandbox.svg" style="max-width:100%;">](https://codesandbox.io/s/react-grid-table-async-controlled-6pp8v?file=/src/App.js)

```JSX
export const AsyncControlledTable = () => {
    
    const columns = getColumns();
    let [rows, setRows] = useState();
    let [totalRows, setTotalRows] = useState();

    const onRowsRequest = async (requestData, tableManager) => {
        const response = await fetch(`app/api/rows`, {
            method: 'post',
            body: {
                from: requestData.from,
                to: requestData.to,
                searchText: requestData.searchText,
                sort: requestData.sort,
            },
        }).then(response => response.json()).catch(console.warn);

        if(!response?.items) return;
        
        return {
            rows: response.items,
            totalRows: response.totalItems
        };
    }

    return (
        <GridTable
            columns={columns}
            onRowsRequest={onRowsRequest}
            rows={rows}
            onRowsChange={setRows}
            totalRows={totalRows}
            onTotalRowsChange={setTotalRows}
        />
    )
}
``` 
#### Async (Managed): 

Use it if you need to fetch your data asynchrony, and manage it yourself (Useful when there are other places that should be able to fetch the same data).  
All the data is supplied to the table via the `rows` prop, which should be updated using the `onRowsRequest` prop.   
**Note**: `react-grid-table` will not necessarily ask for concurrent data, which means that "holes" in the data are possible. These "holes" needs to be filled with null/undefined items in order to ensure proper functionally. 

To achieve this, you can use:

```JSX
let mergedRows = tableManager.asyncApi.mergeRowsAt(rows, fetchedRows, at)
``` 

**Required props**:

| name | type | description |
|---|---|---|
| onRowsRequest* | async function | Should update the rows props according to the request |
| rows* | array of objects | rows data (<u>[details](#rows)</u>) |
| totalRows* | number | Should contain the current data length |
| onRowsReset* | function | Should be used to reset the current data. Will be called when sort or searchText change |

**Example:**

[<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="Edit on CodeSandbox" data-canonical-src="https://codesandbox.io/static/img/play-codesandbox.svg" style="max-width:100%;">](https://codesandbox.io/s/react-grid-table-async-managed-2bsvl?file=/src/App.js)

```JSX
const controller = new AbortController();

export const AsyncManagedTable = () => {
    
    const columns = getColumns();
    let rowsRef = useRef([]);
    let [totalRows, setTotalRows] = useState();

    const onRowsRequest = async (requestData, tableManager) => {
        const response = await fetch(`app/api/rows`, {
            method: 'post',
            body: {
                from: requestData.from,
                to: requestData.to,
                searchText: requestData.searchText,
                sort: requestData.sort,
            },
            signal: controller.signal,
        }).then(response => response.json()).catch(console.warn);

        if(!response?.items) return;

        rowsRef.current = tableManager.asyncApi.mergeRowsAt(rowsRef.current, response.items, requestData.from);

        setTotalRows(response.totalItems);
    }

    const onRowsReset = () => {
        rowsRef.current = [];
        setTotalRows();
        controller.abort();
    }

    return (
        <GridTable
            columns={columns}
            rows={rowsRef.current}
            onRowsRequest={onRowsRequest}
            onRowsReset={onRowsReset}
            totalRows={totalRows}
            requestDebounceTimeout={500}
        />
    )
}
``` 

### Row-Editing
Row editing can be done by rendering the edit button using the `cellRenderer` property in the column configuration, then when clicked, it will control the `editRowId` prop, then the table will render the editing components for columns that are defined as `editable` (true by default), and as was defined in the `editorCellRenderer` which by default will render a text input.

**Example:**

[<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="Edit on CodeSandbox" data-canonical-src="https://codesandbox.io/static/img/play-codesandbox.svg" style="max-width:100%;">](https://codesandbox.io/s/react-grid-table-row-edit-mwysh?file=/src/App.js)

```JSX
// state
const [rowsData, setRows] = useState(MOCK_DATA);

// 'editRowId' can also be controlled.
// if using controlled state, you can call your 'setEditRowId' instead of 'tableManager.rowEditApi.setEditRowId' to set it directly on your state.
// the table will typicaly call 'onEditRowIdChange' to reset it if 'searchText', 'sort' or 'page' has changed.
// const [editRowId, setEditRowId] = useState(null)

// columns
let columns = [
    ...,
    {
        id: 'my-buttons-column',
        width: 'max-content',
        pinned: true,
        sortable: false,
        resizable: false,
        cellRenderer: ({ tableManager, value, data, column, colIndex, rowIndex }) => (
            <button 
                style={{marginLeft: 20}} 
                onClick={e => tableManager.rowEditApi.setEditRowId(data.id)}
            >&#x270E;</button>
        ),
        editorCellRenderer: ({ tableManager, value, data, column, colIndex, rowIndex, onChange }) => (
            <div style={{display: 'inline-flex'}}>
                <button 
                    style={{marginLeft: 20}} 
                    onClick={e => tableManager.rowEditApi.setEditRowId(null)}
                >&#x2716;</button>
                <button 
                    style={{marginLeft: 10, marginRight: 20}} 
                    onClick={e => {
                        let rowsClone = [...rowsData];
                        let updatedRowIndex = rowsClone.findIndex(r => r.id === data.id);
                        rowsClone[updatedRowIndex] = data;

                        setRowsData(rowsClone);
                        tableManager.rowEditApi.setEditRowId(null);
                    }
                }>&#x2714;</button>
            </div>
        )
    }
];

// render
<GridTable 
    columns={columns}
    rows={rowsData} 
    //editRowId={editRowId}
    //onEditRowIdChange={setEditRowId}
    ...
/>

```

For columns that hold values other than string, you'll need to define the `setValue` function on the column so the updated value won't override the original value.

**Example:**

```JSX
setValue: ({value, data, setRow, column}) => {
    // value: '35', 
    // data: { ..., columnField: { fieldToUpdate: '27' }} 
    let rowClone = { ...data };
    rowClone[column.field].fieldToUpdate = value;
    setRow(rowClone);
}
```

### Styling

Styling is done by CSS classes that you can easily override. the table's components are mapped with pre-defined classes that should cover any situation, and you can add your own custom class per column in the `columns` configuration using the `className` property.

| Component | All available class selectors |
|---|---|
| Wrapper | `rgt-wrapper` |
| Header | `rgt-header-container` |
| Search | `rgt-search-container` `rgt-search-label` `rgt-search-icon` `rgt-search-input` `rgt-search-highlight` |
| Columns Visibility Manager | `rgt-columns-manager-wrapper` `rgt-columns-manager-button` `rgt-columns-manager-button-active` `rgt-columns-manager-popover` `rgt-columns-manager-popover-open` `rgt-columns-manager-popover-row` `rgt-columns-manager-popover-title` `rgt-columns-manager-popover-body` |
| Table | `rgt-container` `rgt-container-overlay` |
| Header Cell | `rgt-cell-header` `rgt-cell-header-[column.field]` `rgt-cell-header-checkbox` `rgt-cell-header-virtual-col` `rgt-cell-header-sortable / rgt-cell-header-not-sortable` `rgt-cell-header-sticky` `rgt-cell-header-resizable / rgt-cell-header-not-resizable` `rgt-cell-header-searchable / rgt-cell-header-not-searchable` `rgt-cell-header-pinned` `rgt-cell-header-pinned-left / rgt-cell-header-pinned-right` `rgt-cell-header-inner-not-pinned-right` `[column.className]` `rgt-cell-header-inner` `rgt-cell-header-inner-checkbox` `rgt-resize-handle` `rgt-sort-icon` `rgt-sort-icon-ascending / rgt-sort-icon-descending` `rgt-column-sort-ghost` |
| Cell | `rgt-cell` `rgt-cell-[column.field]` `rgt-row-[rowNumber]` `rgt-row-odd / rgt-row-even` `rgt-row-hover` `rgt-row-selectable / rgt-row-not-selectable` `rgt-cell-inner` `rgt-cell-checkbox` `rgt-cell-virtual` `rgt-cell-pinned` `rgt-cell-pinned-left / rgt-cell-pinned-right` `rgt-cell-editor` `rgt-cell-editor-inner` `rgt-cell-editor-input` `rgt-row-selected` `rgt-placeholder-cell` `rgt-row-edit` |
| Footer | `rgt-footer` `rgt-footer-right-container` |
| Pagination | `rgt-footer-pagination` `rgt-footer-pagination-button` `rgt-footer-pagination-input-container` `rgt-footer-page-input` |
| Information | `rgt-footer-items-information` `rgt-footer-clear-selection-button` |
| PageSize | `rgt-footer-page-size` `rgt-footer-page-size-select` |
| (Utils) | `rgt-text-truncate` `rgt-clickable` `rgt-disabled` `rgt-disabled-button` `rgt-flex-child` |

## License

 © [MIT](https://github.com/NadavShaar/react-grid-table/blob/main/LICENSE)

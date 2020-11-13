# react-grid-table

> A modular table, based on a CSS grid layout, optimized for customization.

[![NPM](https://img.shields.io/npm/v/@nadavshaar/react-grid-table.svg)](https://www.npmjs.com/package/@nadavshaar/react-grid-table) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

**Supported features:**

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

<!-- [<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="Edit on CodeSandbox" data-canonical-src="https://codesandbox.io/static/img/play-codesandbox.svg" style="max-width:100%;">](#) -->

<!-- ![rgt](https://user-images.githubusercontent.com/8030614/98936396-945e7700-24ed-11eb-9485-83586d7b1df8.gif) -->
![rgt](https://user-images.githubusercontent.com/8030614/98937518-2adf6800-24ef-11eb-8040-4629dbb4754d.gif)

## Install
Not published yet!
<!--
```bash
npm install --save @nadavshaar/react-grid-table
```
-->
## Usage
By default, the table is fully featured even with just a basic configuration of rows and columns.

Import both the component from `@nadavshaar/react-grid-table` and its styles from `@nadavshaar/react-grid-table/dist/index.css`.

**Example:**

<!-- [<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="Edit on CodeSandbox" data-canonical-src="https://codesandbox.io/static/img/play-codesandbox.svg" style="max-width:100%;">](#) -->

```JSX
import React from "react";

// importing the table component
import GridTable from '@nadavshaar/react-grid-table';
// importing the table's styles - required
import '@nadavshaar/react-grid-table/dist/index.css';

// custom cell component
const Username = ({ tableManager, value, data, column, rowIndex, searchText }) => {
    return (
        <div className='rgt-cell-inner' style={{display: 'flex', alignItems: 'center'}}>
            <img src={data.avatar} alt="user avatar" />
            <span className='rgt-text-truncate' style={{marginLeft: 10}}>{value}</span>
        </div>
    )
}

let rows = [
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

const MyAwesomeTable = () => {
    
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

    return (
        <GridTable 
            columns={columns}
            rows={rows} 
        />
    )
};

export default MyAwesomeTable;
```
# Docs
### Table of contents
- [Main components](#main-components)
- [Props](#props)
- [Table configuration props](#table-configuration-props)
- [Event props](#event-props)
- [Components props](#components-props)
- [The `columns` prop](#columns)
- [The `checkbox` column](#checkbox-column)
- [The `rows` prop](#rows)
- [The `headerComponent` prop](#headerComponent)
- [The `footerComponent` prop](#footerComponent)
- [The `tableManager` API](#tableManager)
- [How-To: Row-Editing](#row-editing)
- [How-To: Styling](#styling)

## Main components
**HEADER (optional | customizable):** search & column visibility management. 

**TABLE-HEADER:** sort, resize & column reorder. 

**TABLE-BODY:** displaying data / loader / no-results, row editing & row selection. 

**FOOTER (optional | customizable):** rows information, rows per page & pagination. 


## props

| name | type | description | default value |
|---|---|---|---|
| columns* | array of objects | columns configuration (<u>[details](#columns)</u>) | [ ] |
| rows* | array of objects | rows data (<u>[details](#rows)</u>) | [ ] |
| rowIdField | string | the name of the field in the row's data that should be used as the row identifier - must be unique | 'id' |
| selectedRowsIds | array of ids | the ids of all selected rows (<u>[details](#checkbox-column)</u>) | [ ] |
| searchText | string | text for search | "" |
| getIsRowSelectable | function | a callback function that returns whether row selection for the current row should be disabled or not | `row => true` |
| getIsRowEditable | function | a callback function that returns whether row editing for the current row should be disabled or not | `row => true` |
| editRowId | any | the id of the row that should switch to inline editing mode, (more <u>[details](#Row-Editing)</u> about row editing) | null |
| cellProps | object | global props for all data cells | { } |
| headerCellProps | object | global props for all header cells | { } |
| rowVirtualizerProps | object | props for the row virtualizer when `isVirtualScrolling` is true, as documeneted in [react-virtual](https://github.com/tannerlinsley/react-virtual) | { } |

### Table configuration props

| name | type | description | default value |
|---|---|---|---|
| isVirtualScrolling | boolean | whether to render items in a virtual scroll to enhance performance (useful when you have lots of rows in a page) | true |
| isPaginated | boolean | determine whether the pagination controls sholuld be shown in the footer and if the rows data should split into pages | true |
| page | number | current page number | 1 |
| pageSizes | array of numbers | page size options | [20, 50, 100] |
| pageSize | number | the selected page size | 20 |
| sort | object | sort config when controlled. accepts `colId` for the id of the column that should be sorted, and `isAsc` to define the sort direction. example: `{ colId: 'some-column-id', isAsc: true }` | { } |
| minColumnWidth | number | minimum width for all columns (doesn't apply to 'checkbox' column)| 70 |
| highlightSearch | boolean | whether to highlight the search term | true |
| showSearch | boolean | whether to show the search component in the header | true |
| showRowsInformation | boolean | whether to show the rows information component (located at the left side of the footer) | true |
| searchMinChars | number | the minimum characters in order to apply search and highlighting | 2 |
| isLoading | boolean | whether to render a loader | false |
| disableColumnsReorder | boolean | whether to disable column drag & drop for repositioning | false |
| isHeaderSticky | boolean | whether the table header cells will stick to the top when scrolling, or not | true |
| showColumnVisibilityManager | boolean | whether to display the columns visibility management button (located at the top right of the header) | true |
| icons | object of nodes | custom icons config | { sortAscending, sortDescending, clearSelection, columnVisibility, search, loader } |
| textConfig | object | config for all UI text, useful for translations or to customize the text | { search: 'Search:', totalRows: 'Total rows:', rows: 'Rows:', selected: 'Selected', rowsPerPage: 'Rows per page:', page: 'Page:', of: 'of', prev: 'Prev', next: 'Next', columnVisibility: 'Column visibility' } |

### Event props

| name | type | description | usage |
|---|---|---|---|
| onColumnsChange | function | triggers when the `columns` has been changed | `columns => { }` |
| onSelectedRowsChange | function | triggers when rows selection has been changed | `selectedRowsIds => { }` |
| onPageChange | function | triggers when page is changed | `nextPage => { }` |
| onPageSizeChange | function | triggers when page size is changed | `newPageSize => { }` |
| onSearchChange | function | triggers when search text changed | `searchText => { }` |
| onSortChange | function | triggers when sort changed | `({colId, isAsc}) => { }` |
| onRowClick | function | triggers when a row is clicked | `({rowIndex, data, column, event}) => { }` |
| onRowEditIdChange | function | triggers when `rowEditId` changed | `rowEditId => { }` |
| onLoad | function | triggers when `tableManager` is initialized (<u>[details](#tableManager)</u>) | `tableManager => { }` |
| onResize | function | triggers when column resize occur | `({event, target, column}) => { }` |
| onResizeEnd | function | triggers when column resize ended | `() => { }` |
| onColumnReorderStart | function | triggers on column drag. the sort data supplied by [react-sortable-hoc](https://github.com/clauderic/react-sortable-hoc) using the `onSortStart` prop | `sortData => { }` |
| onColumnReorderEnd | function | triggers on column drop, and only if the column changed its position. the sort data supplied by [react-sortable-hoc](https://github.com/clauderic/react-sortable-hoc) using the `onSortEnd` prop | `sortData => { }` |

### Components props

All components are getting the `tableManager` object ([details](#tableManager)).

| name | type | description | usage |
|---|---|---|---|
| headerComponent | function | used for rendering a custom header ([details](#headerComponent)) | `({tableManager}) =>  ( children )` |
| footerComponent | function | used for rendering a custom footer ([details](#footerComponent)) | `({tableManager}) =>  ( children )` |
| loaderComponent | function | used for rendering a custom loader | `({tableManager}) => ( children )` |
| noResultsComponent | function | used for rendering a custom component when there is no data to display | `({tableManager}) => ( children )` |
| searchComponent | function | used for rendering a custom search component ([details](#headerComponent)) | `({value, onChange, tableManager}) => ( children )` |
| columnVisibilityComponent | function | used for rendering a custom columns visibility management component ([details](#headerComponent)) | `({columns, onChange, tableManager}) => ( children )` |
| dragHandleComponent | function | used for rendering a drag handle for the column reorder | `() => ( children )` |
| informationComponent | function | used for rendering a custom rows information component (located at the bottom left in the footer) | `({totalCount, pageCount, selectedCount, tableManager}) => ( children )` |
| pageSizeComponent | function | used for rendering a custom page size control | `({value, onChange, options, tableManager}) => ( children )` |
| paginationComponent | function | used for rendering a custom pagination component | `({page, onChange, tableManager}) => ( children )` |

## props - detailed

### columns
**Type:** array of objects.

This prop defines the columns configuration.

Each column support the following properties:

| name | type | description | default value |
|---|---|---|---|
| id* | any | a unique identifier for the column (can be changed to a different field using the `rowIdField` prop), or you can set it to 'checkbox' which will generate a rows selction column (more [details](#checkbox-column) about checkbox column)  | --- |
| field | string | the name of the field as in the row data, not necessary when the column is not rendering data from `rows` | --- |
| label | string | the label to display in the header cell | the `field` property |
| pinned | boolean | whether the column will be pinned to the side, supported only in the first and last columns | false |
| visible | boolean | whether to display the column | true |
| className | string | a custom class selector for all column cells | "" |
| width | string | the initial width of the column in grid values (full list of [values](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns)) | "200px" |
| minWidth | number | the minimum width of the column | `minColumnWidth` prop |
| maxWidth | number, null | the maximum width of the column | null |
| getValue | function | used for getting the cell value (usefull when the cell value is not a string - [details](#rows)) | `({value, column}) => value` |
| setValue | function | used for updating the cell value (usefull when the cell value is not a string - [details](#Row-Editing)) | `({ value, data, setRow, column }) => { setRow({ ...data, [column.field]: value}) }` |
| searchable | boolean | whether to apply search filtering on the column | true |
| editable | boolean | whether to allow editing for the column | true |
| sortable | boolean | whether to allow sort for the column | true |
| resizable | boolean | whether to allow resizing for the column | true |
| search | function | the search function for the column | `({value, searchText}) => value.toString().toLowerCase().includes(searchText.toLowerCase())` |
| sort | function | the sort function for the column | `({a, b, isAscending}) => { let aa = typeof a === 'string' ? a.toLowerCase() : a; let bb = typeof b === 'string' ? b.toLowerCase() : b; if(aa > bb) return isAscending ? 1 : -1; else if(aa < bb) return isAscending ? -1 : 1; return 0; }` |
| cellRenderer | function | used for custom rendering the cell component `({ tableManager, value, data, column, rowIndex, searchText }) => ( children )` | --- |
| headerCellRenderer | function | used for custom rendering the header cell component `({label, column}) => ( children )` | --- |
| editorCellRenderer | function | used for custom rendering the cell component in edit mode `({ tableManager, value, field, onChange, data, column, rowIndex }) => ( children )` | --- |

**Example:**
```javascript
// column config

{
  id: 'some-unique-id',
  field: 'first_name',
  label: 'First Name',
  className: '',
  pinned: false,
  width: 'max-content',
  getValue: ({value, column}) => value, 
  setValue: ({ value, data, setRow, column }) => { setRow({ ...data, [column.field]: value}) },
  minWidth: 70,
  maxWidth: null,
  sortable: true,
  editable: true,
  searchable: true,
  visible: true,
  resizable: true,
  search: ({value, searchText}) => { },
  sort: ({a, b, isAscending}) => { },
  cellRenderer: ({ tableManager, value, data, column, rowIndex, searchText }) => ( children ),
  headerCellRenderer: ({label, column}) => ( children ),
  editorCellRenderer: ({ tableManager, value, field, onChange, data, column, rowIndex }) => ( children )
}
```

#### checkbox-column
Rows selection is done by a predefined column, simply add a column with an `id` of 'checkbox'.

Checkbox column support the following properties:

| name | type | description | default value  |
|---|---|---|---|
| id* | 'checkbox' | will generate a rows selction column | --- |
| pinned | boolean | whether the column will be pinned to the side, supported only in the first and last columns | false |
| visible | boolean | whether to display the column | true |
| className | string | a custom class for all column cells | "" |
| width | string | the initial width of the column in grid values (full list of [values](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns)) | "max-content" |
| minWidth | number | the minimum width of the column | 0 |
| maxWidth | number, null | the maximum width of the column | null |
| resizable | boolean | whether to allow resizing for the column | false |
| cellRenderer | function | used for custom rendering the checkbox cell | `({isSelected, callback, disabled, rowIndex}) => ( <input type="checkbox" onChange={ callback } checked={ isSelected } disabled={ disabled } /> )` |
| headerCellRenderer | function | used for custom rendering the checkbox header cell | `({isSelected, isIndeterminate, callback, disabled}) => ( <input type="checkbox" onChange={ callback } checked={ isSelected } disabled={ disabled } /> )` |

**Example:**
```javascript
// checkbox column config

{
  id: 'checkbox',
  pinned: true,
  className: '',
  width: '54px',
  minWidth: 0,
  maxWidth: null,
  resizable: false,
  visible: true,
  cellRenderer: ({isSelected, callback, disabled, rowIndex}) => ( children )
  headerCellRenderer: ({isSelected, isIndeterminate, callback, disabled}) => ( children )
}
```

### rows
**Type:** array of objects.

This prop containes the data for the rows.

Each row should have a unique identifier field, which by default is `id`, but it can be changed to a different field using the `rowIdField` prop.

```json
// row data

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

### headerComponent
**Type:** function

The component that will be used as the header component, if you don't want a header at all, simply return `null`.

By default the header renders a search and column visibility manager components, but you can render your own custom components.

If you just want to replace the search or the column visibility management components, you can use the `searchComponent` or the `columnVisibilityComponent` props.

**Arguments:** 
| name | type | description |
|---|---|---|
| tableManger | object | the API object, it containes all data, functions and parameters used by the table (more [details](#tableManager)) |

**Example:**

<!-- [<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="Edit on CodeSandbox" data-canonical-src="https://codesandbox.io/static/img/play-codesandbox.svg" style="max-width:100%;">](#) -->

```JSX
const Header = ({tableManager}) => {

    const { params, handlers, columnsData } = tableManager;

    const { searchText } = params;
    const { handleSearchChange, toggleColumnVisibility } = handlers;
    const { columns } = columnsData;

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
                    onChange={e => handleSearchChange(e.target.value)} 
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
            headerComponent={Header}
        />
    )
}
```

### footerComponent
**Type:** function

The component that will be used as the footer component, if you don't want a footer at all, simply return `null`.

By default the footer renders items information and pagination controls, but you can render your own custom components.

If you just want to replace the rows information, rows per page or the pagination components, you can use the `informationComponent`, `pageSizeComponent` or the `paginationComponent` props respectively.

**Arguments:** 
| name | type | description |
|---|---|---|
| tableManger | object | the API object, it containes all data, functions and parameters used by the table (more [details](#tableManager)) |

**Example:**

<!-- [<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="Edit on CodeSandbox" data-canonical-src="https://codesandbox.io/static/img/play-codesandbox.svg" style="max-width:100%;">](#) -->

```JSX
const Footer = ({tableManager}) => {

    let {
        params: { page, pageSize, pageSizes, totalPages },
        rowsData: { items, pageItems, selectedRowsIds },
        icons: { clearSelection: clearSelectionIcon },
        handlers: { updateSelectedItems, handlePageSizeChange, handlePagination },
    } = tableManager;

    return (
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '12px 20px', background: '#fff'}}>
            <div style={{display: 'flex'}}>
                {`Total Rows: ${items.length} 
                | Rows: ${pageItems.length * page - pageItems.length} - ${pageItems.length * page} 
                | ${selectedRowsIds.length} Selected`}
                { 
                    selectedRowsIds.length ? 
                        <button 
                            style={{marginLeft: 10, padding: 0}} 
                            onClick={e => updateSelectedItems([])}
                        >
                            {clearSelectionIcon}
                        </button> 
                        : 
                        null 
                }
            </div>
            <div style={{display: 'flex'}}>
                <div style={{width: 200, marginRight: 50}}>
                    <span>Items per page: </span>
                    <select 
                        value={pageSize} 
                        onChange={e => {handlePageSizeChange(e.target.value)}}
                    >
                        { pageSizes.map((op, idx) => <option key={idx} value={op}>{op}</option>) }
                    </select>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', width: 280}}>
                    <button 
                        disabled={page-1 < 1} 
                        onClick={e => handlePagination(page-1)}
                    >Back</button>

                    <div>
                        <span>Page: </span>
                        <input 
                            style={{width: 50, marginRight: 5}}
                            onClick={e => e.target.select()}
                            type='number' 
                            value={totalPages ? page : 0} 
                            onChange={e => handlePagination(e.target.value*1)}
                        />
                        <span>of {totalPages}</span>
                    </div>

                    <button 
                        disabled={page+1 > totalPages} 
                        onClick={e => handlePagination(page+1)}
                    >Next</button>
                </div>
            </div>
        </div>
    )
}

const MyAwesomeTable = props => {
    ...
    return (
        <GridTable
            ...
            footerComponent={Footer}
        />
    )
}
```

# tableManager

This is the API object used by the internal components, you can use it to do anything that the API provides, outside of the component.

The API is devided into the following categories:

- **refs:** ref objects of the table and its wrapper
- **handlers:** all functionality handlers
- **components:** all [components](#components-props) that are not part of the table itself
- **rowsData:** all rows related data
- **columnsData:** all columns related data
- **params:** table configuration properties
- **additionalProps:** additional props
- **icons:** icons configuration

### refs

| name | type | description |
|---|---|---|
| rgtRef | object | the `ref` object of the wrapper element |
| tableRef | object | the `ref` object of the table container element |

### handlers

| name | type | description | usage |
|---|---|---|---|
| setColumns | function | sets a columns configuration | setColumns(columns) |
| handlePageSizeChange | function | handles the page size change | `handlePageSizeChange(pageSize)` |
| handleRowEdit | function | updates the row in edit mode, used as the onChange callback for the `editorCellRenderer` propery in the column, and should be used when `editRowId` is set to the id of the edited row | `handleRowEdit(updatedRow)` |
| updateSelectedItems | function | updates the rows selection, contains array of rows ids | `updateSelectedItems([])` |
| toggleItemSelection | function | toggles the row selection by row id | `toggleItemSelection(rowId)` |
| handlePagination | function | navigate to a page | `handlePagination(pageNumber)` |
| toggleColumnVisibility | function | toggles column visibility by column id | `toggleColumnVisibility(colId)` |
| handleSearchChange | function | updates the search | `handleSearchChange(searchText)` |
| handleRowEditIdChange | function | will set a row to switch to edit mode by its id, you can pass null to switch back from edit mode | `handleRowEditIdChange(rowEditId)` |
| getHighlightedText | function | gets text and a search term and returns html with highlighted search term | `getHighlightedText(text, searchTerm)` |
| onRowClick | function | triggers when a row is clicked | `({rowIndex, data, column, event}) => { }` |
| getIsRowEditable | | a callback function that returns whether row editing for the current row should be disabled or not | `row => true` |
| getIsRowSelectable | | a callback function that returns whether row selection for the current row should be disabled or not | `row => true` |
| handleSort | function | sets the sort by the column's id and the sort direction, both can be either: `true`, `false` or `null` | `handleSort(colId, isAsc)` |
| onResize | function | triggers when column resize occur | `({event, target, column}) => { }` |
| onResizeEnd | function | triggers when column resize ended | `() => { }` |
| onColumnReorderStart | function | triggers on column drag. the sort data supplied by [react-sortable-hoc](https://github.com/clauderic/react-sortable-hoc) using the `onSortStart` prop | `sortData => { }` |
| onColumnReorderEnd | function | triggers on column drop, and only if the column changed its position. the sort data supplied by [react-sortable-hoc](https://github.com/clauderic/react-sortable-hoc) using the `onSortEnd` prop | `sortData => { }` |

### components
all [components](#components-props) that are not part of the table itself.

### rowsData

| name | type | description | default value |
|---|---|---|---|
| items | array of objects | the `rows` data |
| pageItems | array of objects | all rows data in the current page | [ ] |
| updatedRow | object | the row that is currently in editing mode | null |
| selectedRowsIds | array | array containing the selected rows ids | [ ] |
| rowIdField | string | the name of the field in the row's data that should be used as the row identifier - must be unique | 'id' |

### columnsData

| name | type | description |
|---|---|---|
| columns | array of objects | the `columns` configuration |
| visibleColumns | array of objects | all columns that has `visible` true |

### params

| name | type | description | default value |
|---|---|---|---|
| sort | object | sort config when controlled. accepts `colId` for the id of the column that should be sorted, and `isAsc` to define the sort direction. example: `{ colId: 'some-column-id', isAsc: true }` | { } |
| lastColIsPinned | boolean | wether the last column is pinned | --- |
| page | number | the current page number | 0 |
| searchText | string | text for search | "" |
| highlightSearch | boolean | whether to highlight the search term | true |
| searchMinChars | number | the minimum characters in order to apply search and highlighting | 2 |
| totalPages | number | the total number of pages | 0 |
| pageSize | number | the selected page size | 20 |
| pageSizes | array of numbers | page size options | [20, 50, 100] |
| tableHasSelection | boolean | wether table has a checkbox column to conrol rows selection | --- |
| showSearch | boolean | whether to show the search component in the header | true |
| showRowsInformation | boolean | whether to show the rows information component (located at the left side of the footer) | true |
| showColumnVisibilityManager | boolean | whether to display the columns visibility management button (located at the top right of the header) | true |
| isHeaderSticky | boolean | whether the table header cells will stick to the top when scrolling, or not | true |
| isPaginated | boolean | 	determine whether the pagination controls sholuld be shown in the footer and if the rows data should split into pages | true |
| isVirtualScrolling | boolean | whether to render items in a virtual scroll to enhance performance (useful when you have lots of rows in a page) | true |
| disableColumnsReorder | boolean | whether to disable column drag & drop for repositioning | false |
| textConfig | object | config for all UI text, useful for translations or to customize the text | { search: 'Search:', totalRows: 'Total rows:', rows: 'Rows:', selected: 'Selected', rowsPerPage: 'Rows per page:', page: 'Page:', of: 'of', prev: 'Prev', next: 'Next', columnVisibility: 'Column visibility' } |


### additionalProps

| name | type | description | default value |
|---|---|---|---|
| cell | object | props passed to all data cells using `cellProps` | { } |
| headerCell | object | props passed to all header cells using `headerCellProps` | { } |
| rowVirtualizer | object | props passed to the row virtualizer using `rowVirtualizerProps` | { } |

### icons

the `icons` configuration as documented under [Table configuration props](#table-configuration-props).

# How to...

### Row-Editing
Row editing can be done by rendering the edit button using the `cellRenderer` property in the column configuration, then when clicked, it will control the `editRowId` prop, then the table will render the editing components for columns that are defined as `editable` (true by default), and as was defined in the `editorCellRenderer` which by default will render a text input.

<!-- [<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="Edit on CodeSandbox" data-canonical-src="https://codesandbox.io/static/img/play-codesandbox.svg" style="max-width:100%;">](#) -->

```JSX
// state
const [rowsData, setRows] = useState(MOCK_DATA);
const [editRowId, setEditRowId] = useState(null)

// columns
let columns = [
    ...,
    {
        id: 'my-buttons-column',
        width: 'max-content',
        pinned: true,
        sortable: false,
        resizable: false,
        cellRenderer: ({ tableManager, value, data, column, rowIndex, searchText }) => (
            <button 
                style={{marginLeft: 20}} 
                onClick={e => tableManager.handlers.handleRowEditIdChange(data.id)}
            >&#x270E;</button>
        ),
        editorCellRenderer: ({ tableManager, value, field, onChange, data, column, rowIndex }) => (
            <div style={{display: 'inline-flex'}}>
                <button 
                    style={{marginLeft: 20}} 
                    onClick={e => tableManager.handlers.handleRowEditIdChange(null)}
                >&#x2716;</button>
                <button 
                    style={{marginLeft: 10, marginRight: 20}} 
                    onClick={e => {
                        let rowsClone = [...tableManager.rowsData.items];
                        let updatedRowIndex = rowsClone.findIndex(r => r.id === data.id);
                        rowsClone[updatedRowIndex] = data;

                        setRowsData(rowsClone);
                        tableManager.handlers.handleRowEditIdChange(null);
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
    editRowId={editRowId}
    ...
/>

```

For columns that holds values other than string, you'll need to define the `setValue` function on the column so the updated value won't override the original value.

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

Styling is done by css classes that can be easily overridden. the table's components are mapped with pre-defined classes that should cover any situation, and you can add your own custom class per column in the `columns` configuration using the `className` property.

| Component | All available class selectors |
|---|---|
| Wrapper | `rgt-wrapper` |
| Header | `rgt-header-container` |
| Search | `rgt-search-container` `rgt-search-label` `rgt-search-icon` `rgt-search-input` `rgt-search-highlight` |
| Columns Visibility Manager | `rgt-columns-manager-wrapper` `rgt-columns-manager-button` `rgt-columns-manager-button-active` `rgt-columns-manager-popover` `rgt-columns-manager-popover-open` `rgt-columns-manager-popover-row` `rgt-columns-manager-popover-title` `rgt-columns-manager-popover-body` |
| Table | `rgt-container` |
| Header Cell | `rgt-cell-header` `rgt-cell-header-[column.field]` `rgt-cell-header-select-all` `rgt-cell-header-virtual-col` `rgt-cell-header-sortable / rgt-cell-header-not-sortable` `rgt-cell-header-sticky` `rgt-cell-header-resizable / rgt-cell-header-not-resizable` `rgt-cell-header-searchable / rgt-cell-header-not-searchable` `rgt-cell-header-pinned` `rgt-cell-header-pinned-left / rgt-cell-header-pinned-right` `[column.className]` `rgt-cell-header-inner` `rgt-cell-header-inner-checkbox-column` `rgt-resize-handle` `rgt-sort-icon` `rgt-sort-icon-ascending / rgt-sort-icon-descending` `rgt-column-sort-ghost` |
| Cell | `rgt-cell` `rgt-cell-[column.field]` `rgt-row-[rowNumber]` `rgt-row-odd / rgt-row-even` `rgt-row-hover` `rgt-row-selectable / rgt-row-not-selectable` `rgt-cell-inner` `rgt-cell-checkbox` `rgt-cell-virtual` `rgt-cell-pinned` `rgt-cell-pinned-left / rgt-cell-pinned-right` `rgt-cell-editor` `rgt-cell-editor-inner` `rgt-cell-editor-input` `rgt-row-selected` |
| Footer | `rgt-footer` `rgt-footer-right-container` |
| Pagination | `rgt-footer-items-per-page` `rgt-footer-pagination-button` `rgt-footer-pagination-container` `rgt-footer-page-input` |
| Information | `rgt-footer-items-information` |
| PageSize | `rgt-footer-items-per-page` |
| (Utils) | `rgt-text-truncate` `rgt-clickable` `rgt-disabled` `rgt-disabled-button` `rgt-flex-child` |

## License

 © [NadavShaar](https://github.com/NadavShaar) 

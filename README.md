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
- Sticky header
- Dynamic row height

**Live [Demo](https://nadavshaar.github.io/react-grid-table/)**

![table](https://user-images.githubusercontent.com/8030614/94979139-cad9c700-0529-11eb-8774-324eb4dfe4f6.gif)

## Install

```bash
npm install --save @nadavshaar/react-grid-table
```

## Basic Usage
By default, the table is fully featured even with just a basic configuration of rows and columns.

Import both the component from `@nadavshaar/react-grid-table` and its styles from `@nadavshaar/react-grid-table/dist/index.css`.
```JSX
import React from "react";

// importing the table component
import GridTable from '@nadavshaar/react-grid-table';
// importing the component's styles - required
import '@nadavshaar/react-grid-table/dist/index.css';

// custom cell component
import Username from "./components/Username";

let rows = [
    { 
        "id": 1, 
        "username": "wotham0", 
        "gender": "Male", 
        "last_visited": "12/08/2019", 
        "object_value_field": {"x": 1, "y": 2}, 
    },
    { 
        "id": 2, 
        "username": "dbraddon2", 
        "gender": "Female", 
        "last_visited": "16/07/2018", 
        "object_value_field": {"x": 3, "y": 4}, 
    },
    { 
        "id": 3, 
        "username": "dridett3", 
        "gender": "Male", 
        "last_visited": "20/11/2016", 
        "object_value_field": {"x": 5, "y": 8}, 
    },
    { 
        "id": 4, 
        "username": "gdefty6", 
        "gender": "Female", 
        "last_visited": "03/08/2019", 
        "object_value_field": {"x": 7, "y": 4}, 
    },
    { 
        "id": 5, 
        "username": "hbeyer9", 
        "gender": "Male", 
        "last_visited": "10/10/2016", 
        "object_value_field": {"x": 2, "y": 2}, 
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
            field: 'object_value_field', 
            label: 'Object Value',
            getValue: ({value, column}) => value.x * value.y,
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
- [Custom rendering props](#custom-rendering-props)
- [The `columns` prop](#columns)
- [The `checkbox` column](#checkbox-column)
- [The `rows` prop](#rows)
- [The `headerRenderer` prop](#headerRenderer)
- [The `footerRenderer` prop](#footerRenderer)
- [Row-Editing](#row-editing)
- [Styling](#styling)

## Main components
**HEADER (optional | customizable):** search & column visibility management. 

**TABLE-HEADER:** sort, resize & column reorder. 

**TABLE-BODY:** displaying data / loader / no-results, row editing & row selection. 

**FOOTER (optional | customizable):** items information & pagination. 


## props

| name | type | description | default value |
|---|---|---|---|
| columns* | array of objects | columns configuration (<u>[details](#columns)</u>) | [ ] |
| rows* | array of objects | rows data (<u>[details](#rows)</u>) | [ ] |
| rowIdField | string | the name of the field in the row's data that should be used as the row identifier - must be unique | 'id' |
| selectedRowsIds | array of ids | selected rows ids (<u>[details](#checkbox-column)</u>) | [ ] |
| searchText | string | text for search | "" |
| isRowSelectable | function | whether row selection for the current row is disabled or not | `row => true` |
| isRowEditable | function | whether row editing for the current row is disabled or not | `row => true` |
| editRowId | string, number, null | the id of the row to edit, (more <u>[details](#Row-Editing)</u> about row editing) | null |
| cellProps | object | global props for all data cells | { } |
| headerCellProps | object | global props for all header cells | { } |

### Table configuration props

| name | type | description | default value |
|---|---|---|---|
| isPaginated | boolean | determine whether the pagination controls sholuld be shown in the footer and if the rows data should be splitted into pages  | true |
| pageSizes | array of numbers | page size options | [20, 50, 100] |
| pageSize | number | the selected page size | 20 |
| sortBy | string, number, null | the id of the column that should be sorted | null |
| sortAscending | boolean | determine the sort direction | true |
| minColumnWidth | number | minimum width for all columns | 70 |
| highlightSearch | boolean | whether to highlight the search term | true |
| showSearch | boolean | whether to show the search in the header | true |
| searchMinChars | number | the minimum characters to apply search and highlighting | 2 |
| isLoading | boolean | whether to render a loader | false |
| isHeaderSticky | boolean | whether the table header will be stick to the top when scrolling or not | true |
| manageColumnVisibility | boolean | whether to display the columns visibility management button (located at the top right of the header) | true |
| icons | object with nodes | custom icons config (current supprt for sort icons only) | { sort: { ascending: &#9650;, descending: &#9660; } } |

### Event props

| name | type | description | usage |
|---|---|---|---|
| onColumnsChange | function | triggers when the `columns` has been changed  | `columns => { }` |
| onSelectedRowsChange | function | triggers when rows selection has been changed  | `selectedRowsIds => { }` |
| onSearchChange | function | used for updating the search text when controlled from outside of the component  | `searchText => { }` |
| onSortChange | function | used for updating the sortBy and its direction when controlled from outside of the component  | `(columnId, isAscending) => { }` |
| onRowClick | function | triggers when a row has been clicked | `({rowIndex, row, column, event}) => { }` |

### Custom rendering props
A set of functions that are used for rendering custom components.

| name | type | description | usage |
|---|---|---|---|
| headerRenderer | function | used for rendering a custom header ([details](#headerRenderer)) | `({searchText, setSearchText, setColumnVisibility, columns}) => ( children )` |
| footerRenderer | function | used for rendering a custom footer ([details](#footerRenderer)) | `({page, totalPages, handlePagination, pageSize, pageSizes, setPageSize, totalRows, selectedRowsLength,  numberOfRows }) => ( children )` |
| loaderRenderer | function | used for rendering a custom loader | `() => ( children )` |
| noResultsRenderer | function | used for rendering a custom component when there is no data to display | `() => ( children )` |
| searchRenderer | function | used for rendering a custom search component ([details](#headerRenderer)) | `({searchText, setSearchText}) => ( children )` |
| columnVisibilityRenderer | function | used for rendering a custom columns visibility management component ([details](#headerRenderer)) | `({columns, setColumnVisibility}) => ( children )` |
| dragHandleRenderer | function | used for rendering a drag handle for the column reorder | `() => ( children )` |

## props - detailed

### columns
**Type:** array of objects.

This prop defines the columns configuration.

Each column supports the following properties:

| name | type | description | default value  |
|---|---|---|---|
| id* | string, number | a unique identifier for the column, can be changed using the `rowIdField` prop | --- |
| field* | string | the name of the field as in the row data / 'checkbox' (more [details](#checkbox-column) about checkbox column) | --- |
| label | string | the label to display in the header cell | the `field` property |
| pinned | boolean | whether the column will be pinned to the side, supported only in the first and last columns| false |
| visible | boolean | whether to show the column (pinned columns are always visible) | true |
| className | string | a custom class selector for all column cells | "" |
| width | string | the initial width of the column in grid values (full list of [values](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns)) | "max-content" |
| minWidth | number, null | the minimum width of the column when resizing | null |
| maxWidth | number, null | the maximum width of the column when resizing | null |
| getValue | function | used for getting the cell value (usefull when the cell value is not a string - [details](#rows)) | `({value, column}) => value` |
| setValue | function | used for updating the cell value (usefull when the cell value is not a string) - [details](#Row-Editing) | `({value, row, setRow, column}) => setRow({...row, [column.field]: value})` |
| searchable | boolean | whether to apply search filtering on the column | true |
| editable | boolean | whether to allow editing for the column | true |
| sortable | boolean | whether to allow sort for the column | true |
| resizable | boolean | whether to allow resizing for the column | true |
| sortableColumn | boolean | whether to allow column reorder (disabled for pinned columns) | true |
| search | function | the search function for this column | `({value, searchText}) => value.toLowerCase().includes(searchText.toLowerCase())` |
| sort | function | the sort function for this column | `({a, b, isAscending}) => { if(a.toLowerCase() > b.toLowerCase()) return isAscending ? 1 : -1; else if(a.toLowerCase() < b.toLowerCase()) return isAscending ? -1 : 1; return 0; }` |
| cellRenderer | function | used for custom rendering the cell `({value, row, column, rowIndex, searchText}) => ( children )` | --- |
| headerCellRenderer | function | used for custom rendering the header cell `({label, column}) => ( children ) ` | --- |
| editorCellRenderer | function | used for custom rendering the cell in edit mode `({value, field, onChange, row, rows, column, rowIndex}) => ( children ) ` | --- |

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
  setValue: ({value, row, setRow, column}) => { setRow({...row, [column.field]: value}) },
  minWidth: null,
  maxWidth: null,
  sortable: true,
  editable: true,
  searchable: true,
  visible: true,
  resizable: true,
  sortableColumn: true,
  // search: ({value, searchText}) => { },
  // sort: ({a, b, isAscending}) => { },
  // cellRenderer: ({value, row, column, rowIndex, searchText}) => { },
  // headerCellRenderer: ({label, column}) => ( ),
  // editorCellRenderer: ({value, field, onChange, row, rows, column, rowIndex}) => { }
}
```

#### checkbox-column
Rows selection is done by a predefined column, simply add a column with a field name of 'checkbox'.

Checkbox column has supports the following properties:

| name | type | description | default value  |
|---|---|---|---|
| id* | string, number | a unique identifier for the column, can be changed using the `rowIdField` prop | --- |
| field* | string | defines the column as a 'checkbox' column | 'checkbox' |
| pinned | boolean | whether the column will be pinned to the side, supported only in the first and last columns | false |
| visible | boolean | whether to show the column (pinned columns are always visible) | true |
| className | string | a custom class for all column cells | "" |
| width | string | the initial width of the column in grid values (full list of [values](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns)) | "max-content" |
| minWidth | number, null | the minimum width of the column when resizing | null |
| maxWidth | number, null | the maximum width of the column when resizing | null |
| resizable | boolean | whether to allow resizing for the column | false |
| sortableColumn | boolean | whether to allow column reorder (disabled for pinned columns) | true |
| cellRenderer | function | used for custom rendering the checkbox cell `({isChecked, callback, disabled, rowIndex}) => ( <input type="checkbox" onChange={ callback } checked={ isChecked } disabled={ disabled } /> )` | --- |
| headerCellRenderer | function | used for custom rendering the checkbox header cell `({isChecked, callback, disabled}) => ( <input type="checkbox" onChange={ callback } checked={ isChecked } disabled={ disabled } /> )` | --- |

**Example:**
```javascript
// checkbox column config

{
  id: 'some-unique-id',
  field: 'checkbox',
  pinned: true,
  className: '',
  width: '54px',
  minWidth: null,
  maxWidth: null,
  resizable: false,
  sortableColumn: false,
  visible: true,
  // cellRenderer: ({isChecked, callback, disabled, rowIndex}) => ( children )
  // headerCellRenderer: ({isChecked, callback, disabled}) => ( children )
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

The value that returns from the `getValue` function will be used for searching, sorting etc...

### headerRenderer
**Type:** function

This function is used for rendering a custom header.

By default the header renders a search and column visibility manager components, but you can render your own custom components.

If you just want to replace the search or the column visibility management components, you can use the `searchRenderer` or the `columnVisibilityRenderer` props.

**Arguments:** 
| name | type | description | default value |
|---|---|---|---|
| searchText | string | text for search | "" | 
| setSearchText | function | a callback function to update search text | `setSearchText(searchText)` | 
| setColumnVisibility | function | a callback function to update columns visibility that accepts the id of the column that should be toggled | `setColumnVisibility(columnId)` | 
| columns | function | the `columns` configuration | [ ] | 

**Example:**

```JSX
headerRenderer={({searchText, setSearchText, setColumnVisibility, columns}) => (
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
                columns.map((cd, idx) => (
                    <div key={idx} style={{flex: 1}}>
                        <input 
                            id={`checkbox-${idx}`}
                            type="checkbox" 
                            onChange={ e => setColumnVisibility(cd.id) } 
                            checked={ cd.visible !== false } 
                        />
                        <label htmlFor={`checkbox-${idx}`} style={{flex: 1, cursor: 'pointer'}}>
                          {cd.label || cd.field}
                        </label>
                    </div>
                ))
            }
        </div>
    </div>
)}
```

### footerRenderer
**Type:** function

This function is used for rendering a custom footer.

By default the footer renders items information and pagination controls, but you can render your own custom components.

**Arguments:** 
| name | type | description | default value |
|---|---|---|---|
| page | number | the current page | 1 |
| totalPages | number | the total number of pages | 0 | 
| handlePagination | function | sets the page to display | `handlePagination(pageNumber)` | 
| pageSizes | array of numbers | page size options | [20, 50, 100] |
| pageSize | number | the selected page size | 20 |
| setPageSize | function | updates the page size | `setPageSize(pageSizeOption)` | 
| totalRows | number | total number of rows in the table | 0 | 
| selectedRowsLength | number | total number of selected rows | 0 | 
| numberOfRows | number | total number of rows in the page | 0 | 

**Example:**

```JSX
footerRenderer={({
    page, 
    totalPages, 
    handlePagination, 
    pageSize, 
    pageSizes, 
    setPageSize, 
    totalRows,
    selectedRowsLength,
    numberOfRows
}) => (
    <div style={{display: 'flex', justifyContent: 'space-between', flex: 1, padding: '12px 20px'}}>
        <div style={{display: 'flex'}}>
          {`Total Rows: ${totalRows} 
          | Rows: ${numberOfRows * page - numberOfRows} - ${numberOfRows * page} 
          | ${selectedRowsLength} Selected`}
        </div>
        <div style={{display: 'flex'}}>
            <div style={{width: 200, marginRight: 50}}>
                <span>Items per page: </span>
                <select 
                    value={pageSize} 
                    onChange={e => {setPageSize(e.target.value); handlePagination(1)}}
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
)}
```

# How to...

### Row-Editing
Row editing can be done by rendering your row edit button using the `cellRenderer` property in the column configuration, then when clicked, it will set a state proprty with the clicked row id, and that row id would be used in the `editRowId` prop, then the table will render the editing components for columns that are defined as `editable` (true by default), and as was defined in the `editorCellRenderer` which by default will render a text input.

```JSX
// state
const [rowsData, setRows] = useState(MOCK_DATA);
const [editRowId, setEditRowId] = useState(null)

// columns
let columns = [
  ...,
  {
    id: 'my-buttons-column',
    field: 'buttons', 
    label: '',
    pinned: true,
    sortable: false,
    resizable: false,
    cellRenderer: ({value, row, column, rowIndex, searchText}) => (
      <button onClick={e => setEditRowId(row.id)}>Edit</button>
    ),
    editorCellRenderer: ({value, field, onChange, row, rows, column, rowIndex}) => (
      <div style={{display: 'inline-flex'}}>
        <button onClick={e => setEditRowId(null)}>Cancel</button>
        <button onClick={e => {
          let rowsClone = [...rows];
          let updatedRowIndex = rowsClone.findIndex(r => r.id === row.id);
          rowsClone[updatedRowIndex] = row;

          setRows(rowsClone);
          setEditRowId(null);
        }}>Save</button>
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

For columns which holds values other than string, you'll have to also define the `setValue` function on the column so the updated value won't override the original value.

**Example:**
```JSX
  setValue: ({value, row, setRow, column}) => {
    // value: '35', 
    // row: { ..., { fieldToUpdate: '27' }} 
    let rowClone = { ...row };
    rowClone[column.field].fieldToUpdate = value;
    setRow(rowClone);
  }
```

### Styling

Styling is done by css class selectors. the table's components are mapped with pre-defined classes, and you can add your own custom class per column in the `columns` configuration.

| Component | All available class selectors |
|---|---|
| Wrapper | `rgt-wrapper` |
| Header | `rgt-header-container` |
| Search | `rgt-search-container` `rgt-search-label` `rgt-search-icon` `rgt-search-input` `rgt-search-highlight` |
| Columns Visibility Manager | `rgt-columns-manager-wrapper` `rgt-columns-manager-button` `rgt-columns-manager-popover` `rgt-columns-manager-popover-open` `rgt-columns-manager-popover-row` |
| Table | `rgt-container` |
| Header Cell | `rgt-cell-header` `rgt-cell-header-checkbox` `rgt-cell-header-[column.field]` `rgt-cell-header-sortable / rgt-cell-header-not-sortable` `rgt-cell-header-sticky` `rgt-cell-header-resizable / rgt-cell-header-not-resizable` `rgt-cell-header-searchable / rgt-cell-header-not-searchable` `rgt-cell-header-sortable-column / rgt-cell-header-not-sortable-column` `rgt-cell-header-pinned` `rgt-cell-header-pinned-left / rgt-cell-header-pinned-right` `[column.className]` `rgt-cell-header-inner` `rgt-cell-header-inner-checkbox-column` `rgt-header-checkbox-cell` `rgt-resize-handle` `rgt-sort-icon` `rgt-sort-icon-ascending / rgt-sort-icon-descending` `rgt-column-sort-ghost` |
| Cell | `rgt-cell` `rgt-cell-[column.field]` `rgt-row-[rowNumber]` `rgt-row-odd / rgt-row-even` `rgt-row-hover` `rgt-row-selectable / rgt-row-not-selectable` `rgt-cell-inner` `rgt-cell-checkbox` `rgt-cell-pinned` `rgt-cell-pinned-left / rgt-cell-pinned-right` `rgt-cell-editor` `rgt-cell-editor-inner` `rgt-cell-editor-input` |
| Pagination | `rgt-footer-items-per-page` `rgt-footer-pagination-button` `rgt-footer-pagination-container` `rgt-footer-page-input` |
| Footer | `rgt-footer` `rgt-footer-items-information` `rgt-footer-right-container` |
| Utils | `rgt-text-truncate` `rgt-clickable` `rgt-disabled` `rgt-disabled-button` `rgt-flex-child` |

## License

 © [MIT](https://github.com/NadavShaar/react-grid-table/blob/main/LICENSE) 

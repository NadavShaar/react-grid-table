import React, { useState, useEffect, useRef } from "react";
import { withKnobs, boolean, number, array } from '@storybook/addon-knobs';
import AbortController from "abort-controller"
import GridTable from '../dist';
import Fetch from 'fetch-simulator';
import MOCK_DATA from "./MOCK_DATA.json";
import Username from "./components/Username";
import './gridTableStory.css';

try {
    Fetch.addRoute('https://react-grid-table/api/users', {
        get: {
            response: MOCK_DATA,
            wait: 500
        }
    });
} catch (error) {
    
}
Fetch.use();

const controller = new AbortController();

const EDIT_SVG = <svg height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg"><g fill="#fff" stroke="#1856bf" transform="translate(2 2)"><path d="m8.24920737-.79402796c1.17157287 0 2.12132033.94974747 2.12132033 2.12132034v13.43502882l-2.12132033 3.5355339-2.08147546-3.495689-.03442539-13.47488064c-.00298547-1.16857977.94191541-2.11832105 2.11049518-2.12130651.00180188-.00000461.00360378-.00000691.00540567-.00000691z" transform="matrix(.70710678 .70710678 -.70710678 .70710678 8.605553 -3.271644)"/><path d="m13.5 4.5 1 1"/></g></svg>;
const CANCEL_SVG = <svg height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#dc1e1e" transform="translate(5 5)"><path d="m.5 10.5 10-10"/><path d="m10.5 10.5-10-10z"/></g></svg>;
const SAVE_SVG = <svg height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m.5 5.5 3 3 8.028-8" fill="none" stroke="#4caf50" transform="translate(5 6)"/></svg>;

const styles = {
	select: {margin: '0 20px'},
	buttonsCellContainer: {padding: '0 20px', width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center'},
	editButton: {background: '#f3f3f3', outline: 'none', cursor: 'pointer', padding: 4, display: 'inline-flex', border: 'none', borderRadius: '50%', boxShadow: '1px 1px 2px 0px rgb(0 0 0 / .3)'},
	buttonsCellEditorContainer: {height: '100%', width: '100%', display: 'inline-flex', padding: '0 20px', justifyContent: 'flex-end', alignItems: 'center'},
	cancelButton: {background: '#f3f3f3', outline: 'none', cursor: 'pointer', marginRight: 10, padding: 2, display: 'inline-flex', border: 'none', borderRadius: '50%', boxShadow: '1px 1px 2px 0px rgb(0 0 0 / .3)'},
	saveButton: {background: '#f3f3f3', outline: 'none', cursor: 'pointer', padding: 2, display: 'inline-flex', border: 'none', borderRadius: '50%', boxShadow: '1px 1px 2px 0px rgb(0 0 0 / .3)'}
}

const baseColumns = [
    {
        id: 'checkbox',
        pinned: true,
        width: '54px',
        label: 'Select'
    },
    {
        id: 'id',
        field: 'id',
        label: 'id',
    },
    {
        id: 2,
        field: 'username',
        label: 'Username',
        cellRenderer: Username,
        editorCellRenderer: props => <Username {...props} isEdit />
    },
    {
        id: 3,
        field: 'first_name',
        label: 'First Name'
    },
    {
        id: 4,
        field: 'last_name',
        label: 'Last Name'
    },
    {
        id: 5,
        field: 'email',
        label: 'Email'
    },
    {
        id: 6,
        field: 'gender',
        label: 'Gender',
        editorCellRenderer: ({ tableManager, value, field, onChange, data, column, rowIndex }) => (
            <select
                style={styles.select}
                value={value}
                onChange={e => onChange({ ...data, [field]: e.target.value })}
            >
                <option>Male</option>
                <option>Female</option>
            </select>
        )
    },
    {
        id: 7,
        field: 'ip_address',
        label: 'IP Address'
    },
    {
        id: 8,
        field: 'last_visited',
        label: 'Last Visited',
        sort: ({ a, b, isAscending }) => {
            let aa = a.split('/').reverse().join(),
                bb = b.split('/').reverse().join();
            return aa < bb ? isAscending ? -1 : 1 : (aa > bb ? isAscending ? 1 : -1 : 0);
        }
    },
    {
        id: 9,
        width: 'max-content',
        pinned: true,
        sortable: false,
        resizable: true,
        cellRenderer: ({ tableManager, value, data, column, rowIndex, searchText }) => (
            <div style={styles.buttonsCellContainer}>
                <button
                    title="Edit"
                    style={styles.editButton}
                    onClick={e => tableManager.rowEditApi.setEditRowId(data.id)}
                >
                    {EDIT_SVG}
                </button>
            </div>
        ),
        editorCellRenderer: ({ onRowEditSave, tableManager, value, field, onChange, data, column, rowIndex }) => (
            <div style={styles.buttonsCellEditorContainer}>
                <button
                    title="Cancel"
                    style={styles.cancelButton}
                    onClick={e => tableManager.rowEditApi.setEditRowId(null)}
                >
                    {CANCEL_SVG}
                </button>
                <button
                    title="Save"
                    style={styles.saveButton}
                    onClick={e => {
                        onRowEditSave(data);
                        tableManager.rowEditApi.setEditRowId(null);
                    }}
                >
                    {SAVE_SVG}
                </button>
            </div>
        )
    }
]

export default {
    title: 'Grid Table',
    component: GridTable,
    decorators: [withKnobs]
};
export const Synced = () => {
    
    const [rowsData, setRowsData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    let [columns, setColumns] = useState(baseColumns.map(c => c.id === 9 ? {
        ...c, editorCellRenderer: props => c.editorCellRenderer({
            ...props, onRowEditSave: editedRow => {
                let rowsClone = [...rowsData];
                let updatedRowIndex = rowsClone.findIndex(r => r.id === editedRow.id);
                rowsClone[updatedRowIndex] = editedRow;
                setRowsData(rowsClone);
            }
        })
    } : c));

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setRowsData(MOCK_DATA)
            setLoading(false);
        }, 1500);
    }, [])

    return (
        <GridTable
            columns={columns}
            rows={rowsData}
            isLoading={isLoading}
            style={{ boxShadow: 'rgb(0 0 0 / 30%) 0px 40px 40px -20px' }}
            showRowsInformation={boolean('Show Rows Information', true)}
            isVirtualScroll={boolean(' Use Virtual Scrolling', true)}
            isPaginated={boolean('Use Pagination', true)}
        />
    )
}

export const Asynced = () => {

    let [columns, setColumns] = useState(baseColumns.map(c => c.id === 9 ? {
        ...c, editorCellRenderer: props => c.editorCellRenderer({
            ...props, onRowEditSave: editedRow => {
                console.log('Saved Successfuly?');
            }
        })
    } : c));

    const onRowsRequest = (requestData, tableManager) => {
        return fetch('https://react-grid-table/api/users', {
            method: 'get',
            signal: controller.signal,
        })
            .then(response => response.json())
            .then(allRows => {
                let {
                    sortApi: {
                        sortRows
                    },
                    searchApi: {
                        searchRows
                    },
                } = tableManager;

                allRows = searchRows(allRows);
                allRows = sortRows(allRows);

                return {
                    rows: allRows.slice(requestData.from, requestData.to),
                    totalRows: allRows.length
                };
            })
            .catch(console.warn);
    }

    return (
        <GridTable
            columns={columns}
            style={{ boxShadow: 'rgb(0 0 0 / 30%) 0px 40px 40px -20px' }}
            showRowsInformation={boolean('Show Rows Information', true)}
            isVirtualScroll={boolean(' Use Virtual Scrolling', false)}
            isPaginated={boolean('Use Pagination', false)}
            onRowsRequest={onRowsRequest}
            requestDebounceTimeout={number('Request Timeout', 300)}
        />
    )
}

export const AsyncedControlled = () => {

    let [rows, setRows] = useState();
    let [totalRows, setTotalRows] = useState();
    let [columns, setColumns] = useState(baseColumns.map(c => c.id === 9 ? {
        ...c, editorCellRenderer: props => c.editorCellRenderer({
            ...props, onRowEditSave: editedRow => {
                console.log('Saved Successfuly?');
            }
        })
    } : c));

    const onRowsRequest = (requestData, tableManager) => {
        return fetch('https://react-grid-table/api/users', {
            method: 'get',
            signal: controller.signal,
        })
            .then(response => response.json())
            .then(allRows => {
                let {
                    sortApi: {
                        sortRows
                    },
                    searchApi: {
                        searchRows
                    },
                } = tableManager;

                allRows = searchRows(allRows);
                allRows = sortRows(allRows);

                return {
                    rows: allRows.slice(requestData.from, requestData.to),
                    totalRows: allRows.length
                };
            })
            .catch(console.warn);
    }

    return (
        <GridTable
            columns={columns}
            rows={rows}
            onRowsChange={setRows}
            totalRows={totalRows}
            onTotalRowsChange={setTotalRows}
            style={{ boxShadow: 'rgb(0 0 0 / 30%) 0px 40px 40px -20px' }}
            showRowsInformation={boolean('Show Rows Information', true)}
            isVirtualScroll={boolean(' Use Virtual Scrolling', false)}
            isPaginated={boolean('Use Pagination', false)}
            onRowsRequest={onRowsRequest}
            requestDebounceTimeout={number('Request Timeout', 300)}
        />
    )
}

export const AsyncedManaged = () => {

    const [rowsData, setRowsData] = useState([]);
    let [totalRows, setTotalRows] = useState();
    let [columns, setColumns] = useState(baseColumns.map(c => c.id === 9 ? {
        ...c, editorCellRenderer: props => c.editorCellRenderer({
            ...props, onRowEditSave: editedRow => {
                let rowsClone = [...rowsData];
                let updatedRowIndex = rowsClone.findIndex(r => r.id === editedRow.id);
                rowsClone[updatedRowIndex] = editedRow;
                setRowsData(rowsClone);
            }
        })
    } : c));
    let [sort, setSort] = useState({});
    let rowsRef = useRef(rowsData);

    const onRowsRequest = async (requestData, tableManager) => {
        let response = await fetch('https://react-grid-table/api/users', {
            method: 'get',
            signal: controller.signal,
        })
            .then(response => response.json())
            .then(allRows => {
                let {
                    sortApi: {
                        sortRows
                    },
                    searchApi: {
                        searchRows
                    },
                } = tableManager;

                allRows = searchRows(allRows);
                allRows = sortRows(allRows);

                return {
                    rows: allRows.slice(requestData.from, requestData.to),
                    totalRows: allRows.length
                };
            })
            .catch(console.warn);
        
        let {
            asyncApi: {
                mergeRowsAt
            },
        } = tableManager;

        rowsRef.current = mergeRowsAt(rowsRef.current, response.rows, requestData.from);

        setRowsData(rowsRef.current);
        setTotalRows(response.totalRows);
    }
    const onRowsReset = () => {
        rowsRef.current = [];
        setRowsData(rowsRef.current);
        setTotalRows();
        controller.abort();
    }

    return (
        <GridTable
            columns={columns}
            rows={rowsData}
            // isLoading={isLoading}
            // editRowId={editRowId}
            // onEditRowIdChange={setEditRowId}
            // selectedRowsIds={boolean('Controlled Selection', false) ? selectedRowsIds : undefined}
            // onSelectedRowsChange={setSelectedRowsIds}
            style={{ boxShadow: 'rgb(0 0 0 / 30%) 0px 40px 40px -20px' }}
            // onLoad={setTableManager}
            // searchText={boolean('Controlled Search', false) ? searchText : undefined}
            // onSearchTextChange={setSearchText}
            showRowsInformation={boolean('Show Rows Information', true)}
            sort={sort}
            onSortChange={setSort}
            isVirtualScroll={boolean(' Use Virtual Scrolling', false)}
            isPaginated={boolean('Use Pagination', false)}
            onRowsRequest={onRowsRequest}
            onRowsReset={onRowsReset}
            totalRows={totalRows}
            requestDebounceTimeout={number('Request Timeout', 300)}
        />
    )
}

export const ControlledProps = () => {


    const [editRowId, setEditRowId] = useState(null);
    const [rowsData, setRowsData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [tableManager, setTableManager] = useState(null);
    let [searchText, setSearchText] = useState('');
    let [selectedRowsIds, setSelectedRowsIds] = useState([]);
    let [sort, setSort] = useState({ colId: 4, isAsc: true });
    let [columns, setColumns] = useState(baseColumns.map(c => c.id === 9 ? {
        ...c, editorCellRenderer: props => c.editorCellRenderer({
            ...props, onRowEditSave: editedRow => {
                let rowsClone = [...rowsData];
                let updatedRowIndex = rowsClone.findIndex(r => r.id === editedRow.id);
                rowsClone[updatedRowIndex] = editedRow;
                setRowsData(rowsClone);
            }
        })
    } : c));

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setRowsData(MOCK_DATA)
            setLoading(false);
        }, 1500);
    }, [])

    return (
        <GridTable
            columns={columns}
            rows={rowsData}
            isLoading={isLoading}
            editRowId={editRowId}
            onEditRowIdChange={setEditRowId}
            selectedRowsIds={boolean('Controlled Selection', false) ? selectedRowsIds : undefined}
            onSelectedRowsChange={setSelectedRowsIds}
            style={{ boxShadow: 'rgb(0 0 0 / 30%) 0px 40px 40px -20px' }}
            onLoad={setTableManager}
            searchText={boolean('Controlled Search', false) ? searchText : undefined}
            onSearchTextChange={setSearchText}
            showRowsInformation={boolean('Show Rows Information', true)}
            sort={sort}
            onSortChange={setSort}
            isVirtualScroll={boolean(' Use Virtual Scrolling', false)}
            isPaginated={boolean('Use Pagination', false)}
        />
    )
}
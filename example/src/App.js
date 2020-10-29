import React, { useState, useEffect } from "react";

import GridTable from '@nadavshaar/react-grid-table';
import '@nadavshaar/react-grid-table/dist/index.css';

import Username from "./components/Username";
import * as MOCK_DATA from "./MOCK_DATA.json";
import './index.css';

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

const Search = props => {
    return (
        <input value={props.value} onChange={e => props.onChange(e.target.value)}/>
    )
}

const App = () => {
    
	const [editRowId, setEditRowId] = useState(null);
	const [rowsData, setRowsData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [tableManager, setTableManager] = useState(null);
    let [searchText, setSearchText] = useState();
    let [selectedRows, setSelectedRows] = useState([]);
    let [sort, setSort] = useState({sortBy: 4, sortAsc: true});
    let [columns, setColumns] = useState([
        {
            id: 'checkbox',
            pinned: true,
            width: '54px'
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
            editorCellRenderer: ({ value, field, onChange, data, column, rowIndex }) => (
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
            field: 'buttons',
            label: '',
            pinned: true,
            sortable: false,
            resizable: true,
            cellRenderer: ({ tableManager, value, data, column, rowIndex, searchText }) => (
                <div style={styles.buttonsCellContainer}>
                    <button
                        title="Edit"
                        style={styles.editButton}
                        onClick={e => tableManager.handlers.handleRowEditIdChange(data.id)}
                    >
                        {EDIT_SVG}
                    </button>
                </div>
            ),
            editorCellRenderer: ({ tableManager, value, field, onChange, data, column, rowIndex }) => (
                <div style={styles.buttonsCellEditorContainer}>
                    <button
                        title="Cancel"
                        style={styles.cancelButton}
                        onClick={e => tableManager.handlers.handleRowEditIdChange(null)}
                    >
                        {CANCEL_SVG}
                    </button>
                    <button
                        title="Save"
                        style={styles.saveButton}
                        onClick={e => {
                            let rowsClone = [...tableManager.rowsData.items];
                            let updatedRowIndex = rowsClone.findIndex(r => r.id === data.id);
                            rowsClone[updatedRowIndex] = data;

                            setRowsData(rowsClone);
                            tableManager.handlers.handleRowEditIdChange(null);
                        }}
                    >
                        {SAVE_SVG}
                    </button>
                </div>
            )
        }
    ]);
	
    useEffect(() => {
		setLoading(true);
		setTimeout(() => {
			setRowsData(MOCK_DATA.default)
			setLoading(false);
		}, 1500);
	}, [])

    return (
        <GridTable
            columns={columns}
            rows={rowsData}
            isLoading={isLoading}
            editRowId={editRowId}
            onRowEditIdChange={setEditRowId}
            selectedRows={selectedRows}
            onSelectedRowsChange={setSelectedRows}
            style={{ boxShadow: 'rgb(0 0 0 / 30%) 0px 40px 40px -20px' }}
            onLoad={setTableManager}
            searchText={searchText}
            onSearchChange={setSearchText}
            sortBy={sort.sortBy}
            sortAscending={sort.sortAsc}
            onSortChange={(sortBy, sortAsc) => setSort({ sortBy, sortAsc })}
            // searchComponent={Search}
        />
    )
};

export default App;

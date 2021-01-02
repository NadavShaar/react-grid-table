import React from "react";
import ControllerWrappper from './ControllerWrappper';

const styles = {
    column: {
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 5,
        borderBottom: '1px solid #eee'
    },
    label: {
        fontWeight: 'bold',
        padding: '10px 0',
        color: '#125082',
        fontSize: 16
    }
}

const ColumnsControllers = ({ controllers }) => {
    let columns = [ ...controllers.columns[0] ];
    const setColumns = controllers.columns[1];

    const setLabel = (column, newLabel) => {
        column.label = newLabel;
        setColumns(columns);
    }

    const setVisible = (column) => {
        column.visible = !column.visible;
        setColumns(columns);
    }

    const setPinned = (column) => {
        column.pinned = !column.pinned;
        setColumns(columns);
    }

    const setSearchable = (column) => {
        column.searchable = !column.searchable;
        setColumns(columns);
    }

    const setSortable = (column) => {
        column.sortable = !column.sortable;
        setColumns(columns);
    }

    const setEditable = (column) => {
        column.editable = !column.editable;
        setColumns(columns);
    }

    const setResizable = (column) => {
        column.resizable = !column.resizable;
        setColumns(columns);
    }

    return (
        <React.Fragment>
            {
                columns.map((column, idx) => (
                        <div key={column.id} style={styles.colmn}>
                            <span style={styles.label}>{column.label || column.id}</span>
                            {
                                (column.id !== 'checkbox' && column.id !== 'buttons') ?
                                    <ControllerWrappper label='Label'>
                                        <input type='text' value={column.label} onChange={e => setLabel(column, e.target.value)} />
                                    </ControllerWrappper>
                                    : 
                                    null
                            }
                            <ControllerWrappper label='Visible'>
                                <input type='checkbox' checked={column.visible} onChange={e => setVisible(column)} />
                            </ControllerWrappper>
                            {
                                (idx === 0 || idx === columns.length-1) ?
                                    <ControllerWrappper label='Pinned'>
                                        <input type='checkbox' checked={column.pinned} onChange={e => setPinned(column)} />
                                    </ControllerWrappper>
                                    : 
                                    null
                            }
                            {
                                (column.id !== 'checkbox' && column.id !== 'buttons') ?
                                    <ControllerWrappper label='Searchable'>
                                        <input type='checkbox' checked={column.searchable} onChange={e => setSearchable(column)} />
                                    </ControllerWrappper>
                                    :
                                    null
                            }
                            {
                                (column.id !== 'checkbox' && column.id !== 'buttons') ?
                                    <ControllerWrappper label='Sortable'>
                                        <input type='checkbox' checked={column.sortable} onChange={e => setSortable(column)} />
                                    </ControllerWrappper>
                                    :
                                    null
                            }
                            {
                                (column.id !== 'checkbox' && column.id !== 'buttons') ?
                                    <ControllerWrappper label='Editable'>
                                        <input type='checkbox' checked={column.editable} onChange={e => setEditable(column)} />
                                    </ControllerWrappper>
                                    :
                                    null
                            }
                            <ControllerWrappper label='Resizable'>
                                <input type='checkbox' checked={column.resizable} onChange={e => setResizable(column)} />
                            </ControllerWrappper>
                        </div>
                    )
                )
            }
        </React.Fragment>
    )
}

export default ColumnsControllers;
import React from "react";
import ControllerWrappper from './ControllerWrappper';

const ColumnsControllers = ({ controllers }) => {
    let columns = [ ...controllers.columns[0] ];
    const setColumns = controllers.columns[1];
    console.log(columns)

    const setLabel = (column, newLabel) => {
        column.label = newLabel;
        setColumns(columns);
    }

    const setPinned = (column) => {
        column.pinned = !column.pinned;
        setColumns(columns);
    }

    return (
        <React.Fragment>
            {
                columns.map((column, idx) => (
                        <div key={column.id} style={{display: 'flex', flexDirection: 'column', padding: '5px 0', borderBottom: '1px solid #eee'}}>
                            <span style={{fontWeight: 'bold', textDecoration: 'underline'}}>{column.label || column.id}</span>
                            {
                                (column.id !== 'checkbox' && column.id !== 'buttons') ?
                                    <ControllerWrappper label='Label'>
                                        <input value={column.label} onChange={e => setLabel(column, e.target.value)} />
                                    </ControllerWrappper>
                                    : 
                                    null
                            }
                            {
                                (idx === 0 || idx === columns.length-1) ?
                                    <ControllerWrappper label='Pinned'>
                                        <input type='checkbox' checked={column.pinned} onChange={e => setPinned(column)} />
                                    </ControllerWrappper>
                                    : 
                                    null
                            }

                        </div>
                    )
                )
            }
        </React.Fragment>
    )
}

export default ColumnsControllers;
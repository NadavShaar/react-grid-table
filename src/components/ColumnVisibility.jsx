import React from 'react';
import { PopoverButton } from './';

const ColumnVisibility = props => {

    let {
        columns,
        onChange,
        tableManager,
    } = props;

    let {
        params: {
            textConfig
        },
        icons: {
            columnVisibility: columnVisibilityIcon
        },
    } = tableManager;

    
    return (
        <PopoverButton
            title={textConfig.columnVisibility}
            buttonChildren={columnVisibilityIcon}
            popoverChildren={
                columns.map((cd, idx) => {
                    if (cd.pinned && idx === 0 || cd.pinned && idx === columns.length - 1) return null;

                    let label = cd.label || cd.field || cd.id;

                    return (
                        <div key={idx} className='rgt-clickable rgt-columns-manager-popover-row'>
                            <label htmlFor={`checkbox-${idx}`} title={label} onClick={e => onChange(cd.id)} className='rgt-clickable rgt-flex-child rgt-text-truncate'>{label}</label>
                            <input
                                id={`checkbox-${idx}`}
                                className='rgt-clickable'
                                type="checkbox"
                                onChange={e => { }}
                                checked={cd.visible !== false}
                            />
                        </div>
                    )
                })
            }
        />
    )
}

export default ColumnVisibility;
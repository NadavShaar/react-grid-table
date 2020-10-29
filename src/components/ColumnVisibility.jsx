import React from 'react';
import PopoverButton from './PopoverButton';

const ColumnVisibility = props => {

    let {
        columns,
        onChange,
        tableManager,
    } = props;

    let {
        icons: {
            columnVisibility: columnVisibilityIcon
        },
    } = tableManager;

    return (
        <PopoverButton
            buttonChildren={columnVisibilityIcon}
            popoverChildren={
                columns.map((cd, idx) => {
                    if (cd.pinned && idx === 0 || cd.pinned && idx === columns.length - 1) return null;
                    return (
                        <div key={idx} className='rgt-clickable rgt-columns-manager-popover-row' onClick={e => onChange(cd.id)} >
                            <label htmlFor={`checkbox-${idx}`} onClick={e => onChange(cd.id)} className='rgt-clickable rgt-flex-child rgt-text-truncate'>{cd.label || cd.field || cd.id}</label>
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
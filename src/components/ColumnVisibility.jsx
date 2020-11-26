import React from 'react';
import { PopoverButton } from './';

export default props => {

    let {
        columns,
        onChange,
        tableManager,
    } = props;

    let {
        config: {
            texts: {
                columnVisibility: columnVisibilityText
            },
            icons: {
                columnVisibility: columnVisibilityIcon
            },
        }
    } = tableManager;

    
    return (
        <PopoverButton
            title={columnVisibilityText}
            buttonChildren={columnVisibilityIcon}
            popoverChildren={
                columns.filter(col => !col.pinned).map((cd, idx) => {
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
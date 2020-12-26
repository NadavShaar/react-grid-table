import React from 'react';

const HeaderSelectionCell = ({ columns, tableManager }) => {
    const {
        config: { additionalProps: { headerSelectionCell: additionalProps = {} } },
        rowSelectionApi: { selectAll: selectionProps },
    } = tableManager;

    let classNames = selectionProps.disabled ? 'rgt-disabled' : 'rgt-clickable' + ' ' + (additionalProps.className || '').trim();

    return (
        <input
            {...additionalProps}
            className={classNames.trim()}
            type="checkbox"
            ref={selectionProps.ref}
            onChange={selectionProps.onChange}
            checked={selectionProps.checked}
            disabled={selectionProps.disabled}
        />
    )
};

export default HeaderSelectionCell;
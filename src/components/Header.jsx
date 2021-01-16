import React from 'react';

const Header = ({ tableManager }) => {
    const { 
        config: {
            showColumnVisibilityManager,
            components: { ColumnVisibility, Search },
            additionalProps: { header: additionalProps = {} },
            showSearch,
        }
    } = tableManager;

    const classNames = ('rgt-header-container ' + (additionalProps.className || '')).trim();

    return (
        <div {...additionalProps} className={classNames}>
            {
                showSearch !== false ?
                    <Search tableManager={tableManager}/>
                    :
                    <span></span>
            }
            {
                showColumnVisibilityManager !== false ?
                    <ColumnVisibility tableManager={tableManager}/>
                    :
                    <span></span>
            }
        </div>
    )
};

export default Header;
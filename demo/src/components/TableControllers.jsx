import React from "react";
import ControllerWrappper from './ControllerWrappper';

const TableControllers = ({ controllers }) => {
    return (
        <React.Fragment>
            <ControllerWrappper label='Page'>
                <input type='number' value={controllers.page[0]} min='1' onChange={e => controllers.page[1](~~e.target.value)} />
            </ControllerWrappper>
            <ControllerWrappper label='Page Size'>
                <input type='number' value={controllers.pageSize[0]} min='1' onChange={e => controllers.pageSize[1](~~e.target.value)} />
            </ControllerWrappper>
            <ControllerWrappper label='Search Text'>
                <input type='text' value={controllers.searchText[0]} onChange={e => controllers.searchText[1](e.target.value)} />
            </ControllerWrappper>
            <ControllerWrappper label='Sort By'>
                <select value={controllers.sort[0].colId || 'null'} onChange={e => controllers.sort[1]({ ...controllers.sort[0], colId: e.target.value === 'null' ? null : e.target.value, isAsc: e.target.value })}>
                    <option value={'null'}>None</option>
                    {controllers.columns[0].filter(c => (c.sortable !== false) && (c.id !== 'checkbox')).map(c => {
                        return (
                            <option key={c.id} value={c.id}>{c.label}</option>
                        )
                    })}
                </select>
            </ControllerWrappper>
            <ControllerWrappper label='Sort Direction'>
                <select value={!!controllers.sort[0].isAsc} onChange={e => controllers.sort[1]({ ...controllers.sort[0], isAsc: e.target.value === 'true'})}>
                    <option value={'true'}>Ascending</option>
                    <option value={'false'}>Descending</option>
                </select>
            </ControllerWrappper>
            <ControllerWrappper label='Enable Columns Reorder'>
                <input type='checkbox' checked={controllers.enableColumnsReorder[0]} onChange={e => controllers.enableColumnsReorder[1](!controllers.enableColumnsReorder[0])} />
            </ControllerWrappper>
            <ControllerWrappper label='Highlight Search'>
                <input type='checkbox' checked={controllers.highlightSearch[0]} onChange={e => controllers.highlightSearch[1](!controllers.highlightSearch[0])} />
            </ControllerWrappper>
            <ControllerWrappper label='Show Search'>
                <input type='checkbox' checked={controllers.showSearch[0]} onChange={e => controllers.showSearch[1](!controllers.showSearch[0])} />
            </ControllerWrappper>
            <ControllerWrappper label='Show Column Visibility Manager'>
                <input type='checkbox' checked={controllers.showColumnVisibilityManager[0]} onChange={e => controllers.showColumnVisibilityManager[1](!controllers.showColumnVisibilityManager[0])} />
            </ControllerWrappper>
            <ControllerWrappper label='Show Rows Information'>
                <input type='checkbox' checked={controllers.showRowsInformation[0]} onChange={e => controllers.showRowsInformation[1](!controllers.showRowsInformation[0])} />
            </ControllerWrappper>
            <ControllerWrappper label='Is Header Sticky'>
                <input type='checkbox' checked={controllers.isHeaderSticky[0]} onChange={e => controllers.isHeaderSticky[1](!controllers.isHeaderSticky[0])} />
            </ControllerWrappper>
            <ControllerWrappper label='Is Virtual Scroll'>
                <input type='checkbox' checked={controllers.isVirtualScroll[0]} onChange={e => controllers.isVirtualScroll[1](!controllers.isVirtualScroll[0])} />
            </ControllerWrappper>
            <ControllerWrappper label='Is Paginated'>
                <input type='checkbox' checked={controllers.isPaginated[0]} onChange={e => controllers.isPaginated[1](!controllers.isPaginated[0])} />
            </ControllerWrappper>
            <ControllerWrappper label='Min Search Chars'>
                <input type='number' value={controllers.minSearchChars[0]} min='0' onChange={e => controllers.minSearchChars[1](~~e.target.value)} />
            </ControllerWrappper>
            <ControllerWrappper label='Min Column Width'>
                <input type='number' value={controllers.minColumnResizeWidth[0]} min='0' onChange={e => controllers.minColumnResizeWidth[1](~~e.target.value)} />
            </ControllerWrappper>
            <ControllerWrappper label='Select All Mode'>
                <select value={controllers.selectAllMode[0]} onChange={e => controllers.selectAllMode[1](e.target.value)}>
                    <option value={'page'}>Page</option>
                    <option value={'all'}>All</option>
                </select>
            </ControllerWrappper>
        </React.Fragment>
    )
}

export default TableControllers;
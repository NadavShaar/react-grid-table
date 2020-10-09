var lastPos;

const tableManager = () => {
    return {
        generateColumns: ({columns, minColumnWidth}) => {
            return columns.map((cd, idx) => { 
    
                let isPinnedColumn =  idx === 0 && cd.pinned || idx === columns.length-1 && cd.pinned;
                let isVisibleColumn =  isPinnedColumn || cd.visible !== false;
                
                if(cd.id === 'checkbox') return {
                    className: '',
                    width: 'max-content',
                    minWidth: 0,
                    maxWidth: null,
                    resizable: false,
                    ...cd,
                    pinned: isPinnedColumn,
                    visible: isVisibleColumn
                };
                
                return {
                    label: cd.field,
                    className: '',
                    width: 'max-content',
                    minWidth: cd.minWidth || minColumnWidth,
                    maxWidth: null,
                    getValue: ({value, column}) => value, 
                    setValue: ({value, row, setRow, column}) => { setRow({...row, [column.field]: value}) },
                    searchable: true,
                    editable: true,
                    sortable: true,
                    resizable: true,
                    search: ({value, searchText}) => value.toString().toLowerCase().includes(searchText.toLowerCase()), 
                    sort: ({a, b, isAscending}) => {
                        let aa = typeof a === 'string' ? a.toLowerCase() : a;
                        let bb = typeof b === 'string' ? b.toLowerCase() : b;
                        if(aa > bb) return isAscending ? 1 : -1;
                        else if(aa < bb) return isAscending ? -1 : 1;
                        return 0;
                    }, 
                    ...cd, 
                    pinned: isPinnedColumn,
                    visible: isVisibleColumn
                }
            });
        },
        getNormalizedItems: ({columns, items, searchText, isPaginated, page, pageSize, sortBy, sortAsc, setItems, setTotalPages, searchMinChars}) => {
            items = [...items];
    
            var conf = columns.reduce((conf, coldef) => {
                conf[coldef.field] = coldef;
                return conf;
            }, {})
            var conf2 = columns.reduce((conf, coldef) => {
                conf[coldef.id] = coldef;
                return conf;
            }, {})
    
            if(searchText.length >= searchMinChars) {
                items = items.filter(item => Object.keys(item).some(key => {
                    if (conf[key] && conf[key].searchable !== false) {
                        let displayValue = conf[key].getValue({value: item[key], column: conf[key]});
                        return conf[key].search({value: displayValue.toString(), searchText});
                    }
                    return false;
                }));
            }
    
            // sort
            if(sortBy){
                items.sort((a, b) => {
                    let aVal = conf2[sortBy].getValue({value: a[conf2[sortBy].field], column: conf2[sortBy]});
                    let bVal = conf2[sortBy].getValue({value: b[conf2[sortBy].field], column: conf2[sortBy]});
                    
                    if(conf2[sortBy].sortable === false) return 0;
                    return conf2[sortBy].sort({a: aVal, b: bVal, isAscending: sortAsc});
                });
            }
    
            // paginate
            let totalPages = (items.length % pageSize > 0) ? Math.trunc(items.length / pageSize) + 1 : Math.trunc(items.length / pageSize);
    
            if (isPaginated !== false) items = items.slice((pageSize * page - pageSize), (pageSize * page));
            
            setItems(items);
            setTotalPages(totalPages);
        },
        handleResize: ({e, target, column, tableRef, visibleColumns}) => {
            let containerEl = tableRef.current.container;
            let gridTemplateColumns = containerEl.style.gridTemplateColumns;
            let currentColWidth = target.offsetParent.clientWidth;
            if(!lastPos) lastPos = e.clientX;
            
            let diff = lastPos - e.clientX;
            
            let colIndex = visibleColumns.findIndex(cd => cd.id === column.id);
            let colMinWidth = visibleColumns[colIndex].minWidth;
            if(e.clientX > lastPos || e.clientX < lastPos && currentColWidth - diff > colMinWidth) {
                let gtcArr = gridTemplateColumns.split(" ");
                
                if((column.minWidth && ((currentColWidth - diff) <= column.minWidth)) || (column.maxWidth && ((currentColWidth - diff) >= column.maxWidth))) return;
    
                gtcArr[colIndex] = `${currentColWidth - diff}px`;
                let newGridTemplateColumns = gtcArr.join(" ");
    
                containerEl.style.gridTemplateColumns = newGridTemplateColumns;
            }
            
            lastPos = e.clientX;
        },
        handleResizeEnd: ({tableRef, columns, setColumns}) => {
            lastPos = null;
            let containerEl = tableRef.current.container;
            let gridTemplateColumns = containerEl.style.gridTemplateColumns;
            gridTemplateColumns = gridTemplateColumns.split(" ");
            
            columns = columns.map((cd, idx) => { return {...cd, width: gridTemplateColumns[idx]} }).filter(col => col.id !== 'virtual');
            setColumns(columns);
        },
        handleColumnSortStart: (obj, e) => {
            obj.helper.classList.add('rgt-column-sort-ghost');
            tableManager.isColumnSorting = true;
        },
        handleColumnSortEnd: ({sortObj, visibleColumns, columns, setColumns}) => {
            setTimeout(() => { tableManager.isColumnSorting = false }, 0);
            if(sortObj.oldIndex === sortObj.newIndex) return;
    
            let colDefNewIndex = columns.findIndex(oc => oc.id === visibleColumns[sortObj.newIndex].id);
            let colDefOldIndex = columns.findIndex(oc => oc.id === visibleColumns[sortObj.oldIndex].id);
    
            columns = [...columns];
            columns.splice(colDefNewIndex, 0, ...columns.splice(colDefOldIndex, 1));
            
            setColumns(columns);
        },
        handleSort: ({colId, onSortChange, setSortBy, setSortAsc, sortByState, sortAsc}) => {
            if(tableManager.isColumnSorting) return;
            
            if(sortByState !== colId) {
                setSortBy(colId);
                setSortAsc(true);
                if(onSortChange) onSortChange(colId, true);
                return;
            }
            let sort = sortAsc ? false : sortAsc === false ? null : true;
            if(sort === null) setSortBy(null);
            if(onSortChange) onSortChange(colId, sort);
            setSortAsc(sort);
        },
        handlePagination: ({goToPage, listEl, totalPages, setPage, selectedItems, onSelectedItemsChange}) => {
            if((goToPage >= 1) && (goToPage <= totalPages)) {
                setPage(goToPage);
                // if(selectedItems.length) {
                //     onSelectedItemsChange([]);
                // }
                setTimeout(() => { listEl.scrollTop = 0 }, 0);
            };
        },
        toggleSelectAll: ({selectAllIsChecked, selectedItems, selectableItems, onSelectedItemsChange, isSelectAllIndeterminate, rowIdField}) => {
            let selectedIds = [...selectedItems];

            if(selectAllIsChecked || isSelectAllIndeterminate) selectedIds = selectedIds.filter(si => !selectableItems.find(item => si === item.id));
            if (!selectAllIsChecked && !isSelectAllIndeterminate) selectableItems.forEach(s => selectedIds.push(s[rowIdField]));
            
            onSelectedItemsChange(selectedIds);
        },
        toggleItemSelection: ({id, selectedItems, onSelectedItemsChange}) => {
            selectedItems = [...selectedItems];
    
            let itemIndex = selectedItems.findIndex(s => s === id);
    
            if(itemIndex !== -1) selectedItems.splice(itemIndex, 1);
            else selectedItems.push(id);
    
            onSelectedItemsChange(selectedItems);
        },
        handleColumnVisibility: ({colId, columns, setColumns}) => {
            columns = [...columns];
            let colIndex = columns.findIndex(cd => cd.id === colId);
    
            columns[colIndex].visible = !columns[colIndex].visible;
            setColumns(columns);
        }
    }
}

export default tableManager;
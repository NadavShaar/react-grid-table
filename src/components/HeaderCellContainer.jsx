import React from "react";
import { SortableElement, SortableHandle } from "../drag-and-drop";

const SortableItem = ({ children, columnId, className }, ref) => (
    <div ref={ref} className={className} data-column-id={columnId}>
        {children}
    </div>
);

const SortableElementItem = SortableElement(React.forwardRef(SortableItem));

const DragHandleContainer = ({ children }, ref) => (
    <span ref={ref}>{children}</span>
);

const SortableDragHandle = SortableHandle(
    React.forwardRef(DragHandleContainer)
);

const HeaderCellContainer = ({ index, column, tableManager }) => {
    let {
        config: {
            isHeaderSticky,
            components: { DragHandle },
            additionalProps: { headerCellContainer: additionalProps = {} },
            icons: {
                sortAscending: sortAscendingIcon,
                sortDescending: sortDescendingIcon,
            },
        },
        sortApi: { sort, toggleSort },
        columnsApi: { visibleColumns },
        config: { enableColumnsReorder },
        columnsResizeApi: { useResizeRef },
        rowSelectionApi: { selectAll: selectionProps },
    } = tableManager;

    let resizeHandleRef = useResizeRef(column);

    const getClassNames = () => {
        let classNames;

        switch (column.id) {
            case "virtual":
                classNames = `rgt-cell-header rgt-cell-header-virtual-col${
                    isHeaderSticky ? " rgt-cell-header-sticky" : ""
                }`.trim();
                break;
            default:
                classNames = `rgt-cell-header rgt-cell-header-${
                    column.id === "checkbox" ? "checkbox" : column.field
                }${
                    column.sortable !== false &&
                    column.id !== "checkbox" &&
                    column.id !== "virtual"
                        ? " rgt-clickable"
                        : ""
                }${
                    column.sortable !== false && column.id !== "checkbox"
                        ? " rgt-cell-header-sortable"
                        : " rgt-cell-header-not-sortable"
                }${
                    isHeaderSticky
                        ? " rgt-cell-header-sticky"
                        : " rgt-cell-header-not-sticky"
                }${
                    column.resizable !== false
                        ? " rgt-cell-header-resizable"
                        : " rgt-cell-header-not-resizable"
                }${
                    column.searchable !== false && column.id !== "checkbox"
                        ? " rgt-cell-header-searchable"
                        : " rgt-cell-header-not-searchable"
                }${
                    isPinnedLeft
                        ? " rgt-cell-header-pinned rgt-cell-header-pinned-left"
                        : ""
                }${
                    isPinnedRight
                        ? " rgt-cell-header-pinned rgt-cell-header-pinned-right"
                        : ""
                } ${column.className}`.trim();
        }

        return (
            classNames.trim() +
            " " +
            (additionalProps.className || "")
        ).trim();
    };

    const getAdditionalProps = () => {
        let mergedProps = {
            ...additionalProps,
        };
        if (column.sortable) {
            let onClick = additionalProps.onClick;
            mergedProps.onClick = (e) => {
                toggleSort(column.id);
                onClick?.(e);
            };
        }

        return mergedProps;
    };

    let isPinnedRight = column.pinned && index === visibleColumns.length - 1;
    let isPinnedLeft = column.pinned && index === 0;
    let classNames = getClassNames();
    let innerCellClassNames = `rgt-cell-header-inner${
        column.id === "checkbox" ? " rgt-cell-header-inner-checkbox" : ""
    }${!isPinnedRight ? " rgt-cell-header-inner-not-pinned-right" : ""}`;
    additionalProps = getAdditionalProps();

    let headerCellProps = { tableManager, column };

    return (
        <div
            data-column-id={column.id.toString()}
            {...additionalProps}
            className={classNames}
        >
            {column.id === "virtual" ? null : (
                <React.Fragment>
                    <SortableElementItem
                        className={innerCellClassNames}
                        index={index}
                        disabled={
                            !enableColumnsReorder ||
                            isPinnedLeft ||
                            isPinnedRight
                        }
                        columnId={column.id.toString()}
                        collection={isPinnedLeft || isPinnedRight ? 0 : 1}
                    >
                        {DragHandle && !isPinnedLeft && !isPinnedRight ? (
                            <SortableDragHandle index={index}>
                                {<DragHandle />}
                            </SortableDragHandle>
                        ) : null}
                        {column.id === "checkbox"
                            ? column.headerCellRenderer({
                                  ...headerCellProps,
                                  ...selectionProps,
                              })
                            : column.headerCellRenderer(headerCellProps)}
                        {sort.colId !== column.id ? null : sort.isAsc ? (
                            <span className="rgt-sort-icon rgt-sort-icon-ascending">
                                {sortAscendingIcon}
                            </span>
                        ) : (
                            <span className="rgt-sort-icon rgt-sort-icon-descending">
                                {sortDescendingIcon}
                            </span>
                        )}
                    </SortableElementItem>
                    {column.resizable ? (
                        <span
                            ref={resizeHandleRef}
                            className="rgt-resize-handle"
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                            }}
                        ></span>
                    ) : null}
                </React.Fragment>
            )}
        </div>
    );
};

export default HeaderCellContainer;

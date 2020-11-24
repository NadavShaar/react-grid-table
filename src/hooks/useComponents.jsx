export default (props, tableManager) => {
    return {
        Search: props.searchComponent,
        ColumnVisibility: props.columnVisibilityComponent,
        Header: props.headerComponent,
        Footer: props.footerComponent,
        Loader: props.loaderComponent,
        NoResults: props.noResultsComponent,
        Information: props.informationComponent,
        PageSize: props.pageSizeComponent,
        Pagination: props.paginationComponent,
        DragHandle: props.dragHandleComponent,
    }
}
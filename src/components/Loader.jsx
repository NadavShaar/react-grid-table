const Loader = props => {

    let {
        tableManager,
    } = props;

    let {
        icons: {
            loader: loaderIcon
        },
    } = tableManager;

    return loaderIcon
}

export default Loader;
const Loader = ({ tableManager }) => {
    let {
        config: {
            icons: { loader: loaderIcon },
        },
    } = tableManager;

    return loaderIcon;
};

export default Loader;

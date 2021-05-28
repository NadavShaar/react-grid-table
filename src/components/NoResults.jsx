const NoResults = ({ tableManager }) => {
    let {
        config: {
            texts: { noResults },
        },
    } = tableManager;

    return noResults;
};

export default NoResults;

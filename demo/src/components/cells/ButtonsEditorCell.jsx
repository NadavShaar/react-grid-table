import React from "react";

const CANCEL_SVG = (
    <svg
        height="20"
        viewBox="0 0 20 20"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g fill="none" stroke="#dc1e1e" transform="translate(5 5)">
            <path d="m.5 10.5 10-10" />
            <path d="m10.5 10.5-10-10z" />
        </g>
    </svg>
);
const SAVE_SVG = (
    <svg
        height="20"
        viewBox="0 0 20 20"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="m.5 5.5 3 3 8.028-8"
            fill="none"
            stroke="#4caf50"
            transform="translate(5 6)"
        />
    </svg>
);

const styles = {
    buttonsCellEditorContainer: {
        height: "100%",
        width: "100%",
        display: "inline-flex",
        padding: "0 20px",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    cancelButton: {
        background: "#f3f3f3",
        outline: "none",
        cursor: "pointer",
        marginRight: 10,
        padding: 2,
        display: "inline-flex",
        border: "none",
        borderRadius: "50%",
        boxShadow: "1px 1px 2px 0px rgb(0 0 0 / .3)",
    },
    saveButton: {
        background: "#f3f3f3",
        outline: "none",
        cursor: "pointer",
        padding: 2,
        display: "inline-flex",
        border: "none",
        borderRadius: "50%",
        boxShadow: "1px 1px 2px 0px rgb(0 0 0 / .3)",
    },
};

const ButtonsEditorCell = ({ tableManager, data, setRowsData }) => (
    <div style={styles.buttonsCellEditorContainer}>
        <button
            title="Cancel"
            style={styles.cancelButton}
            onClick={(e) => {
                e.stopPropagation();
                tableManager.rowEditApi.setEditRowId(null);
            }}
        >
            {CANCEL_SVG}
        </button>
        <button
            title="Save"
            style={styles.saveButton}
            onClick={(e) => {
                e.stopPropagation();
                let rowsClone = [...tableManager.rowsApi.originalRows];
                let updatedRowIndex = rowsClone.findIndex(
                    (r) => r.id === data.id
                );
                rowsClone[updatedRowIndex] = data;
                setRowsData(rowsClone);
                tableManager.rowEditApi.setEditRowId(null);
            }}
        >
            {SAVE_SVG}
        </button>
    </div>
);

export default ButtonsEditorCell;

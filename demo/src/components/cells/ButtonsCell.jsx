import React from "react";

const EDIT_SVG = (
    <svg
        height="16"
        viewBox="0 0 20 20"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g fill="#fff" stroke="#1856bf" transform="translate(2 2)">
            <path
                d="m8.24920737-.79402796c1.17157287 0 2.12132033.94974747 2.12132033 2.12132034v13.43502882l-2.12132033 3.5355339-2.08147546-3.495689-.03442539-13.47488064c-.00298547-1.16857977.94191541-2.11832105 2.11049518-2.12130651.00180188-.00000461.00360378-.00000691.00540567-.00000691z"
                transform="matrix(.70710678 .70710678 -.70710678 .70710678 8.605553 -3.271644)"
            />
            <path d="m13.5 4.5 1 1" />
        </g>
    </svg>
);

const styles = {
    buttonsCellContainer: {
        padding: "0 20px",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    editButton: {
        background: "#f3f3f3",
        outline: "none",
        cursor: "pointer",
        padding: 4,
        display: "inline-flex",
        border: "none",
        borderRadius: "50%",
        boxShadow: "1px 1px 2px 0px rgb(0 0 0 / .3)",
    },
};

const ButtonsCell = ({ tableManager, data }) => (
    <div style={styles.buttonsCellContainer}>
        <button
            title="Edit"
            style={styles.editButton}
            onClick={(e) => {
                e.stopPropagation();
                tableManager.rowEditApi.setEditRowId(data.id);
            }}
        >
            {EDIT_SVG}
        </button>
    </div>
);

export default ButtonsCell;

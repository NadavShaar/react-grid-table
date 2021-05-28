import React from "react";

const styles = {
    root: {
        position: "relative",
        padding: "0 20px",
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
    },
    img: { minWidth: 32 },
    input: {
        position: "absolute",
        height: 28,
        width: "calc(100% - 82px)",
        top: 10,
        right: 20,
        bottom: 0,
        border: "none",
        borderBottom: "1px solid #eee",
        outline: "none",
        fontSize: 16,
        padding: 0,
        fontFamily: "inherit",
    },
    text: {
        marginLeft: 10,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
};
const UsernameCell = ({
    value,
    onChange,
    isEdit,
    data,
    column,
    isFirstEditableCell,
}) => {
    return (
        <div style={styles.root}>
            {isEdit ? (
                <React.Fragment>
                    <img style={styles.img} src={data.avatar} alt="avatar" />
                    <input
                        autoFocus={isFirstEditableCell}
                        style={styles.input}
                        type="text"
                        value={value}
                        onChange={(e) =>
                            onChange({
                                ...data,
                                [column.field]: e.target.value,
                            })
                        }
                    />
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <img style={styles.img} src={data.avatar} alt="avatar" />
                    <span style={styles.text} title={value}>
                        {value}
                    </span>
                </React.Fragment>
            )}
        </div>
    );
};

export default UsernameCell;

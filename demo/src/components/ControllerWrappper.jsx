import React from "react";

const styles = {
    wrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '7px 0',
        alignItems: 'center'
    },
    label: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    children: {
        display: 'flex',
        flexDirection: 'column'
    }
}

const ControllerWrappper = ({ label, children }) => {
    return (
        <div style={styles.wrapper}>
            <span style={styles.label}>{label}: </span>
            <div style={styles.children}>
                {children}
            </div>
        </div>
    )
}

export default ControllerWrappper;
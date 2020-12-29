import React from "react";

const ControllerWrappper = ({ label, children }) => {
    return (
        <div style={{ display: 'flex', maxWidth: 322 }}>
            <span style={{ display: 'flex', minWidth: 222, maxWidth: 222 }}>{label}: </span>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 100, maxWidth: 100 }}>
                {children}
            </div>
        </div>
    )
}

export default ControllerWrappper;
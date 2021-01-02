import React from "react";

const ControllerWrappper = ({ label, children }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0' }}>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}: </span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {children}
            </div>
        </div>
    )
}

export default ControllerWrappper;
import React, { useState, useEffect, useRef } from "react";

const IsControlled = ({ propName, unControlledProps, setUnControlledProps, children }) => {
    const onChange = e => {
        if (unControlledProps.includes(propName)) unControlledProps = unControlledProps.filter(cp => cp !== propName);
        else unControlledProps = unControlledProps.concat(propName);
        setUnControlledProps(unControlledProps);
    }
    return (
        <div style={{ display: 'flex', maxWidth: 300 }}>
            <span style={{ display: 'flex', minWidth: 100, maxWidth: 100 }}>{propName}: </span>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 150, maxWidth: 150 }}>
                {children}
            </div>
            <input
                type="checkbox"
                checked={!unControlledProps.includes(propName)}
                onChange={onChange}
            />
        </div>
    )
}

export default IsControlled;
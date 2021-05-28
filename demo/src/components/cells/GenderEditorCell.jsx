import React from "react";

const styles = {
    select: { margin: "0 20px" },
};

const GenderEditorCell = ({ value, data, column, onChange }) => (
    <select
        style={styles.select}
        value={value}
        onChange={(e) => onChange({ ...data, [column.field]: e.target.value })}
    >
        <option>Male</option>
        <option>Female</option>
    </select>
);

export default GenderEditorCell;

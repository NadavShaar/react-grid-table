import React from "react";
import TableControllers from './TableControllers';
import ColumnsControllers from './ColumnsControllers';

const ControllersDrawer = ({ controllers }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 350, width: '100%', padding: 20, boxShadow: '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)' }}>
            {/* <TableControllers controllers={controllers} /> */}
            <ColumnsControllers controllers={controllers} />
        </div>
    )
}

export default ControllersDrawer;
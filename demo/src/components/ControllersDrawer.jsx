import React, { useState } from "react";
import TableControllers from './TableControllers';
import ColumnsControllers from './ColumnsControllers';

const styles = {
    wrapper: {
        display: 'flex', 
        flexDirection: 'column', 
        maxWidth: 350, 
        width: '100%', 
        fontSize: 14,
        boxShadow: '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
        zIndex: 1
    },
    tab: {
        width: '50%',
        border: 'none',
        lineHeight: '34px',
        background: '#eef2f5',
        color: '#000',
        cursor: 'pointer',
        fontSize: 14,
        outline: 'none'
    },
    activeTab: {
        background: '#0075ff',
        color: '#fff'
    }
};

const ControllersDrawer = ({ controllers }) => {
    const [tab, setTab] = useState('table');
    const tableTabStyles= {...styles.tab, ...(tab === 'table' ? styles.activeTab : {})};
    const columnsTabStyles= {...styles.tab, ...(tab === 'columns' ? styles.activeTab : {})};

    return (
        <div style={styles.wrapper}>
            <span style={{padding: '15px 20px', fontSize: 18, fontWeight: 'bold'}}>SETTINGS</span>
            <div style={{width: '100%'}}>
                <button onClick={() => setTab('table')} style={tableTabStyles}>Table</button>
                <button onClick={() => setTab('columns')} style={columnsTabStyles}>Columns</button>
            </div>
            <div style={{overflow: 'auto', flex: 1, padding: 20}}>
                {
                    tab === 'table' ?
                        <TableControllers controllers={controllers} />
                        :
                        <ColumnsControllers controllers={controllers} />
                }
            </div>
        </div>
    )
}

export default ControllersDrawer;
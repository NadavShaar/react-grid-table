import React, { useState } from "react";
import TableControllers from './TableControllers';
import ColumnsControllers from './ColumnsControllers';

const styles = {
    wrapper: {
        display: 'flex', 
        flexDirection: 'column', 
        maxWidth: 320, 
        width: '100%', 
        fontSize: 14,
        boxShadow: '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
        zIndex: 10,
        position: 'fixed',
        top: 0,
        bottom : 0,
        left: 0,
        background: '#fff',
        transition: 'transform 400ms cubic-bezier(0, 0, 0.2, 1) 0ms'
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
    },
    drawerToggleButton: {
        cursor: 'pointer',
        position: 'absolute',
        width: '40px',
        height: '40px',
        right: '-40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        top: '14px',
        boxShadow: '5px 3px 6px 0px rgba(0,0,0,0.2)'
    },
    drawerToggleIcon: {
        fontSize: '40px',
        margin: '-10px 3px 0 0'
    },
};

const ControllersDrawer = ({ isOpen, onToggle, controllers }) => {
    const [tab, setTab] = useState('table');
    const drawerStyles= {...styles.wrapper, transform: isOpen ? 'translate3d(0, 0, 0)' : 'translate3d(-320px, 0, 0)'};
    const tableTabStyles= {...styles.tab, ...(tab === 'table' ? styles.activeTab : {})};
    const columnsTabStyles= {...styles.tab, ...(tab === 'columns' ? styles.activeTab : {})};

    return (
        <div style={drawerStyles} className="settingsDrawer">
            <div style={styles.drawerToggleButton} onClick={() => onToggle(!isOpen)} className="settingsDrawerButton">
                <span style={styles.drawerToggleIcon}>{isOpen ? <>&lsaquo;</> : <>&rsaquo;</>}</span>
            </div>
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
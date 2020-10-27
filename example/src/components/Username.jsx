import React from 'react';

const Username = ({value, field, onChange, isEdit, data, columnData, rowIndex, searchText}) => {

    return (
        <div style={{position: 'relative', padding: '0 20px', display: 'flex', width: '100%', height: '100%', alignItems: 'center'}}>
            {
                isEdit ?
                    <React.Fragment>
                        <img src={data.avatar} alt="avatar" />    
                        <input
                            autoFocus 
                            style={{position: 'absolute', height: 28, width: 'calc(100% - 82px)', top: 10, right: 20, bottom: 0, border: 'none', borderBottom: '1px solid #eee', outline: 'none', fontSize: 16, padding: 0, fontFamily: 'inherit'}} 
                            type="text" 
                            value={value} 
                            onChange={e => onChange({...data, [field]: e.target.value})}
                        />
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <img src={data.avatar} alt="avatar" />
                        <span style={{marginLeft: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{value}</span>
                    </React.Fragment>
            }
        </div>
    )
}

export default Username;
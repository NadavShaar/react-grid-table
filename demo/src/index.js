import React from "react";
import GridTable from '../../dist';

// custom cell component
const Username = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
    return (
        <div className='rgt-cell-inner' style={{ display: 'flex', alignItems: 'center' }}>
            <img src={data.avatar} alt="user avatar" />
            <span className='rgt-text-truncate' style={{ marginLeft: 10 }}>{value}</span>
        </div>
    )
}

let rows = [
    {
        "id": 1,
        "username": "wotham0",
        "gender": "Male",
        "last_visited": "12/08/2019",
        "test": { "x": 1, "y": 2 },
        "avatar": "https://robohash.org/atquenihillaboriosam.bmp?size=32x32&set=set1"
    },
    {
        "id": 2,
        "username": "dbraddon2",
        "gender": "Female",
        "last_visited": "16/07/2018",
        "test": { "x": 3, "y": 4 },
        "avatar": "https://robohash.org/etsedex.bmp?size=32x32&set=set1"
    },
    {
        "id": 3,
        "username": "dridett3",
        "gender": "Male",
        "last_visited": "20/11/2016",
        "test": { "x": 5, "y": 8 },
        "avatar": "https://robohash.org/inimpeditquam.bmp?size=32x32&set=set1"
    },
    {
        "id": 4,
        "username": "gdefty6",
        "gender": "Female",
        "last_visited": "03/08/2019",
        "test": { "x": 7, "y": 4 },
        "avatar": "https://robohash.org/nobisducimussaepe.bmp?size=32x32&set=set1"
    },
    {
        "id": 5,
        "username": "hbeyer9",
        "gender": "Male",
        "last_visited": "10/10/2016",
        "test": { "x": 2, "y": 2 },
        "avatar": "https://robohash.org/etconsequatureaque.jpg?size=32x32&set=set1"
    }
];

const MyAwesomeTable = () => {

    const columns = [
        {
            id: 1,
            field: 'username',
            label: 'Username',
            cellRenderer: Username,
        },
        {
            id: 2,
            field: 'gender',
            label: 'Gender',
        },
        {
            id: 3,
            field: 'last_visited',
            label: 'Last Visited',
            sort: ({ a, b, isAscending }) => {
                let aa = a.split('/').reverse().join(),
                    bb = b.split('/').reverse().join();
                return aa < bb ? isAscending ? -1 : 1 : (aa > bb ? isAscending ? 1 : -1 : 0);
            }
        },
        {
            id: 4,
            field: 'test',
            label: 'Score',
            getValue: ({ value, column }) => value.x + value.y
        }
    ];

    return (
        <GridTable
            columns={columns}
            rows={rows}
        />
    )
};

export default MyAwesomeTable;
import React from 'react';
import { TablePagination } from '@material-ui/core';

function Pagination() {
    return (
        <TablePagination
        component="nav"
        page={0}
        rowsPerPage={10}
        count={100}
        onChangePage={() => {}}
    />
    );
}

export default Pagination;
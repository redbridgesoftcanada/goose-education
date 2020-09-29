import React from 'react';
import { TablePagination } from '@material-ui/core';

function Pagination(props) {
    const { currentPage, count, resourcesPerPage, handlePageChange } = props; 
    return (
        <TablePagination
            component="nav"
            page={currentPage}
            count={count}
            rowsPerPage={resourcesPerPage}
            onChangePage={handlePageChange}
            rowsPerPageOptions={[]}
            labelRowsPerPage=''
        />
    );
}

export default Pagination;
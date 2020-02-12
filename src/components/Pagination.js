import React from 'react';
import { TablePagination } from '@material-ui/core';

function Pagination(props) {
    const { currentPage, totalPages, resourcesPerPage, handlePageChange } = props; 
    return (
        <TablePagination
        component="nav"
        page={currentPage}
        rowsPerPage={resourcesPerPage}
        rowsPerPageOptions={[]}
        labelRowsPerPage=''
        count={totalPages}
        onChangePage={handlePageChange}
    />
    );
}

export default Pagination;
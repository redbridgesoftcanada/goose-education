import React from 'react';
import { Link, Table, TableBody, TableCell, TableHead, TableRow, makeStyles } from '@material-ui/core';
import Title from './Title';

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

function preventDefault(event) {
  event.preventDefault();
}

export default function TableTemplate(props) {
  const resourceType = props.type;
  const listOfResources = props.listOfResources;

  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>{resourceType}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Roles</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listOfResources.map((resource, i) => (
            <TableRow key={i}>
              <TableCell>{i}</TableCell>
              <TableCell>{resource.firstName} {resource.lastName}</TableCell>
              <TableCell>{resource.email}</TableCell>
              <TableCell>{!resource.roles['admin'] ? 'User' : 'Admin'}</TableCell>
              <TableCell>{!resource.roles['admin'] ? 'Change Role, Delete' : ''}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        {/* create 'load more' feature */}
        <Link color="secondary" href="#" onClick={preventDefault}>
          See more {resourceType}
        </Link>
      </div>
    </React.Fragment>
  );
}
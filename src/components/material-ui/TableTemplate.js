import React from 'react';
import { Link, Table, TableBody, TableCell, TableHead, TableRow, Typography, makeStyles } from '@material-ui/core';
import { CheckBox, CheckBoxOutlineBlank } from '@material-ui/icons';
import { format } from 'date-fns';
import Title from './Title';

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

function preventDefault(event) {
  event.preventDefault();
}

function createTableContent(type, data) {
  switch(type) {
    case 'accounts': 
      return (
        <>
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
            {data.map((resource, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{resource.firstName} {resource.lastName}</TableCell>
                <TableCell>{resource.email}</TableCell>
                <TableCell>{!resource.roles['admin'] ? 'User' : 'Admin'}</TableCell>
                <TableCell>{!resource.roles['admin'] ? 'Change Role, Delete' : ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </>
      )
    
    case 'applications':
      return (
        <>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((resource, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{resource.firstName} {resource.lastName}</TableCell>
                <TableCell>{format(resource.createdAt, 'Pp')}</TableCell>
                <TableCell>{resource.status}</TableCell>
                <TableCell>Download, Change Status, Delete</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </>
      )
    
    case 'schools':
      return (
        <>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((resource, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{resource.title}</TableCell>
                <TableCell>{resource.type}</TableCell>
                <TableCell>{resource.location}</TableCell>
                <TableCell>{resource.isFeatured ? <CheckBox/> : <CheckBoxOutlineBlank/>}</TableCell>
                <TableCell>Create, Edit, Delete, Change Featured</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </>
      )

      default:
        return <Typography>(⁄ ⁄•⁄ω⁄•⁄ ⁄)</Typography>
  }
}

export default function TableTemplate(props) {
  const resourceType = props.type;
  const listOfResources = props.listOfResources;
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>{resourceType}</Title>
      <Table size="small">
        {createTableContent(resourceType, listOfResources)}
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
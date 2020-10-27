import React, { useState } from "react";
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Check, Block, Clear, Edit } from "@material-ui/icons";
import { format } from "date-fns";
import { withFirebase } from "../../components/firebase";
import AdminComposeDialog from './AdminComposeDialog';
import DeleteConfirmation from '../DeleteConfirmation';
import { onDelete } from '../../constants/helpers/_storage';

function GooseTips(props) {
  const { firebase, listOfTips, snackbarMessage, deleteConfirmOpen, deleteConfirmToggle, editOpen, editToggle } = props;

  const [ selectedTip, setSelectedTip ] = useState(null);

  const toggleClickAction = event => {
    const actionType = event.currentTarget.name;
    const tipData = listOfTips.find(tip => tip.id === event.currentTarget.id);
    setSelectedTip(tipData);
    (actionType === 'edit') ? editToggle() : deleteConfirmToggle();
  }

  const handleDelete = () => {
    const selected = { id: selectedTip.id, upload: selectedTip.image }
    onDelete('tips', selected, firebase, deleteConfirmToggle, snackbarMessage); 
  }

  return (
    <>
      <AdminComposeDialog 
        formType="tip" 
        isEdit={true} 
        open={editOpen} 
        onClose={editToggle} 
        setSnackbarMessage={snackbarMessage} 
        prevContent={selectedTip}/>

      <DeleteConfirmation 
        deleteType='admin_tip' 
        open={deleteConfirmOpen} 
        handleDelete={handleDelete} 
        onClose={deleteConfirmToggle}/>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align='center'>Title</TableCell>
            <TableCell align='center'>Featured</TableCell>
            <TableCell align='center'>Last Updated At</TableCell>
            <TableCell align='center'>Edit</TableCell>
            <TableCell align='center'>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listOfTips.map((tip, i) => (
            <TableRow key={i} hover>
              <TableCell align='center'>{tip.title}</TableCell>
              <TableCell align='center'>{tip.isFeatured ? <Check fontSize='small'/> : <Block fontSize='small'/>}</TableCell>
              <TableCell align='center'>{format(tip.updatedAt, "Pp")}</TableCell>
              <TableCell align='center'>
                <IconButton name='edit' id={tip.id} color="secondary" onClick={toggleClickAction}>
                  <Edit fontSize='small'/> 
                </IconButton>
              </TableCell>
              <TableCell align='center'>
                <IconButton name='delete' id={tip.id} color="secondary" onClick={toggleClickAction}>
                  <Clear fontSize='small'/>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default withFirebase(GooseTips);
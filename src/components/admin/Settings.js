import React, { Fragment, useState } from "react";
import { Button, Collapse, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { defaultValueTextField } from '../../constants/helpers-admin';
import { withFirebase } from "../../components/firebase";

const multiGraphicsIds = ['gooseCards', 'gooseFeatureBoard', 'homeFeatureBoard', 'homestayBannerProcess', 'networkingCards'];

function Settings(props) {
  const { state, dispatch, listOfGraphics, firebase } = props;

  const INITIAL_STATE = {
    gooseCards: false,
    gooseFeatureBoard: false,
    homeFeatureBoard: false,
    homestayBannerProcess: false,
    networkingCards: false,
  }
  const [ open, setOpen ] = useState(INITIAL_STATE);
  const [ input, setInput ] = useState({});

  // D I S P A T C H  M E T H O D S
  const setSnackbarMessage = message => dispatch({type: 'SNACKBAR_OPEN', payload: message});

  // E V E N T  L I S T E N E R S
  const handleOpen = event => {
    const selectedCollapseComponent = event.currentTarget.id;
    setOpen(prevState => ({...prevState, [selectedCollapseComponent]: !open[selectedCollapseComponent]}));
  }

  const handleTextInput = (event, type) => {
    const inputRef = event.currentTarget.name;
    const inputType = type;
    const inputValue = event.currentTarget.value;
    setInput(prevState => ({...prevState, [inputRef]: {inputValue, inputType}}));
  }

  const handleSave = async event => {
    const checkForInputs = Object.keys(input).length !== 0;
    if (checkForInputs) {
      await createBatchUpdates(firebase, input, setSnackbarMessage);
    } else {
      setSnackbarMessage("Unable to save - there have been no changes made.");
    }
    // event.preventDefault();
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Location</TableCell>
            <TableCell align="center">Title</TableCell>
            <TableCell align="center">Subtitle</TableCell>
            <TableCell align="center">Caption</TableCell>
            <TableCell align="center">Image</TableCell>
            <TableCell/>
          </TableRow>
        </TableHead>
        <TableBody>
          {generateSettingInputFields(listOfGraphics, open, handleOpen, handleTextInput)}
        </TableBody>
      </Table>
      <Button fullWidth color="secondary" onClick={handleSave}>Save</Button>
    </>
  )
}

// H E L P E R  F U N C T I O N S
const templateInputFields = (id, title, subtitle, caption, image, handleTextListener) => {
  const disabledInput = <TextField disabled variant="filled" color="secondary"/>;
  return (
    <>
      <TableCell>{title ? defaultValueTextField(id, title, event => handleTextListener(event, 'title'), false) : disabledInput}</TableCell>
      <TableCell>{subtitle ? defaultValueTextField(id, subtitle, event => handleTextListener(event, 'subtitle'), true) : disabledInput}</TableCell>
      <TableCell>{caption ? defaultValueTextField(id, caption, event => handleTextListener(event, 'caption'), true) : disabledInput}</TableCell>
      <TableCell>{image ? defaultValueTextField(id, image, event => handleTextListener(event, 'image'), false) : disabledInput}</TableCell>
    </>
)}

const generateSettingInputFields = (listOfGraphics, openState, handleOpenListener, handleTextListener) => {
  return listOfGraphics.map((graphic, i) => {
    const checkForMultiGraphics = multiGraphicsIds.some(id => graphic.id.includes(id));

    if (checkForMultiGraphics) {
      return (
        <Fragment key={i}>
          <TableRow hover id={graphic.id} onClick={handleOpenListener}>
            <TableCell>{graphic.id}</TableCell>
            <TableCell/>
            <TableCell/>
            <TableCell/>
            <TableCell/>
            <TableCell>{openState[graphic.id] ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={1}/>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
              <Collapse in={openState[graphic.id]} timeout="auto" unmountOnExit>
                {Object.values(graphic).map((innerGraphic, i) => {
                  if (typeof innerGraphic !== 'string') {
                    return (
                      <Table key={i}>
                        <TableBody>
                          <TableRow>
                            {templateInputFields(innerGraphic.id, innerGraphic.title, innerGraphic.subtitle, innerGraphic.caption, innerGraphic.image, handleTextListener)}
                          </TableRow>
                        </TableBody>
                      </Table>
                  )}
                })}
              </Collapse>
            </TableCell>
          </TableRow>
        </Fragment>
      )
    } else {
      return (
        <TableRow key={i} hover>
          <TableCell>{graphic.id}</TableCell>
          {templateInputFields(graphic.id, graphic.title, graphic.subtitle, graphic.caption, graphic.image, handleTextListener)}
          <TableCell/>
        </TableRow>
    )}
  });
}

const createBatchUpdates = async (firebase, inputState, snackbarMessageListener) => {
  let batch = firebase.batch();
  await Object.keys(inputState).map(key => {
    let inputId = key;
    let { inputValue, inputType } = inputState[key];
    let docRef = firebase.graphic(inputId);
    batch.update(docRef, {[inputType]: inputValue});
  });
  batch.commit().then(function () {
    console.log('Updated values')
    snackbarMessageListener("Changes successfully saved.");
  });
}


export default withFirebase(Settings);
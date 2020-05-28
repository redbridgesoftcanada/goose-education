import React, { Fragment, useState } from "react";
import { Button, Collapse, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { defaultValueTextField } from '../../constants/helpers-admin';
import { withFirebase } from "../../components/firebase";

const multiGraphicsIds = ['gooseCards', 'gooseFeatureBoard', 'homeFeatureBoard', 'homestayBannerProcess', 'networkingCards'];

function Settings(props) {
  const { listOfGraphics, firebase, snackbarMessage } = props;

  const INITIAL_OPEN = {
    gooseCards: false,
    gooseFeatureBoard: false,
    homeFeatureBoard: false,
    homestayBannerProcess: false,
    networkingCards: false,
  }
  const [ open, setOpen ] = useState(INITIAL_OPEN);
  const [ input, setInput ] = useState({});

  // E V E N T  L I S T E N E R S
  const handleOpen = event => {
    const selectedCollapseComponent = event.currentTarget.id;
    setOpen(prevState => ({...prevState, [selectedCollapseComponent]: !open[selectedCollapseComponent]}));
  }

  const handleTextInput = (event, type) => {
    const inputCategory = event.currentTarget.name;
    const inputRef = event.currentTarget.id;
    const inputValue = event.currentTarget.value;
    const inputType = type;
    setInput(prevState => ({...prevState, [inputCategory]: {inputRef, inputValue, inputType}}));
  }

  const handleSave = () => {
    const checkForInputs = Object.keys(input).length !== 0;
    if (checkForInputs) {
      createBatchUpdates(firebase, input, snackbarMessage);
    } else {
      snackbarMessage("Nothing to save - no changes have been made.");
    }
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
      <Button fullWidth variant="contained" color="secondary" onClick={handleSave}>Save</Button>
    </>
  )
}

// H E L P E R  F U N C T I O N S
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
                  const multiIds = JSON.stringify({"outer": graphic.id, "inner": innerGraphic.id});
                  if (typeof innerGraphic !== 'string') {
                    return (
                      <Table key={i}>
                        <TableBody>
                          <TableRow>
                            {templateInputFields(multiIds, innerGraphic.title, innerGraphic.subtitle, innerGraphic.caption, innerGraphic.image, handleTextListener)}
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

const templateInputFields = (id, title, subtitle, caption, image, handleTextListener) => {
  const checkMultiIds = id.includes('{');
  if (checkMultiIds) {
    id = JSON.parse(id);
  }
  const disabledInput = <TextField disabled variant="filled" color="secondary"/>;
  return (
    <>
      <TableCell>{title ? defaultValueTextField(id, title, event => handleTextListener(event, 'title'), false) : disabledInput}</TableCell>
      <TableCell>{subtitle ? defaultValueTextField(id, subtitle, event => handleTextListener(event, 'subtitle'), true) : disabledInput}</TableCell>
      <TableCell>{caption ? defaultValueTextField(id, caption, event => handleTextListener(event, 'caption'), true) : disabledInput}</TableCell>
      <TableCell>{image ? defaultValueTextField(id, image, event => handleTextListener(event, 'image'), false) : disabledInput}</TableCell>
    </>
)}

const createBatchUpdates = async (firebase, inputState, snackbarMessageListener) => {
  let batch = firebase.batch();
  await Object.keys(inputState).map(key => {
    let inputCategory = key;
    let { inputRef, inputValue, inputType } = inputState[key];

    let docRef = firebase.graphic(inputCategory);
    if (inputRef) {
      batch.update(docRef, {[inputRef]: {[inputType]: inputValue}})
    } else {
      batch.update(docRef, {[inputType]: inputValue});
    }
  });
  batch.commit().then(function () {
    snackbarMessageListener("Changes successfully saved.");
  });
}

export default withFirebase(Settings);
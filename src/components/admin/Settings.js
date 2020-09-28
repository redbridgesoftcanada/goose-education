import React, { Fragment, useState } from "react";
import { Box, Button, CardMedia, Collapse, Grid, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { convertToSentenceCase } from '../../constants/helpers/_features';
import TabPanel from '../../components/TabPanel';
import StyledValidators from '../../components/customMUI';
import { withFirebase } from "../../components/firebase";

const multiGraphicsIds = ['footerLeft', 'footerRight', 'gooseCards', 'gooseFeatureBoard', 'homeFeatureBoard', 'homestayBannerProcess', 'networkingCards'];

function Settings(props) {
  const { listOfGraphics, listOfImages, firebase, snackbarMessage } = props;

  const [ input, setInput ] = useState({});
  const [ open, setOpen ] = useState({
    tab: 0,
    footerLeft: false,
    footerRight: false,
    gooseCards: false,
    gooseFeatureBoard: false,
    homeFeatureBoard: false,
    homestayBannerProcess: false,
    networkingCards: false,
  });

  const handleTab = selectedTab => {
    setOpen(prevState => ({...prevState, tab: selectedTab}));
  }

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
      createBatchUpdates(firebase, input, snackbarMessage)
      .then(() => 
        snackbarMessage("Changes saved! Please refresh to see changes on Goose."),
        setInput({}));
    } else {
      snackbarMessage("Nothing to save - no changes have been made.");
    }
  }

  return (
    <>
      <Tabs 
        centered 
        value={open.tab}
        onChange={(event, newValue) => handleTab(newValue)}
      >
        <Tab label={'Page Content'}/>
        <Tab label={'Images'}/>
      </Tabs>

      <TabPanel value={open.tab} index={0}>
        {createMediaContentTable(listOfGraphics, open, handleOpen, handleTextInput, handleSave)}
      </TabPanel>

      <TabPanel value={open.tab} index={1}>
        {createImagesTable(listOfImages, handleTextInput, handleSave)}
      </TabPanel>
    </>
  )
}

const createMediaContentTable = (listOfGraphics, collapseState, collapseListener, changeListener, onSave) => {
  return (
    <Box mx={3} my={2}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={6}>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listOfGraphics.map(graphic => {
              const checkForMultiGraphics = multiGraphicsIds.some(id => graphic.id.includes(id));
              if (!checkForMultiGraphics) {
                return createMediaRow(graphic, changeListener)
              } else {
                return createNestedMediaRow(graphic, collapseState, collapseListener, changeListener)
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Button 
        fullWidth 
        variant="contained" 
        color="secondary"
        onClick={onSave}>
          Save
      </Button>

    </Box>
  )
}

const createMediaRow = (graphic, changeListener) => {
  const checkMultiIds = graphic.id.includes('{');
  if (checkMultiIds) {
    graphic.id = JSON.parse(graphic.id);
  }

  const editableFields = Object.entries(graphic).reduce((a, [k, v]) => (k !== 'image' && k !== 'location' && v ? (a[k] = v, a) : a), {});

  return (
    <TableRow hover key={editableFields.id}>
      <TableCell>{editableFields.id}</TableCell>
      <TableCell colSpan={5}>
        {Object.keys(editableFields).map(field => {
          if (!field || field === 'id') {
            return;
          } else {
            return (
              <StyledValidators.AdminTextField
                key={editableFields.id + '-' + field}
                name={editableFields.id}
                defaultValue={editableFields[field]}
                onChange={event => changeListener(event, field)}
              />
            )
          }
        })}
      </TableCell>
    </TableRow>
  )
}

const createNestedMediaRow = (graphic, collapseState, collapseListener, changeListener) => {
  const nestedGraphics = Object.entries(graphic).reduce((a, [k, v]) => (typeof v !== 'string' ? (a[k] = v, a) : a), {});

  return (
    <Fragment key={graphic.id}>
      <TableRow hover id={graphic.id} onClick={collapseListener}>
        <TableCell>{graphic.id}</TableCell>
        <TableCell colSpan={4} align='right'>
          {collapseState[graphic.id] ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell padding='none' colSpan={6} style={{ paddingLeft: 40 }}>
          <Collapse in={collapseState[graphic.id]} timeout="auto" unmountOnExit>
            
            {Object.values(nestedGraphics).map((nGraphic, i) => {

              const multiIds = JSON.stringify({outer: graphic.id, inner: nGraphic.id});

                return (
                  <Table key={i}>
                    <TableBody>
                      {Object.keys(nGraphic).map(field => {
                        if (!nGraphic[field] || field === 'id') {
                          return;
                        } else {
                          return (
                            <StyledValidators.AdminTextField
                              key={nGraphic.id + '-' + field}
                              name={multiIds}
                              defaultValue={nGraphic[field]}
                              onChange={event => changeListener(event, field)}
                            />
                          )
                        }
                      })}
                    </TableBody>
                  </Table>
              )})}
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}

const createImagesTable = (listOfImages, changeListener, onSave) => {
  return (
    <Box mx={3} my={2}>
      <Grid container spacing={3} justify='center' alignItems='center'>
        {listOfImages.map(image => {
          return (
            <>
              <Grid item xs={6}>
                <CardMedia
                  component="img"
                  height="140"
                  image={image.url}
                />
              </Grid>
              
              <Grid item xs={6}>
                <Typography align="left" variant="h6">{convertToSentenceCase(image.id)}</Typography>
                <StyledValidators.AdminTextField
                  name={image.id}
                  defaultValue={image.url}
                  onChange={event => changeListener(event, 'image')}/>
              </Grid>
            </>
          )
        })}
      </Grid>

      <br/>
      <Button 
        fullWidth 
        variant="contained" 
        color="secondary"
        onClick={onSave}>
          Save
      </Button>

    </Box>
  )
}


const createBatchUpdates = async (firebase, inputState) => {
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
  batch.commit();
}

export default withFirebase(Settings);
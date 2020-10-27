import React, { Fragment, useState } from "react";
import { Box, Button, CardMedia, Collapse, Grid, IconButton, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@material-ui/core";
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
          <TableCell colSpan={6}/>
          {listOfGraphics.map(graphic => {
            const checkForMultiGraphics = multiGraphicsIds.some(id => graphic.id.includes(id));
            if (!checkForMultiGraphics) {
              return createMediaRow(graphic, changeListener)
            } else {
              return createNestedMediaRow(graphic, collapseState, collapseListener, changeListener)
            }
          })}
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

  const editableFields = Object.entries(graphic).reduce((a, [key, value]) => (key !== 'image' && key !== 'location' && value ? (a[key] = value, a) : a), {});

  return (
    <TableRow hover key={editableFields.id}>
      <TableCell variant='head'>{editableFields.id}</TableCell>
      <TableCell padding='none'>
        {Object.keys(editableFields).map(field => {
          if (!field || field === 'id') {
            return;
          } else {
            return (
              <StyledValidators.AdminTextField
                multiline
                label={convertToSentenceCase(field)}
                key={editableFields.id + '-' + field}
                name={editableFields.id}
                defaultValue={editableFields[field]}
                onChange={event => changeListener(event, field)}/>
            )
          }
        })}
      </TableCell>
    </TableRow>
  )
}

const createNestedMediaRow = (graphic, collapseState, collapseListener, changeListener) => {
  const nestedGraphics = Object.entries(graphic).reduce((a, [k, v]) => (typeof v !== 'string' ? (a[k] = v, a) : a), {});
  const sortedGraphics = Object.values(nestedGraphics).sort((a ,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));

  return (
    <Fragment key={graphic.id}>
      <TableRow hover id={graphic.id} onClick={collapseListener}>
        <TableCell variant='head'>{graphic.id}</TableCell>
        <TableCell colSpan={4} align='right'>
          <IconButton>
            {collapseState[graphic.id] ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell padding='none' colSpan={6} style={{ paddingLeft: 40 }}>
          <Collapse in={collapseState[graphic.id]} timeout="auto" unmountOnExit>
            <Table>
              {sortedGraphics.map((nGraphic, i) => {
                const multiIds = JSON.stringify({outer: graphic.id, inner: nGraphic.id});
                  return (
                    <TableRow>
                      <TableCell variant='head'>{nGraphic.id}</TableCell>
                      <TableCell>
                        {Object.keys(nGraphic).map(field => {
                          if (!nGraphic[field] || field === 'id' || field === 'image') {
                            return;
                          } else {
                            return (
                              <StyledValidators.AdminTextField
                                multiline
                                label={convertToSentenceCase(field)}
                                key={nGraphic.id + '-' + field}
                                name={multiIds}
                                defaultValue={nGraphic[field]}
                                onChange={event => changeListener(event, field)}/>
                            )
                          }
                        })}
                      </TableCell>
                    </TableRow>
                )})}
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}

const createImagesTable = (listOfImages, changeListener, onSave) => {
  return (
    <Box mx={3} my={3} pt={2}>
      <Grid container spacing={3} justify='center' alignItems='center'>
        {listOfImages.map((image, i) => {
          let label = convertToSentenceCase(image.id);
          if (image.id.includes('GFB')) {
            label = `Goose Feature Board ${image.id.slice(-1)}`;
          } else if (image.id.includes('HFB')) {
            label = `Home Feature Board ${image.id.slice(-1)}`;
          }

          return (
            <Fragment key={i}>
              <Grid item xs={6}>
                <CardMedia component="img" height="140" image={image.url}/>
              </Grid>
              
              <Grid item xs={6}>
                <Typography align="left" variant="h6">{label}</Typography>
                  <StyledValidators.AdminTextField
                    name={image.id}
                    defaultValue={image.url}
                    onChange={event => changeListener(event, 'image')}/>
              </Grid>
            </Fragment>
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
  const batch = firebase.batch();
  await Object.keys(inputState).map(inputCategory => {
    const { inputRef, inputValue, inputType } = inputState[inputCategory];

    const checkNestedGraphics = inputCategory.includes('GFB') || inputCategory.includes('HFB');
    if (checkNestedGraphics) {
      const docRef = inputCategory.includes('GFB') ? firebase.graphic(`gooseFeatureBoard`) : firebase.graphic(`homeFeatureBoard`);
      batch.update(docRef, {[`${inputCategory}.${inputType}`]: inputValue});
    } else {
      const docRef = firebase.graphic(inputCategory);
      inputRef ? batch.update(docRef, {[`${inputRef}.${inputType}`]: inputValue}) : batch.update(docRef, {[inputType]: inputValue});
    }
  });
  batch.commit();
}

export default withFirebase(Settings);
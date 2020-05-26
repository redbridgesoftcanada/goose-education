import React, { Fragment, useState } from "react";
import { Collapse, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { withFirebase } from "../../components/firebase";

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
  const { gooseCards, gooseFeatureBoard, homeFeatureBoard, homestayBannerProcess, networkingCards } = open;

  const handleClick = event => {
    setOpen(prevState => ({...prevState, [event.currentTarget.id]: !open[event.currentTarget.id]
  }))}

  const templateInputFields = (title, subtitle, caption, image) => {
    return (
      <>
        <TableCell><TextField {...(title) ? {variant: "outlined"} : {variant: "filled", color: "secondary", disabled: true}} defaultValue={title}/></TableCell>
        <TableCell><TextField {...(subtitle) ? {variant: "outlined"} : {variant: "filled", color: "secondary", disabled: true}} defaultValue={subtitle}/></TableCell>
        <TableCell><TextField {...(caption) ? {variant: "outlined"} : {variant: "filled", color: "secondary", disabled: true}} defaultValue={caption}/></TableCell>
        <TableCell><TextField {...(image) ? {variant: "outlined"} : {variant: "filled", color: "secondary", disabled: true}} defaultValue={image}/></TableCell>
      </>
  )}

  const generateSettingInputFields = listOfGraphics => {
    return listOfGraphics.map((graphic, i) => {
      const multiGraphicsIds = ['gooseCards', 'gooseFeatureBoard', 'homeFeatureBoard', 'homestayBannerProcess', 'networkingCards'];
      const checkForMultiGraphics = multiGraphicsIds.some(id => graphic.id.includes(id));

      if (checkForMultiGraphics) {
        return (
          <Fragment key={i}>
            <TableRow hover id={graphic.id} onClick={handleClick}>
              <TableCell>{graphic.id}</TableCell>
              <TableCell/>
              <TableCell/>
              <TableCell/>
              <TableCell/>
              <TableCell>{open[graphic.id] ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={1}/>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                <Collapse in={open[graphic.id]} timeout="auto" unmountOnExit>
                  {Object.values(graphic).map((innerGraphic, i) => {
                    if (typeof innerGraphic !== 'string') {
                      return (
                        <Table key={i}>
                          <TableBody>
                            <TableRow>
                              {templateInputFields(innerGraphic.title, innerGraphic.subtitle, innerGraphic.caption, innerGraphic.image)}
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
            {templateInputFields(graphic.title, graphic.subtitle, graphic.caption, graphic.image)}
            <TableCell/>
          </TableRow>
      )}
    });
  }

  return (
    <Table size="medium">
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
          {generateSettingInputFields(listOfGraphics)}
        </TableBody>
    </Table>
  )
}

export default withFirebase(Settings);
import React, { useState } from "react";
import { FormLabel } from "@material-ui/core";
import { withFirebase } from "../../components/firebase";

function Settings(props) {
  const { state, dispatch, listOfGraphics, firebase } = props;

  // (id) gooseCards, gooseFeatureBoard, homeFeatureBoard, homestayBannerProcess, networkingCards 

  return (
    <>
      {listOfGraphics.map((graphic, i) => {
        return (
          <FormLabel component="legend">{graphic.id}</FormLabel>
        )
      })}
    </>
  )
}

export default withFirebase(Settings);
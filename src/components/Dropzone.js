import React from 'react';
import { DropzoneArea } from 'material-ui-dropzone';

export default function Dropzone(props) {
    const { handleChange } = props;
    return (
        <DropzoneArea onChange={handleChange}/>
    );
}
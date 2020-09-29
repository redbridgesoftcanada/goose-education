import React from 'react';
import { Button, Dialog, DialogTitle, MenuItem, TextField, Typography } from '@material-ui/core';
import { CheckOutlined, CloseOutlined } from '@material-ui/icons';
import { FILTER_OPTIONS, FILTER_CONJUNCTIONS } from '../constants/constants';
import useStyles from '../styles/constants';

const errorStyles = {
    fontSize: '0.75rem',
    color: '#bf1f22',
    textAlign: 'center'
}

export default function FilterDialog(props) {
    const classes = useStyles(props, 'buttons'); 
    const { filterOpen, filterOption, filterConjunction, filterQuery, error, handleSearchQuery, handleSearchClick, onClose } = props;

    const generateDialogField = (name, value, label, children) => 
        <TextField className={classes.menu}
            select
            label={label}
            name={name}
            value={value}
            onChange={handleSearchQuery}
            margin="normal">
                {children}
        </TextField>

    return (
      <Dialog onClose={onClose} open={filterOpen}>
        <DialogTitle className={classes.title}>Filter</DialogTitle>
        <div className={classes.container}>
            {generateDialogField('filterOption', filterOption, 'Content', listOfOptions)}
            {generateDialogField('filterConjunction', filterConjunction, 'And/Or', listOfConjunctions)}
            <TextField className={classes.filterSearch}
                placeholder="Search Term"
                type="search"
                name="filterQuery"
                value={filterQuery}
                variant="outlined"
                onChange={handleSearchQuery}
                margin="dense"/>
        </div>
        {error && <Typography style={{...errorStyles}}>{error}</Typography>}
        <div className={classes.container}>
            <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                startIcon={<CheckOutlined/>}
                onClick={handleSearchClick} >
                Filter
            </Button>
            <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                startIcon={<CloseOutlined />}
                onClick={onClose}>
                Close
            </Button>
        </div>
      </Dialog>
    )
}

const listOfOptions = FILTER_OPTIONS.map((option, i) => (
    <MenuItem key={i} value={option}>
        {option}
    </MenuItem>
));

const listOfConjunctions = FILTER_CONJUNCTIONS.map((conjunction, i) => (
    <MenuItem key={i} value={conjunction}>
        {conjunction}
    </MenuItem>
));
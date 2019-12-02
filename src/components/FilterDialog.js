import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, MenuItem, TextField, makeStyles } from '@material-ui/core';
import { CheckOutlined, CloseOutlined } from '@material-ui/icons';

const filterOptions = ['Title', 'Contents', 'Title + Contents', 'Member ID', 'Member ID (코)', 'Author', 'Author (코)'];

const additiveOptions = ["And", "Or"];

const useStyles = makeStyles(theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      maxWidth: '285px',
    },
    title: {
        textAlign: 'center'
    },
    menu: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    search: {
      width: '80%',
      padding: theme.spacing(1, 1)
    },
    button: {
        margin: theme.spacing(1),
        color: theme.palette.common.white,
        backgroundColor: theme.palette.secondary.main,
    },
  }));

function FilterDialog(props) {
    const classes = useStyles(); 
    const { onClose, open } = props;

    const [option, setOption] = useState('title');

    const handleChange = (event) => {
        setOption(event.target.value);
    };
  
    return (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle className={classes.title}>Filter</DialogTitle>
        <div className={classes.container}>
            <TextField
            select
            label="Content"
            className={classes.menu}
            value={option}
            onChange={handleChange}
            margin="normal"
            >
            {filterOptions.map(option => (
                <MenuItem key={option} value={option}>
                {option}
                </MenuItem>
            ))}
            </TextField>
            <TextField
                select
                label="And/Or"
                className={classes.menu}
                value={option}
                onChange={handleChange}
                margin="normal"
            >
                {additiveOptions.map(option => (
                    <MenuItem key={option} value={option}>
                    {option}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                placeholder="Search Term"
                type="search"
                className={classes.search}
                margin="dense"
                variant="outlined"
            />
        </div>
        <div className={classes.container}>
            <Button
                variant="contained"
                // color="secondary"
                className={classes.button}
                startIcon={<CheckOutlined />}
            >
                Search
            </Button>
            <Button
                variant="contained"
                // color="secondary"
                className={classes.button}
                startIcon={<CloseOutlined />}
                onClick={onClose}
            >
                Close
            </Button>
        </div>

      </Dialog>
    )
}

export default FilterDialog;
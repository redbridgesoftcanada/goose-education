import React from 'react';
import { Button, Dialog, DialogTitle, MenuItem, TextField, makeStyles, Typography } from '@material-ui/core';
import { CheckOutlined, CloseOutlined } from '@material-ui/icons';

const filterOptions = ['Title', 'Contents', 'Title + Contents', 'Author'];   // 'Author (코)', 'Member ID', 'Member ID (코)';
const filterConjunctions = ["And", "Or"];

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
    const { handleSearchQuery, handleSearchClick, onClose } = props;
    const { filterOpen, filterOption, filterConjunction, filterQuery, error, isError } = props.filterProps;
  
    return (
      <Dialog onClose={onClose} open={filterOpen}>
        <DialogTitle className={classes.title}>Filter</DialogTitle>
        <div className={classes.container}>
            <TextField className={classes.menu}
            select
            label="Content"
            name="filterOption"
            value={filterOption}
            onChange={handleSearchQuery}
            margin="normal"
            >
            {filterOptions.map((option, i) => (
                <MenuItem key={i} value={option}>
                {option}
                </MenuItem>
            ))}
            </TextField>
            <TextField className={classes.menu}
                select
                label="And/Or"
                name="filterConjunction"
                value={filterConjunction}
                onChange={handleSearchQuery}
                margin="normal"
            >
                {filterConjunctions.map((option, i) => (
                    <MenuItem key={i} value={option}>
                    {option}
                    </MenuItem>
                ))}
            </TextField>
            <TextField className={classes.search}
                placeholder="Search Term"
                type="search"
                name="filterQuery"
                value={filterQuery}
                variant="outlined"
                onChange={handleSearchQuery}
                margin="dense"
            />
        </div>
        <div className={classes.container}>
        {(isError) && <Typography>{error}</Typography>}
            <Button
                variant="contained"
                className={classes.button}
                startIcon={<CheckOutlined/>}
                onClick={handleSearchClick} 
            >
                Search
            </Button>
            <Button
                variant="contained"
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
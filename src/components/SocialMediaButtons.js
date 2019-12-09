import React from 'react';
import { Grid, IconButton, Link, Tooltip, Typography, withStyles } from '@material-ui/core';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';

const styles = theme => ({
    title: {
        marginTop: theme.spacing(5),
    },
    button: {
        "&:hover": {
          backgroundColor: "transparent"
        }
    },
    email: {
        fontSize: '35px',
    },
    image: {
        width: '2rem',
    },
});

function SocialMediaButtons(props) {
    const { classes, title, description } = props
    return (
        <>
            <Typography variant='h4' className={classes.title}>
                { title }
            </Typography>
            <Typography variant='subtitle2'>
                { description }
            </Typography>
            <Grid container className={classes.title}>
                <Grid item xs={3} md={3}>
                    <Tooltip title='goose.education@gmail.com' placement='top'>
                        <IconButton className={classes.button}>
                            <EmailOutlinedIcon className={classes.email}/>
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item xs={3} md={3}>
                    <Tooltip title='Kakao' placement='top'>
                        <IconButton 
                            className={classes.button}
                            component={Link}
                            href='https://pf.kakao.com/_hNspC'
                            target='_blank'>
                            <img src={require('../assets/img/kakaolink_btn_small.png')} alt='Kakao Talk'/>
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item xs={3} md={3}>
                    <Tooltip title='Instagram' placement='top'>
                        <IconButton 
                        className={classes.button}
                        component={Link}
                        href='https://www.instagram.com/gooseedu/'
                        target='_blank'>
                            <img className={classes.image} src={require('../assets/img/glyph-logo_May2016.png')} alt='Instagram'/>
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item xs={3} md={3}>
                    <Tooltip title='Facebook' placement='top'>
                        <IconButton 
                        className={classes.button}
                        component={Link}
                        href='https://www.facebook.com/gooseedu'
                        target='_blank'>
                            <img className={classes.image} src={require('../assets/img/f_logo_RGB-Blue_250.png')} alt='Facebook'/>
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        </>
    )
}

export default withStyles(styles)(SocialMediaButtons);
import React from 'react';
import { Grid, IconButton, Link, Tooltip, Typography } from '@material-ui/core';
import { EmailOutlined, Facebook, Instagram } from '@material-ui/icons';
import { ReactComponent as Kakao } from '../assets/img/kakao-talk.svg';
import useStyles from '../styles/constants';

export default function SocialMediaButtons(props) {
    const { title, description } = props
    const classes = useStyles(props, 'buttons');
    
    return (
        <>
            <Typography variant='h4' className={classes.toolTipHeader}>{title}</Typography>
            <Typography variant='subtitle2'>{description}</Typography>
            <Grid container>
                {customButtonToolTip(classes, 'goose.education@gmail.com', <EmailOutlined fontSize='large'/>)}
                {customButtonToolTip(classes, 'Kakao', <Kakao fontSize='large'/>)}
                {customButtonToolTip(classes, 'Instagram', <Instagram fontSize='large'/>)}
                {customButtonToolTip(classes, 'Facebook', <Facebook fontSize='large'/>)}
            </Grid>
        </>
    )
}

function customButtonToolTip(classes, label, icon) {
    
    const { footerRight } = JSON.parse(localStorage.getItem('footer'));
    const { FR1, FR2, FR3 } = footerRight;

    const isEmail = label === 'goose.education@gmail.com';

    const configIconButton = { component: Link, target: '_blank' }
    switch (label) {
        case 'Instagram':
            configIconButton.href = FR1.image;
            break;

        case 'Facebook': 
            configIconButton.href = FR2.image;
            break;

        case 'Kakao':
            configIconButton.href = FR3.image;
            break;
    }
    
    return (
        <Grid item xs={3} md={3}>
            <Tooltip title={label} placement='top'>
                <IconButton className={classes.toolTipButton}
                    {...!isEmail ? configIconButton : { href: `mailto:${label}` }}>
                        {icon}
                </IconButton>
            </Tooltip>
        </Grid>
    );
}
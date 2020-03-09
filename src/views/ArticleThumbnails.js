import React, { useEffect, useState } from 'react';
import { Container, Grid, IconButton, Typography, withStyles } from '@material-ui/core';
import { ValidatorForm } from 'react-material-ui-form-validator';
import AddIcon from '@material-ui/icons/Add';
import { Redirect } from "react-router-dom";
import { AuthUserContext } from '../components/session';
import ArticleDialog from '../components/ArticleDialog';

const styles = theme => ({
    root: {
        overflow: 'hidden',
        backgroundColor: theme.palette.primary.dark,
    },
    container: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(15),
        display: 'flex',
        position: 'relative',
    },
    thumbnail: {
        "&:hover": {
            cursor: 'pointer',
        },
    },
    image: {
        display: 'block',
        border: '0',
        width: 'auto',
        maxWidth: '100%',
        height: 'auto',
        margin: '0px auto',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(0, 5),
    },
    title: {
        color: theme.palette.common.white,
        marginTop: theme.spacing(7),
        marginBottom: theme.spacing(2),
    },
    description: {
        color: theme.palette.common.white,
    },
    button: {
        color: theme.palette.common.white,
        marginTop: '1.5em'
    },
    header: {
        display: 'flex',
        justifyContent: 'center',
    }
});

function ProductValues(props) {
    const { classes, featuredArticles } = props;
    
    const INITIAL_STATE = {
        redirectPath: {},
        selectedArticleDialogOpen: false,
        selectedArticle: null,
    }
    
    const [ state, setState ] = useState(INITIAL_STATE);
    const { redirectPath, selectedArticleDialogOpen, selectedArticle } = state;

    const handleIconClick = () => {
        setState({ 
            ...state,
            redirectPath: { pathname: '/networking', state: { title: 'Networking' } } 
        });
    }
    const handleArticleClick = event => {
        const selectedArticle = featuredArticles.find(article => article.id.toString() === event.currentTarget.id);
        setState({ 
            ...state, 
            selectedArticle,
            selectedArticleDialogOpen: true
        });
    }
    const handleArticleClose = () => setState({ 
        ...state, 
        selectedArticle: null,
        selectedArticleDialogOpen: false
    });

    return (
        <section className={classes.root}>
            <div className={classes.header}>
                <Typography variant="h4" className={classes.title}>
                    Networking
                </Typography>
                {(Object.entries(redirectPath).length) ? 
                    <Redirect push to={redirectPath}/>
                    :
                    <IconButton id='School Information' onClick={handleIconClick} className={classes.button}>
                        <AddIcon />
                    </IconButton>
                }
            </div>
            <Typography variant="body2" className={classes.description}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
            <Container className={classes.container}>
                <Grid container spacing={2}>
                    {featuredArticles.map(article => {
                        return (
                            <Grid item key={article.id} xs={12} md={3}>
                                <div className={classes.thumbnail} id={article.id} onClick={handleArticleClick}>
                                    <img
                                        className={classes.image}
                                        src={require(`../assets/img/${article.image}`)}
                                        alt="article-thumbnail"
                                    />
                                </div>
                            </Grid>
                        )
                    })}
                </Grid>
            </Container>
            <AuthUserContext.Consumer>
                {authUser => authUser &&
                    <ArticleDialog 
                    authUser={authUser}
                    articleOpen={selectedArticleDialogOpen} 
                    onClose={handleArticleClose} 
                    article={selectedArticle}/>
                }
            </AuthUserContext.Consumer>
        </section>
    );
}

export default withStyles(styles)(ProductValues);
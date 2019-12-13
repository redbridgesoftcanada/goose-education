import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, IconButton, Typography, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Redirect } from "react-router-dom";

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
    
    const [state, setState] = useState({
        articleOpen: false,
        article: null,
    });

    const { articleOpen, article } = state;
    
    // // COMPONENTS > Article Dialog Modal 
    const handleArticleClick = event => setState({...state, articleOpen: true, article: featuredArticles.find(article => article.id.toString() === event.currentTarget.id)});
    const handleArticleClose = () => setState({...state, articleOpen: false, article: null});
    
    const [pathname, setPathname] = useState({});
    
    const handleClick = () => setPathname({
        pathname: '/networking', 
        state: {
            title: 'Networking',
        }
    });

    return (
        <section className={classes.root}>
            <div className={classes.header}>
                <Typography variant="h4" className={classes.title}>
                    Networking
                </Typography>
                {
                (Object.entries(pathname).length) ? 
                    <Redirect push to={pathname}/>
                    :
                    <IconButton id='School Information' onClick={handleClick} className={classes.button}>
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
            <ArticleDialog articleOpen={articleOpen} onClose={handleArticleClose} article={article}/>
        </section>
    );
}

ProductValues.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductValues);
import React, { useState } from 'react';
import { Container, Grid, IconButton, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Redirect } from "react-router-dom";
import { AuthUserContext } from '../components/session';
import ArticleDialog from '../components/ArticleDialog';
import { useStyles } from '../styles/home';

export default function FeatureArticles(props) {
    const classes = useStyles(props.classes, 'featureArticles');
    const { featuredArticles, wrapperText } = props;

    const [ redirectPath, setRedirectPath ] = useState({});
    const [ article, setArticle ] = useState({ selected: null, dialogOpen: false });

    const handleIconClick = () => {
        setRedirectPath({ 
            pathname: '/networking', 
            state: { title: 'Networking', selected: 0 } 
        });
    }

    const handleArticleClick = event => {
        const selectedArticle = featuredArticles.find(article => article.id.toString() === event.currentTarget.id);
        setArticle({ selected: selectedArticle, dialogOpen: true });
    }

    const handleArticleClose = () => setArticle({ selected: null, dialogOpen: false });

    return (
        <section className={classes.root}>
            <div className={classes.header}>
                <Typography className={classes.title}>{wrapperText.title}</Typography>
                {(Object.entries(redirectPath).length) ? 
                    <Redirect push to={redirectPath}/>
                    :
                    <IconButton className={classes.button} onClick={handleIconClick}>
                        <AddIcon />
                    </IconButton>
                }
            </div>
            <Typography className={classes.description}>{wrapperText.caption}</Typography>
            <Grid container className={classes.imageWrapper}>
                <Grid container item spacing={1}>
                    {featuredArticles.map(feature => {
                        return (
                            <Grid item key={feature.id} xs={12} sm={6} md={3}>
                                <div id={feature.id} onClick={handleArticleClick}>
                                    <img
                                        className={classes.image}
                                        src={require(`../assets/img/${feature.image}`)}
                                        alt="article-thumbnail"
                                    />
                                </div>
                            </Grid>
                        )
                    })}
                </Grid>
            </Grid>
            <AuthUserContext.Consumer>
                {authUser => 
                    <ArticleDialog 
                    authUser={authUser}
                    article={article.selected}
                    articleOpen={article.dialogOpen} 
                    onClose={handleArticleClose}/>
                }
            </AuthUserContext.Consumer>
        </section>
    );
}
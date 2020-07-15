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
        const networkingPath = { 
            pathname: '/networking', 
            state: { title: 'Networking', selected: 0 } 
        }
        setRedirectPath(networkingPath);
    }

    const handleArticleClick = event => {
        const selectedArticle = featuredArticles.find(article => article.id.toString() === event.currentTarget.id);
        setArticle({ selected: selectedArticle, dialogOpen: true });
    }

    const handleArticleClose = () => setArticle({ selected: null, dialogOpen: false });

    return (
        <section className={classes.root}>
            <div className={classes.header}>
                <Typography className={classes.title} variant="h4">{wrapperText.title}</Typography>
                {(Object.entries(redirectPath).length) ? 
                    <Redirect push to={redirectPath}/>
                    :
                    <IconButton className={classes.button} onClick={handleIconClick}>
                        <AddIcon />
                    </IconButton>
                }
            </div>
            <Typography className={classes.description} variant="body2">{wrapperText.caption}</Typography>
            <Container className={classes.imageWrapper}>
                <Grid container spacing={2}>
                    {featuredArticles.map(feature => {
                        return (
                            <Grid item key={feature.id} xs={12} md={3}>
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
            </Container>
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
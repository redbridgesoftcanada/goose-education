import React from 'react';
import { Box, Dialog, DialogContent, DialogContentText, DialogTitle, Grid, withStyles } from '@material-ui/core';
import { AccountCircleOutlined, LocalOfferOutlined, ChatBubbleOutlineOutlined, VisibilityOutlined, ScheduleOutlined } from '@material-ui/icons';

import Typography from '../components/onePirate/Typography';

const styles = theme => ({
  meta: {
    background: theme.palette.secondary.light,
    color: 'rgba(0, 0, 0, 0.54)',
    opacity: 0.9,
  },
  left: {
    float: 'left',
    display: 'flex',
    justifyContent: 'space-evenly'
  },
  right: {
    float: 'right',
    display: 'flex',
  },
  item: {
    paddingRight: theme.spacing(1),
  },
  image: {
    display: 'block',
    border: '0',
    width: '100%',
    maxWidth: '100%',
    height: 'auto',
  },
  description: {
    marginTop: theme.spacing(2),
  },
});

function ArticleDialog(props) {
  const { article, classes, articleOpen, onClose } = props;

  return (
      <Dialog open={articleOpen} scroll={'paper'} onClose={onClose}>
        <DialogTitle>{article ? article.title : ''}</DialogTitle>
        <Box px={3} py={2} className={classes.meta}>
          <div className={classes.left}>
            <Grid container spacing={1}>
              <Grid item >
                <AccountCircleOutlined/>
              </Grid>
              <Grid item>
                <Typography variant='body2' className={classes.item}>{article ? article.author : ''}</Typography>
              </Grid>
              <Grid item >
                <LocalOfferOutlined/>
              </Grid>
              <Grid item>
                <Typography variant='body2' className={classes.item}>{article ? article.tag : ''}</Typography>
              </Grid>
              <Grid item >
                <ChatBubbleOutlineOutlined/>
              </Grid>
              <Grid item>
                <Typography variant='body2' className={classes.item}>{article ? article.comments.length : ''}</Typography>
              </Grid>
              <Grid item >
                <VisibilityOutlined/>
              </Grid>
              <Grid item>
                <Typography variant='body2' className={classes.item}>{article ? article.views : ''}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className={classes.right}>
            <Grid container spacing={1}>
              <Grid item>
                <ScheduleOutlined/>
              </Grid>
              <Grid item>
                <Typography variant='body2'>{article ? article.date : ''}</Typography>
              </Grid>
            </Grid>
          </div>
        </Box>
        <DialogContent dividers={true}>
          <img className={classes.image} src={require(`../assets/img/${article ? article.image : 'flogo.png'}`)} alt="article cover image"/>
          <DialogContentText className={classes.description}>
            {article ? article.description : ''}
          </DialogContentText>
        </DialogContent>
        <DialogContent dividers={true}>
          <DialogContentText>
            {article ? article.comments.length : ''} Comments
          </DialogContentText>
        </DialogContent>
      </Dialog>
  );
}

export default withStyles(styles)(ArticleDialog);
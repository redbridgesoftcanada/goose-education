import React, { Fragment, useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, Fab, Grid, withStyles } from '@material-ui/core';
import { AccountCircleOutlined, LocalOfferOutlined, ChatBubbleOutlineOutlined, VisibilityOutlined, ScheduleOutlined, PrintOutlined } from '@material-ui/icons';
import ReactQuill from 'react-quill';
import parse from 'html-react-parser';
import { format } from 'date-fns';
import Typography from '../components/onePirate/Typography';
import { withFirebase } from '../components/firebase';

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
  print: {
    float: 'right'
  },
});

function printDiv(divName) {
  let printContents = document.getElementById(divName).innerHTML;
  let originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;

  setTimeout(()=> {
    window.print();
  }, 500);

  document.body.innerHTML = originalContents;
}

function ArticleDialog(props) {
  const { authUser, classes, firebase, history, article, articleOpen, onClose } = props;
  const [ comment, setComment ] = useState('');

  if (!article) {
    return null;
  }

  const onSubmit = event => {
    firebase.article(article.id).update({ 
        "comments": firebase.updateArray().arrayUnion({
            authorDisplayName: authUser.displayName,
            authorID: authUser.uid,
            description: comment,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }) 
    })
    .then(() => { 
      setComment('');
      onClose();
      history.push('/networking');
    });
    // .catch(error => dispatch({ type: 'error', payload: error }))
    event.preventDefault();
  }

  return (
      <Dialog open={articleOpen} scroll='paper' onClose={onClose} id='printableArea' fullWidth maxWidth='md'>
        <DialogTitle>{article ? article.title : ''}</DialogTitle>
        <Box px={3} py={2} className={classes.meta}>
          <div className={classes.left}>
            <Grid container spacing={1}>
              <Grid item >
                <AccountCircleOutlined/>
              </Grid>
              <Grid item>
                <Typography variant='body2' className={classes.item}>{article.authorDisplayName}</Typography>
              </Grid>
              {article.tag &&
              <>
                <Grid item >
                  <LocalOfferOutlined/>
                </Grid>
                <Grid item>
                  <Typography variant='body2' className={classes.item}>{article.tag}</Typography>
                </Grid>
              </>
              }
              <Grid item >
                <ChatBubbleOutlineOutlined/>
              </Grid>
              <Grid item>
                <Typography variant='body2' className={classes.item}>{article.comments.length}</Typography>
              </Grid>
              <Grid item >
                <VisibilityOutlined/>
              </Grid>
              <Grid item>
                <Typography variant='body2' className={classes.item}>{article.views}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className={classes.right}>
            <Grid container spacing={1}>
              <Grid item>
                <ScheduleOutlined/>
              </Grid>
              <Grid item>
                <Typography variant='body2'>{article.createdAt && article.updatedAt ? format(article.updatedAt, 'Pp') : format(article.createdAt, 'Pp')}</Typography>
              </Grid>
            </Grid>
          </div>
        </Box>
        <DialogContent dividers>
          <img className={classes.image} 
          src={(article.image.includes('firebase')) ? article.image : require(`../assets/img/${article.image}`)} 
          alt="article cover"/>
          <DialogContent className={classes.description}>
            {parse(article.description)}
          </DialogContent>
          <Fab size="small" color="secondary" className={classes.print} onClick={() => printDiv('printableArea')}>
            <PrintOutlined />
          </Fab>
          <br/><br/><br/>
          <Divider/>
          <br/>
          <DialogContentText>{article.comments.length} Comments</DialogContentText>
            { article.comments.length ? article.comments.map((comment, i) => {
              return (
                <Fragment key={i}>
                    <div className={classes.left}>
                        <Typography variant='body2' align='left' color='secondary'>{comment.authorDisplayName}</Typography>
                    </div>
                    <div className={classes.right}>
                        <Typography variant='body2' align='left'>
                            {(comment.updatedAt > comment.createdAt) ? format(comment.updatedAt, 'Pp') : format(comment.createdAt, 'Pp')}
                        </Typography>
                    </div>
                    <br/>
                    <div variant='body2' align='left'>{parse(comment.description)}</div>
                </Fragment>
              )
            })
          :
          <DialogContentText>There are currently no comments.</DialogContentText>
          }
          <br/>
          <div>
            <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>
              <ReactQuill 
              {...(!authUser ? { readOnly: true, placeholder:'Please Register or Login to Comment.' } : {} )}
              value={comment} 
              onChange={value => setComment(value)} />
              <Button disabled={!authUser} variant='contained' fullWidth color='secondary' type='submit'>Post</Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
  );
}

export default withStyles(styles)(withFirebase(ArticleDialog));
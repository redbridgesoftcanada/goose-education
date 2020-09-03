import React from 'react';
import { CardMedia, Dialog, DialogContent, DialogTitle, Grid, Typography } from '@material-ui/core';
import { AccountCircleOutlined, ScheduleOutlined } from '@material-ui/icons';
import parse from 'html-react-parser';
import { format, compareDesc } from 'date-fns';
import useStyles from '../styles/goose';

function ArticleDialog(props) {
  const classes = useStyles(props, 'tips');
  const { article, articleOpen, onClose } = props;

  if (!article) return null;

  return (
    <Dialog open={articleOpen} scroll='paper' onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>
        {article.title}
        <Grid container spacing={1} alignItems='flex-start' className={classes.metaContainer}>
          <Grid item><AccountCircleOutlined fontSize='small'/></Grid>
          <Grid item>
              <Typography variant='body2'>{article.authorDisplayName}</Typography>
          </Grid>
      
          <Grid item><ScheduleOutlined fontSize='small'/></Grid>
          <Grid item>
            <Typography variant='body2'>
              {format([article.createdAt, article.updatedAt].sort(compareDesc).pop(), 'P')}
            </Typography>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent dividers>
        {parse(article.description)}
        
        <CardMedia
          className={classes.tipImage}
          image={(article.image.includes('firebase')) ? article.image : require(`../assets/img/${article.image}`)}
          title='Tips Thumbnail'
        />
      </DialogContent>

    </Dialog>
  );
}

export default ArticleDialog;
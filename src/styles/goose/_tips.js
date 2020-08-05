import { makeStyles } from '@material-ui/core/styles';

export const tipsStyles = props => {
  return makeStyles(theme => ({
    root: {
      overflow: 'hidden',
    },

    image: {
      display: 'block',
      border: 0,
      width: 'auto',
      maxWidth: '100%',
      height: 'auto',
      margin: '0 auto',
    },

    item: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(3, 5),
      textAlign: 'left',
      "&:hover": {
          cursor: 'pointer',
      },
    },

    title: {
      marginTop: theme.spacing(7),
      marginBottom: theme.spacing(2),
    },

    body: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(1, 0),
    },

    articleTitle: {
      ...theme.typography.subtitle2,
    },

    articleDescription: {
      ...theme.typography.body2,
      width: `${theme.spacing(5)}vh`,

      [theme.breakpoints.between('sm', 'md')]: {
        width: `${theme.spacing(4)}vh`
      },
      [theme.breakpoints.between('xs', 'sm')]: {
        width: `${theme.spacing(6)}vh`
      }
    },

    search: {
      float: 'right',
      border: `2px solid ${theme.palette.secondary.main}`,
      borderRadius: 5,
      paddingLeft: theme.spacing(1),
    },

    searchButton: {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.secondary.main,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },

    filterButton: {
      float: 'left',
      color: theme.palette.primary.light,
      border: `2px solid ${theme.palette.primary.light}`,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      marginRight: theme.spacing(1),
    }
  }))(props)
}
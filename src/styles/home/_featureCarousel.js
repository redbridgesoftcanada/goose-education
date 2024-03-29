import { makeStyles } from '@material-ui/core/styles';

export const featureCarouselStyles = props => {
  return makeStyles(theme => ({
    featureCard: {
      maxWidth: 345,
      width: '50%',
      display: 'inline-block',
      position: 'absolute',
      top: '35%',
      right: '5%',
    },

    media: {
      height: 200,
      backgroundPosition:'center', 
      backgroundSize:'contain',
      '&:hover': {
        cursor: 'pointer',
        boxShadow: '0 0 0 2px white',
        border: '2px solid white'
      }
    },
    
    image: {
      objectFit: 'contain'
    }

  }))(props);
}
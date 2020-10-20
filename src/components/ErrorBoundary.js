import React from 'react';
import { Box, Button, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

// only class components can be error boundaries (React 16.14.0)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error: true };
  }

  render() {
    if (this.state.error) {
      return (
        <Box my={8}>
          <Typography variant='h4'>Oops! Something went wrong.</Typography>
          <Typography variant='body1'>The page you're looking for was moved, removed or may not exist.</Typography>
          <Button component={Link} to='/' color='secondary' variant='contained' onClick={() => this.setState({ error: false })}>
            Go Home
          </Button>
        </Box>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
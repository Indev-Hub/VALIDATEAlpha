import { useState, useEffect } from 'react';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { Box, Button, Container, Hidden, Skeleton, Typography } from '@material-ui/core';
import ArrowLeftIcon from '../icons/ArrowLeft';

const BrowseLayout = () => {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState('');

  useEffect(() => {
    (async () => {
      const response = await fetch('/static/browse/hero.svg');
      const blob = await response.blob();

      setImage(URL.createObjectURL(blob));
      setIsLoading(false);
    })();
  }, []);

  const urlLastSegment = pathname.slice(pathname.lastIndexOf('/') + 1);
  const isEntry = urlLastSegment === 'browse' || !urlLastSegment;
  const title = isEntry
    ? 'Browse components'
    : urlLastSegment
      .split('-')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ');

  return (
    <>
      <Box sx={{ backgroundColor: 'background.default' }}>
        <Container
          maxWidth="lg"
          sx={{
            alignItems: 'center',
            display: 'flex',
            py: 6
          }}
        >
          <div>
            {!isEntry && (
              <Button
                color="primary"
                component={RouterLink}
                startIcon={<ArrowLeftIcon />}
                sx={{ mb: 3 }}
                to="/browse"
                variant="text"
              >
                Back to components
              </Button>
            )}
            <Typography
              color="textPrimary"
              variant="h1"
            >
              {title}
            </Typography>
            {isEntry && (
              <Typography
                color="textSecondary"
                sx={{ mt: 1 }}
                variant="body1"
              >
                Browse through over 100 individual components and over 35 screens
              </Typography>
            )}
          </div>
          <Box sx={{ flexGrow: 1 }} />
          <Hidden smDown>
            {isLoading
              ? (
                <Skeleton
                  sx={{
                    borderRadius: 1,
                    height: 206.24,
                    width: 195.32
                  }}
                  variant="rectangular"
                />
              )
              : (
                <img
                  alt="Components"
                  src={image}
                />
              )}
          </Hidden>
        </Container>
      </Box>
      <Outlet />
    </>
  );
};

export default BrowseLayout;

import { useState, useEffect } from 'react';
import { Box, Card, Container, Grid, Link, Typography, Skeleton } from '@material-ui/core';

const HomeClients = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);

  useEffect(() => {
    (async () => {
      const responses = await Promise.all([
        fetch('/static/home/cta-rocket.svg'),
        fetch('/static/home/cta-code.svg')
      ]);

      const blobs = await Promise.all([
        responses[0].blob(),
        responses[1].blob()
      ]);

      setImages(blobs.map((blob) => URL.createObjectURL(blob)));
      setIsLoading(false);
    })();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        py: 15
      }}
      {...props}
    >
      <Container maxWidth="lg">
        <Typography
          align="center"
          color="textPrimary"
          sx={{ pb: 6 }}
          variant="h3"
        >
          Your clients will love it
        </Typography>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            md={6}
            xs={12}
          >
            <Card
              sx={{
                backgroundColor: 'primary.main',
                p: 2
              }}
            >
              <Grid
                alignItems="center"
                container
                spacing={2}
              >
                <Grid
                  item
                  sm={6}
                  xs={12}
                >
                  <Typography
                    sx={{ color: 'primary.contrastText' }}
                    variant="h5"
                  >
                    Documentation
                  </Typography>
                  <Typography
                    sx={{
                      color: 'primary.contrastText',
                      opacity: 0.56,
                      pb: 2
                    }}
                    variant="body2"
                  >
                    How to get started with VALIDATE
                  </Typography>
                  <Link
                    href="/docs"
                    sx={{ color: 'primary.contrastText' }}
                    variant="body2"
                  >
                    Getting started guide
                  </Link>
                </Grid>
                <Grid
                  item
                  sm={6}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                  xs={12}
                >
                  <Box
                    sx={{
                      maxWidth: {
                        sm: '100%',
                        xs: '60%'
                      }
                    }}
                  >
                    {isLoading
                      ? (
                        <Skeleton
                          sx={{
                            pt: '100%',
                            width: '100%'
                          }}
                          variant="rectangular"
                        />
                      )
                      : (
                        <img
                          alt="Rocket"
                          src={images[0]}
                          style={{ maxWidth: '100%' }}
                        />
                      )}
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
            <Card
              sx={{
                backgroundColor: 'info.main',
                p: 2
              }}
            >
              <Grid
                alignItems="center"
                container
                spacing={2}
              >
                <Grid
                  item
                  sm={6}
                  xs={12}
                >
                  <Typography
                    sx={{ color: 'primary.contrastText' }}
                    variant="h5"
                  >
                    See live preview
                  </Typography>
                  <Typography
                    sx={{
                      color: 'primary.contrastText',
                      opacity: 0.56,
                      pb: 2
                    }}
                    variant="body2"
                  >
                    Browse through numerous screens
                  </Typography>
                  <Link
                    href="/browse"
                    sx={{ color: 'primary.contrastText' }}
                    variant="body2"
                  >
                    Browse Components
                  </Link>
                </Grid>
                <Grid
                  item
                  sm={6}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                  xs={12}
                >
                  <Box
                    sx={{
                      maxWidth: {
                        sm: '100%',
                        xs: '50%'
                      }
                    }}
                  >
                    {isLoading
                      ? (
                        <Skeleton
                          sx={{
                            pt: '150.57%',
                            width: '100%'
                          }}
                          variant="rectangular"
                        />
                      )
                      : (
                        <img
                          alt="Code"
                          src={images[1]}
                          style={{ maxWidth: '100%' }}
                        />
                      )}
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomeClients;

import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography } from '@material-ui/core';
import { SocialPostAdd, SocialPostCard } from '../../components/dashboard/social';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import gtm from '../../lib/gtm';
import axios from '../../lib/axios';

const SocialFeed = () => {
  const isMountedRef = useIsMountedRef();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getPosts = useCallback(async () => {
    try {
      const response = await axios.get('/api/social/feed');

      if (isMountedRef.current) {
        setPosts(response.data.posts);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <>
      <Helmet>
        <title>Dashboard: Social Feed | VALIDATE</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <div>
            <Typography
              color="textSecondary"
              variant="overline"
            >
              Social Feed
            </Typography>
            <Typography
              color="textPrimary"
              variant="h5"
            >
              Here&apos;s what your connections posted
            </Typography>
          </div>
          <Box sx={{ mt: 3 }}>
            <SocialPostAdd />
          </Box>
          {posts.map((post) => (
            <Box
              key={post.id}
              sx={{ mt: 3 }}
            >
              <SocialPostCard
                authorAvatar={post.author.avatar}
                authorName={post.author.name}
                comments={post.comments}
                createdAt={post.createdAt}
                isLiked={post.isLiked}
                likes={post.likes}
                media={post.media}
                message={post.message}
              />
            </Box>
          ))}
        </Container>
      </Box>
    </>
  );
};

export default SocialFeed;

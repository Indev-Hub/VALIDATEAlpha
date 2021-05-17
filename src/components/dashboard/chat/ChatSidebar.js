import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Hidden, IconButton, Typography } from '@material-ui/core';
import CogIcon from '../../../icons/Cog';
import PencilAltIcon from '../../../icons/PencilAlt';
import axios from '../../../lib/axios';
import Scrollbar from '../../Scrollbar';
import ChatContactSearch from './ChatContactSearch';
import ChatThreadList from './ChatThreadList';

const ChatSidebar = () => {
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchClickAway = () => {
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  const handleSearchChange = async (event) => {
    try {
      const { value } = event.target;

      setSearchQuery(value);

      if (value) {
        const response = await axios.get('/api/chat/search', {
          params: {
            query: value
          }
        });

        setSearchResults(response.data.results);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchSelect = (result) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    navigate(`/dashboard/chat/${result.username}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        backgroundColor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        flexDirection: 'column',
        maxWidth: '100%',
        width: 300
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          height: 64,
          px: 2
        }}
      >
        <Hidden smDown>
          <Typography
            color="textPrimary"
            variant="h5"
          >
            Chats
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton>
            <CogIcon fontSize="small" />
          </IconButton>
        </Hidden>
        <IconButton
          component={RouterLink}
          to="/dashboard/chat/new"
        >
          <PencilAltIcon fontSize="small" />
        </IconButton>
      </Box>
      <Hidden smDown>
        <ChatContactSearch
          isFocused={isSearchFocused}
          onChange={handleSearchChange}
          onClickAway={handleSearchClickAway}
          onFocus={handleSearchFocus}
          onSelect={handleSearchSelect}
          query={searchQuery}
          results={searchResults}
        />
      </Hidden>
      <Scrollbar options={{ suppressScrollX: true }}>
        <Box sx={{ display: isSearchFocused ? 'none' : undefined }}>
          <ChatThreadList />
        </Box>
      </Scrollbar>
    </Box>
  );
};

export default ChatSidebar;

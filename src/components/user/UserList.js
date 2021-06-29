import { API, graphqlOperation } from 'aws-amplify';
import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core'
import { listUsers } from 'src/graphql/queries';
import { Refresh } from '@material-ui/icons';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [])

  const fetchUsers = async () => {
    try {
      const userData = await API.graphql(graphqlOperation(listUsers));
      const userList = userData.data.listUsers.items;
      console.log('user list', userList);
      setUsers(userList);
    } catch (error) {
      console.log('error on fetching users', error);
    }
  }
  return (
    <Box
      width="100%"
      alignItems="center"
      justify="center"
      justifyContent="center"
      margin="auto"
      marginY="50px"
    >
      <Grid container display="column" justifyContent="center">
        <Typography textAlign="center" variant="h4">VALIDATE User List</Typography>
        <IconButton
          onClick={fetchUsers}
        >
          <Refresh size="large" />
        </IconButton>
      </Grid>
      {users.map((user, idx) => {
        return <Paper variant="outlined" sx={{py: 2, px: 5, m: 1}} key={`user_${idx}`}>
          <Grid
            container
            display="flex"
            className="videoCard"
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item>
              <Typography className="UserName">{user.username}</Typography>
            </Grid>
            <Grid item>
              <Typography className="UserEmail">{user.email}</Typography>
            </Grid>
            <Grid item>
              <Typography className="UserId">{user.id}</Typography>
            </Grid>
          </Grid>
        </Paper>
      })}
    </Box>
  )
}

export default UserList;

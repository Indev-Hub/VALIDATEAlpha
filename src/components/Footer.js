import {
  Box,
  Container,
  // Divider,
  Grid,
  // Link,
  // List,
  // ListItem,
  // ListItemAvatar,
  // ListItemText,
  Typography
} from '@material-ui/core';
// import { alpha } from '@material-ui/core/styles';
// import MinusIcon from '../icons/Minus';
import Logo from '../images/IconBlack.png';

const Footer = (props) => (
  <Box
    sx={{
      backgroundColor: 'background.contrastPersist'
    }}
    {...props}
  >
    <Container maxWidth="lg">
      <Grid
        container
        spacing={0}
        justifyContent="center"
      >
        <Box
          sx={{
            pt: 2
          }}
        >
          <img src={Logo} alt="VALIDATE Logo" width="50px" />
        </Box>
        <Typography
          color="text.contrastPersist"
          variant="caption"
          textAlign="center"
          width="100%"
          sx={{
            pb: 2
          }}
        >
          All Rights Reserved.
        </Typography>
      </Grid>
    </Container>
  </Box>
);

export default Footer;

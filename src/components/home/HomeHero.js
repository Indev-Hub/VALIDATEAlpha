/* eslint-disable */
import { useState, useEffect } from "react";
// import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Link, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import awsconfig from "../../aws-exports";
import { ArrowCircleDown } from "@material-ui/icons";
// import CheckCircleIcon from '../../icons/CheckCircle';
// import FormSelect from '../form/FormSelect';
// import FormCheckbox from '../form/FormCheckbox';
import SearchMain from 'src/components/search/SearchMain';
import Logo from "../../images/VALIDATE PunchOut.png";
import Pinstripe from '../../assets/Pinstripe_Diagonal_Pattern_clip_art_hight.png'
import HomeTop from "./HomeTop";
// import HomeLanding from "./HomeLanding";
// import CreateFormDesign from '../form/CreateFormDesign';
// import UserList from '../user/UserList';
// import SubmissionList from '../submissions/submissionList';

Amplify.configure(awsconfig);

const HomeHero = (props) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState("");

  const loops = [
    'url("https://media.giphy.com/media/3o84U78CXEB2opZd4I/giphy.gif")',
    'url("https://media.giphy.com/media/4GWgNkOcQeubVjoc5P/giphy.gif")',
    'url("https://media.giphy.com/media/elzCnIQAjQMWA/giphy.gif")',
    'url("https://media.giphy.com/media/26ufmyrjQ4BmKN7xe/giphy.gif")',
    'url("https://media.giphy.com/media/3o7TKrOrms2QqxGchO/giphy.gif")',
    'url("https://media.giphy.com/media/3o6Ztgkkc0eeQUVt7y/giphy.gif")',
    'url("https://media.giphy.com/media/3oEduJkM0N7gYxZPBm/giphy.gif")',
    'url("https://media.giphy.com/media/uhBRkVfDoKwRW/giphy.gif")',
  ];
  const loop = loops[Math.floor(Math.random() * loops.length)];

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `/static/home/hero_${theme.palette.mode}.png`
      );
      const blob = await response.blob();

      setImage(URL.createObjectURL(blob));
      setIsLoading(false);
    })();
  }, [theme.palette.mode]);

  return (
    <Box
      sx={{
        // backgroundColor: "black",
        pt: 0,
        minHeight: 'calc(100vh - 160px)',
        overflow: 'hidden',
      }}
      {...props}
    >
      <HomeTop />
      <Container
        maxWidth="100%"
        sx={{
          // backgroundColor: "black",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          py: 4,
          px: {
            md: "130px !important",
          },
        }}
      >
        <Box width="100%" id="SearchMain">
          <SearchMain/>
        </Box>
        {/* <UserList /> */}
        {/* <SubmissionList /> */}
        {/* <CreateFormDesign width="760px" /> */}
      </Container>
    </Box>
  );
};

export default HomeHero;

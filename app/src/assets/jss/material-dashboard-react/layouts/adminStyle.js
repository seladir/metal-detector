import {
  transition,
  container
} from "assets/jss/material-dashboard-react.js";

import background from "assets/img/background.jpg";

const appStyle = theme => ({
  wrapper: {
    height: "100vh",
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
  },
  mainPanel: {
    [theme.breakpoints.up("md")]: {
      width: "100%"
    },
    overflow: "auto",
    ...transition,
    maxHeight: "100%",
    width: "100%",
    overflowScrolling: "touch",
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "15px",
    minHeight: "calc(100vh - 100px)"
  },
  container,
  map: {
    marginTop: "70px"
  }
});

export default appStyle;

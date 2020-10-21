import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
// core components
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

import { detectTrackFile, detectTrackLink } from "api/detection.js"

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  cardWrapper: {
    minWidth: "600px",
    minHeight: "400px",
    width: "40vw",
    height: "30vh"
  }
};

const useStyles = makeStyles(styles);

function DetectTrack() {
  console.log('aga')
  const [loading, setLoading] = React.useState(false);

  const inputFile = React.useRef(null)

  const history = useHistory();
  const uploadTrack = () => {
    inputFile.current.click();
  }

  const useLink = () => {
    const value = document.getElementById('youtube-link').value;
    console.log(value);
    setLoading(true);
    detectTrackLink(value)
      .then(result => result.json())
      .then((body) => {
        setLoading(false);
        if (body.success === true) {
          history.push(`/result/${body.id}`);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      })
  }

  function handleFile(e) {
    const file = e.target.files[0];
    setLoading(true);
    detectTrackFile(file)
      .then(result => result.json())
      .then((body) => {
        if (body.success === true) {
          history.push(`/result/${body.id}`);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      })
  }

  const classes = useStyles();
  return (
    <div className={classes.cardWrapper}>
      <Card profile>
        <CardBody profile>
          <h4 className={classes.cardTitle}>
            Upload a file or just drop a Youtube link:
          </h4>
          {loading && <div className="loader-wrapper"><div className="loader"></div></div>}
          {!loading && <div>
            <div style={{ float: "left" }}>
              <input type='file' id='file_input' ref={inputFile} onChange={handleFile} accept="audio/*" style={{display: 'none'}}/>
              <Button color="primary" onClick={uploadTrack}>
                Upload Track
              </Button>
            </div>
            <div style={{ float: "right" }}>
              <TextField id="youtube-link" label="Link"  style={{ marginRight: "10px" }} />
              <Button color="primary" onClick={useLink}>
                Use Link
              </Button>
            </div>
          </div>}
          <br/>
        </CardBody>
      </Card>
    </div>
  );
}

export default DetectTrack;

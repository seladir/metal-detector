import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
// core components
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

import { getDetectionResult } from "api/detection.js"

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

const statusTitles = {
  starting: 'Starting',
  processing: 'Processing',
  failed: 'Detection failed',
  not_found: 'Not found',
  finished: 'Finished',
}

const statusDescriptions = {
  starting: 'Detection begins.',
  processing: 'Detection in progress.',
  failed: 'Something went wrong during detection.',
  not_found: 'Request not found.',
  finished: 'Finished.',
}

const genres = [
  'Black metal',
  'Death metal',
  'Doom metal',
  'Gothic metal',
  'Heavy metal',
  'Power metal',
]

const useStyles = makeStyles(styles);

function updateStatus(id, handleChangeResult, handleChangeStatus, setLoading) {
  getDetectionResult(id)
    .then((response) => {
      console.log(response);
      if (response.status === 404) {
        handleChangeStatus('not_found');
        setLoading(false);
      } else {
        response.json()
          .then((data) => {
            console.log(data);
            if (data.status === 'finished') {
              const first = data.result.first;
              const second = data.result.second;
              let title = '';
              let description = '';
              if (first.probability > 0.25) {
                title = genres[first.genre];
              }
              if (first.probability > 0.5) {
                description = `It's definitely ${genres[first.genre]}!`;
              } else if (first.probability > 0.25) {
                description = `It seems it's ${genres[first.genre]}.`;
              // } else if (first.probability > 0.25) {
              //   description = `I'm not sure but it may be ${genres[first.genre]}.`;
              } else {
                title = 'Not a metal track'
                description = 'It doesn\'t seem to be metal.'
              }

              if (first.probability > 0.25 && second.probability && first.probability / second.probability < 2) {
                title += ` / ${genres[second.genre]}`;
                description += ` Also it may be similar to ${genres[second.genre]}.`
              }

              handleChangeResult({title, description})
            }
            handleChangeStatus(data.status)

            if (data.status === 'processing' || data.status === 'starting') {
              setTimeout(updateStatus, 1000, id, handleChangeResult, handleChangeStatus, setLoading)
            } else {
              setLoading(false);
            }
          })
          .catch(() => {
            handleChangeStatus('failed');
            setLoading(false);
          })
      }
    })
    .catch(() => {
      handleChangeStatus('failed');
      setLoading(false);
    })
}

function DetectionResult() {
  console.log('aga')
  const { id } = useParams();

  const [status, setStatus] = React.useState('starting');
  const [loading, setLoading] = React.useState(true);
  const [result, setResult] = React.useState({ title: '', description: '' });
  const handleChangeStatus = (value) => {
    if (value !== status) {
      setStatus(value);
    }
  };
  const handleChangeResult = (value) => {
    if (value.title !== result.title || value.description !== result.description) {
      setResult(value);
    }
  };

  const history = useHistory();
  const goMain = () => {
    history.push('/');
  }

  React.useEffect(() => {
    updateStatus(id, handleChangeResult, handleChangeStatus, setLoading)
  }, []);

  const classes = useStyles();
  return (
    <div className={classes.cardWrapper}>
      <Card profile>
        <CardBody profile>
          <h1 className={classes.cardTitle}>
            { status === 'finished' ? result.title : statusTitles[status] }
          </h1>
          <p className={classes.description}>
            { status === 'finished' ? result.description : statusDescriptions[status] }
          </p>
          <br/>
          {loading && <div className="loader-wrapper"><div className="loader"></div></div>}
          {!loading && <Button color="primary" onClick={goMain}>
            Try Other Track
          </Button>}
        </CardBody>
      </Card>
    </div>
  );
}

DetectionResult.whyDidYouRender = true;

export default DetectionResult;

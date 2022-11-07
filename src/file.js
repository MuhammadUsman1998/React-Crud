import { useState, useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import MicIcon from "@mui/icons-material/Mic";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import Grid from "@mui/material/Grid";
import Wave from "../../images/wave.gif";
import WaveStop from "../../images/wave-stop.png";
import Zoom from "@mui/material/Zoom";
import Form from "./Form";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar from "@mui/material/Snackbar";
import "./VoiceBot.css";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "#000",
    fontSize: 16,
  },
}));

function TransitionRight(props) {
  return <Zoom {...props} direction="left" />;
}

export default function VoiceBot({ steps, setSteps }) {
  console.log(steps);
  const [second, setSecond] = useState("00");
  const [minute, setMinute] = useState("00");
  console.log(second, minute);
  const [isActive, setIsActive] = useState(false);
  const [counter, setCounter] = useState(0);
  const [showAudio, setShowAudio] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [startBtn, setStartBtn] = useState(true);
  const [checked, setChecked] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    let intervalId;

    if (isActive && !error) {
      intervalId = setInterval(() => {
        const secondCounter = counter % 60;
        const minuteCounter = Math.floor(counter / 60);

        let computedSecond =
          String(secondCounter).length === 1
            ? `0${secondCounter}`
            : secondCounter;
        let computedMinute =
          String(minuteCounter).length === 1
            ? `0${minuteCounter}`
            : minuteCounter;

        setSecond(computedSecond);
        setMinute(computedMinute);

        setCounter((counter) => counter + 1);
      }, 900);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isActive, counter]);

  function stopTimer() {
    setIsActive(false);
    setCounter(0);
    setSecond("00");
    setMinute("00");
  }

  useEffect(() => {
    if (mediaError) {
      setError(true);
    }
  }, [error]);

  const {
    status,
    startRecording,
    stopRecording,
    pauseRecording,
    mediaBlobUrl,
    resumeRecording,
    error: mediaError,
  } = useReactMediaRecorder({
    video: false,
    audio: true,
    echoCancellation: true,
  });
  // console.log('deed', mediaBlobUrl);
  console.log(error, "here is an error");

  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.mediaBlobUrl);

      reader.onload = () =>
        resolve({
          fileName: file.title,
          base64: reader.result,
        });
      reader.onerror = reject;
    });

  const title = () => {
    return (
      <Typography gutterBottom variant="h5" component="div">
        Rock
        <span style={{ color: "#DE6562", fontWeight: "bold" }}>Tech.</span>
      </Typography>
    );
  };

  const IconButtonHandler = () => {
    setShowModal(false);
    setShowForm(false);
    setIsActive(false);
    setShowAudio(false);
    setStartBtn(true);
    stopTimer();
  };

  const FiberManualRecordIconHandler = () => {
    if (!mediaError) {
      setStartBtn(false);
      startRecording();
      setIsActive(true);
      setChecked(true);
    } else {
      setError(!error);
    }
  };

  const closeIconHandler = () => {
    setStartBtn(true);
    stopRecording();
    setIsActive(false);
    setShowAudio(false);
  };

  const stopIconHandler = () => {
    stopTimer();
    stopRecording();
    setShowAudio(true);
  };

  const PlayArrowIconHandler = () => {
    if (!isActive) {
      resumeRecording();
    } else {
      pauseRecording();
    }
    setIsActive(!isActive);
  };

  const doneIconHandler = () => {
    setShowForm(true);
  };

  const micIconHandler = () => {
    setShowModal(true);
    setSteps((prevState) => {
      return { ...prevState, step1: true };
    });
  };
  return (
    <>
      {mediaError && error && (
        <Snackbar
          open={error}
          autoHideDuration={600}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          TransitionComponent={TransitionRight}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            <AlertTitle>Error</AlertTitle>
            {mediaError}
          </Alert>
        </Snackbar>
      )}
      {showModal ? (
        <Card className="vb">
          <CardHeader
            title={title()}
            action={
              <IconButton
                aria-label="close"
                onClick={() => IconButtonHandler()}
                // onClick={() => {
                //   setShowModal(false);
                //   setShowForm(false);
                //   setIsActive(false);
                //   setShowAudio(false);
                //   setStartBtn(true);
                //   stopTimer();
                // }}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            }
          />

          {showForm ? (
            <Form
              setShowModal={setShowModal}
              showForm={setShowForm}
              showAudio={setShowAudio}
              showBtn={setStartBtn}
            />
          ) : (
            <>
              <CardContent>
                <Zoom in={showModal}>
                  <Typography variant="h3" component="div">
                    <span className="minute">{minute}</span>
                    <span>:</span>
                    <span className="second">{second}</span>
                  </Typography>
                </Zoom>

                <div className="vb-wave">
                  {showAudio && !startBtn ? (
                    <audio src={mediaBlobUrl} controls />
                  ) : isActive ? (
                    <Zoom in={isActive}>
                      <img src={Wave} className="vb-waveImg" />
                    </Zoom>
                  ) : (
                    <Zoom in={!isActive}>
                      <img src={WaveStop} className="vb-waveImg" />
                    </Zoom>
                  )}
                </div>
              </CardContent>
              <CardActions>
                <Grid className="button-container" spacing={2}>
                  {startBtn ? (
                    <Grid item xs={8}>
                      <Tooltip
                        title="Click to Record Voice"
                        placement="top"
                        arrow
                      >
                        <Zoom in={startBtn}>
                          <Fab
                            className="fabIcon"
                            color="primary"
                            aria-label="Play"
                            onClick={() => FiberManualRecordIconHandler()}
                            // onClick={() => {
                            //   if (!mediaError) {
                            //     setStartBtn(false);
                            //     startRecording();
                            //     setIsActive(true);
                            //     setChecked(true);
                            //   } else {
                            //     setError(!error);
                            //   }
                            // }}
                          >
                            <FiberManualRecordIcon />
                          </Fab>
                        </Zoom>
                      </Tooltip>
                    </Grid>
                  ) : (
                    <>
                      <Zoom in={checked}>
                        <Grid item xs={8}>
                          {showAudio ? (
                            <Fab
                              className="fabIcon"
                              color="secondary"
                              aria-label="add"
                              onClick={() => closeIconHandler()}
                              //   onClick={() => {
                              //     setStartBtn(true);
                              //     stopRecording();
                              //     setIsActive(false);
                              //     setShowAudio(false);
                              //   }}
                            >
                              <CloseIcon />
                            </Fab>
                          ) : (
                            <Fab
                              className="fabIcon"
                              color="secondary"
                              aria-label="add"
                              onClick={() => stopIconHandler()}
                              //   onClick={() => {
                              //     stopTimer();
                              //     stopRecording();
                              //     setShowAudio(true);
                              //   }}
                            >
                              <StopIcon />
                            </Fab>
                          )}
                        </Grid>
                      </Zoom>
                      <Zoom in={checked}>
                        <Grid item xs={4}>
                          <Fab
                            className="fabIcon"
                            color="primary"
                            onClick={() => PlayArrowIconHandler()}
                            // onClick={() => {
                            //   if (!isActive) {
                            //     resumeRecording();
                            //   } else {
                            //     pauseRecording();
                            //   }
                            //   setIsActive(!isActive);
                            // }}
                            disabled={showAudio ? true : false}
                          >
                            {!isActive ? <PlayArrowIcon /> : <PauseIcon />}
                          </Fab>
                        </Grid>
                      </Zoom>
                      <Zoom in={checked}>
                        <Grid item xs={8}>
                          <Fab
                            className="fabIcon"
                            color="gray"
                            onClick={() => doneIconHandler()}
                            // onClick={() => setShowForm(true)}
                            disabled={!showAudio ? true : false}
                          >
                            <DoneIcon />
                          </Fab>
                        </Grid>
                      </Zoom>
                    </>
                  )}
                </Grid>
              </CardActions>
            </>
          )}
        </Card>
      ) : (
        <LightTooltip title="Send Voice Message" placement="left" arrow>
          <Fab
            className="fabIconMic"
            color="primary"
            onClick={() => micIconHandler()}
            // onClick={() => {
            //   setShowModal(true);
            //   setSteps((prevState) => {
            //     return { ...prevState, step1: true };
            //   });
            // }}
          >
            <MicIcon />
          </Fab>
        </LightTooltip>
      )}
    </>
  );
}

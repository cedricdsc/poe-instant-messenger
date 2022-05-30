import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import classNames from 'classnames';
import classes from './SetupStepper.module.scss';
import SearchIcon from '@mui/icons-material/Search';
import { onElementEnter, onElementLeave } from 'renderer/background/util';
import MainProcess from 'renderer/background/mainProcess';
import { useState, ChangeEvent } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const steps = [
  {
    label: 'Greetings Exile!',
    description: `Thank you for downloading PoE Instant Messenger, a third-party application for Path of Exile.
    Please keep in mind that this project is not affiliated with Grinding Gear Games in any way and only possible because of their Third-Party Policy.`,
  },
  {
    label: 'Select your Path of Exile log file.',
    description:
      'In order for this application to work you have to navigate to your Path of Exile installation folder and select the log file.',
  },
  {
    label: 'See you in Wraeclast, Exile.',
    description: `That was everything it takes for PoE Instant Messenger to help you not missing a message anymore. Have fun!`,
  },
];

export default function SetupStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [folderPath, setFolderPath] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    console.log(activeStep);
    if (activeStep === 2) {
      MainProcess.sendEvent({
        name: 'OVERLAY->MAIN::finishSetup',
        payload: { path: folderPath },
      });
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const folderSearchTerm = '\\Path of Exile\\';
    const pathList = event.currentTarget.files;
    if (pathList) {
      const selectedPath = pathList[0].path;
      if (selectedPath.includes(folderSearchTerm)) {
        setFolderPath(
          selectedPath.substring(
            0,
            selectedPath.lastIndexOf(folderSearchTerm) + folderSearchTerm.length
          )
        );
        handleNext();
      } else {
        setAlertOpen(true);
        setTimeout(() => setAlertOpen(false), 3000);
      }
    }
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      className={classNames(classes.fullHeight)}
    >
      <Box
        sx={{ width: 400, backgroundColor: 'white', p: 4, borderRadius: 4 }}
        className={classNames(classes.interactable)}
        onMouseEnter={onElementEnter}
        onMouseLeave={onElementLeave}
      >
        <Typography variant="h4" component="h1" mb={2}>
          Setup
        </Typography>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                <Typography>{step.description}</Typography>
                <Box sx={{ mb: 2 }}>
                  <div>
                    {index === 1 ? (
                      <Button
                        variant="contained"
                        component="label"
                        sx={{ mt: 1, mr: 1 }}
                        startIcon={<SearchIcon />}
                      >
                        Select Log File
                        <input
                          type="file"
                          hidden
                          onChange={handleFileSelection}
                          multiple={false}
                        />
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                        startIcon={
                          index === steps.length - 1 && <CheckCircleIcon />
                        }
                        endIcon={
                          index !== steps.length - 1 && <ArrowForwardIosIcon />
                        }
                      >
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                      </Button>
                    )}

                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        <Collapse in={alertOpen}>
          <Alert severity="error">
            The selected file seems not to be in the Path of Exile folder. Try
            again!
          </Alert>
        </Collapse>
      </Box>
    </Grid>
  );
}

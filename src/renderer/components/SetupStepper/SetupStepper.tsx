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
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import classes from './SetupStepper.module.scss';
import MainProcess from '../../background/mainProcess';
import {
  getTheme,
  onElementEnter,
  onElementLeave,
} from '../../background/util';
import { useStore } from '../../background/store';

const steps = [
  {
    label: 'Greetings Exile!',
    description: `Thank you for downloading PoE Instant Messenger, a third-party application for Path of Exile.
    Please keep in mind that this project is not affiliated with Grinding Gear Games in any way and only possible because of their Third-Party Policy.`,
  },
  {
    label: 'Select your Path of Exile directory.',
    description:
      'In order for this application to work you have to navigate to your Path of Exile installation destination and select the folder on your system.',
  },
  {
    label: 'See you in Wraeclast, Exile.',
    description: `That was everything it takes for PoE Instant Messenger to help you not missing a message anymore. Have fun!`,
  },
];

export default function SetupStepper() {
  const initalSetupState = { activeStep: 0, folderPath: '', alertOpen: false };
  const [setupState, setSetupState] = useState(initalSetupState);

  const { store } = useStore();
  const theme = getTheme(store);

  useEffect(() => {
    MainProcess.onEvent('MAIN->OVERLAY::validDirectory', (payload) => {
      setSetupState((prevState) => {
        return {
          ...prevState,
          folderPath: payload.path,
          activeStep: prevState.activeStep + 1,
        };
      });
    });

    MainProcess.onEvent('MAIN->OVERLAY::invalidDirectory', () => {
      setSetupState((prevState) => {
        return { ...prevState, alertOpen: true };
      });
      setTimeout(
        () =>
          setSetupState((prevState) => {
            return { ...prevState, alertOpen: false };
          }),
        3000
      );
    });
  }, []);

  const handleNext = () => {
    setSetupState((prevState) => {
      return { ...prevState, activeStep: prevState.activeStep + 1 };
    });
    if (setupState.activeStep === 2) {
      MainProcess.sendEvent({
        name: 'OVERLAY->MAIN::finishSetup',
        payload: { path: setupState.folderPath },
      });
    }
  };

  const handleBack = () => {
    setSetupState((prevState) => {
      return { ...prevState, activeStep: prevState.activeStep - 1 };
    });
  };

  const handleDirectorySelection = () => {
    MainProcess.sendEvent({
      name: 'OVERLAY->MAIN::openDialog',
      payload: undefined,
    });
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
        sx={{
          width: 400,
          backgroundColor: theme.palette.background.paper,
          p: 4,
          borderRadius: 4,
        }}
        className={classNames(classes.interactable)}
        onMouseEnter={onElementEnter}
        onMouseLeave={onElementLeave}
      >
        <Typography
          variant="h4"
          component="h1"
          mb={2}
          color={theme.palette.text.primary}
        >
          Setup
        </Typography>
        <Stepper activeStep={setupState.activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                <Typography color={theme.palette.text.primary}>
                  {step.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <div>
                    {index === 1 ? (
                      <Button
                        variant="contained"
                        component="label"
                        sx={{ mt: 1, mr: 1 }}
                        onClick={handleDirectorySelection}
                        startIcon={<SearchIcon />}
                      >
                        Select Directory
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
        <Collapse in={setupState.alertOpen}>
          <Alert severity="error">
            The selected directory does not belong to Path of Exile. Try again!
          </Alert>
        </Collapse>
      </Box>
    </Grid>
  );
}

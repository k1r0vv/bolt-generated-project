import React, { useState } from 'react';
    import {
      Snackbar,
      IconButton,
      SpeedDial,
      SpeedDialAction,
      SpeedDialIcon,
      Dialog,
      DialogTitle,
      DialogContent,
      DialogActions,
      Button,
      TextField,
      Typography,
      Rating
    } from '@mui/material';
    import {
      BugReport,
      Feedback as FeedbackIcon,
      Close,
      Star
    } from '@mui/icons-material';

    const FeedbackComponent = () => {
      const [open, setOpen] = useState(false);
      const [feedbackType, setFeedbackType] = useState(null);
      const [feedback, setFeedback] = useState('');
      const [rating, setRating] = useState(0);
      const [snackbarOpen, setSnackbarOpen] = useState(false);

      const handleSubmit = () => {
        // Here you would typically send the feedback to your backend
        console.log({ feedbackType, feedback, rating });
        setOpen(false);
        setSnackbarOpen(true);
        setFeedback('');
        setRating(0);
      };

      return (
        <>
          <SpeedDial
            ariaLabel="Feedback"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
          >
            <SpeedDialAction
              icon={<BugReport />}
              tooltipTitle="Report Bug"
              onClick={() => {
                setFeedbackType('bug');
                setOpen(true);
              }}
            />
            <SpeedDialAction
              icon={<FeedbackIcon />}
              tooltipTitle="Suggest Feature"
              onClick={() => {
                setFeedbackType('feature');
                setOpen(true);
              }}
            />
            <SpeedDialAction
              icon={<Star />}
              tooltipTitle="Rate App"
              onClick={() => {
                setFeedbackType('rating');
                setOpen(true);
              }}
            />
          </SpeedDial>

          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>
              {feedbackType === 'bug' && 'Report a Bug'}
              {feedbackType === 'feature' && 'Suggest a Feature'}
              {feedbackType === 'rating' && 'Rate the App'}
            </DialogTitle>
            <DialogContent>
              {feedbackType === 'rating' && (
                <Rating
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  size="large"
                  sx={{ my: 2 }}
                />
              )}
              <TextField
                autoFocus
                margin="dense"
                label="Your Feedback"
                fullWidth
                multiline
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained">Submit</Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            message="Thank you for your feedback!"
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => setSnackbarOpen(false)}
              >
                <Close />
              </IconButton>
            }
          />
        </>
      );
    };

    export default FeedbackComponent;

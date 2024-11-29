import React, { useState } from 'react';
    import {
      Dialog,
      DialogTitle,
      DialogContent,
      DialogActions,
      Button,
      List,
      ListItem,
      ListItemText,
      Switch,
      FormControl,
      InputLabel,
      Select,
      MenuItem,
      Typography
    } from '@mui/material';

    const Settings = ({ open, onClose, settings, onSettingsChange }) => {
      const [localSettings, setLocalSettings] = useState(settings);

      const handleChange = (key, value) => {
        setLocalSettings(prev => ({
          ...prev,
          [key]: value
        }));
      };

      const handleSave = () => {
        onSettingsChange(localSettings);
        onClose();
      };

      return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
          <DialogTitle>Settings</DialogTitle>
          <DialogContent>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Dark Mode"
                  secondary="Enable dark theme for the application"
                />
                <Switch
                  edge="end"
                  checked={localSettings.darkMode}
                  onChange={(e) => handleChange('darkMode', e.target.checked)}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Auto Refresh"
                  secondary="Automatically refresh data"
                />
                <Switch
                  edge="end"
                  checked={localSettings.autoRefresh}
                  onChange={(e) => handleChange('autoRefresh', e.target.checked)}
                />
              </ListItem>
              <ListItem>
                <FormControl fullWidth>
                  <InputLabel>Refresh Interval</InputLabel>
                  <Select
                    value={localSettings.refreshInterval}
                    onChange={(e) => handleChange('refreshInterval', e.target.value)}
                    disabled={!localSettings.autoRefresh}
                  >
                    <MenuItem value={30000}>30 seconds</MenuItem>
                    <MenuItem value={60000}>1 minute</MenuItem>
                    <MenuItem value={300000}>5 minutes</MenuItem>
                  </Select>
                </FormControl>
              </ListItem>
              <ListItem>
                <FormControl fullWidth>
                  <InputLabel>Currency Display</InputLabel>
                  <Select
                    value={localSettings.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                  >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                  </Select>
                </FormControl>
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      );
    };

    export default Settings;

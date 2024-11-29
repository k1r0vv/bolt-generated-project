import React from 'react';
    import {
      Button,
      Menu,
      MenuItem,
      ListItemIcon,
      ListItemText
    } from '@mui/material';
    import {
      GetApp,
      PictureAsPdf,
      TableChart
    } from '@mui/icons-material';

    const DataExport = ({ data, type }) => {
      const [anchorEl, setAnchorEl] = React.useState(null);

      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };

      const handleClose = () => {
        setAnchorEl(null);
      };

      const exportToCSV = () => {
        const csvContent = convertToCSV(data);
        downloadFile(csvContent, `${type}_data.csv`, 'text/csv');
        handleClose();
      };

      const exportToJSON = () => {
        const jsonContent = JSON.stringify(data, null, 2);
        downloadFile(jsonContent, `${type}_data.json`, 'application/json');
        handleClose();
      };

      const downloadFile = (content, filename, contentType) => {
        const blob = new Blob([content], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      const convertToCSV = (data) => {
        if (!data || !data.length) return '';
        
        const headers = Object.keys(data[0]);
        const rows = data.map(obj => 
          headers.map(header => JSON.stringify(obj[header])).join(',')
        );
        
        return [
          headers.join(','),
          ...rows
        ].join('\n');
      };

      return (
        <>
          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={handleClick}
            size="small"
          >
            Export
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={exportToCSV}>
              <ListItemIcon>
                <TableChart fontSize="small" />
              </ListItemIcon>
              <ListItemText>Export as CSV</ListItemText>
            </MenuItem>
            <MenuItem onClick={exportToJSON}>
              <ListItemIcon>
                <GetApp fontSize="small" />
              </ListItemIcon>
              <ListItemText>Export as JSON</ListItemText>
            </MenuItem>
          </Menu>
        </>
      );
    };

    export default DataExport;

import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function TitleField({label, type}) {
  return (
    <Box
      sx={{
        width: 500,
        maxWidth: '100%',
        color: '#ffffff',
        marginTop: '1em',
      }}
    >
      <TextField
        fullWidth
        label={label}
        type = {type}
        id="fullWidth"
        InputLabelProps={{ style: { color: "white" } }}
        InputProps={{ style: { color: "white", border:'1px white' } }}
      />
    </Box>
  );
}
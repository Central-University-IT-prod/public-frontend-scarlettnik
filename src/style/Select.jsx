import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function SelectPeriod() {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel
          variant="standard"
          htmlFor="uncontrolled-native"
          sx={{
            fontSize: "18px",
            color: "#ffffff",
            marginBottom: '1em',

          }}
        >
          Age
        </InputLabel>
        <Select
          defaultValue={10}
          inputProps={{
            name: "age",
            id: "uncontrolled-native",
          }}
          sx={{
            color: "#ffffff",
            backgroundColor: "#333333",
            
          }}
          MenuProps={{
            PaperProps: {
              style: {
                backgroundColor: "#333333",
                color: "white",
              },
            },
          }}
        >
          <MenuItem value={10}>Каждый день</MenuItem>
          <MenuItem value={20}>По неделям</MenuItem>
          <MenuItem value={30}>По месяцам</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

import { TextField } from "@mui/material";

const InputField = ({ type, name, label, register, error }) => {
  return (
    <div>
      <TextField
        label={label}
        variant="outlined"
        {...register(name)}
        type={type}
        name={name}
        autoComplete="off"
        id={`field_${name}`}
        InputLabelProps={{ style: { color: "white" } }}
        InputProps={{ style: { color: "white", border:'1px white' } }}
      />
      <br/>
      {error && <span style={{color: '#77777'}}>{error.message}</span>}
    </div>
  );
};

export default InputField;

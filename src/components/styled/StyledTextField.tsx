import {withStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const StyledTextField = withStyles({
    root: {
        background: '#F6F6F6',
        border: '1px solid #757575',
        boxSizing: 'border-box',
        borderRadius: '2px',
        color: 'black',
        paddingLeft: '20px',
        paddingTop: '10px',
        paddingBottom: '5px',
        fontSize: '16px',
        '& .MuiInputBase-root': {
            color: 'black',
        },
        '& .MuiFormLabel-root': {
            color: 'black',
            padding: '10px'
        },
        '& .MuiInput-underline:after': {
            display: 'none'
        },
        '& .MuiInput-underline:before': {
            display: 'none'
        }
    }
})(TextField);

export default StyledTextField

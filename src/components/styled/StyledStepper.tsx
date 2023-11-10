import {withStyles} from "@material-ui/core/styles";
import {Stepper} from '@mui/material';

const StyledStepper = withStyles({
    root: {
        "& .Mui-active": {
            color: "#FF4655 !important"
        },
        "& .Mui-completed": {
            color: "#FF4655 !important"
        },
        "& .Mui-disabled": {
            color: "#A6A6A6"
        },
    }

})(Stepper);

export default StyledStepper

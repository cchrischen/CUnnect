import { createTheme } from "@mui/material";

export const mint = "#C7D8C6";
export const lightMint = "#E5EDE4";
export const grayBlue = "#A9B7C0";
export const lightGrayBlue = "#C6D0D6";
export const pastelBeige = "#F6EFE7";

export const generalTheme = createTheme({
  palette: {
    primary: {
      main: mint,
    },
    secondary: {
      main: grayBlue,
    },
  },
  typography: {
    fontFamily: "Montserrat, sans-serif",
    h1: {
      fontWeight: "bolder",
    },
    h2: {
      fontSize: "40px",
      fontWeight: "bold",
      margin: "20px 0px 25px 0px",
      fontFamily: "Poppins, sans-serif",
    },
    h3: {
      fontSize: "30px",
      fontWeight: "bold",
      margin: "10px",
      fontFamily: "Poppins, sans-serif",
    },
    subtitle1: {
      fontSize: "17px",
      paddingBottom: "15px",
    },
    h4: {
      fontSize: "15x",
    },
  },
});

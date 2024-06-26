import React,{useContext} from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { indigo, pink } from "@mui/material/colors";

import "./DicomViewer.css";
import DwvComponent from "./DwvComponent";
import { UserDetailContext } from "../UserDetailContext";

export default function DicomViewer() {
  const {
    dicomImage,setDicomImage,isLoggedIn, setIsLoggedIn,
    
  } = useContext(UserDetailContext);
  console.log(dicomImage)
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = createTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
        main: indigo[500],
      },
      secondary: {
        main: pink[500],
      },
      mode: prefersDarkMode ? "light" : "dark",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="Appp">
        <DwvComponent   dicomImage={dicomImage} isLoggedIn={isLoggedIn} />
      </div>
    </ThemeProvider>
  );
}

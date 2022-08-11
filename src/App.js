import CRUD from "./crud";
import { makeStyles } from "@material-ui/styles";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    height: "100vh",
    backgroundColor: "#F2F2F7",
  }),
}));

const theme = createTheme({});
function App() {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <CRUD />
      </div>
    </ThemeProvider>
  );
}

export default App;

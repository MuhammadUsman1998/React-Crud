import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { createTheme, ThemeProvider, Theme } from "@mui/material/styles";
import { Avatar, makeStyles, TableRow } from "@material-ui/core";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import {
  Button,
  CssBaseline,
  TableBody,
  TableCell,
  TableHead,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
const ariaLabel = { "aria-label": "description" };

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const useStyles = makeStyles((Theme) => ({
  inputbg: {
    backgroundColor: "white",
  },
  input: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

function CRUD() {
  const [inputText, setInputText] = useState({
    id: "",
    fname: "",
    lname: "",
    profession: "",
    age: "",
  });
  const [items, setItems] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(
          "https://crud-database-86446-default-rtdb.firebaseio.com/users.json",
          {
            method: "GET",
            headers: {
              "content-Type": "application/json",
            },
          }
        );
        const responseData = await res.json();
        const loadedUsers = [];

        for (const key in responseData) {
          loadedUsers.push({
            id: key,
            fname: responseData[key].fname,
            lname: responseData[key].lname,
            profession: responseData[key].profession,
            age: responseData[key].age,
          });
        }
        // debugger;
        // const dataArray = Object.values(data);
        setItems(loadedUsers);
      } catch (error) {}
    };
    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fname, lname, profession, age } = inputText;
    try {
      await fetch(
        "https://crud-database-86446-default-rtdb.firebaseio.com/users.json",

        {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify({
            id: uuidv4(),
            fname,
            lname,
            profession,
            age,
          }),
        }
      );
      setInputText({
        fname: "",
        lname: "",
        profession: "",
        age: "",
      });
      alert("data stored");
    } catch (error) {
      alert("plz fill data");
    }
  };

  const deleteItems = async (id) => {
    await axios
      .delete(
        `https://crud-database-86446-default-rtdb.firebaseio.com/users/${id}.json`
      )
      .then((res) => {
        if (res.status !== 200) {
          return;
        } else {
          setItems(
            items.filter((user) => {
              return user.id !== id;
            })
          );
        }
      })
      .catch((err) => {});
  };

  const handleUpdateSubmit = async (e, id) => {
    e.preventDefault();
    console.log("id from update", id);
    await axios
      .put(
        `https://crud-database-86446-default-rtdb.firebaseio.com/users/${id}.json`,
        inputText
      )
      .then((res) => {
        if (res.status !== 200) {
          return;
        } else {
          console.log({ res });
        }
        setInputText({
          fname: "",
          lname: "",
          profession: "",
          age: "",
        });
        setIsUpdate(false);
      })
      .catch((err) => {});
  };

  const editItem = (id) => {
    let updateEditItems = items.find((elem) => {
      return elem.id === id;
    });
    setIsUpdate(true);
    setInputText({ id: id, ...updateEditItems });
  };

  const handleFormDisabled = () => {
    if (
      !inputText.fname ||
      !inputText.lname ||
      !inputText.profession ||
      !inputText.age
    ) {
      return true;
    } else {
      return false;
    }
  };

  const classes = useStyles();

  return (
    <>
      <ThemeProvider>
        <CssBaseline />
        <Typography
          variant='h2'
          sx={{ background: "#101928", color: "white", textAlign: "center" }}
        >
          React Crud
        </Typography>
        {!isUpdate && (
          <div className={classes.inputbg}>
            <form
              className={classes.input}
              onSubmit={handleSubmit}
              method='POST'
            >
              <Typography sx={{ py: 6 }}>
                <TextField
                  placeholder='Enter First Name'
                  required
                  id='outlined-required'
                  name='fname'
                  value={inputText.fname}
                  inputProps={ariaLabel}
                  sx={{ px: 5 }}
                  onChange={(e) =>
                    setInputText({ ...inputText, fname: e.target.value })
                  }
                />
                <TextField
                  required
                  id='outlined-required'
                  placeholder='Enter Last Name'
                  name='lname'
                  value={inputText.lname}
                  onChange={(e) =>
                    setInputText({ ...inputText, lname: e.target.value })
                  }
                  inputProps={ariaLabel}
                />
              </Typography>

              <Typography sx={{ py: 6 }}>
                <TextField
                  required
                  id='outlined-required'
                  placeholder='Enter Profession'
                  name='profession'
                  value={inputText.profession}
                  sx={{ px: 5 }}
                  onChange={(e) =>
                    setInputText({ ...inputText, profession: e.target.value })
                  }
                  inputProps={ariaLabel}
                />

                <TextField
                  id='outlined-required'
                  placeholder='Enter Age'
                  name='age'
                  value={inputText.age}
                  sx={{}}
                  onChange={(e) =>
                    setInputText({ ...inputText, age: e.target.value })
                  }
                  inputProps={ariaLabel}
                />
              </Typography>
              <Typography sx={{ py: 3 }}>
                <Button
                  onClick={handleSubmit}
                  variant='contained'
                  sx={{
                    cursor: handleFormDisabled() ? "not-allowed" : "pointer",
                  }}
                >
                  Submit
                </Button>
              </Typography>
            </form>
          </div>
        )}

        {isUpdate && (
          <div className={classes.inputbg}>
            <form
              className={classes.input}
              onSubmit={handleSubmit}
              method='POST'
            >
              <Typography sx={{ py: 6 }}>
                <TextField
                  placeholder='Enter First Name'
                  required
                  id='outlined-required'
                  name='fname'
                  value={inputText.fname}
                  inputProps={ariaLabel}
                  sx={{ px: 5 }}
                  onChange={(e) =>
                    setInputText({ ...inputText, fname: e.target.value })
                  }
                />
                <TextField
                  required
                  id='outlined-required'
                  placeholder='Enter Last Name'
                  name='lname'
                  value={inputText.lname}
                  onChange={(e) =>
                    setInputText({ ...inputText, lname: e.target.value })
                  }
                  inputProps={ariaLabel}
                />
              </Typography>

              <Typography sx={{ py: 6 }}>
                <TextField
                  required
                  id='outlined-required'
                  placeholder='Enter Profession'
                  name='profession'
                  value={inputText.profession}
                  sx={{ px: 5 }}
                  onChange={(e) =>
                    setInputText({ ...inputText, profession: e.target.value })
                  }
                  inputProps={ariaLabel}
                />

                <TextField
                  id='outlined-required'
                  placeholder='Enter Age'
                  name='age'
                  value={inputText.age}
                  sx={{}}
                  onChange={(e) =>
                    setInputText({ ...inputText, age: e.target.value })
                  }
                  inputProps={ariaLabel}
                />
              </Typography>
              <Typography sx={{ py: 3 }}>
                <Button
                  onClick={(e) => handleUpdateSubmit(e, inputText.id)}
                  variant='contained'
                >
                  Update
                </Button>
              </Typography>
            </form>
          </div>
        )}

        <TableContainer
          component={Paper}
          sx={{
            border: "4px solid rgb(0,0,0,0.2)",
            height: 400,
            marginBottom: "12px",
            "&::-webkit-scrollbar-x": {
              width: 600,
            },
            // "&::-webkit-scrollbar-track": {
            //   backgroundColor: "orange",
            // },
            // "&::-webkit-scrollbar-thumb": {
            //   borderRadius: "2px",
            //   backgroundColor: "red",
            // },
          }}
        >
          <Table sx={{ minWidth: 650 }} size='small' aria-label='a dense table'>
            {items.length > 0 && (
              <TableHead sx={{ position: "sticky", top: 0 }}>
                <TableRow>
                  <StyledTableCell>Sr No</StyledTableCell>
                  <StyledTableCell>First Name</StyledTableCell>
                  <StyledTableCell align='right'>Last Name</StyledTableCell>
                  <StyledTableCell align='right'>Profession</StyledTableCell>
                  <StyledTableCell align='right'>Age</StyledTableCell>
                  <StyledTableCell align='right'>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
            )}

            <TableBody>
              {items?.map((elem, index) => {
                return (
                  <StyledTableRow key={elem.id}>
                    <StyledTableCell component='th' scope='row'>
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell component='th' scope='row'>
                      {elem.fname}
                    </StyledTableCell>
                    <StyledTableCell align='right'>
                      {elem.lname}
                    </StyledTableCell>
                    <StyledTableCell align='right'>
                      {elem.profession}
                    </StyledTableCell>
                    <StyledTableCell align='right'>{elem.age}</StyledTableCell>
                    <StyledTableCell
                      align='right'
                      sx={{ display: "flex", cursor: "pointer" }}
                    >
                      <img
                        src='https://img.icons8.com/fluency/48/000000/delete-forever.png'
                        width={30}
                        title='Delete-Item'
                        onClick={() => deleteItems(elem.id)}
                      />
                      <img
                        src='https://img.icons8.com/color-glass/48/000000/edit.png'
                        width={30}
                        title='Edit-Item'
                        onClick={() => editItem(elem.id)}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </ThemeProvider>
    </>
  );
}
export default CRUD;

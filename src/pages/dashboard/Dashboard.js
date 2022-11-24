import React, { useState, useEffect } from "react";
import { LIMIT, PAGE, SORTBY, DESCENDING } from "../../context/config"
import useStyles from "./styles";


import {
  Grid,
  LinearProgress,
  Select,
  CircularProgress,
  Input,
  TextField,
  OutlinedInput,
  MenuItem,
  Button, Modal, Box
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  LineChart,
  Line,
  Area,
  PieChart,
  Pie,
  Cell,
  YAxis,
  XAxis,
} from "recharts";

// styles


// components
import mock from "./mock";
import Widget from "../../components/Widget";
import PageTitle from "../../components/PageTitle";
import { Typography } from "../../components/Wrappers";
import Dot from "../../components/Sidebar/components/Dot";
import Table from "./components/Table/Table";
import BigStat from "./components/BigStat/BigStat";
import { useUserDispatch, customersList, useUserState, addCustomer } from "../../context/UserContext";

const mainChartData = getMainChartData();
const PieChartData = [
  { name: "Group A", value: 400, color: "primary" },
  { name: "Group B", value: 300, color: "secondary" },
  { name: "Group C", value: 300, color: "warning" },
  { name: "Group D", value: 200, color: "success" },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};




export default function Dashboard(props) {
  var userDispatch = useUserDispatch();
  var userState = useUserState();
  const { listing } = userState;
  var classes = useStyles();
  var theme = useTheme();
  var [isLoading, setIsLoading] = useState(false);
  var [listings, setListings] = useState(listing);
  var [limit, setLimit] = useState(LIMIT);
  var [page, setPage] = useState(PAGE);
  var [sortby, setSortby] = useState(SORTBY);
  var [descending, setDescending] = useState(DESCENDING);
  var [gender, setGender] = useState("Male");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  var [error, setError] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [searchInput, setSearchInput] = useState("")



  useEffect(() => {
    const fetch = async () => {
      await customersList(userDispatch, setIsLoading, limit, page, sortby, descending)
    }
    if (listing == undefined) { fetch() }
  }, []);


  const handleSave = () => {
    addCustomer(userDispatch, name, address, email, mobile, gender, props.history, setIsLoading, setError, limit, page, sortby, descending)

  }

  const searchByName = (e) => {
    setName(e.target.value)
    if (e.target.value != "") {


      var searchedCustomer = listing && listing.length > 0 && listing.filter(customer => customer.name.toLowerCase() === e.target.value.toLowerCase())

      setListings(searchedCustomer && searchedCustomer.length == 0 ? undefined : searchedCustomer.length > 0 ? searchedCustomer : listings)
    } else {

      setListings(listing)
    }

  }

  const searchByEmail = (e) => {
    setEmail(e.target.value)
    if (e.target.value != "") {

      var searchedCustomer = listing && listing.length > 0 && listing.filter(customer => customer.email.toLowerCase() === e.target.value.toLowerCase())

      setListings(searchedCustomer && searchedCustomer.length == 0 ? undefined : searchedCustomer.length > 0 ? searchedCustomer : listings)
    } else {
      setListings(listing)
    }

  }

  const searchByMobile = (e) => {
    setMobile(e.target.value)
    if (e.target.value != "") {
      var searchedCustomer = listing && listing.length > 0 && listing.filter(customer => customer.mobile_no.toLowerCase() === e.target.value.toLowerCase())
      setListings(searchedCustomer && searchedCustomer.length == 0 ? undefined : searchedCustomer.length > 0 ? searchedCustomer : listings)
    } else {
      setListings(listing)
    }

  }

  const filterByGender = (e) => {
    setGender(e.target.value)


    if (e.target.value != "") {
      setListings(listings)
      var searchedCustomer = listing && listing.length > 0 && listing.filter(customer => customer.gender.toLowerCase() === e.target.value.toLowerCase())

      setListings(searchedCustomer && searchedCustomer.length == 0 ? undefined : searchedCustomer.length > 0 ? searchedCustomer : listings)
    } else {
      setListings(listings)
    }

  }



  return (
    <>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Customer

            </Typography>
            {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography> */}
            <TextField
              id="name"
              InputProps={{
                classes: {
                  underline: classes.textFieldUnderline,
                  input: classes.textField,
                },
              }}
              value={name}
              onChange={e => setName(e.target.value)}
              margin="normal"
              placeholder="Name"
              type="text"
              fullWidth
            />
            {/* <Typography color="secondary" className={classes.errorMessage}>
              Something is wrong with your login or password
            </Typography> */}
            <TextField
              id="address"
              InputProps={{
                classes: {
                  underline: classes.textFieldUnderline,
                  input: classes.textField,
                },
              }}
              value={address}
              onChange={e => setAddress(e.target.value)}
              margin="normal"
              placeholder="Address"
              type="text"
              fullWidth
            />
            <TextField
              id="email"
              InputProps={{
                classes: {
                  underline: classes.textFieldUnderline,
                  input: classes.textField,
                },
              }}
              value={email}
              onChange={e => setEmail(e.target.value)}
              margin="normal"
              placeholder="Email"
              type="text"
              fullWidth
            />
            <TextField
              id="mobile_no"
              InputProps={{
                classes: {
                  underline: classes.textFieldUnderline,
                  input: classes.textField,
                },
              }}
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              margin="normal"
              placeholder="Mobile Number"
              type="text"
              fullWidth
              required
            />
            {/* <TextField
              id="name"
              InputProps={{
                classes: {
                  underline: classes.textFieldUnderline,
                  input: classes.textField,
                },
              }}

              margin="normal"
              placeholder="Name"
              type="text"
              fullWidth
            /> */}
            <Select
              value={gender}
              onChange={e => setGender(e.target.value)}
              input={
                <Input
                  disableUnderline
                  classes={{ input: classes.selectInput }}
                />
              }
              className={classes.select}
              fullWidth
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>

            </Select>
            {isLoading &&
              <CircularProgress size={26} className={classes.loginLoader} />}
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSave}
            >
              Save
            </Button>

            <Button
              variant="contained"
              color="primary"
              size="large"
              style={{ marginLeft: '10px' }}
              onClick={handleClose}
            >

              Close
            </Button>
          </Box>

        </Modal>
      </div>
      <PageTitle title="Customers" button={<Button
        variant="contained"
        size="medium"
        color="secondary"
        onClick={handleOpen}
      >
        Add Customers
      </Button>} />
      <Grid container spacing={4}>



        {/* {mock.bigStat.map(stat => (
          <Grid item md={4} sm={6} xs={12} key={stat.product}>
            <BigStat {...stat} />
          </Grid>
        ))} */}
        {isLoading &&
          <CircularProgress size={26} className={classes.loginLoader} />}
        <Grid item xs={3}>
          <TextField
            id="search"
            InputProps={{
              classes: {
                underline: classes.textFieldUnderline,
                input: classes.textField,
              },
            }}
            value={name}
            onChange={searchByName}
            margin="normal"
            placeholder="Search by name"
            type="text"
            fullWidth
          /></Grid>
        <Grid item xs={3}>
          <TextField
            id="search"
            InputProps={{
              classes: {
                underline: classes.textFieldUnderline,
                input: classes.textField,
              },
            }}
            value={email}
            onChange={searchByEmail}
            margin="normal"
            placeholder="Search by email"
            type="text"
            fullWidth
          /></Grid>
        <Grid item xs={3}>
          <TextField
            id="search"
            InputProps={{
              classes: {
                underline: classes.textFieldUnderline,
                input: classes.textField,
              },
            }}
            value={mobile}
            onChange={searchByMobile}
            margin="normal"
            placeholder="Search by mobile no."
            type="text"
            fullWidth
          /></Grid>
        <Grid item xs={3}>
          <Select
            value={gender}
            onChange={filterByGender}
            input={
              <Input
                disableUnderline
                classes={{ input: classes.selectInput }}
              />
            }
            className={classes.select}
            fullWidth
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>

          </Select></Grid>
        <Grid item xs={12}>
          <Widget
            title="Customers"
            upperTitle
            noBodyPadding
            bodyClass={classes.tableWidget}
          >
            {listings != undefined ? <Table data={listings} history={props.history} /> : null}
          </Widget>
        </Grid>
      </Grid>
    </>
  );
}

// #######################################################################
function getRandomData(length, min, max, multiplier = 10, maxDiff = 10) {
  var array = new Array(length).fill();
  let lastValue;

  return array.map((item, index) => {
    let randomValue = Math.floor(Math.random() * multiplier + 1);

    while (
      randomValue <= min ||
      randomValue >= max ||
      (lastValue && randomValue - lastValue > maxDiff)
    ) {
      randomValue = Math.floor(Math.random() * multiplier + 1);
    }

    lastValue = randomValue;

    return { value: randomValue };
  });
}

function getMainChartData() {
  var resultArray = [];
  var tablet = getRandomData(31, 3500, 6500, 7500, 1000);
  var desktop = getRandomData(31, 1500, 7500, 7500, 1500);
  var mobile = getRandomData(31, 1500, 7500, 7500, 1500);

  for (let i = 0; i < tablet.length; i++) {
    resultArray.push({
      tablet: tablet[i].value,
      desktop: desktop[i].value,
      mobile: mobile[i].value,
    });
  }

  return resultArray;
}

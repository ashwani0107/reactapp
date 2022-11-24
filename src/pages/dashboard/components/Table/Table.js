import React, { useState } from "react";
import { Typography } from "../../../../components/Wrappers";
import { LIMIT, PAGE, SORTBY, DESCENDING } from "../../../../context/config"
import { useUserDispatch, deleteCustomer, updateCustomer, customersList } from "../../../../context/UserContext";
import {
  Table,
  TableRow,
  TableHead,
  Select,
  TableBody,
  TextField,
  Input,
  MenuItem,
  TableCell,
  CircularProgress,
  Chip,
  Modal, Box, Button
} from "@material-ui/core";
import * as Icons from "@material-ui/icons";
import "font-awesome/css/font-awesome.min.css";
import useStyles from "../../styles";


const states = {
  sent: "success",
  pending: "warning",
  declined: "secondary",
};

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

export default function TableComponent({ data, history }) {
  var userDispatch = useUserDispatch();
  const classes = useStyles();
  var keys = Object.keys(data[0]).map(i => i.toUpperCase());
  keys.shift(); // delete "id" key
  const [id, setId] = useState("");
  var [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  var [error, setError] = useState(null);
  const handleClose = () => { setOpen(false); setIsLoading(false) }
  const handleCloseEdit = () => { setOpenEdit(false); setIsLoading(false) }
  const [openEdit, setOpenEdit] = useState(false);

  var [gender, setGender] = useState("Select Gender");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [descendings, setDescendings] = useState(DESCENDING);
  const [errors, setErrors] = useState({});

  const confirmModel = (e, id) => {
    setId(id)
    setOpen(true)
  }
  const openEditCustomerModel = (e, customer) => {
    setName(customer.name)
    setAddress(customer.address)
    setEmail(customer.email)
    setMobile(customer.mobile_no)
    setGender(customer.gender)
    setId(customer.id)
    setOpenEdit(true)
  }

  const delCustomer = () => {
    deleteCustomer(userDispatch, id, history, setIsLoading, setError, LIMIT, PAGE, SORTBY, DESCENDING)
  }

  const handleUpdate = () => {
    updateCustomer(userDispatch, id, name, address, email, mobile, gender, history, setIsLoading, setError, LIMIT, PAGE, SORTBY, DESCENDING, setErrors)
  }

  const handleSorting = (e, type) => {
    //console.log("descendings", descendings)

    var descOrder = localStorage.getItem("descorder");
    let descendingsOrder = descendings || descOrder === true ? false : descOrder === false ? true : null
    localStorage.setItem('descorder', descendingsOrder)
    const fetch = async () => {
      await customersList(userDispatch, setIsLoading, LIMIT, PAGE, type, descendingsOrder)
    }
    fetch()
    //setDescendings(descendingsOrder)
  }
  console.log("iddddd", id)
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
            {isLoading &&
              <Typography id="modal-modal-title" variant="h6" component="h2">
                <CircularProgress size={26} className={classes.loginLoader} /></Typography>}
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Are you sure to delete this customer?

            </Typography>


            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={delCustomer}
            >
              Confirm
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
      <div>
        <Modal
          open={openEdit}
          onClose={handleCloseEdit}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {isLoading &&
              <Typography id="modal-modal-title" variant="h6" component="h2">
                <CircularProgress size={26} className={classes.loginLoader} /></Typography>}
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Update Customer

            </Typography>

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
            {errors.name && <Typography color="secondary" className={classes.errorMessage}>
              {errors.name}
            </Typography>}

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
            {errors.address && <Typography color="secondary" className={classes.errorMessage}>
              {errors.address}
            </Typography>}
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
            {errors.email && <Typography color="secondary" className={classes.errorMessage}>
              {errors.email}
            </Typography>}
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
              inputProps={{ maxLength: 12 }}
            />
            {errors.mobile && <Typography color="secondary" className={classes.errorMessage}>
              {errors.mobile}
            </Typography>}

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
            ><MenuItem value="Select Gender">Select Gender</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>

            </Select>
            {errors.gender && <Typography color="secondary" className={classes.errorMessage}>
              {errors.gender}
            </Typography>}
            <div style={{ marginTop: '20px' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleUpdate}
              >
                Update
              </Button>

              <Button
                variant="contained"
                color="primary"
                size="large"
                style={{ marginLeft: '10px' }}
                onClick={handleCloseEdit}
              >

                Close
              </Button>
            </div>
          </Box>

        </Modal>
      </div>
      {isLoading &&
        <Typography id="modal-modal-title" variant="h6" component="h2">
          <CircularProgress size={26} className={classes.loginLoader} /></Typography>}
      <Table className="mb-0">

        <TableHead>
          <TableRow>
            {/* {keys.map(key => (
            <TableCell key={key}>{key}</TableCell>
          ))} */}
            <TableCell style={{ cursor: "pointer" }} key={"id"} onClick={(e) => handleSorting(e, "id")} >Id</TableCell>
            <TableCell style={{ cursor: "pointer" }} key={"name"} onClick={(e) => handleSorting(e, "name")}>Name</TableCell>
            <TableCell style={{ cursor: "pointer" }} key={"email"} onClick={(e) => handleSorting(e, "email")}>Email</TableCell>
            <TableCell style={{ cursor: "pointer" }} key={"address"} onClick={(e) => handleSorting(e, "address")}>Address</TableCell>
            <TableCell style={{ cursor: "pointer" }} key={"mobile_no"} onClick={(e) => handleSorting(e, "mobile_no")}>Mobile No</TableCell>

            <TableCell style={{ cursor: "pointer" }} key={"gender"} onClick={(e) => handleSorting(e, "gender")}>Gender</TableCell>
            <TableCell >Action</TableCell>
          </TableRow>
        </TableHead>
        {data && data.length > 0 ?
          <TableBody>
            {data.map((obj, index) => (
              <TableRow key={obj.id}>
                <TableCell className="pl-3 fw-normal">{obj.id}</TableCell>
                <TableCell className="pl-3 fw-normal">{obj.name}</TableCell>
                <TableCell>{obj.email}</TableCell>
                <TableCell>{obj.address}</TableCell>
                <TableCell>{obj.mobile_no}</TableCell>
                <TableCell>{obj.gender}</TableCell>
                <TableCell><a onClick={(e) => openEditCustomerModel(e, obj)} style={{ cursor: "pointer" }}><Icons.Create style={{ marginRight: 16 }} /></a> <a onClick={(e) => confirmModel(e, obj.id)} style={{ cursor: "pointer" }}><Icons.RestoreFromTrash style={{ marginRight: 16 }} /></a></TableCell>


                {/* <TableCell>
              <Chip label={status} classes={{root: classes[states[status.toLowerCase()]]}}/>
            </TableCell> */}
              </TableRow>
            ))}
          </TableBody> : <TableBody> <TableRow><TableCell>No Customer List Found!</TableCell></TableRow></TableBody>}
      </Table>
    </>
  );
}

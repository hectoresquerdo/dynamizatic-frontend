import "date-fns";
import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { FormControl } from "@material-ui/core";
import { InputLabel, Input } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import axios from "axios";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";

const Header = ({ onCreate, onFilter }) => {
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [country, setCountry] = useState("");
  const [shipDate, setShipDate] = useState(new Date());
  const [companyName, setCompanyName] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newOrder = {
      order_id: orderId,
      country: country,
      ship_date: shipDate,
      company_name: companyName,
      status: status,
      type: type,
    };

    axios
      .post("https://dynamizatic-backend.herokuapp.com/orders", newOrder)
      .then(() => {
        setOpen(false);
        onCreate(newOrder);
        setCompanyName("");
        setStatus("");
        setOrderId("");
        setCountry("");
        setType("");
      });
  };
  const handleFilter = () => {
    axios
      .get("https://dynamizatic-backend.herokuapp.com/orders", {
        params: {
          companyName: companyName ? companyName : null,
          status: status ? status : null,
        },
      })
      .then((response) => {
        onFilter(response.data);
        setCompanyName("");
        setStatus("");
      });
  };
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h4">DynamizaTIC</Typography>

      <form onSubmit={handleFilter}>
        <Box
          component="span"
          display="flex"
          alignItems="flex-end"
          justifyContent="space-between"
          width="25rem"
        >
          <FormControl margin="normal">
            <InputLabel htmlFor="company">Company</InputLabel>
            <Input
              onChange={(e) => setCompanyName(e.target.value)}
              id="company"
              name="company"
              value={companyName}
            />
          </FormControl>
          <FormControl margin="normal" style={{ minWidth: 90 }}>
            <InputLabel htmlFor="status" margin="normal">
              Status
            </InputLabel>

            <Select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value={""}>Select</MenuItem>
              <MenuItem value={"Shipped"}>Shipped</MenuItem>
              <MenuItem value={"Delivered"}>Delivered</MenuItem>
              <MenuItem value={"Pending"}>Pending</MenuItem>
            </Select>
          </FormControl>

          <IconButton aria-label="search" edge="start">
            <SearchIcon fontSize="medium" onClick={handleFilter} />
          </IconButton>
        </Box>
      </form>

      <Button variant="contained" onClick={handleOpen}>
        Create Order
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id="alert-dialog-title">Create Order</DialogTitle>
          <DialogContent>
            <Box maxWidth="600px" width="400px">
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
              >
                <FormControl fullWidth>
                  <InputLabel htmlFor="order_id">Order Id</InputLabel>
                  <Input
                    id="order_id"
                    name="order_id"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel htmlFor="country">Country</InputLabel>
                  <Input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    id="country"
                    name="country"
                  />
                </FormControl>
                <FormControl fullWidth>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      label="Ship date"
                      value={shipDate}
                      onChange={setShipDate}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel htmlFor="company_name">Company Name</InputLabel>
                  <Input
                    id="company_name"
                    name="company_name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel htmlFor="status">Status</InputLabel>

                  <Select
                    id="status"
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value={"Shipped"}>Shipped</MenuItem>
                    <MenuItem value={"Delivered"}>Delivered</MenuItem>
                    <MenuItem value={"Pending"}>Pending</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel htmlFor="type">Type</InputLabel>
                  <Select
                    labelId="type"
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <MenuItem value={"Retail"}>Retail</MenuItem>
                    <MenuItem value={"Online"}>Online</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
export default Header;

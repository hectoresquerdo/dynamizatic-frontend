import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { FormControl } from "@material-ui/core";
import { InputLabel, Input } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import axios from "axios";
import Box from "@material-ui/core/Box";
import DialogContent from "@material-ui/core/DialogContent";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

function EditModal({ open, onClose, selected, onUpdate }) {
  const [orderId, setOrderId] = useState("");
  const [country, setCountry] = useState("");
  const [shipDate, setShipDate] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (selected) {
      setOrderId(selected.order_id);
      setCountry(selected.country);
      setShipDate(selected.ship_date);
      setCompanyName(selected.company_name);
      setStatus(selected.status);
      setType(selected.type);
    }
  }, [selected]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedOrder = {
      order_id: orderId,
      country: country,
      ship_date: shipDate,
      company_name: companyName,
      status: status,
      type: type,
    };

    axios
      .put(
        `https://dynamizatic-backend.herokuapp.com/orders/${orderId}`,
        updatedOrder
      )
      .then(() => {
        onUpdate(updatedOrder);
        onClose(true);
      });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Modify Order</DialogTitle>
      <DialogActions>
        <form onSubmit={handleSubmit}>
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
                    disabled
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
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </form>
      </DialogActions>
    </Dialog>
  );
}

export default EditModal;

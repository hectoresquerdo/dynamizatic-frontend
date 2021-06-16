import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import axios from "axios";
import moment from "moment";
import DeleteModal from "./delete-modal";
import EditModal from "./edit-modal";

const headCells = [
  {
    id: "name",
    label: "Order ID",
  },
  {
    id: "country",
    label: "Country",
  },
  {
    id: "ship_date",
    label: "Ship Date",
  },
  {
    id: "company",
    label: "Company Name",
  },
  {
    id: "status",
    label: "Status",
  },
  {
    id: "type",
    label: "Type",
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

function TablePage({ rows, onDeleteRow, onUpdate }) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState(null);

  const deleteOrder = () => {
    axios
      .delete(
        `https://dynamizatic-backend.herokuapp.com/orders/${selectedOrder.order_id}`
      )
      .then(() => {
        onDeleteRow(selectedOrder.order_id);
        setIsDeleteModalOpen(false);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className={classes.root}>
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={deleteOrder}
      />
      <EditModal
        open={isEditModalOpen}
        selected={selectedOrder ? selectedOrder : null}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={onUpdate}
      />
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <TableHead>
              <TableRow style={{ backgroundColor: "#d1d1d1" }}>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align="center"
                    padding="none"
                    padding-left="20px"
                  >
                    {headCell.label}
                  </TableCell>
                ))}
                <TableCell align="center">Actions </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.order_id}>
                      <TableCell component="th" scope="row" align="center">
                        {row.order_id}
                      </TableCell>
                      <TableCell align="center">{row.country}</TableCell>
                      <TableCell align="center">
                        {moment(row.ship_date).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell align="center">{row.company_name}</TableCell>
                      <TableCell align="center">{row.status}</TableCell>
                      <TableCell align="center">{row.type}</TableCell>
                      <TableCell align="center">
                        <IconButton aria-label="edit">
                          <EditIcon
                            onClick={() => {
                              setSelectedOrder(row);
                              setIsEditModalOpen(true);
                            }}
                          />
                        </IconButton>
                        <IconButton aria-label="delete">
                          <DeleteIcon
                            onClick={() => {
                              setSelectedOrder(row);
                              setIsDeleteModalOpen(true);
                            }}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default TablePage;

"use client";

import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
  Typography,
  Snackbar,
  Alert,
  SnackbarCloseReason,
} from "@mui/material";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import { setData } from "@/redux/tableSlice";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

const defaultColumns = ["name", "email", "age", "role"];

const DataTable = () => {
  const dispatch = useDispatch();
  const rows = useSelector((state: RootState) => state.table.data);
  const [editableRows, setEditableRows] = useState<{
    [key: number]: DataTableType;
  }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [openSaved, setOpenSaved] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    ...defaultColumns,
  ]);
  const [allColumns, setAllColumns] = useState<string[]>([...defaultColumns]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [newField, setNewField] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [confirmImport, setConfirmImport] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    const allCols = JSON.parse(localStorage.getItem("allColumns") || "null");
    const visibleCols = JSON.parse(
      localStorage.getItem("visibleColumns") || "null"
    );

    setAllColumns(allCols ?? [...defaultColumns]);
    setVisibleColumns(visibleCols ?? [...defaultColumns]);
  }, []);

  useEffect(() => {
    localStorage.setItem("allColumns", JSON.stringify(allColumns));
  }, [allColumns]);

  useEffect(() => {
    localStorage.setItem("visibleColumns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddNewField = () => {
    const formatted = newField.trim().toLowerCase();
    if (!formatted) return;

    const alreadyExists = allColumns.includes(formatted);
    if (!alreadyExists) {
      setAllColumns((prev) => [...prev, formatted]);
    }

    setVisibleColumns((prev) =>
      prev.includes(formatted) ? prev : [...prev, formatted]
    );

    setNewField("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleColumnToggle = (column: string) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column]
    );
  };

  const confirmImportCSV = () => {
    if (!confirmImport) return;
    Papa.parse(confirmImport, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const parsedData = results.data as DataTableType[];
        dispatch(setData(parsedData));
        setConfirmImport(null);
      },
      error: function (err) {
        alert("Invalid CSV format: " + err.message);
      },
    });
  };

  const validateCell = (column: string, value: string): string => {
    if (
      column === "email" &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      return "Invalid email format";
    }
    if (column === "age" && value && (isNaN(+value) || +value <= 0)) {
      return "Age must be a positive number";
    }
    return "";
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setConfirmImport(file);
  };

  const handleExport = () => {
    const csvContent = [
      visibleColumns.join(","),
      ...sortedRows.map((row: DataTableType) =>
        visibleColumns.map((col) => row[col] ?? "").join(",")
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "table_export.csv");
  };

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn as keyof typeof a];
    const valB = b[sortColumn as keyof typeof b];
    if (typeof valA === "number" && typeof valB === "number") {
      return sortDirection === "asc" ? valA - valB : valB - valA;
    }
    return sortDirection === "asc"
      ? valA.toString().localeCompare(valB.toString())
      : valB.toString().localeCompare(valA.toString());
  });

  const paginatedRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleCellChange = (idx: number, column: string, value: string) => {
    setEditableRows((prev) => ({
      ...prev,
      [idx]: { ...prev[idx], [column]: value },
    }));
    const error = validateCell(column, value);
    setValidationErrors((prev) => ({
      ...prev,
      [`${idx}-${column}`]: error,
    }));
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSaved(false);
  };

  const saveAllEdits = () => {
    const hasErrors = Object.values(validationErrors).some((err) => err);
    if (hasErrors) {
      alert("Please fix validation errors before saving.");
      return;
    }
    const updatedRows = [...rows];
    for (const idx in editableRows) {
      const i = parseInt(idx);
      updatedRows[i] = { ...updatedRows[i], ...editableRows[i] };
    }
    dispatch(setData(updatedRows));
    setEditableRows({});
    setValidationErrors({});
    setOpenSaved(true);
  };

  const cancelAllEdits = () => {
    setEditableRows({});
    setValidationErrors({});
  };

  const handleDeleteRow = (index: number) => {
    confirmDeleteRow();
    setConfirmDelete(index);
  };

  const confirmDeleteRow = () => {
    if (confirmDelete === null) return;
    const newData = [...rows];
    newData.splice(confirmDelete, 1);
    dispatch(setData(newData));
    setConfirmDelete(null);
    setOpenDelete(true);
  };

  const handleAddRow = () => {
    const newRow: DataTableType = {
      name: "",
      email: "",
      age: 0,
      role: "",
    };
    visibleColumns.forEach((col) => {
      newRow[col] = "";
    });
    dispatch(setData([...rows, newRow]));
  };
  const reorder = (list: string[], startIndex: number, endIndex: number) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = reorder(
      visibleColumns,
      result.source.index,
      result.destination.index
    );
    setVisibleColumns(reordered);
  };

  return (
    <div className="px-2">
      <Snackbar
        open={openSaved}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Data saved successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openDelete}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Row deleted successfully!
        </Alert>
      </Snackbar>

      <TextField
        label="Search"
        variant="outlined"
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
        className={`max-w-[30vw] bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--border-main)] rounded-md focus:outline-none focus:ring-2`}
      />

      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <Button
          onClick={handleAddRow}
          startIcon={<AddIcon />}
          variant="contained"
        >
          Add Row
        </Button>
        <Button onClick={() => setModalOpen(true)} variant="outlined">
          Manage Columns
        </Button>
        <Button variant="outlined" component="label">
          Import CSV
          <input type="file" accept=".csv" hidden onChange={handleImport} />
        </Button>
        <Button variant="outlined" onClick={handleExport} className="">
          Export CSV
        </Button>
        {Object.keys(editableRows).length > 0 && (
          <>
            <Button variant="contained" onClick={saveAllEdits}>
              Save All
            </Button>
            <Button variant="outlined" onClick={cancelAllEdits}>
              Cancel
            </Button>
          </>
        )}
      </Box>

      <Dialog open={!!confirmImport} onClose={() => setConfirmImport(null)}>
        <DialogTitle>Confirm Import</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to import and overwrite the table data?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmImport(null)}>Cancel</Button>
          <Button onClick={confirmImportCSV} variant="contained">
            Yes, Import
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this row?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button onClick={confirmDeleteRow} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Manage Columns</DialogTitle>
        <DialogContent>
          <FormGroup>
            {allColumns.map((col) => (
              <FormControlLabel
                key={col}
                control={
                  <Checkbox
                    checked={visibleColumns.includes(col)}
                    onChange={() => handleColumnToggle(col)}
                  />
                }
                label={col.charAt(0).toUpperCase() + col.slice(1)}
              />
            ))}
          </FormGroup>
          <TextField
            label="New Field"
            value={newField}
            onChange={(e) => setNewField(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAddNewField}>Add</Button>
        </DialogActions>
      </Dialog>

      {isMounted && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="columns" direction="horizontal">
                  {(provided) => (
                    <TableRow
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {visibleColumns.map((column, index) => (
                        <Draggable
                          key={column}
                          draggableId={column}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <TableCell
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => handleSort(column)}
                              style={{
                                ...provided.draggableProps.style,
                                cursor: "grab",
                                backgroundColor: snapshot.isDragging
                                  ? "#e0f2fe"
                                  : "inherit",
                              }}
                            >
                              {column.charAt(0).toUpperCase() + column.slice(1)}
                              {sortColumn === column
                                ? sortDirection === "asc"
                                  ? " ↑"
                                  : " ↓"
                                : ""}
                            </TableCell>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  )}
                </Droppable>
              </DragDropContext>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row, idx) => (
                <TableRow key={idx}>
                  {visibleColumns.map((column) => (
                    <TableCell key={column}>
                      <TextField
                        variant="standard"
                        value={
                          editableRows[idx]?.[column] ??
                          row[column as keyof typeof row] ??
                          ""
                        }
                        onChange={(e) =>
                          handleCellChange(idx, column, e.target.value)
                        }
                        type={column === "age" ? "number" : "text"}
                        error={!!validationErrors[`${idx}-${column}`]}
                        helperText={validationErrors[`${idx}-${column}`]}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <IconButton
                      onClick={() => handleDeleteRow(idx)}
                      color="error"
                    >
                      <DeleteIcon onClick={() => handleDeleteRow(idx)} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={sortedRows.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10]}
          />
        </TableContainer>
      )}
    </div>
  );
};

export default DataTable;

import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle,InputAdornment, DialogContent, DialogActions, Button, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, TextField, MenuItem, Select, InputLabel, FormControl, Pagination, IconButton } from '@mui/material';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';  // Font Awesome icons
import moment from 'moment';  // Import Moment.js

interface Reservation {
  _id: string;
  user_id: string;
  start_datetime: string;
  end_datetime: string;
  status: string;
  ITEMID: number;
}

interface ReservationsModalProps {
  open: boolean;
  onClose: () => void;
  ITEMID: number;
}

export function ReservationsModal({ open, onClose, ITEMID }: ReservationsModalProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [reservationDateFrom, setReservationDateFrom] = useState<string>('');
  const [reservationDateTo, setReservationDateTo] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('reservation_date');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = new URL(`http://localhost:8000/api/resources/${ITEMID}/reservations/`);
        
        // Add start_datetime to the query params
        if (reservationDateFrom) {
          url.searchParams.append('start_datetime', reservationDateFrom); // Send only the date, no time
        }
        
        // Add other filters to the query parameters
        if (userId) url.searchParams.append('user_id', userId);
        if (reservationDateFrom) url.searchParams.append('reservation_date_from', reservationDateFrom);
        if (reservationDateTo) url.searchParams.append('reservation_date_to', reservationDateTo);
        if (statusFilter) url.searchParams.append('status', statusFilter);
        url.searchParams.append('sort_by', sortBy);
        url.searchParams.append('sort_order', sortOrder);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('page_size', pageSize.toString());
  
        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(`No Reservations found for this ressource`);
        }
        const data = await response.json();
        setReservations(data.results);
        setTotalPages(Math.ceil(data.count / pageSize));
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (ITEMID) fetchReservations();
  }, [ITEMID, userId, reservationDateFrom, reservationDateTo, statusFilter, sortBy, sortOrder, page, pageSize]);
  

  const resetFilters = () => {
    setUserId('');
    setReservationDateFrom('');
    setStatusFilter('');
    setSortBy('reservation_date');
    setSortOrder('asc');
    setPage(1); 
  };

  // Format Date using Moment.js
  const formatDate = (dateString: string) => {
    if (!dateString) return '';  // Return empty string if no date
    return moment(dateString).format('MM/DD/YYYY HH:mm');  // Format using Moment.js
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Reservations for Book {ITEMID}</DialogTitle>
      <DialogContent>
        <div style={{ marginBottom: 20 }}>
          {/* User Search */}
          <TextField
            label="Search by User Name"
            variant="outlined"
            fullWidth
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          
          {/* Date Range Filters */}
          <div style={{ display: 'flex', gap: '10px' }}>
          <TextField
  label="Reservation Date"
  variant="outlined"
  type="date"
  value={reservationDateFrom}  // or the state you use for reservation date
  onChange={(e) => setReservationDateFrom(e.target.value)}  // Update state with new date
  style={{ flex: 1 }}
  InputLabelProps={{
    shrink: true,  // Ensures the label stays above the input field
  }}
  InputProps={{
    startAdornment: <InputAdornment position="start">📅</InputAdornment>,  // Adds a calendar icon to the left of the input (optional)
  }}
/>

           
          </div>

          {/* Status Filter */}
          <TextField
            label="Search by Status"
            variant="outlined"
            fullWidth
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ marginBottom: '10px' }}
            select
          >
            <MenuItem value="reserved">Reserved</MenuItem>
            <MenuItem value="not_reserved">Not Reserved</MenuItem>
          </TextField>

          {/* Sort By & Order */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FormControl style={{ flex: 1 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="reservation_date">Reservation Date</MenuItem>
                <MenuItem value="user_id">User Name</MenuItem>
              </Select>
            </FormControl>
            <IconButton
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              style={{ padding: '10px' }}
            >
              {sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
            </IconButton>
          </div>
        </div>

        {loading ? (
          <Typography>Loading reservations...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Paper style={{ marginTop: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Reservation Date</TableCell>
                  <TableCell>Return Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation._id}>
                    <TableCell>{reservation.user_id}</TableCell>
                    <TableCell>{formatDate(reservation.start_datetime)}</TableCell> {/* Format reservation date */}
                    <TableCell>{formatDate(reservation.end_datetime)}</TableCell> {/* Format return date */}
                    <TableCell>{reservation.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        {/* Pagination Controls */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={resetFilters} variant="outlined" color="secondary">Reset Filters</Button>
        <Button onClick={onClose} variant="contained" color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
}

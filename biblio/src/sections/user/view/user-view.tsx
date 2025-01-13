import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableContainer, TablePagination, Paper, TextField } from '@mui/material';

import { UserTableHead } from '../user-table-head';
import { UserTableRow } from '../user-table-row';

type UserData = {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string; // Add avatar URL if available from API
};

type UserViewProps = {};

export function UserView() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    // Fetch user data from the backend API with search query
    axios.get('http://127.0.0.1:8000/api/users/', {
      params: {
        name: searchQuery, // Pass search query to the API
        page: page + 1, // API expects 1-based page
        page_size: rowsPerPage,
      }
    })
      .then((response) => {
        const userData = response.data.results.map((user: any) => ({
          ...user,
          avatarUrl: '', // Add logic if avatar URL is available
        }));
        setUsers(userData);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [searchQuery, page, rowsPerPage]); // Trigger when search query, page, or rowsPerPage changes

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelected = users.map((user) => user._id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };
  
  

  const handleSelectRow = (userId: string) => {
    const selectedIndex = selected.indexOf(userId);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, userId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Paper>
      {/* Search Input */}
      <TextField
        label="Search by Name"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
      />

      <TableContainer>
        <Table aria-labelledby="tableTitle" size="medium">
          <UserTableHead
            order={order}
            orderBy={orderBy}
            numSelected={selected.length}
            rowCount={users.length}
            onSort={handleRequestSort}
            headLabel={[
              { id: 'name', label: 'Name' },
              { id: 'email', label: 'Email' },
              { id: 'role', label: 'Role' },
            ]}
            onSelectAllRows={handleSelectAllClick}
          />
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .sort((a, b) => {
                if (orderBy === 'name') {
                  return order === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
                }
                return 0;
              })
              .map((user) => (
                <UserTableRow
                  key={user._id}
                  row={user}
                  selected={selected.indexOf(user._id) !== -1}
                  onSelectRow={() => handleSelectRow(user._id)}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

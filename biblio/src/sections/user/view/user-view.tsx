import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';

// Mock data with basic fields that `UserTableRow` expects
const _users = [
  { id: '1', name: 'John Doe', role: 'Admin', status: 'Active', company: 'XYZ University', avatarUrl: '', isVerified: true },
  { id: '2', name: 'Jane Smith', role: 'Student', status: 'Inactive', company: 'ABC College', avatarUrl: '', isVerified: false },
  { id: '3', name: 'Mike Johnson', role: 'Librarian', status: 'Active', company: 'XYZ University', avatarUrl: '', isVerified: true },
];

export function UserView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]); // Track selected rows

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectRow = (id: string) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((item) => item !== id) : [...prevSelected, id]
    );
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Users
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New user
        </Button>
      </Box>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                orderBy="name"
                rowCount={_users.length}
                numSelected={selected.length}
                order="asc"
                onSort={() => {}}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'role', label: 'Role' },
                  { id: 'company', label: 'Institute' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
                onSelectAllRows={(checked: boolean) => {
                  setSelected(checked ? _users.map((user) => user.id) : []);
                }}
              />
              <TableBody>
                {_users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => handleSelectRow(row.id)}
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={page}
          count={_users.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Card>
    </DashboardContent>
  );
}

import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar, Box, Button, Card, Checkbox, Divider, Grid, IconButton, 
  InputAdornment, Link, Tab, Table, TableBody, TableCell, TableHead, 
  TablePagination, TableRow, Tabs, TextField, Tooltip
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import HttpIcon from '@material-ui/icons/Http';
import LaunchIcon from '@material-ui/icons/Launch';
import PublicTwoToneIcon from '@material-ui/icons/PublicTwoTone';
import VpnLockTwoToneIcon from '@material-ui/icons/VpnLockTwoTone';
// import getInitials from '../../../utils/getInitials';
import Scrollbar from '../../Scrollbar';
import SearchIcon from '../../../icons/Search';

// The following are rendered as sort options and used to set sort state
const sortOptions = [
  {
    label: 'Last update (newest)',
    value: 'updatedAt|desc'
  },
  {
    label: 'Last update (oldest)',
    value: 'updatedAt|asc'
  },
];

// Filter forms list based on search query or 'filters' object for tabs
const applyFilters = (forms, query, filters, showPrivate) => forms
  .filter((form) => {
    let matches = true;

    if (query) {
      // The 'properties' variable determines the fields that are searched 
      const properties = ['title', 'description'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (form[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    // Filter forms based on the Company Name value from the selected tab
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value && form.companyName !== key) {
        matches = false;
      }
    });

    // Filter out private forms when showPrivate is false
    if (!showPrivate) {
      if (form.isPrivate) {
        matches = false;
      }
    };

    return matches;
  });

const applyPagination = (forms, page, limit) => forms
  .slice(page * limit, page * limit + limit);

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
};

const getComparator = (order, orderBy) => (order === 'desc'
  ? (a, b) => descendingComparator(a, b, orderBy)
  : (a, b) => -descendingComparator(a, b, orderBy));

const applySort = (forms, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = forms.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    // @ts-ignore
    const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }

    // @ts-ignore
    return a[1] - b[1];
  });

  // @ts-ignore
  return stabilizedThis.map((el) => el[0]);
};

const CompanyFormsTable = (props) => {
  const navigate = useNavigate();

  const {
    forms,
    countSubmissions,
    setConfirmDialog,
    handleFormDelete,
    handleFormUpdate,
    handleDuplicateForm,
    handleCopyFormUrl,
    ...other
  } = props;

  const [currentTab, setCurrentTab] = useState('all');
  const [selectedForms, setSelectedForms] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const [filters, setFilters] = useState({
    hasAcceptedMarketing: null,
    isProspect: null,
    isReturning: null
  });
  const [showPrivate, setShowPrivate] = useState(true);

  // Update filters state for applyFilters (invoked by filteredForms on render)
  const handleTabsChange = (_event, value) => {
    const updatedFilters = {};
    if (value !== 'all') {
      updatedFilters[value] = true;
    }
    setFilters(updatedFilters);
    setSelectedForms([]);
    setCurrentTab(value);
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleSelectAllForms = (event) => {
    setSelectedForms(event.target.checked
      ? forms.map((form) => form.id)
      : []);
  };

  const handleSelectOneForm = (_event, formId) => {
    if (!selectedForms.includes(formId)) {
      setSelectedForms((prevSelected) => [...prevSelected, formId]);
    } else {
      setSelectedForms((prevSelected) => prevSelected
        .filter((id) => id !== formId));
    }
  };

  const handleDeleteSelectedForms = () => {
    selectedForms.forEach(formId => {
      handleFormDelete(formId)
    });
  };

  // Change Public/Private status to add/remove a form from home page
  const handleMakePublicPrivate = () => {
    const checkedForms = forms.filter(form => selectedForms.includes(form.id));
    checkedForms.forEach(form => {
      const updateFields = {
        isPrivate: !form.isPrivate
      };
      handleFormUpdate(form.id, updateFields);
    });
    setSelectedForms([]);
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  const filteredForms = applyFilters(forms, query, filters, showPrivate);
  const sortedForms = applySort(filteredForms, sort);
  const paginatedForms = applyPagination(sortedForms, page, limit);
  const enableBulkActions = selectedForms.length > 0;
  const selectedSomeForms = selectedForms.length > 0
    && selectedForms.length < forms.length;
  const selectedAllForms = selectedForms.length === forms.length;

  return (
    <Card {...other}>
      <Grid container display="flex">
        <Grid item xs={9}>
          <Tabs
            indicatorColor="primary"
            onChange={handleTabsChange}
            scrollButtons="auto"
            textColor="primary"
            value={currentTab}
            variant="scrollable"
          >
            <Tab
              key="all"
              label="All"
              value="all"
            />
            {Object.keys(
              forms.reduce(
                (acc, it) => (acc[it.company.name] = it, acc), []
              )).map((comp) => (
                <Tab
                  key={comp}
                  label={comp}
                  value={comp}
                />
              ))}
          </Tabs>
        </Grid>
        <Grid
          item xs={3}
          container
          direction="column"
          alignItems="flex-end"
          justify="flex-end"
          sx={{
            paddingTop: "6px",
            paddingRight: "16px",
            color: "primary"
          }}
        >
          <Button
            onClick={() => setShowPrivate(!showPrivate)}
            color="primary"
            sx={{ ml: 2 }}
            variant="outlined"
          >
            {showPrivate ? 'Hide Private Forms' : 'Show All Forms'}
          </Button>
        </Grid>
      </Grid>
      <Divider />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          m: -1,
          p: 2
        }}
      >
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 500
          }}
        >
          <TextField
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
            onChange={handleQueryChange}
            placeholder="Search forms"
            value={query}
            variant="outlined"
          />
        </Box>
        <Box
          sx={{
            m: 1,
            width: 240
          }}
        >
          <TextField
            label="Sort By"
            name="sort"
            onChange={handleSortChange}
            select
            SelectProps={{ native: true }}
            value={sort}
            variant="outlined"
          >
            {sortOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </TextField>
        </Box>
      </Box>
      {enableBulkActions && (
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              backgroundColor: 'background.paper',
              mt: '6px',
              position: 'absolute',
              px: '4px',
              width: '100%',
              zIndex: 2
            }}
          >
            <Checkbox
              checked={selectedAllForms}
              color="primary"
              indeterminate={selectedSomeForms}
              onChange={handleSelectAllForms}
            />
            <Button
              color="primary"
              sx={{ ml: 2 }}
              variant="outlined"
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: 'Delete form',
                  subtitle: `Are you sure you want to delete this 
                  form? It will be permanently removed, along with 
                  all associated images and responses. This action 
                  cannot be undone.`,
                  buttonText: 'Delete',
                  onConfirm: handleDeleteSelectedForms,
                })
              }}
            >
              Delete
            </Button>
            <Button
              color="primary"
              sx={{ ml: 2 }}
              variant="outlined"
              onClick={handleMakePublicPrivate}
            >
              Make Public/Private
            </Button>
          </Box>
        </Box>
      )}
      <Scrollbar>
        <Box sx={{ minWidth: 700 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAllForms}
                    color="primary"
                    indeterminate={selectedSomeForms}
                    onChange={handleSelectAllForms}
                  />
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Company
                </TableCell>
                <TableCell>
                  Description
                </TableCell>
                <TableCell align="center">
                  Responses
                </TableCell>
                <TableCell align="center">
                  Form Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedForms.map(form => {
                const isFormSelected = selectedForms.includes(form.id);
                return (
                  <TableRow
                    hover
                    key={form.id}
                    selected={isFormSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isFormSelected}
                        color="primary"
                        onChange={(event) => handleSelectOneForm(event, form.id)}
                        value={isFormSelected}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        {/* <Avatar
                          src={form.avatar}
                          sx={{
                            height: 42,
                            width: 42
                          }}
                        >
                          {getInitials(form.title)}
                        </Avatar> */}
                        {form.isPrivate ?
                          <VpnLockTwoToneIcon fontSize="large" />
                          : <PublicTwoToneIcon fontSize="large" />
                        }
                        <Box sx={{ ml: 1 }}>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/dashboard/form-analytics/${form.id}`}
                            variant="subtitle2"
                          >
                            {form.title}
                          </Link>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {form.company.name}
                    </TableCell>
                    <TableCell>
                      {`${form.description.substring(0, 60)}
                      ${form.description.length > 60 ? '...' : ''}`}
                    </TableCell>
                    <TableCell align="center">
                      {`${countSubmissions(form.id)}`}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Copy URL">
                        <IconButton
                          onClick={() => handleCopyFormUrl(form.id)}>
                          <HttpIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Go to">
                        <IconButton
                          onClick={() => navigate(`/form/${form.id}`)}>
                          <LaunchIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Duplicate">
                        <IconButton
                          onClick={() => handleDuplicateForm(form)}
                        >
                          <FileCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={filteredForms.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

CompanyFormsTable.propTypes = {
  forms: PropTypes.array,
  countSubmissions: PropTypes.func,
  setConfirmDialog: PropTypes.func,
  handleFormDelete: PropTypes.func,
  handleDuplicateForm: PropTypes.func,
};

export default CompanyFormsTable;

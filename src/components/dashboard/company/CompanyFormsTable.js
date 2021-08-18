import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography
} from '@material-ui/core';
import ArrowRightIcon from '../../../icons/ArrowRight';
import PencilAltIcon from '../../../icons/PencilAlt';
import SearchIcon from '../../../icons/Search';
import getInitials from '../../../utils/getInitials';
import Scrollbar from '../../Scrollbar';

// This array is no longer used. Tab label/value comes from forms.reduce function now
const tabs = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Accepts Marketing',
    value: 'hasAcceptedMarketing'
  },
  {
    label: 'Prospect',
    value: 'isProspect'
  },
  {
    label: 'Returning',
    value: 'isReturning'
  }
];

// This array IS BEING USED
const sortOptions = [
  {
    label: 'Last update (newest)',
    value: 'updatedAt|desc'
  },
  {
    label: 'Last update (oldest)',
    value: 'updatedAt|asc'
  },
  {
    label: 'Total orders (highest)',
    value: 'orders|desc'
  },
  {
    label: 'Total orders (lowest)',
    value: 'orders|asc'
  }
];

const applyFilters = (forms, query, filters) => forms
  .filter((form) => {
    let matches = true;

    if (query) {
      // "properties" determines the fields that are searched for matching values in the query
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

    // This is where we will sort based on the Company name from the selected tab
    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && form[key] !== value) {
        matches = false;
      }
    });

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
  const { forms, ...other } = props;
  const [currentTab, setCurrentTab] = useState('all');
  console.log('currentTab', currentTab)
  const [selectedForms, setSelectedForms] = useState([]);
  console.log('selected forms', selectedForms)
  const [companyIds, setCompanyIds] = useState(['All']);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const [filters, setFilters] = useState({
    hasAcceptedMarketing: null,
    isProspect: null,
    isReturning: null
  });
  console.log('filters', filters)

  const handleTabsChange = (event, value) => {
    const updatedFilters = {
      ...filters,
      hasAcceptedMarketing: null,
      isProspect: null,
      isReturning: null
    };

    if (value !== 'all') {
      updatedFilters[value] = true;
    }

    // The below setFilters(updatedFilters) function needs to be added back in once the updateFilters
    // keys are replaced with the Company names

    // setFilters(updatedFilters);
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

  const handleSelectOneForm = (event, formId) => {
    if (!selectedForms.includes(formId)) {
      setSelectedForms((prevSelected) => [...prevSelected, formId]);
    } else {
      setSelectedForms((prevSelected) => prevSelected.filter((id) => id !== formId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  const filteredForms = applyFilters(forms, query, filters);
  const sortedForms = applySort(filteredForms, sort);
  const paginatedForms = applyPagination(sortedForms, page, limit);
  const enableBulkActions = selectedForms.length > 0;
  const selectedSomeForms = selectedForms.length > 0
    && selectedForms.length < forms.length;
  const selectedAllForms = selectedForms.length === forms.length;

  return (
    <Card {...other}>
      <Tabs
        indicatorColor="primary"
        onChange={handleTabsChange}
        scrollButtons="auto"
        textColor="primary"
        value={currentTab}
        variant="scrollable"
      >
        {/* {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
          />
        ))} */}
        <Tab
          key="all"
          label="All"
          value="all"
        />
        {Object.keys(forms.reduce((acc, it) => (acc[it.company.name] = it, acc), [])).map((comp) => (
          <Tab
            key={comp}
            label={comp}
            value={comp}
          />
        ))}
      </Tabs>
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
            >
              Delete
            </Button>
            <Button
              color="primary"
              sx={{ ml: 2 }}
              variant="outlined"
            >
              Edit
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
                {/* <TableCell>
                  Spent
                </TableCell> */}
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedForms.map((form) => {
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
                        <Avatar
                          src={form.avatar}
                          sx={{
                            height: 42,
                            width: 42
                          }}
                        >
                          {getInitials(form.title)}
                        </Avatar>
                        <Box sx={{ ml: 1 }}>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to="/dashboard/forms/1"
                            variant="subtitle2"
                          >
                            {form.title}
                          </Link>
                          <Typography
                            color="textSecondary"
                            variant="body2"
                          >
                            {form.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {form.company.name}
                    </TableCell>
                    <TableCell>
                      {/* {form.description} */}
                      {`${form.description.substring(0, 80)}${form.description.length > 80 ? '...' : ''}`}
                    </TableCell>
                    {/* <TableCell>
                      {numeral(form.totalAmountSpent)
                        .format(`${form.currency}0,0.00`)}
                    </TableCell> */}
                    <TableCell align="right">
                      <IconButton
                        component={RouterLink}
                        to="/dashboard/forms/1/edit"
                      >
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        component={RouterLink}
                        to="/dashboard/forms/1"
                      >
                        <ArrowRightIcon fontSize="small" />
                      </IconButton>
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
  forms: PropTypes.array.isRequired
};

export default CompanyFormsTable;

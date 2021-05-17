import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Button, Container, Grid, Link, Typography } from '@material-ui/core';
import {
  FinanceCostBreakdown,
  FinanceOverview,
  FinanceIncrementalSales,
  FinanceProfitableProducts,
  FinanceSalesByContinent,
  FinanceSalesRevenue
} from '../../components/dashboard/finance';
import useSettings from '../../hooks/useSettings';
import ChevronDownIcon from '../../icons/ChevronDown';
import ChevronRightIcon from '../../icons/ChevronRight';
import DownloadIcon from '../../icons/Download';
import gtm from '../../lib/gtm';

const Finance = () => {
  const { settings } = useSettings();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard: Finance | VALIDATE</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid
            container
            justifyContent="space-between"
            spacing={3}
          >
            <Grid item>
              <Typography
                color="textPrimary"
                variant="h5"
              >
                Finance
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small" />}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard"
                  variant="subtitle2"
                >
                  Dashboard
                </Link>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                >
                  Finance
                </Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item>
              <Button
                endIcon={<DownloadIcon fontSize="small" />}
                variant="outlined"
              >
                Export
              </Button>
              <Button
                color="primary"
                endIcon={<ChevronDownIcon fontSize="small" />}
                sx={{ ml: 2 }}
                variant="contained"
              >
                Last month
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
              >
                <FinanceOverview />
              </Grid>
              <Grid
                item
                md={8}
                xs={12}
              >
                <FinanceSalesRevenue />
              </Grid>
              <Grid
                item
                md={4}
                xs={12}
              >
                <FinanceCostBreakdown />
              </Grid>
              <Grid
                item
                md={8}
                xs={12}
              >
                <FinanceSalesByContinent />
              </Grid>
              <Grid
                item
                md={4}
                xs={12}
              >
                <FinanceIncrementalSales />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <FinanceProfitableProducts />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Finance;

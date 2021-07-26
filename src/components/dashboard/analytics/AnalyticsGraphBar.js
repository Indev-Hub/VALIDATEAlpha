import React from 'react'
import Chart from 'react-apexcharts';
import { Box, Card, Grid, Typography } from '@material-ui/core';
import { alpha, useTheme } from '@material-ui/core/styles';

// const BarChart = () => {
//   const theme = useTheme();

//   const chart = {
//     options: {
//       chart: {
//         background: 'transparent',
//         toolbar: {
//           show: false
//         },
//         zoom: {
//           enabled: true
//         }
//       },
//       colors: ['#7783DB'],
//       dataLabels: {
//         enabled: false
//       },
//       grid: {
//         show: false
//       },
//       states: {
//         normal: {
//           active: {
//             filter: {
//               type: 'none'
//             }
//           },
//           filter: {
//             type: 'none',
//             value: 0
//           }
//         }
//       },
//       stroke: {
//         width: 0
//       },
//       theme: {
//         mode: theme.palette.mode
//       },
//       tooltip: {
//         enabled: true
//       },
//       xaxis: {
//         type: 'category',
//         axisBorder: {
//           show: false
//         },
//         axisTicks: {
//           show: false
//         },
//         labels: {
//           show: true
//         }
//       },
//       yaxis: {
//         show: true
//       }
//     },
//     series: [
//       {
//         data: [
//           {
//             x: 'pic 1',
//             y: 10
//           },
//           {
//             x: 'pic 2',
//             y: 35
//           },
//           {
//             x: 'pic 3',
//             y: 50
//           },
//           {
//             x: 'pic 4',
//             y: 3
//           }
//         ]
//       }
//     ]
//   };

//   return (
//     <Chart
//       type="bar"
//       width="100%"
//       {...chart}
//     />
//   );
// };

const AnalyticsGraphBar = (props) => {
  const theme = useTheme();

  const chart = {
    options: {
      chart: {
        background: 'transparent',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: true
        }
      },
      colors: ['#7783DB'],
      dataLabels: {
        enabled: false
      },
      grid: {
        show: false
      },
      states: {
        normal: {
          active: {
            filter: {
              type: 'none'
            }
          },
          filter: {
            type: 'none',
            value: 0
          }
        }
      },
      stroke: {
        width: 0
      },
      theme: {
        mode: theme.palette.mode
      },
      tooltip: {
        enabled: true
      },
      xaxis: {
        type: 'category',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: true
        }
      },
      yaxis: {
        show: true
      }
    },
    series: [
      {
        data: [
          {
            x: 'pic 1',
            y: 10
          },
          {
            x: 'pic 2',
            y: 35
          },
          {
            x: 'pic 3',
            y: 50
          },
          {
            x: 'pic 4',
            y: 3
          }
        ]
      }
    ]
  };



  return (
    <Grid
      container
      spacing={2}
    >
    <Grid
        item
        md={12}
        sm={12}
        xs={12}
      >
        <Card>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              p: 3
            }}
          >
            <div>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Conversions
              </Typography>
              <Typography
                color="textPrimary"
                sx={{ mt: 1 }}
                variant="h5"
              >
                131,3K
              </Typography>
            </div>
            <Chart
              type="bar"
              width="500"
              height="250"
              {...chart}
            />
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AnalyticsGraphBar

import React from 'react'
import Chart from 'react-apexcharts';
import { Box, Card, Grid, Typography } from '@material-ui/core';
import { alpha, useTheme } from '@material-ui/core/styles';
import { jsonParse } from './jsonModifier';

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
  const { answers } = props;
  console.log('result from prop analytics', answers)
  const pAnswers = answers.replace(/\\"/g, '"')
  console.log('replace string escapes', pAnswers)

  const theme = useTheme();

  const barData =
    {
      'q1': 'What answer?',
      'a1': {'title': 'Seattle', 'count': 20},
      'a2': {'title': 'New Jersey', 'count': 5},
      'a3': {'title': 'Memphis', 'count': 3},
      'a4': {'title': 'New York', 'count': 24},
      'a5': {'title': 'Georgia', 'count': 11}
    }

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
    // This is where we have to find out how to add the "answer" to the x axis and the "count"
    // (how many times that answer was selected) to the y axis. I believe it will be a prop passed
    // in from AnalyticsSubmissions.js where this component will be placed.
    series: [
      {
        data: [
          {
            x: barData.a1.title,
            y: barData.a1.count
          },
          {
            x: barData.a2.title,
            y: barData.a2.count
          },
          {
            x: barData.a3.title,
            y: barData.a3.count
          },
          {
            x: barData.a4.title,
            y: barData.a4.count
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

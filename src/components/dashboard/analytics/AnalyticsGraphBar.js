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
  const { fullData, question, answers } = props;
  // console.log('result from prop analytics', answers)

  const theme = useTheme();

  // Count the number of each answer for questions
  let countAnswers = answers.reduce((acc, curr)=>{
    const ans = curr.q2.answer;
    acc[ans] = (acc[ans] || 0) + 1;
    return acc;
  }, {});
  console.log('countAnswers', countAnswers);

  const answerArray = Object.entries(countAnswers).map(([key, value]) => ({[key]: value}))
  console.log('answerArray', answerArray);


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
            x: Object.keys(answerArray[0]),
            y: Object.values(answerArray[0])
          },
          {
            x: Object.keys(answerArray[1]),
            y: Object.values(answerArray[1])
          },
          {
            x: Object.keys(answerArray[2]),
            y: Object.values(answerArray[2])
          }
        ]
      }
    ]
  };

  return (
    <Card
      sx={{
        p:4
      }}
    >
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
          <Typography
            color="textPrimary"
            variant="h5"
          >
            {question}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Chart
            type="bar"
            width="100%"
            height="250"
            {...chart}
          />
        </Grid>
      </Grid>
    </Card>
  )
}

export default AnalyticsGraphBar

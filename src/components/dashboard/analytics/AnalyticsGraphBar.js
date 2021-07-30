import React from 'react'
import Chart from 'react-apexcharts';
import { Card, Grid, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

const AnalyticsGraphBar = props => {
  const theme = useTheme();
  const { question, answerOptions, answerType, aggregatedAnswers } = props;

  // Answer types dictate how chart values are calculated
  const countTypes = ['Checkbox', 'Dropdown', 'Radio Group', 'Switch']
  const avgTypes = ['Rating', 'Number']

  // Tally answers into {answerOption: count/avg} pairs based on type
  let talliedAnswers = {};
  if (countTypes.includes(answerType)) {
    answerOptions.forEach(option => {
      talliedAnswers[option] = 0;
    });
    aggregatedAnswers.forEach(answer => {
      talliedAnswers[answer]++;
    });
  } else if (avgTypes.includes(answerType)) {
    const summedAnswers = aggregatedAnswers.reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
    talliedAnswers["Average Response"] = summedAnswers / aggregatedAnswers.length;
  }

  // Create x-axis categories and y-axis values from talliedAnswers
  let chartData = [];
  for (const answerOption in talliedAnswers) {
    chartData.push(
      {
        x: answerOption,
        y: talliedAnswers[answerOption],
      }
    );
  };

  // Configure chart; pass chartData to data in series property
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
        data: [...chartData]
      }
    ]
  };

  // Render single chart component
  return (
    <Card
      sx={{
        p: 4
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

export default AnalyticsGraphBar;

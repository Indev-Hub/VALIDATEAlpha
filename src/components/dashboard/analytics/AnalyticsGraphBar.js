import React from 'react';
import { Card, Grid, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import ImagesLegend from './ImagesLegend';

const AnalyticsGraphBar = (props) => {
  const theme = useTheme();
  const { question, answerOptions, answerType, aggregatedAnswers } = props;

  // Answer types dictate how chart values are calculated
  const countTypes = [
    'Checkbox',
    'Dropdown',
    'Images',
    'Radio Group',
    'Switch',
  ];
  const avgTypes = ['Rating', 'Number'];

  // Tally answers into {answerOption: count/avg} pairs based on type
  let talliedAnswers = {};
  if (countTypes.includes(answerType)) {
    answerOptions.forEach((option) => {
      talliedAnswers[option] = 0;
    });
    aggregatedAnswers.forEach((answer) => {
      talliedAnswers[answer]++;
    });
  } else if (avgTypes.includes(answerType)) {
    const summedAnswers = aggregatedAnswers.reduce(
      (acc, curr) => parseInt(acc) + parseInt(curr),
      0
    );
    talliedAnswers['Average Response'] =
      summedAnswers / aggregatedAnswers.length;
  }

  // Set category labels and construct chart data set
  let chartData = [];
  let labelCounter = 1;
  const imageFileKeysAndLabels = {};
  for (const answerOption in talliedAnswers) {
    let categoryLabel = answerOption;
    if (answerOption.includes('/image-')) {
      const label = `Image ${labelCounter}`;
      imageFileKeysAndLabels[answerOption] = label;
      labelCounter++;
      categoryLabel = label;
    }
    chartData.push({
      x: categoryLabel,
      y: talliedAnswers[answerOption],
    });
  }

  // Configure chart; pass chartData to data in series property
  const chart = {
    options: {
      chart: {
        background: 'transparent',
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: true,
        },
      },
      colors: ['#7783DB'],
      dataLabels: {
        enabled: false,
      },
      grid: {
        show: false,
      },
      states: {
        normal: {
          active: {
            filter: {
              type: 'none',
            },
          },
          filter: {
            type: 'none',
            value: 0,
          },
        },
      },
      stroke: {
        width: 0,
      },
      theme: {
        mode: theme.palette.mode,
      },
      tooltip: {
        enabled: true,
      },
      xaxis: {
        type: 'category',
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: true,
        },
      },
      yaxis: {
        show: true,
      },
    },
    series: [
      {
        data: [...chartData],
      },
    ],
  };

  // Render single chart component
  return (
    <Card sx={{ p: 4 }}>
      <Grid container spacing={2}>
        <Grid item md={12} sm={12} xs={12}>
          <Typography color='textPrimary' variant='h5'>
            {question}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Chart type='bar' width='100%' height='250' {...chart} />
        </Grid>
      </Grid>
      {answerType === 'Images' && (
        <ImagesLegend
          imageFileKeysAndLabels={Object.entries(imageFileKeysAndLabels)}
        />
      )}
    </Card>
  );
};

AnalyticsGraphBar.propTypes = {
  question: PropTypes.string,
  answerOptions: PropTypes.array,
  answerType: PropTypes.string,
  aggregatedAnswers: PropTypes.array,
};

export default AnalyticsGraphBar;

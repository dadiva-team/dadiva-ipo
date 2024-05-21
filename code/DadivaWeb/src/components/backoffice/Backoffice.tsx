import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const series = [{ data: [-2, -9, 12, 11, 6, -4] }];

export function Backoffice() {
  return (
    <BarChart
      height={300}
      grid={{ horizontal: true }}
      series={series}
      margin={{
        top: 10,
        bottom: 20,
      }}
      yAxis={[
        {
          colorMap: {
            type: 'continuous',
            min: -10,
            max: 10,
            color: ['red', 'green'],
          },
        },
      ]}
      xAxis={[
        {
          scaleType: 'band',
          data: [
            new Date(2019, 1, 1),
            new Date(2020, 1, 1),
            new Date(2021, 1, 1),
            new Date(2022, 1, 1),
            new Date(2023, 1, 1),
            new Date(2024, 1, 1),
          ],
          valueFormatter: value => value.getFullYear().toString(),
          colorMap: undefined,
        },
      ]}
    />
  );
}

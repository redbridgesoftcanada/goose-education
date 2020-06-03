import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { BarChart, Bar, Tooltip, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';

export default function Chart({ data }) {
  const theme = useTheme();

  return (
    <>
      <Title>{data.name}</Title>
      <ResponsiveContainer>
        <BarChart
          data={data.plots}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey={data.xAxisKey} stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              {data.dataKey}
            </Label>
          </YAxis>
          <Tooltip/>
          <Bar dataKey={data.dataKey} fill={theme.palette.secondary.main} barSize={50}/>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
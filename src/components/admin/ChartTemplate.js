import React from 'react';
import { useTheme } from '@material-ui/core';
import { BarChart, Bar, Tooltip, XAxis, YAxis, Label, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Title from './Title';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Chart(props) {
  const theme = useTheme();

  const { chart, data } = props;

  if (!data) return null;

  const renderPieLegend = dataPlots => {
    return dataPlots.map((entry, i) => (
      { value: entry.Name, type: 'square', id:`item-${i}`, color: COLORS[i % COLORS.length] }));
  }

  return (
    <>
      <Title>{(data.name !== 'schools') ? data.name : "Applications Per School"}</Title>

      {chart === 'bar' &&
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
      }

      {chart === 'pie' &&
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data.plots}
            outerRadius={80}
            fill="#8884d8"
            dataKey={data.dataKey}>
            {data.plots.map((entry, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Legend layout="vertical" verticalAlign="middle" align="right" payload={renderPieLegend(data.plots)}/>
        </PieChart>
      </ResponsiveContainer>
      }
    </>
  );
}
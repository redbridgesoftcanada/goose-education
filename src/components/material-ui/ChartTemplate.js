import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { BarChart, Bar, Tooltip, XAxis, YAxis, Label, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Title from './Title';

export default function Chart(props) {
  const theme = useTheme();

  const { type, data } = props;
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  return (
    <>
      <Title>{data.name}</Title>

      {type === 'bar' &&
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

      {type === 'pie' &&
        <PieChart width={800} height={400}>
          <Pie
            data={data.plots}
            cx={120}
            cy={200}
            outerRadius={80}
            fill="#8884d8"
            dataKey={data.dataKey}
          >
            {data.plots.map((entry, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
        </PieChart>
      }
    </>
  );
}
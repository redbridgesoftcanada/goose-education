import React, { useRef } from 'react';
import { useTheme } from '@material-ui/core';
import { red, pink, deepPurple, indigo, blue, cyan, teal, orange } from '@material-ui/core/colors';
import { BarChart, Bar, Tooltip, XAxis, YAxis, Label, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Title from './Title';

const muiHues = [red, pink, deepPurple, indigo, blue, cyan, teal, orange];
const muiShades = [200, 300, 400, 500];

function createColourPalette(entries) {  
  const palette = [];
  do {
    const rHue = muiHues[Math.floor(Math.random() * muiHues.length)];
    const rShade = muiShades[Math.floor(Math.random() * muiShades.length)];
    
    if (!palette.includes(rHue[rShade])) palette.push(rHue[rShade]);
  } 
  while (palette.length <= entries);

  return palette;
}

export default function Chart(props) {
  const theme = useTheme();

  const { chart, data } = props;

  const COLORS = useRef(null);
  if (data && !COLORS.current) COLORS.current = createColourPalette(data.plots.length);

  const renderPieLegend = dataPlots => {
    return dataPlots.map((entry, i) => (
      { value: entry.Name, type: 'square', id:`item-${i}`, color: COLORS.current[i % COLORS.current.length] }));
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
            <YAxis allowDecimals={false} stroke={theme.palette.text.secondary}>
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
      <ResponsiveContainer width={500} height="100%">
        <PieChart>
          <Pie
            data={data.plots}
            outerRadius={80}
            fill="#8884d8"
            dataKey={data.dataKey}>
            {data.plots.map((entry, i) => <Cell key={`cell-${i}`} fill={COLORS.current[i % COLORS.current.length]} />)}
          </Pie>
          <Legend layout="vertical" verticalAlign="middle" align="right" payload={renderPieLegend(data.plots)}/>
        </PieChart>
      </ResponsiveContainer>
      }
    </>
  );
}
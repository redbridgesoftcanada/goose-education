import React from 'react';
import LinkButton from '../customMUI/linkButton';

export default function Networking() {
  return (
    <LinkButton 
      to={{ pathname: '/networking', state: { selected: 0 } }}
      label='Networking'/>
)};
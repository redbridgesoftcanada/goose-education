import React from 'react';
import LinkButton from '../customMUI/linkButton';

export default function StudyAbroadCounselling() {
  return (
    <LinkButton 
      to={{pathname: '/services', state: { selected: 1 }}}
      label='Study Abroad Counselling'/>
)};
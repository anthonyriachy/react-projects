/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';

// eslint-disable-next-line max-len
export default function IssueEdit({ match }) { // all routed components are provided an object called match
  const { id } = match.params;
  return (
    <h2>{`This is a placeholder for editing issue ${id}`}</h2>
  );
}

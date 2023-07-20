/* eslint-disable linebreak-style */
/* eslint-disable react/destructuring-assignment */
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
import { Link } from 'react-router-dom';
function IssueRow(props) {
  return (
    <tr>
      <td>{props.issue.id}</td>
      <td>{props.issue.status}</td>
      <td>{props.issue.owner}</td>
      <td>{props.issue.created.toDateString()}</td>
      <td>{props.issue.effort}</td>
      <td>{props.issue.due ? props.issue.due.toDateString() : ' '}</td>
      <td>{props.issue.title}</td>
      <td><Link to={`/edit/${props.issue.id}`}>Edit</Link></td>
    </tr>
  );
}

export default function IssueTable({ issues }) {
  const issueRows = issues.map(issue => (
    <IssueRow key={issue.id} issue={issue} />
  ));
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Due Date</th>
          <th>Title</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>{issueRows}</tbody>
    </table>
  );
}

/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/sort-comp */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint "react/jsx-no-undef": "off" */

import React from 'react';
import IssueFilter from './IssueFilter.jsx';
import IssueTable from './IssueTable.jsx';
import IssueAdd from './IssueAdd.jsx';
import graphQLFetch from './graphQLFetch.js';

export default class IssueList extends React.Component {
  constructor() {
    super();

    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this); 
    //! !!!!!!!!!111 this  is very important it won't work without it
  }

  async loadData() {
    //   //check 123 very important
    const query = `query {
          issueList {
          _id id title status owner
          created effort due
          }
        }`;

    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ issues: data.issueList });
    }
  }

  componentDidMount() {
    // see if the ui is loaded
    this.loadData(); // if yes load the data
  }

  async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
          issueAdd(issue: $issue) {
          id
          }
          }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
      this.loadData();
    }
  }

  render() {
    const { issues } = this.state;
    return (
      <React.Fragment>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr />
        <IssueTable issues={issues} />
        <hr />
        <IssueAdd createIssue={this.createIssue} />
        {/* Add createIssue prop */}
      </React.Fragment>
    );
  }
}
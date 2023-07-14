/* eslint-disable linebreak-style */
/* eslint-disable react/sort-comp */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */

/* eslint-disable import/no-unresolved */
// const sampleIssue = {
//   status: "New",
//   owner: "Pieta",
//   title: "Completion date should be optional",
// };

/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM */
/* eslint "react/jsx-no-undef": "off" */

/* globals React ReactDOM PropTypes */
// for prototypes

import graphQLFetch from './graphQLFetch.js';

class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault(); // to stop it from submitting it
    const form = document.forms.addForm;

    const issue = {
      owner: form.owner.value,
      title: form.title.value,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
    };

    const { createIssue } = this.props;
    createIssue(issue);
    form.owner.value = ''; // rest the input field
    form.title.value = '';
  }

  render() {
    return (
      <form name="addForm" className="form-class" onSubmit={this.handleSubmit}>
        {/* handleSubmit expects a event object (e) */}
        <input type="text" name="owner" placeholder="Owner" />
        <input type="text" name="title" placeholder="Title" />
        <button type="submit">Add</button>
      </form>
    );
  }
}

IssueAdd.propTypes = {
  createIssue: PropTypes.func.isRequired,
};

// eslint-disable-next-line react/prefer-stateless-function
class IssueFilter extends React.Component {
  render() {
    return <div>IssueFilter</div>;
  }
}

function IssueRow(props) {
  console.log(props.issue+" issuelog")
  return (
    <tr>
      <td>{props.issue.id}</td>
      <td>{props.issue.status}</td>
      <td>{props.issue.owner}</td>
      <td>{props.issue.created.toDateString()}</td>
      <td>{props.issue.effort}</td>
      <td>{props.issue.due ? props.issue.due.toDateString() : ' '}</td>
      <td>{props.issue.title}</td>
    </tr>
  );
}

function IssueTable({ issues }) {
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
        </tr>
      </thead>
      <tbody>{issueRows}</tbody>
    </table>
  );
}

class App extends React.Component {
  constructor() {
    super();

    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this); //! !!!!!!!!!111 this  is very important it won't work without it
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

ReactDOM.render(<App />, document.getElementById('root'));

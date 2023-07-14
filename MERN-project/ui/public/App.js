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
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10)
    };
    const {
      createIssue
    } = this.props;
    createIssue(issue);
    form.owner.value = ''; // rest the input field
    form.title.value = '';
  }
  render() {
    return /*#__PURE__*/React.createElement("form", {
      name: "addForm",
      className: "form-class",
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "owner",
      placeholder: "Owner"
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "title",
      placeholder: "Title"
    }), /*#__PURE__*/React.createElement("button", {
      type: "submit"
    }, "Add"));
  }
}
IssueAdd.propTypes = {
  createIssue: PropTypes.func.isRequired
};

// eslint-disable-next-line react/prefer-stateless-function
class IssueFilter extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("div", null, "IssueFilter");
  }
}
function IssueRow(props) {
  const {
    issue
  } = props;
  return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, issue.id), /*#__PURE__*/React.createElement("td", null, issue.status), /*#__PURE__*/React.createElement("td", null, issue.owner), /*#__PURE__*/React.createElement("td", null, issue.created.toDateString()), /*#__PURE__*/React.createElement("td", null, issue.effort), /*#__PURE__*/React.createElement("td", null, issue.due ? issue.due.toDateString() : ' '), /*#__PURE__*/React.createElement("td", null, issue.title));
}
function IssueTable({
  issues
}) {
  const issueRows = issues.map(issue => /*#__PURE__*/React.createElement(IssueRow, {
    key: issue.id,
    issue: issue
  }));
  return /*#__PURE__*/React.createElement("table", {
    className: "bordered-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "ID"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Owner"), /*#__PURE__*/React.createElement("th", null, "Created"), /*#__PURE__*/React.createElement("th", null, "Effort"), /*#__PURE__*/React.createElement("th", null, "Due Date"), /*#__PURE__*/React.createElement("th", null, "Title"))), /*#__PURE__*/React.createElement("tbody", null, issueRows));
}
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      issues: []
    };
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
      this.setState({
        issues: data.issueList
      });
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
    const data = await graphQLFetch(query, {
      issue
    });
    if (data) {
      this.loadData();
    }
  }
  render() {
    const {
      issues
    } = this.state;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", null, "Issue Tracker"), /*#__PURE__*/React.createElement(IssueFilter, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(IssueTable, {
      issues: issues
    }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(IssueAdd, {
      createIssue: this.createIssue
    }));
  }
}
ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('root'));
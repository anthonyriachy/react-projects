const initialIssues = [{
  id: 1,
  status: "New",
  owner: "Ravan",
  effort: 5,
  created: new Date("2018-08-15"),
  due: undefined,
  title: "Error in console when clicking Add"
}, {
  id: 2,
  status: "Assigned",
  owner: "Eddie",
  effort: 14,
  created: new Date("2018-08-16"),
  due: new Date("2018-08-30"),
  title: "Missing bottom border on panel"
}];
// const sampleIssue = {
//   status: "New",
//   owner: "Pieta",
//   title: "Completion date should be optional",
// };

class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault(); //to stop it from submitting it 
    const form = document.forms.addForm;
    const issue = {
      owner: form.owner.value,
      title: form.title.value,
      status: 'new'
    };
    this.props.createIssue(issue);
    form.owner.value = ""; //rest the input field
    form.title.value = "";
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
    }), /*#__PURE__*/React.createElement("button", null, "Add"));
  }
}
class IssueFilter extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("div", null, "IssueFilter");
  }
}
function IssueRow(props) {
  return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, props.issue.id), /*#__PURE__*/React.createElement("td", null, props.issue.status), /*#__PURE__*/React.createElement("td", null, props.issue.owner), /*#__PURE__*/React.createElement("td", null, props.issue.created.toDateString()), /*#__PURE__*/React.createElement("td", null, props.issue.effort), /*#__PURE__*/React.createElement("td", null, props.issue.due ? props.issue.due.toDateString() : ""), /*#__PURE__*/React.createElement("td", null, props.issue.title));
}
function IssueTable(props) {
  const issueRows = props.issues.map(issue => /*#__PURE__*/React.createElement(IssueRow, {
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
    this.createIssue = this.createIssue.bind(this); //!!!!!!!!!!111 this  is very important it won't work without it
  }

  loadData() {
    setTimeout(() => {
      this.setState({
        issues: initialIssues
      });
    }, 500);
  }
  componentDidMount() {
    // see if the ui is loaded
    this.loadData(); //if yes load the data
  }

  createIssue(issue) {
    issue.id = this.state.issues.length + 1;
    issue.created = new Date();
    const newIssueList = this.state.issues.slice(); //slice is use to make a COPY of the array
    newIssueList.push(issue);
    this.setState({
      issues: newIssueList
    });
  }
  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", null, "Issue Tracker"), /*#__PURE__*/React.createElement(IssueFilter, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(IssueTable, {
      issues: this.state.issues
    }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(IssueAdd, {
      createIssue: this.createIssue
    }), " ");
  }
}
ReactDOM.createRoot(document.getElementById("root")).render( /*#__PURE__*/React.createElement(App, null));
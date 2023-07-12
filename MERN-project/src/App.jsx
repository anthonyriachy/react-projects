// const sampleIssue = {
//   status: "New",
//   owner: "Pieta",
//   title: "Completion date should be optional",
// };

const dateRegex = new RegExp("^\\d\\d\\d\\d-\\d\\d-\\d\\d");
function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

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
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
    };
    this.props.createIssue(issue);
    form.owner.value = ""; //rest the input field
    form.title.value = "";
  }

  render() {
    return (
      <form name="addForm" className="form-class" onSubmit={this.handleSubmit}>
        {/* handleSubmit expects a event object (e) */}
        <input type="text" name="owner" placeholder="Owner" />
        <input type="text" name="title" placeholder="Title" />
        <button>Add</button>
      </form>
    );
  }
}

class IssueFilter extends React.Component {
  render() {
    return <div>IssueFilter</div>;
  }
}

function IssueRow(props) {
  return (
    <tr>
      <td>{props.issue.id}</td>
      <td>{props.issue.status}</td>
      <td>{props.issue.owner}</td>
      <td>{props.issue.created.toDateString()}</td>
      <td>{props.issue.effort}</td>
      <td>{issue.due ? issue.due.toDateString() : " "}</td>
      <td>{props.issue.title}</td>
    </tr>
  );
}

function IssueTable(props) {
  const issueRows = props.issues.map((issue) => (
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
    this.createIssue = this.createIssue.bind(this); //!!!!!!!!!!111 this  is very important it won't work without it
  }
  async loadData() {
    //   //check 123 very important
    const query = `query {
        issueList {
        _id id title status owner
        created effort due
        }
        }`;

    const response = await fetch("/graphql", {
      //end point
      method: "POST", //post method
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    //const result=await response.json();
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver); //JSON.parse convert a string tp a js object

    this.setState({ issues: result.data.issueList });
  }
  componentDidMount() {
    // see if the ui is loaded
    this.loadData(); //if yes load the data
  }

  async createIssue(issue) {
    // issue.id = this.state.issues.length + 1;
    // issue.created = new Date();

    // const newIssueList = this.state.issues.slice(); //slice is use to make a COPY of the array
    // newIssueList.push(issue);
    // this.setState({ issues: newIssueList });
    // const query = `mutation issueAdd($issue: IssueInputs!) {
    //   issueAdd(issue: $issue) {
    //   id
    //   }
    //   }`;

    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
        id
        }
        }`;

    const response = await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { issue } }),
    });
    this.loadData();
  }

  render() {
    return (
      <React.Fragment>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr />
        <IssueTable issues={this.state.issues} />
        <hr />
        <IssueAdd createIssue={this.createIssue} /> {/* Add createIssue prop */}
      </React.Fragment>
    );
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

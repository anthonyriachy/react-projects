/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./public/App.js":
/*!***********************!*\
  !*** ./public/App.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _graphQLFetch_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./graphQLFetch.js */ \"./public/graphQLFetch.js\");\n/* eslint-disable linebreak-style */\n/* eslint-disable react/sort-comp */\n/* eslint-disable max-len */\n/* eslint-disable no-shadow */\n/* eslint-disable no-undef */\n\n// const sampleIssue = {\n//   status: \"New\",\n//   owner: \"Pieta\",\n//   title: \"Completion date should be optional\",\n// };\n\n/* eslint \"react/react-in-jsx-scope\": \"off\" */\n/* globals React ReactDOM */\n/* eslint \"react/jsx-no-undef\": \"off\" */\n\n/* globals React ReactDOM PropTypes */\n// for prototypes\n\nclass IssueAdd extends React.Component {\n  constructor() {\n    super();\n    this.handleSubmit = this.handleSubmit.bind(this);\n  }\n  handleSubmit(e) {\n    e.preventDefault(); // to stop it from submitting it\n    const form = document.forms.addForm;\n    const issue = {\n      owner: form.owner.value,\n      title: form.title.value,\n      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10)\n    };\n    const {\n      createIssue\n    } = this.props;\n    createIssue(issue);\n    form.owner.value = ''; // rest the input field\n    form.title.value = '';\n  }\n  render() {\n    return /*#__PURE__*/React.createElement(\"form\", {\n      name: \"addForm\",\n      className: \"form-class\",\n      onSubmit: this.handleSubmit\n    }, /*#__PURE__*/React.createElement(\"input\", {\n      type: \"text\",\n      name: \"owner\",\n      placeholder: \"Owner\"\n    }), /*#__PURE__*/React.createElement(\"input\", {\n      type: \"text\",\n      name: \"title\",\n      placeholder: \"Title\"\n    }), /*#__PURE__*/React.createElement(\"button\", {\n      type: \"submit\"\n    }, \"Add\"));\n  }\n}\nIssueAdd.propTypes = {\n  createIssue: PropTypes.func.isRequired\n};\n// eslint-disable-next-line react/prefer-stateless-function\nclass IssueFilter extends React.Component {\n  render() {\n    return /*#__PURE__*/React.createElement(\"div\", null, \"IssueFilter\");\n  }\n}\nfunction IssueRow({\n  issue\n}) {\n  return /*#__PURE__*/React.createElement(\"tr\", null, /*#__PURE__*/React.createElement(\"td\", null, issue.id), /*#__PURE__*/React.createElement(\"td\", null, issue.status), /*#__PURE__*/React.createElement(\"td\", null, issue.owner), /*#__PURE__*/React.createElement(\"td\", null, issue.created.toDateString()), /*#__PURE__*/React.createElement(\"td\", null, issue.effort), /*#__PURE__*/React.createElement(\"td\", null, issue.due ? props.issue.due.toDateString() : ' '), /*#__PURE__*/React.createElement(\"td\", null, issue.title));\n}\nfunction IssueTable({\n  issues\n}) {\n  const issueRows = issues.map(issue => /*#__PURE__*/React.createElement(IssueRow, {\n    key: issue.id,\n    issue: issue\n  }));\n  return /*#__PURE__*/React.createElement(\"table\", {\n    className: \"bordered-table\"\n  }, /*#__PURE__*/React.createElement(\"thead\", null, /*#__PURE__*/React.createElement(\"tr\", null, /*#__PURE__*/React.createElement(\"th\", null, \"ID\"), /*#__PURE__*/React.createElement(\"th\", null, \"Status\"), /*#__PURE__*/React.createElement(\"th\", null, \"Owner\"), /*#__PURE__*/React.createElement(\"th\", null, \"Created\"), /*#__PURE__*/React.createElement(\"th\", null, \"Effort\"), /*#__PURE__*/React.createElement(\"th\", null, \"Due Date\"), /*#__PURE__*/React.createElement(\"th\", null, \"Title\"))), /*#__PURE__*/React.createElement(\"tbody\", null, issueRows));\n}\nclass App extends React.Component {\n  constructor() {\n    super();\n    this.state = {\n      issues: []\n    };\n    this.createIssue = this.createIssue.bind(this); //! !!!!!!!!!111 this  is very important it won't work without it\n  }\n\n  async loadData() {\n    //   //check 123 very important\n    const query = `query {\n        issueList {\n        _id id title status owner\n        created effort due\n        }\n        }`;\n    const data = await (0,_graphQLFetch_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(query);\n    if (data) {\n      this.setState({\n        issues: data.issueList\n      });\n    }\n  }\n  componentDidMount() {\n    // see if the ui is loaded\n    this.loadData(); // if yes load the data\n  }\n\n  async createIssue(issue) {\n    const query = `mutation issueAdd($issue: IssueInputs!) {\n        issueAdd(issue: $issue) {\n        id\n        }\n        }`;\n    const data = await (0,_graphQLFetch_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(query, {\n      issue\n    });\n    if (data) {\n      this.loadData();\n    }\n  }\n  render() {\n    const {\n      issues\n    } = this.state;\n    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(\"h1\", null, \"Issue Tracker\"), /*#__PURE__*/React.createElement(IssueFilter, null), /*#__PURE__*/React.createElement(\"hr\", null), /*#__PURE__*/React.createElement(IssueTable, {\n      issues: issues\n    }), /*#__PURE__*/React.createElement(\"hr\", null), /*#__PURE__*/React.createElement(IssueAdd, {\n      createIssue: this.createIssue\n    }), ' ');\n  }\n}\nReactDOM.createRoot(document.getElementById('root')).render( /*#__PURE__*/React.createElement(App, null));\n\n//# sourceURL=webpack://mern-project-uiapi/./public/App.js?");

/***/ }),

/***/ "./public/graphQLFetch.js":
/*!********************************!*\
  !*** ./public/graphQLFetch.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ graphQLFetch)\n/* harmony export */ });\n/* eslint-disable linebreak-style */\n/* eslint-disable no-alert */\n/* eslint-disable no-unused-vars */\n/* eslint-disable no-undef */\n\nconst dateRegex = new RegExp('^\\\\d\\\\d\\\\d\\\\d-\\\\d\\\\d-\\\\d\\\\d');\nfunction jsonDateReviver(key, value) {\n  if (dateRegex.test(value)) return new Date(value);\n  return value;\n}\nasync function graphQLFetch(query, variables = {}) {\n  try {\n    const response = await fetch(window.ENV.UI_API_ENDPOINT, {\n      method: 'POST',\n      headers: {\n        'Content-Type': 'application/json'\n      },\n      body: JSON.stringify({\n        query,\n        variables\n      })\n    });\n    const body = await response.text();\n    const result = JSON.parse(body, jsonDateReviver);\n    if (result.errors) {\n      const error = result.errors[0];\n      if (error.extensions.code === 'BAD_USER_INPUT') {\n        const details = error.extensions.exception.errors.join('\\n ');\n        alert(`${error.message}:\\n ${details}`);\n      } else {\n        alert(`${error.extensions.code}: ${error.message}`);\n      }\n    }\n    return result.data;\n  } catch (e) {\n    alert(`Error in sending data to server: ${e.message}`);\n    return null;\n  }\n}\n\n//# sourceURL=webpack://mern-project-uiapi/./public/graphQLFetch.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./public/App.js");
/******/ 	
/******/ })()
;
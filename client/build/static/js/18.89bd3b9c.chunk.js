webpackJsonp([18],{440:function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}function o(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=n(373),c=(n.n(i),n(105)),s=n(0),l=n.n(s),u=n(313),f=n.n(u),p=n(301),m=(n.n(p),n(302)),d=n.n(m),h=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),b=function(e){function t(e){r(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={attendees:[]},n}return o(t,e),h(t,[{key:"componentWillMount",value:function(){var e=this;navigator.onLine?c.a.getAttendees(this.props.chalkboard).then(function(t){e.setState({attendees:t.data})}).catch(function(t){console.log("Error: ",t),e.props.handleRequestOpen("There was an error retrieving the attendees")}):this.props.handleRequestOpen("You are offline.")}},{key:"render",value:function(){return l.a.createElement(p.List,null,this.state.attendees.map(function(e,t){return l.a.createElement("div",{key:t},l.a.createElement("div",null,l.a.createElement(d.a,{className:"garnett-divider",inset:!0}),l.a.createElement(p.ListItem,{className:"garnett-list-item",leftAvatar:l.a.createElement(f.a,{className:"garnett-image",src:e.photoURL}),primaryText:l.a.createElement("p",{className:"attendee-name"}," ",e.name," ")}),l.a.createElement(d.a,{className:"garnett-divider",inset:!0})))}))}}]),t}(s.Component);t.default=b}});
//# sourceMappingURL=18.89bd3b9c.chunk.js.map
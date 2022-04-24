import React from "react";
import "./App.scss";
import MyAdd from "./components/Add";
import MyComponent from "./components/MyComponent";
class App extends React.Component {
  render() {
    return (
      <div className="app">
        <MyComponent></MyComponent>
        <MyAdd></MyAdd>
      </div>
    );
  }
}
export default App;

import React, { Component } from 'react';
import '../css/App.css';
import AddApointments from './AddAppointments';
import ListApointments from './ListAppointments';
import SearchApointments from './SearchAppointments';
import {without} from 'lodash';

class App extends Component {

  constructor(){
    super();
    this.state = {
      myAppointments: [],
      formDisplay: false,
      orderBy: 'ownerName',
      orderDir: 'desc',
      lastIndex: 0
    }
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
  }

  addAppointment(apt){
    let tempApts = this.state.myAppointments;
    apt.aptId = this.state.lastIndex;
    tempApts.unshift(apt);
    this.setState({myAppointments: tempApts, lastIndex: this.state.lastIndex + 1})
  }

  deleteAppointment(apt) {
    let tempApts = this.state.myAppointments;
    tempApts = without(tempApts, apt);

    this.setState({myAppointments : tempApts});
  }

  toggleForm() {
    this.setState({
      formDisplay: !this.state.formDisplay
    });
  }

  componentDidMount(){
    fetch("./data.json")
      .then(response => response.json())
      .then(result => {
        const appointments = result.map(item => {
          item.aptId = this.state.lastIndex;
          this.setState({lastIndex: this.state.lastIndex + 1})
          return item;});
        this.setState({myAppointments: appointments})
      })
      
  }

  render() {

    let order;
    let filteredApts = this.state.myAppointments;
    if(this.state.orderDir === 'asc'){
      order = 1;
    }
    else{
      order = -1;
    }

    filteredApts.sort((a,b) => {
      if(a[this.state.orderBy.toLowerCase()] < 
         b[this.state.orderBy.toLowerCase()])
      {
        return -1 * order;
      }
      else{
        return 1 * order;
      } });

    return (
            <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddApointments formDisplay={this.state.formDisplay} toggleForm={this.toggleForm} addAppointment= {this.addAppointment}/>
                <SearchApointments/>
                <ListApointments appointments={filteredApts} deleteAppointment={this.deleteAppointment} />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;

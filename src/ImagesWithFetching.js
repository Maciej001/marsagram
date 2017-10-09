import React, { Component } from "react";
import Images from './Images'

const withFetching = Comp =>
  class WithFetch extends Component {
    state = {
      data: {},
      isLoading: true,
      error: null
    };

    componentDidMount() {
      this.fetchData(this.props.url);
    }

    componentWillReceiveProps(nextProps) {
      this.fetchData(this.props.url);
    }

    fetchData = url => {
      this.setState({ isLoading: true });

      fetch(url)
        .then(response => response.json())
        .then(data => this.setState({ data, isLoading: false }))
        .catch(error => this.setState({ error, isLoading: false }));
    };

    render() {
      if (this.state.isLoading) {
        return <p>Loading...</p>;
      }

      if (this.state.error) {
        return <p>Fetching data error.</p>;
      }

      return <Comp {...this.props} {...this.state}/>;
    }
  };

const ImagesWithFetching = withFetching(Images);

export default ImagesWithFetching;

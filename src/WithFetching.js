import React, { Component } from "react";

const withFetching = url => Comp =>
  class WithFetch extends Component {
    state = {
      data: {},
      isLoading: false,
      error: null
    };

    componentDidMount() {
      this.fetchData(url);
    }

    componentWillReceiveProps(nextProps) {
      this.fetchData(url);
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

      if (
        !this.state.data ||
        !this.state.data.photos ||
        this.state.data.photos.length === 0
      ) {
        return <p>There are no images available from this camera.</p>;
      }

      return <Comp {...this.props} {...this.state} />;
    }
  };

export default withFetching;

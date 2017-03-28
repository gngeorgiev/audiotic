import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { YouTube } from 'audiotic';

export default class App extends React.Component {
  state = {
    videos: []
  };

  async componentDidMount() {
    const videos = await YouTube.search('ariana grande');

    this.setState({
      videos
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.videos.map((v, i) => <Text key={i}>{v.title}</Text>)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

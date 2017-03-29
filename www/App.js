import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Toolbar, ThemeProvider, BottomNavigation } from 'react-native-material-ui';

import { SearchComponent } from './components/Search.component';

export default class App extends React.Component {
  state = {
    screen: 'search'
  };

  async componentDidMount() {
  }

  render() {
    return (
      <ThemeProvider uiTheme={uiTheme}>
        <View style={styles.container}>
          <Toolbar 
            leftElement='menu'
            centerElement='Audiotic - Music'
            searchable={{
              autoFocus: true,
              placeholder: 'Search Music',
              onSearchPressed: searchString => this.setState({searchString})
            }}
          />

          <BottomNavigation active={this.state.screen}>
            <BottomNavigation.Action
              key='search'
              icon='search'
              label='Search'
              onPress={() => this.setState({screen: 'search'})}
            />
            <BottomNavigation.Action
              key='history'
              icon='history'
              label='history'
              onPress={() => this.setState({screen: 'history'})}
            />
            <BottomNavigation.Action
              key='saved'
              icon='save'
              label='Saved'
              onPress={() => this.setState({screen: 'saved'})}
            />
          </BottomNavigation>

          <SearchComponent
            active={this.state.screen === 'search'}
            hidden={this.state.screen !== 'search'}
            searchString={this.state.searchString}
          />
        </View>
      </ThemeProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  bottomNavigation: {
    flex: 1
  },
  bottomNavigationAction: {
    flex: 0.33
  }
});

const uiTheme = {
  toolbar: {
    container: {
      height: 50
    }
  }
};

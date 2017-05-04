import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tabs, Tab, Icon } from 'react-native-elements'

import { SearchComponent } from './components/Search.component';
import { PlayerComponent } from './components/Player.component';
import { AudioPlayer } from './modules/AudioPlayer';

const states = {
  search: 'search',
  history: 'history',
  saved: 'save'
}

export default class App extends React.Component {
  state = {
    screen: states.search
  };

  searchText = '';

  async componentWillUnmount() {
    await AudioPlayer.stop();
  }

  render() {
    return (
      <View style={styles.container}>
        <PlayerComponent/>

        <View style={{flex: 2}}>
          <Tabs>
            <Tab
              title='Search'
              selected={this.state.screen === states.search}
              renderIcon={() => <Icon name={states.search} />}
              renderSelectedIcon={() => <Icon name={states.search} color={'#6296f9'} />}
              onPress={() => this.setState({screen: states.search})}>
                <SearchComponent
                  active={this.state.screen === states.search}
                  hidden={this.state.screen !== states.search}
                  searchString={this.state.searchString}
                />
            </Tab>
            <Tab
              title='History'
              selected={this.state.screen === states.history}
              renderIcon={() => <Icon name={states.history} />}
              renderSelectedIcon={() => <Icon name={states.history} color={'#6296f9'} />}
              onPress={() => this.setState({screen: states.history})}>
                
            </Tab>

            <Tab
              title='Saved'
              selected={this.state.screen === states.saved}
              renderIcon={() => <Icon name={states.saved} />}
              renderSelectedIcon={() => <Icon name={states.saved} color={'#6296f9'} />}
              onPress={() => this.setState({screen: states.saved})}>
                
            </Tab>
          </Tabs>
        </View>
        
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  bottomNavigation: {
    flex: 1
  },
  bottomNavigationAction: {
    flex: 0.33
  }
});
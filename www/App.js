import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Tabs, Tab, Icon } from "react-native-elements";
import Display from "react-native-display";
import { YouTube } from 'audiotic-core';

import { PlayerComponent } from "./components/Player.component";
import {
  FullScreenPlayerComponent
} from "./components/FullScreenPlayer.component";
import { AudioPlayer } from "./modules/AudioPlayer";
import { TracksViewComponent } from './components/TracksView.component'


const states = {
  search: "search",
  history: "history",
  saved: "save"
};

export default class App extends React.Component {
  state = {
    screen: states.search,
    showFullScreenPlayer: false
  };

  searchText = "";

  async componentWillUnmount() {
    await AudioPlayer.stop();
  }

  render() {
    const { showFullScreenPlayer } = this.state;

    return (
      <View style={{flex: 1}}>
        <Display enable={showFullScreenPlayer} style={{flex: 1}}>
          <FullScreenPlayerComponent
            onBackPress={() => this.setState({ showFullScreenPlayer: false })}
          />
        </Display>

        <Display enable={!showFullScreenPlayer} style={{flex: 1}} keepAlive={true}>
          <View style={styles.container}>
            <PlayerComponent
              onPress={() => this.setState({ showFullScreenPlayer: true })}
            />

            <View style={{ flex: 2 }}>
              <Tabs>
                <Tab
                  title="Search"
                  selected={this.state.screen === states.search}
                  renderIcon={() => <Icon name={states.search} />}
                  renderSelectedIcon={() => (
                    <Icon name={states.search} color={"#6296f9"} />
                  )}
                  onPress={() => this.setState({ screen: states.search })}
                >
                  <TracksViewComponent
                    active={this.state.screen === states.search}
                    hidden={this.state.screen !== states.search}
                    searchString={this.state.searchString}
                    onSearch={str => YouTube.search(str)}
                  />
                </Tab>
                <Tab
                  title="History"
                  selected={this.state.screen === states.history}
                  renderIcon={() => <Icon name={states.history} />}
                  renderSelectedIcon={() => (
                    <Icon name={states.history} color={"#6296f9"} />
                  )}
                  onPress={() => this.setState({ screen: states.history })}
                />

                <Tab
                  title="Saved"
                  selected={this.state.screen === states.saved}
                  renderIcon={() => <Icon name={states.saved} />}
                  renderSelectedIcon={() => (
                    <Icon name={states.saved} color={"#6296f9"} />
                  )}
                  onPress={() => this.setState({ screen: states.saved })}
                />
              </Tabs>
            </View>

          </View>
        </Display>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff"
  },
  bottomNavigation: {
    flex: 1
  },
  bottomNavigationAction: {
    flex: 0.33
  }
});

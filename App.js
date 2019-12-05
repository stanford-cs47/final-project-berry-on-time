import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import * as pages from './App/pages';

import Icon from 'react-native-vector-icons/FontAwesome';

const SearchBerries = createStackNavigator({
  Home: {screen: pages.Berrydex},
  AddBerry: {screen: pages.AddBerry}
},{
  initialRouteName: 'Home',
});

const TrackBerries = createStackNavigator({
  Home: {screen: pages.Home},
  PlantedBerryViewer: {screen: pages.PlantedBerryViewer}
},{
  initialRouteName: 'Home',
});

const TabNav = createBottomTabNavigator({
  Home: {screen: TrackBerries,
    navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="home" size={30} color={tintColor}/>
        )
      },
    },
  Search: {screen: SearchBerries,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Icon name="search" size={30} color={tintColor}/>
      )
    },
  }
},{
  initialRouteName: 'Home',
  tabBarOptions: {
    activeTintColor: '#8eb00b',
    inactiveTintColor: '#bbb'
  }
});

const MyApp = createAppContainer(TabNav);
export default MyApp;

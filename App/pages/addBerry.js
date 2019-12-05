import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { material } from 'react-native-typography';
import { Metrics, Colors } from '../Themes';
import { Entypo } from '@expo/vector-icons';
import ViewBerry from '../Components/ViewBerry';

export default class AddBerry extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      headerTitle: (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={material.title}>Info</Text>
        </View>
      )
    };
  };

  state = {
    content: null,
  }

  componentDidMount() {
    const params = this.props.navigation.state.params || {};
    const content = params.content;

    this.setState({content: content});
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          {this.state.content ? <ViewBerry content={this.state.content} /> : null}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

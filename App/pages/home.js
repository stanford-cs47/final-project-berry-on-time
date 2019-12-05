import React from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Image } from 'react-native';
import firestore from '../../firebase';
import firebase from 'firebase';
import { Metrics } from '../Themes';
import { material } from 'react-native-typography';

import CountDown from 'react-native-countdown-component';

export default class Home extends React.Component {

  static navigationOptions = {
     title: 'Berries Planted',
   };

  state = {
    plantedberries: [],
    isRefreshing: true,
    unplant: null,
  }

  componentDidMount() {
    let plantedBerriesRef = firestore.collection('watching/');
    let unplant = plantedBerriesRef.onSnapshot(() => {
      this.reloadPlantedBerries();
    });
    this.setState({ unplant });

    this.reloadPlantedBerries(); // load list of berries planted
  }

  componentWillUnmount() {
    this.state.unplant();
  }

  getPlantedBerries = async () => {
    try {
      let plantedberries = [];

      // Add your code here
      let plantedBerriesListRef = firestore.collection('watching/');
      let allPlantedBerries = await plantedBerriesListRef.get();
      allPlantedBerries.forEach((plantedberry) => {
        plantedberries.push(plantedberry.data());  // Dont forget to do .data()....
      })

      return (plantedberries ? plantedberries : []);
    } catch (error) {
      console.log(error);
    }
    return ([]);
  }

  plantedBerryPressed = (item) => {
    const { navigate } = this.props.navigation;
    navigate('PlantedBerryViewer', { content: item });
  }

  reloadPlantedBerries = async () => {
    this.setState({isRefreshing: true});
    const watching = await this.getPlantedBerries();
    this.setState({plantedberries: watching, isRefreshing: false});
  }

  _keyExtractor = (item, index) => item.id;

  renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => this.plantedBerryPressed(item)} key={item.id}>
      <View style={styles.plantedBerryContainer}>
        <Image style={styles.thumbImage} source={{uri: item.img}}/>
        <View style={styles.textContainer}>
          <Text style={styles.berryName}>{item.name || "No Name"}</Text>
          <View style={styles.timers}>
            <View style={styles.harvest}>
              <Text style={styles.timerOne}>Soil Status:</Text>
              <CountDown
                until={50.0 / item.soil * 3600}
                size={10}
                onFinish={() => alert(item.name + " needs to be watered!")}
                digitStyle={{backgroundColor: '#FFF'}}
                timeToShow={['H', 'M', 'S']}
                timeLabels={{h: 'HH', m: 'MM', s: 'SS'}}
            />
            </View>
            <View style={styles.harvest}>
              <Text style={styles.timerTwo}>Time Left:</Text>
              <CountDown
                until={item.growth * 60 * 60}
                size={10}
                onFinish={() => alert(item.name + " is ready for harvest!")}
                digitStyle={{backgroundColor: '#FFF'}}
                timeToShow={['H', 'M', 'S']}
                timeLabels={{h: 'HH', m: 'MM', s: 'SS'}}
              />
            </View>
          </View>
        </View>
      </View>
      </TouchableOpacity>
    );
  }

  render() {
    let emptyList = null;
    if (!this.state.plantedberries[0]) {
      emptyList = (<Text style={{marginTop: Metrics.navBarHeight}}>No berries planted yet!</Text>);
    }

    return (
      <View style={styles.container}>

        {emptyList}

        <FlatList
          data={this.state.plantedberries}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderItem}
          onRefresh={this.reloadPlantedBerries}
          refreshing={this.state.isRefreshing}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: Metrics.marginVertical,
  },
  plantedBerryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Metrics.marginVertical,
    marginBottom: Metrics.marginVertical,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: Metrics.marginHorizontal,
    marginRight: Metrics.marginHorizontal,
  },
  thumbImage: {
    width: Metrics.images.large,
    height: Metrics.images.large,
  },
  timers: {
    flexDirection: 'column',
  },
  timerOne: {
    fontSize: 15,
  },
  timerTwo: {
    fontSize: 15,
  },
  harvest: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  berryName: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});

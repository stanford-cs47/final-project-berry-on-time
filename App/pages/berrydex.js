import React from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native';
import firestore from '../../firebase';
import firebase from 'firebase';
import { Metrics } from '../Themes';
import { material } from 'react-native-typography';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

export default class Berrydex extends React.Component {

  static navigationOptions = {
     title: 'Berrydex',
   };

  state = {
    berries: [],
    isRefreshing: true,
    unplant: null,
    searchText: '',
  }

  componentDidMount() {
    let plantedBerriesRef = firestore.collection('berrydex/');
    let unplant = plantedBerriesRef.onSnapshot(() => {
      this.reloadBerries();
    });
    this.setState({ unplant });

    this.reloadBerries(); // load list of berries planted
  }

  componentWillUnmount() {
    this.state.unplant();
  }

  getBerries = async () => {
    try {
      let berries = [];

      let plantedBerriesListRef = firestore.collection('berrydex/');
      let allPlantedBerries = await plantedBerriesListRef.get();
      allPlantedBerries.forEach((berry) => {
        berries.push(berry.data());  // Dont forget to do .data()....
      })

      return (berries ? berries : []);
    } catch (error) {
      console.log(error);
    }
    return ([]);
  }

  berryPressed = (item) => {
    const { navigate } = this.props.navigation;
    navigate('AddBerry', { content: item });
  }

  reloadBerries = async () => {
    this.setState({isRefreshing: true});
    const watching = await this.getBerries();
    this.setState({berries: watching, isRefreshing: false});
  }

  _keyExtractor = (item, index) => item.id;

  renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => this.berryPressed(item)} key={item.id}>
      <View style={styles.plantedBerryContainer}>
        <View style={styles.textContainer}>
          <Image style={styles.thumbImage} source={{uri: item.img}}/>
          <Text style={material.body1}>{item.name || "No Name"}</Text>
        </View>
      </View>
      </TouchableOpacity>
    );
  }

  onChangeText = text => {
   this.setState({searchText: text});
  }

  async loadBerries(searchTerm = '') {
    this.setState({isRefreshing: true});
    var resultBerries = [];
    for(var i = 0; i < this.state.berries.length; i++) {
      if (this.state.berries[i].name.search(searchTerm) != -1) {
        resultBerries.push(this.state.berries[i]);
        console.log(resultBerries);
      }
    }
    this.setState({isRefreshing: false, berries: resultBerries, searchText: ''})

  }

  render() {
    let emptyList = null;
    if (!this.state.berries[0]) {
      emptyList = (<Text style={{marginTop: Metrics.navBarHeight}}>No berries exist yet!</Text>);
    }

    return (
      <View style={styles.container}>

        {emptyList}
        <View style={styles.searchbar}>
          <TextInput
            style={styles.textinput}
            onChangeText={text => this.onChangeText(text)}
            onSubmitEditing={() => this.loadBerries(this.state.searchText)}
            value={this.state.searchText}
          />
          <TouchableOpacity
            onPress={() => this.loadBerries(this.state.searchText)}
            style={styles.button}>
            <FontAwesome
              name='search'
              size={25}
              color='#8eb00b'
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={this.state.berries.sort((a, b) => a.name.localeCompare(b.name))}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderItem}
          onRefresh={this.reloadBerries}
          refreshing={this.state.isRefreshing}
          numColumns={3}
        />

      </View>
    );
  }
}

var { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: Metrics.marginVertical,
    alignItems: 'center',
  },
  plantedBerryContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    marginTop: Metrics.marginVertical,
    marginBottom: Metrics.marginVertical,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    margin: 6,
    padding: 3,
    paddingBottom: 6,
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
    flexDirection: 'row',
  },
  searchbar: {
    flex: 0.07,
    flexDirection: 'row',
    borderRadius: 15,
    backgroundColor: '#efefef',
    padding: 10,
    paddingLeft: 20,
  },
  textinput: {
    width: 0.75 * width,
  },
  button: {
    height: 25,
    paddingRight: 10
  },
  flatlist: {
    flex: 1,
    top: 110,
    width: '100%',
    height: '80%'
  },
});

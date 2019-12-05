import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, Share, Alert } from 'react-native';
import { Metrics, Images } from '../Themes';
import { material } from 'react-native-typography';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import firestore from '../../firebase';
import firebase from 'firebase';

export default class FeedItem extends React.Component {
  static defaultProps = { content: {} }

  static propTypes = {
    content: PropTypes.object.isRequired,
    onProfilePressed: PropTypes.func,
  }

  state = {
    loading: false,
    planted: false,
    savingBerry: false,
  }


  componentDidMount = async () => {
    try {
      const { content = {} } = this.props;

      let plantedBerriesRef = firestore.doc('watching/' + content.id);
      let plantedberry = await plantedBerriesRef.get();
      if(plantedberry.exists) this.setState({planted: true});
    } catch (err) {
      console.log(err);
    }
  }

  deletePlantedBerry = async () => {
    this.setState({ savingBerry: true });
    Alert.alert(
       'Berry removed!'
    )
      const { content = {} } = this.props;
      let plantedBerriesRef = firestore.doc('watching/' + content.id);
      await plantedBerriesRef.delete();

    this.setState({ savingBerry: false });
    this.props.navigation.popToTop();
  }

  render() {
    const { content = {} } = this.props;

    return (
      <View style={styles.container}>

        <Image source={{uri: content.img}}/>

        <View style={styles.descContainer}>
          <Text style={styles.title}>{content.name || 'No Name'}</Text>
          <View style={styles.timers}>
            <Text style={material.body1}><Text style={{fontWeight: 'bold'}}>Soil Status: Wet</Text></Text>
            <Text style={material.body1}><Text style={{fontWeight: 'bold'}}>Time Left: {content.growth} hrs</Text></Text>
          </View>
          <Text style={material.subheading}><Text style={{fontWeight: 'bold'}}>Flavor:</Text> {content.flavor || 'No Flavor'}</Text>
          <Text style={material.subheading}><Text style={{fontWeight: 'bold'}}>Description:</Text> {content.desc || 'No Description'}</Text>
          <Text style={material.subheading}><Text style={{fontWeight: 'bold'}}>Effect:</Text> {content.effect || 'No Effect'}</Text>
        </View>

        <View style={styles.options}>
          <TouchableOpacity style={styles.delete} onPress={(this.deletePlantedBerry)}>
            <Text>Remove Berry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.water} onPress={this.waterPlantedBerry}>
            <Text>Water Berry</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }

  getPostedDate = () => {
    const { content = {} } = this.props;
    const postedDate = new Date(content.created_at);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return postedDate.toLocaleDateString('en', options);
  }

  showImageLoader = (width, height) => {
    const { loading } = this.state;

    if (loading) {
      return (
        <View style={[styles.mainImageLoader, {width: width, height: height}]}>
          <ActivityIndicator />
        </View>
      );
    }
  }

  calculateImageRect = (oldWidth, oldHeight) => {
    const newWidth = Metrics.screenWidth;

    const aspectRatio = oldWidth / oldHeight;
    const newHeight = newWidth / aspectRatio;   //div width by aspect ratio

    return {width: newWidth, height: newHeight};
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    paddingTop: Metrics.doubleBaseMargin,
    paddingBottom: Metrics.doubleBaseMargin,
    width: Metrics.screenWidth,
  },
  timers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 10,
  },
  mainImageContainer: {
    marginTop: Metrics.marginVertical,
  },
  likesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: Metrics.marginVertical,
    marginLeft: Metrics.marginHorizontal,
    marginRight: Metrics.marginHorizontal,
  },
  descContainer: {
    marginLeft: Metrics.marginHorizontal,
    marginRight: Metrics.marginHorizontal,
  },
  dateContainer: {
    marginLeft: Metrics.marginHorizontal,
    marginRight: Metrics.marginHorizontal,
  },
  berryImage: {
    height: Metrics.icons.medium,
    width: Metrics.icons.medium,
    borderRadius: Metrics.icons.medium * 0.5
  },
  profileName: {
    paddingLeft: Metrics.marginHorizontal,
    paddingRight: Metrics.marginHorizontal,
  },
  mainImage: {
    width: Metrics.screenWidth,
  },
  mainImageLoader: {
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: Metrics.marginHorizontal,
    marginRight: Metrics.marginHorizontal,
    marginTop: 20,
  },
  delete: {
    backgroundColor: '#f0a797',
    padding: 10,
    borderRadius: 5,
  },
  water: {
    backgroundColor: '#b6dcfa',
    padding: 10,
    borderRadius: 5,
  }
});

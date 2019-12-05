import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, Share, Alert } from 'react-native';
import { Metrics, Images } from '../Themes';
import { material } from 'react-native-typography';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import firestore from '../../firebase';
import firebase from 'firebase';

export default class ViewBerry extends React.Component {
  static defaultProps = { content: {} }

  static propTypes = {
    content: PropTypes.object.isRequired,
    onProfilePressed: PropTypes.func,
  }

  state = {
    loading: false,
    savingBerry: false,
  }


  componentDidMount = async () => {
    try {
      const { content = {} } = this.props;
      let plantedBerriesRef = firestore.doc('watching/');
      let plantedberry = await plantedBerriesRef.get();
    } catch (err) {
      console.log(err);
    }
  }

  guidGenerator() {
      var S4 = function() {
         return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      };
      return (S4()+S4()+S4()+"-"+S4()+S4()+"-"+S4()+S4()+S4());
  }

  savePlantedBerry = async () => {
    this.setState({ savingBerry: true });
    Alert.alert(
       'Berry planted!'
    )
      const { content = {} } = this.props;
      console.log(content.id);
      let newID = this.guidGenerator();
      content.id = newID;
      let plantedBerriesRef = firestore.doc('watching/' + content.id);
      console.log(content.id);
      await plantedBerriesRef.set(content);

    this.setState({ savingBerry: false });
  }

  render() {
    const { content = {} } = this.props;
    const { img = {} } = content;
    const { name = {} } = content;

    return (
      <View style={styles.container}>

      <View style={styles.descContainer}>
        <Text style={styles.title}>{content.name || 'No Name'}</Text>
        <Text style={material.subheading}><Text style={{fontWeight: 'bold'}}>Flavor:</Text> {content.flavor || 'No Flavor'}</Text>
        <Text style={material.subheading}><Text style={{fontWeight: 'bold'}}>Description:</Text> {content.desc || 'No Description'}</Text>
        <Text style={material.subheading}><Text style={{fontWeight: 'bold'}}>Effect:</Text> {content.effect || 'No Effect'}</Text>
      </View>

        <View style={styles.options}>
          <TouchableOpacity style={styles.addOn} onPress={this.savePlantedBerry}>
            <Text>Plant Berry</Text>
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
  options: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: Metrics.marginHorizontal,
    marginRight: Metrics.marginHorizontal,
    marginTop: 20,
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
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 10,
  },
  addOn: {
    backgroundColor: '#d5e6a3',
    padding: 10,
    borderRadius: 5,
  }
});

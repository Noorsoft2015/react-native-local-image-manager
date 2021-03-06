/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  CameraRoll,
} = React;
var logError = require('logError');

var LocalImageManager = require('NativeModules').LocalImageManager;

var ExampleProject = React.createClass({

  getInitialState: function() {
    return {
      imageResult: null,
      resizeResult: null,
    };
  },

  render: function() {
    var imageElement;
    var resizeElement;

    if (this.state.imageResult) {
      imageElement = (
        <Image source={{uri: this.state.imageResult}} style={styles.image} />
      );
    }

    if (this.state.resizeResult) {
      resizeElement = (
        <Image source={{uri: this.state.resizeResult}} style={styles.image} />
      );
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.downloadImage}>
          <Text style={styles.welcome}>
            Download Image
          </Text>
        </TouchableOpacity>
        {imageElement}

        <TouchableOpacity onPress={this.resizeImage}>
          <Text style={styles.welcome}>
            Resize Camera Roll Image
          </Text>
        </TouchableOpacity>
        {resizeElement}
      </View>
    );
  },

  downloadImage () {
    var options = {
      uri: 'https://igcdn-photos-a-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-15/11242865_1062704387091208_1538328286_n.jpg',
      filename: 'pup.jpg',
    };

    LocalImageManager.download(options, (results) => {
      // results is the filesystem path of the downloaded image
      console.log(results);
      this.setState({ imageResult: results });
    });
  },

  resizeImage () {
    // grab the first camera roll image
    CameraRoll.getPhotos({ first: 1 }, (path) => {
      var image = path.edges[0].node.image.uri;

      var options = {
        uri: image,
        width: 200,
        height: 200,
        quality: 0.5,
        filename: 'small.jpg',
      };

      // resize the image
      LocalImageManager.resize(options, (results)=>{
        // results is the filesystem path of the resized image
        console.log(results);
        this.setState({ resizeResult: results });
      });

    }, logError);
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  image: {
    width: 200,
    height: 200,
  },
});

AppRegistry.registerComponent('ExampleProject', () => ExampleProject);

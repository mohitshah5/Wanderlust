import React from 'react'; // -*- js-jsx -*-
import { StyleSheet, Text, Image, ScrollView, View, Dimensions, TouchableOpacity } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import MapView from 'react-native-maps';
import StarRating from 'react-native-star-rating';

export default class ActivityDetail extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.data.title
  })

  constructor(props) {  
    super(props)
    this.state = {rating: props.navigation.state.params.starRating}
  }

  onStarRatingPress(rating) {
    this.setState(prev => {
      return {...prev, rating: rating}
    })
    this.props.navigation.state.params.onStarRating(
      rating,
      this.props.navigation.state.params.data.key
    )
  }

  renderEachRow(x, i) {
    return (
      <Row key={'gk_'+x.key} style={i%2==0? styles.even : styles.odd}>
        <Col style={{width:'40%', marginLeft: 4}}>
          <Text style={{fontWeight:'bold'}}>{x.heading}</Text>
        </Col>
        <Col style={{marginRight: 4}}>
          <Text>{x.value}</Text>
        </Col>
      </Row>
    )
  }

  render() {
    const {height, width} = Dimensions.get('window')
    const pad = 15
    const d = this.props.navigation.state.params.data
    var grid = []

    if(d.minPrice && d.avgPrice) {
      grid.push({key: 'prices',
                 heading: 'Price range:',
                 value: '$' + d.minPrice.toFixed(2) + ' – $' + d.avgPrice.toFixed(2)})
    }

    if(d.type && d.type.length > 0) {
      grid.push({key: 'type',
                 heading: 'Experience type:',
                 value: d.type.join(', ')})
    }

    if(d.timeNeededMinutes && d.timeNeededMinutes > 0) {
      grid.push({key: 'time',
                 heading: 'Time needed:',
                 value: '' + d.timeNeededMinutes + ' minutes'})
    }

    if(d.mood && d.mood.length > 0) {
      grid.push({key: 'mood',
                 heading: 'Moods:',
                 value: d.mood.join(', ')})
    }

    return (
      <View style={{flex:1}}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{width: '100%', backgroundColor: '#0fe'}}>
            <Image source={{uri: d.image, height:height*0.3}}/>
          </View>
          <View style={{paddingLeft: pad, paddingRight: pad}}>
            <Text style={{fontSize: 28}}>{d.title}</Text>
            <Text style={{fontSize: 16, marginBottom: pad}}>{d.description}</Text>

            <Grid style={{borderWidth: 1, borderColor: '#ccc'}}>
              {grid.map(this.renderEachRow)}
            </Grid>

            <View style={{flexDirection:'row', alignItems:'center', marginTop:pad}}>
              <TouchableOpacity style={{padding:5}}
                                onPress={() => this.onStarRatingPress(0)}>
                <Text style={{fontSize: 24, color:this.state.rating > 0? '#cd1a1a' : '#ccc'}}>×</Text>
              </TouchableOpacity>
              <StarRating
                disabled={false}
                fullStarColor='#daa520'
                halfStarEnabled={true}
                maxStars={5}
                rating={this.state.rating}
                buttonStyle={{padding:5}}
                selectedStar={(rating) => this.onStarRatingPress(rating)}
                />
            </View>

            <MapView style={{width: 'auto', height: height*0.5, marginTop: pad}}
                     region={{
                       latitude: d.latitude,
                       longitude: d.longitude,
                       latitudeDelta: 0.1,
                       longitudeDelta: 0.1
                     }}>
              <MapView.Marker
                coordinate={{latitude: d.latitude, longitude: d.longitude}}
                title={d.title}/>
            </MapView>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  odd: {
    marginBottom: 2,
  },
  even: {
    marginBottom: 2,
    backgroundColor: '#cee',
  },
  container: {
    padding: 0,
    margin: 0,
    // borderColor: '#f70',
    // borderWidth: 2,
    backgroundColor: '#fff',
  },
});

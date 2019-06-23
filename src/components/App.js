import React, { Component } from 'react';
import { Platform, 
        StyleSheet, 
        Text, 
        View,
        Animated, 
        Easing,
        Dimensions } from 'react-native';

import ajax from '../ajax';
import DealList from './DealList';
import DealDetail from './DealDetail';
import SearchBar from './SearchBar';

export default class App extends Component {
  titleXPos = new Animated.Value(0)

  state = {
    deals: [],
    dealsFromSearch:[],
    currentDealId: null,
  }

  animateTitle = (direction = 1) => {
    const width = Dimensions.get(`window`).width - 150;
    Animated.timing(this.titleXPos, {
      toValue: direction * (width/2),
      duration: 1000,
      easing: Easing.ease,
    }).start(({finished})=>{
      //Was the previous animation successful? if so then call this again
      //This is used for checking if the deal list has been loaded so that this doesn't go on a continuous animation
      if(finished){
        this.animateTitle(-1 * direction)
      }
    })
  }
  async componentDidMount() {
    this.animateTitle()
    const deals = await ajax.fetchInitialDeals();

    this.setState((prevState) => {
      return { deals }
    })
  }

  searchDeals = async (searchTerm) =>{
    let dealsFromSearch = []
    if(searchTerm){
      dealsFromSearch = await ajax.fetchDealSearchResults(searchTerm)      
    }
    this.setState({dealsFromSearch});
  }

  setCurrentDeal = (dealId) => {
    this.setState({ currentDealId: dealId })
  }

  unSetCurrentDeal = () => {
    this.setState({ currentDealId: null })
  }

  currentDeal = () => {
    return this.state.deals.find((deal) => deal.key === this.state.currentDealId)
  }

  
  render() {
    if (this.state.currentDealId) {
      return (<DealDetail  
               style={styles.main}
               initialDealData={this.currentDeal()} 
               onBack={this.unSetCurrentDeal} 
               nextDeal={this.setCurrentDeal}
               />)
    }
    const dealsToDispal = 
      this.state.dealsFromSearch.length > 0 
      ? this.state.dealsFromSearch
      : this.state.deals 

    if (this.state.deals.length > 0) {
      return(<View  style={styles.main}>
              <SearchBar searchDeals={this.searchDeals}/>
              <DealList
                deals={dealsToDispal}
                onItemPress={this.setCurrentDeal}
              />
            </View>)
    }
    return (
      <Animated.View style={[styles.container, {left: this.titleXPos}]}>
        <Text style={styles.header}>Bake Sale</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 40
  },
  main: {
    marginTop: 20,
  }
});

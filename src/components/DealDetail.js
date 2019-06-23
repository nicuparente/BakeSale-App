import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, TouchableOpacity, Animated, PanResponder, Dimensions, Button, Linking, ScrollView } from 'react-native'
import PropTypes from 'prop-types'

import { priceDisplay } from '../util'
import ajax from '../ajax'
export class DealDetail extends Component {
    imageXPos = new Animated.Value(0);
    dealXPos = new Animated.Value(0);
    width = Dimensions.get(`window`).width;

    imagePanResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt,gs) =>{ // handles moving the image
            this.imageXPos.setValue(gs.dx)
        },
        onPanResponderRelease: (evt,gs) =>{
            console.warn(this.state.deal.media.length)
            if(Math.abs(gs.dx) > this.width *0.4){
                //if direction is -1 swipe left if 1 swipe right
                const direction = Math.sign(gs.dx)
                Animated.timing(this.imageXPos,{
                    toValue: direction * this.width,
                    duration: 250,

                }).start(()=> this.handleSwipe(-1 * direction))
            }
            else{
                Animated.spring(this.imageXPos,{
                    toValue: 0
                }).start()
            }

        } 
    })

    dealPanResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt,gs) =>{ // handles moving the image
            this.dealXPos.setValue(gs.dx)
        },
        onPanResponderRelease: (evt,gs) =>{
            if(Math.abs(gs.dx) > this.width *0.4){
                //if direction is -1 swipe left if 1 swipe right
                const direction = Math.sign(gs.dx)
                Animated.timing(this.dealXPos,{
                    toValue: direction * this.width,
                    duration: 250,

                }).start(()=> this.handleSwipe(-1 * direction))
            }
            else{
                Animated.spring(this.dealXPos,{
                    toValue: 0
                }).start()
            }

        } 
    })
    static propTypes = {
        initialDealData: PropTypes.object.isRequired,
        onBack: PropTypes.func.isRequired,
    }

    state = {
        deal: this.props.initialDealData,
        imageIndex: 0
    }

    async componentDidMount() {
        const fullDeal = await ajax.fetchDealDetail(this.state.deal.key)
        this.setState({
            deal: fullDeal
        })

    }

    handleSwipe = (indexDirection) =>{
        if(!this.state.deal.media[this.state.imageIndex +indexDirection]){
            Animated.spring(this.imageXPos,{
                toValue: 0
            }).start()
            return;
        }
        this.setState((prevState) =>({
            imageIndex: prevState.imageIndex + indexDirection
        }), () => {
            //Next image animation.. This is necessary because the position of the current image component is off screen so we need to reset it back to its original position
            this.imageXPos.setValue(indexDirection * this.width)
            Animated.spring(this.imageXPos,{
                toValue: 0
            }).start()
        })
    }

    openDeal = () =>{
        Linking.openURL(this.state.deal.url)
    }

    render() {
        const deal = this.state.deal
        return (
            <ScrollView style={styles}>
                <TouchableOpacity onPress={this.props.onBack}>
                    <Text style={styles.backLink}>Back</Text>
                </TouchableOpacity>
                <Animated.Image {...this.imagePanResponder.panHandlers} source={{ uri: deal.media[this.state.imageIndex] }} style={[{left: this.imageXPos},styles.image]} />
                <View>
                    <View>
                        <Text style={styles.title}>{deal.title}</Text>
                    </View>
                    <View style={styles.footer}>
                        <View style={styles.info}>
                            <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
                            <Text style={styles.cause}>{deal.cause.name}</Text>
                        </View>
                        {
                            deal.user && (
                                <View >
                                    <Image source={{ uri: deal.user.avatar }} style={styles.avatar}
                                    />
                                    <Text>{deal.user.name}</Text>
                                </View>
                            )
                        }
                    </View>
                    <View style={styles.description}>
                        <Text>{deal.description}</Text>
                    </View>
                    <Button title="Buy this deal" onPress={this.openDeal}/>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    backLink: {
        marginBottom: 5,
        color: '#22f',
        marginLeft: 10,
    },
    image: {
        width: '100%',
        height: 150,
        backgroundColor: '#ccc',
    },
    backLink: {
        marginBottom: 5,
        color: '#22f',
        marginLeft: 10
    },
    title: {
        fontSize: 16,
        padding: 10,
        fontWeight: 'bold',
        backgroundColor: 'rgba(237, 149, 45, 0.4)',
    },
    footer: {
        flex: 1,
        justifyContent: 'space-around',
        flexDirection: 'row',
        marginTop: 25,
        marginBottom: 80,
    },
    info: {
        alignItems: 'center',
    },
    user: {
        alignItems: 'center',
    },
    cause: {
        marginVertical: 10,
    },
    price: {
        fontWeight: 'bold',
        fontSize: 40
    },
    avatar: {
        width: 60,
        height: 60,
    },
    description: {
        margin: 10,
        padding: 10,
    },
});

export default DealDetail

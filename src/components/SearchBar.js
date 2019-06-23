import React, { Component } from 'react'
import { Text, TextInput, StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
export default class SearchBar extends Component {
    
    static propTypes = {
        searchDeals : PropTypes.func.isRequired
    }

    state = {
        searchTerm: ''
    }

    debounceSearchDeals = debounce(this.props.searchDeals, 300)

    handleChange = (searchTerm) =>{ 
        this.setState({searchTerm}, () => {
            this.debounceSearchDeals(this.state.searchTerm)
        });

    }

    render() {
        return (
            <TextInput 
             placeholder="Search deals.."
             style={styles.input}
             onChangeText={this.handleChange}/>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        height: 40
    }
})

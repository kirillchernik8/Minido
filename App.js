import React from 'react';
import { StyleSheet, View, StatusBar, ScrollView, ActivityIndicator, AsyncStorage} from 'react-native';
import {LinearGradient} from 'expo'
import uuid from 'uuid/v1'
import { primaryGradientArray } from './utils/Colors.js'
import Subtitle from './components/Subtitle.js'
import Header from './components/Header.js'
import Input from './components/Input.js'
import List from './components/List.js'
import Button from './components/Button.js'

const headerTitle = 'Todo';

export default class App extends React.Component {
 state = {
   inputValue: '', 
   loadingItems: false, 
   allItems: {}, 
   isCompleted: false
 }

 componentDidMount = () => {
   this.loadingItems()
 }

 newInputValue = value =>{
   this.setState({
    inputValue: value
   })
 }


 loadingItems = async() => {
   try{
     const allItems = await AsyncStorage.getItem("Todos");
     this.setState({
       loadingItems: true,
       allItems: JSON.parse(allItems) || {}
     });
    } catch (err){
       console.error(err)
     }
   }

 onDoneAddItem = () =>{
   const {inputValue } = this.state;
   if(inputValue !== ''){
     this.setState(prevState => {
       const id = uuid();
       const newItemObject = {
         [id] : {
           id, 
           isCompleted: false, 
           text : inputValue, 
           createdAt: Date.now()
         }
       };

       const newState = {
         ...prevState, 
         inputValue: '', 
         allItems: {
           ...prevState.allItems,
           ...newItemObject
         }
       }; 
       this.saveItems(newState.allItems)
       return {...newState}
     })
   }
 }

deleteItem = id =>{
  this.setState(prevState =>{
   const allItems = prevState.allItems; 
   delete allItems[id];
   const newState = {
     ...prevState, 
     ...allItems
   }
   this.saveItems(newState.allItems)
   return {...newState}
  })
}

completeItem = id => {
  this.setState(prevState =>{
    const newState = {
      ...prevState, 
      allItems: {
        ...prevState.allItems,
        [id]: {
          ...prevState.allItems[id], 
          isCompleted: true
        }
      }
    }
    this.saveItems(newState.allItems)
    return {...newState}
  })
}

incompleteItem = id =>{
  this.setState(prevState =>{
    const newState = {
      ...prevState, 
      allItems: {
        ...prevState.allItems,
        [id]: {
          ...prevState.allItems[id],
          isCompleted: false
        }
      }
    }
    this.saveItems(newState.allItems)
    return {...newState}
  })
}

deleteAllItems = async () => {
  try{
    await AsyncStorage.removeItem('Todos')
    this.setState({ allItems: {}})
  } catch (err) {
    console.error(err)
  }
}

saveItems = newItem => {
  const saveItem = AsyncStorage.setItem('Todos', JSON.stringify(newItem))
}


  render() {
    const {inputValue, loadingItems, allItems} = this.state
    return (
        <LinearGradient colors={primaryGradientArray} style = {styles.container}>
            <StatusBar barStyle = "dark-content" />
            <View style = {styles.centered}>
              <Header title = {headerTitle}/>
            </View>

            <View style = {styles.inputContainer}>
               <Subtitle subtitle = {"What are your plans for today? "} />
                  <Input
                    inputValue = {inputValue}
                    onChangeText = {this.newInputValue}
                    onDoneAddItem = {this.onDoneAddItem}
                   />
               </View>

            <View style = {styles.list}>
              <View style = {styles.column}>
                <Subtitle  subtitle = {"Recent notes"} />
               <View style ={styles.deleteAllButon}>
                 <Button deleteAllItems = {this.deleteAllItems} />
              </View>
            </View>
            {loadingItems ? (
              	<ScrollView contentContainerStyle = {styles.scrollableList}>
                      {Object.values(allItems)
                        .reverse()
                        .map(item => (
                            <List
                              key = {item.id}
                              {...item}
                              deleteItem = {this.deleteItem}
                              completeItem = {this.completeItem}
                              incompleteItem = {this.incompleteItem}
                            />
                          ))}
                      </ScrollView>
            ) : (
              <ActivityIndicator size = "large" color = "white" />
            )}
            </View>
        </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {

    flex: 1
    // backgroundColor: '#beb1a5',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  centered : {
    alignItems: 'center'
  },
  inputContainer: {
    marginTop: 40,
    paddingLeft: 15
  }, 
  scrollableList: {
    marginTop: 15
  }, 
  list: {
    flex: 1, 
    marginTop: 70, 
    paddingLeft: 15, 
    marginBottom: 10,

  }, 
  column: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    borderRadius: 12
  }, 
  deleteAllButon: {
    marginRight: 40,
    top: 20
  }
});



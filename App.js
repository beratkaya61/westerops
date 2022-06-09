import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';

import CheckBox from 'expo-checkbox';

import AsyncStorage from '@react-native-async-storage/async-storage';

import uuid from 'react-native-uuid';

import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

import BottomSheet from '@gorhom/bottom-sheet';
import { RadioButton } from 'react-native-paper';

const ASYNC_STORAGE_TODO_LIST_KEY = '@AsyncStorageTodoListKey';
const ASYNC_STORAGE_PINNED_LIST_KEY = '@AsyncStoragePinnedListKey';

const bottomSheetTypes = {
  addTask: {
    title: 'Add a Task',
    type: 1
  },
  threeDots: {
    type: 2
  },
  updateTask: {
    title: 'Update Task',
    type: 3
  }
}

export default function App() {

  const [agree, setAgree] = useState(false);
  const [text, onChangeText] = useState('');
  const [checked, setChecked] = useState(false);
  const [bottomSheetFeatures, setBottomSheetFeatures] = useState({
    title: '',
    type: bottomSheetTypes.addTask.type
  });

  const [bottomSheetData, setBottomSheetData] = useState(null);
  const [asyncStorageLock, setAsyncStorageLock] = useState(true);

  const [pinnedList, setPinnedList] = useState([]);
  const [todoList, setTodoList] = useState([]);

  const [tempPinnedList, setTempPinnedList] = useState([]);

  const [isPinned, setPinned] = useState(false);

  const bottomSheetRef = useRef(null);

  useEffect(() => {

    if (!asyncStorageLock) {
      saveTodoToUserDevice(todoList);
      console.log('state condition after todo save to async storage : ', todoList);
    }

  }, [todoList]);

  useEffect(() => {

    if (!asyncStorageLock) {
      savePinnedToUserDevice(pinnedList);
    }
    console.log('state condition after pinned list save to async storage : ', pinnedList);

  }, [pinnedList]);

  useEffect(() => {
    getAllTODOListFromAsyncStorage();
    getAllPinnedListFromAsyncStorage();
  }, []);

  // variables
  const snapPoints = useMemo(() => ['25%', '30%', '50%', '78%'], []);

  const handleOpenBottomSheet = useCallback((index, feature, isPinned = false) => {
    console.log('handleOpenBottomSheet features : ', feature);
    setBottomSheetFeatures({
      title: feature.title,
      type: feature.type
    });

    setPinned(isPinned);
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  const handleCloseBottomSheet = useCallback(() => {

    onChangeText('');
    setChecked(false)

    bottomSheetRef.current?.close();

    setTimeout(() => {
      Keyboard.dismiss();
    }, 300);
  }, []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    //console.log('handleSheetChanges', index);
  }, []);



  // TODO LIST OPERATIONS
  const addTODO = async (item) => {

    console.log('addTODO : ', item);

    if (item == '') {
      Alert.alert('Error', 'Please input todo');
    } else {

      const newTodo = {
        id: uuid.v4(), // ⇨ '11edc52b-2918-4d71-9058-f7285e29d894'
        name: item,
        isChecked: false
      };

      //this remove lock to save data to async storage
      setAsyncStorageLock(false);
      setTodoList([...todoList, JSON.stringify(newTodo)]);
      handleCloseBottomSheet();
      onChangeText('');
    }
  };

  const saveTodoToUserDevice = async todoList => {
    try {
      const stringifyTodoList = JSON.stringify(todoList);
      await AsyncStorage.setItem(ASYNC_STORAGE_TODO_LIST_KEY, stringifyTodoList);
      console.log('saveTodoToUserDevice : ', stringifyTodoList);
    } catch (error) {
      // Error saving data
      console.log('Error while saving todo list data : ', error);
    }
  };

  const getAllTODOListFromAsyncStorage = async () => {
    try {
      const todos = await AsyncStorage.getItem(ASYNC_STORAGE_TODO_LIST_KEY);
      if (todos != null) {
        setTodoList(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };



  // PINNED LIST OPERATIONS
  const addPinned = async (item) => {

    console.log('add Pinned Item : ', item);

    if (item == '') {
      Alert.alert('Error', 'Please input pinned');
    } else {

      const newPinnedItem = {
        id: uuid.v4(),
        name: item,
        isChecked: false
      };

      //this remove lock to save data to async storage
      setAsyncStorageLock(false);

      setPinnedList([...pinnedList, JSON.stringify(newPinnedItem)]);
      handleCloseBottomSheet();
      onChangeText('');
    }

  };

  const getAllPinnedListFromAsyncStorage = async () => {
    try {
      const pinnedItem = await AsyncStorage.getItem(ASYNC_STORAGE_PINNED_LIST_KEY);

      if (pinnedItem != null) {
        setPinnedList(JSON.parse(pinnedItem));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const savePinnedToUserDevice = async pinnedList => {
    try {
      const stringifyPinnedList = JSON.stringify(pinnedList);
      await AsyncStorage.setItem(ASYNC_STORAGE_PINNED_LIST_KEY, stringifyPinnedList);
      console.log('save Pinned İTEM To User Device : ', stringifyPinnedList);
    } catch (error) {
      // Error saving data
      console.log('Error while saving todo list data : ', error);
    }
  };



  const deleteItem = () => {

    const data = JSON.parse(bottomSheetData);

    if (!isPinned) {
      //REMOVE ITEM FROM TODO LIST
      const newPinnedList = pinnedList.filter(item => JSON.parse(item).id !== data.id);
      //this remove lock to save data to async storage
      setAsyncStorageLock(false);

      setPinnedList(newPinnedList);
    } else {
      //REMOVE ITEM FROM PINNED LIST
      const newTodoList = todoList.filter(item => JSON.parse(item).id !== data.id);
      setAsyncStorageLock(false);
      setTodoList(newTodoList);
    }
  }

  const updateItem = (text) => {

    const data = JSON.parse(bottomSheetData);

    if (!isPinned) {
      //UPDATE ITEM FROM TODO LIST
      const updateTodoList = todoList.map(item => {
        if (JSON.parse(item).id === data.id) {
          return JSON.stringify({
            ...JSON.parse(item),
            name: text,
          });
        }
        return item;
      }
      );

      if (checked) {

        //todo list de bulunan item pinned liste ekleniyor
        //transfer todo list to pinned list
        const newTodoList = todoList.filter(item => JSON.parse(item).id !== data.id);

        //this remove lock to save data to async storage
        setAsyncStorageLock(false);

        setTodoList(newTodoList);

        const newPinnedItem = {
          id: data.id,
          name: text,
          isChecked: data.isChecked
        };

        setPinnedList([...pinnedList, JSON.stringify(newPinnedItem)]);

        handleCloseBottomSheet();
        onChangeText('');

        return;
      }

      //this remove lock to save data to async storage
      setAsyncStorageLock(false);

      setTodoList(updateTodoList);
    }
    else {
      //UPDATE ITEM FROM PINNED LIST
      const updatedPinnedList = pinnedList.map(item => {
        if (JSON.parse(item).id === data.id) {
          return JSON.stringify({
            ...JSON.parse(item),
            name: text
          });
        }
        return item;
      }
      );

      if (!checked) {

        //pinned list de bulunan item todo liste ekleniyor
        //transfer pinned list to todo list
        const newPinnedList = pinnedList.filter(item => JSON.parse(item).id !== data.id);

        //this remove lock to save data to async storage
        setAsyncStorageLock(false);

        setPinnedList(newPinnedList);

        const newTodoItem = {
          id: data.id,
          name: text,
          isChecked: data.isChecked
        };

        setTodoList([...todoList, JSON.stringify(newTodoItem)]);

        handleCloseBottomSheet();
        onChangeText('');

        return;
      }

      //this remove lock to save data to async storage
      setAsyncStorageLock(false);

      setPinnedList(updatedPinnedList);
    }

    handleCloseBottomSheet();
    onChangeText('');
  }

  //it is used only transfer todo list to pinned list
  const pinOnTheTop = () => {

    const data = JSON.parse(bottomSheetData);

    const newTodoList = todoList.filter(item => JSON.parse(item).id !== data.id);

    //this remove lock to save data to async storage
    setAsyncStorageLock(false);

    setTodoList(newTodoList);

    const newPinnedItem = {
      id: data.id,
      name: data.name,
      isChecked: data.isChecked
    };

    setPinnedList([...pinnedList, JSON.stringify(newPinnedItem)]);
  }

  const checkboxHandleChange = async (id) => {

    console.log('checkbox clicked : ', id);

    let tempPinnedItems = pinnedList.map((pinnedItem) => {

      const pinnedItemData = JSON.parse(pinnedItem);

      if (id === pinnedItemData.id) {
        const updated = { ...pinnedItemData, isChecked: !pinnedItemData.isChecked };

        return JSON.stringify(updated)
      }

      return JSON.stringify(pinnedItemData);
    });

    const tempList=[]
    tempList.push(...tempPinnedItems);
    
    setAsyncStorageLock(false)
    setPinnedList(tempList);
  };

  const isItemExistInPinnedList = () => {
    const isExist = pinnedList.find(item => JSON.parse(item).id === JSON.parse(bottomSheetData).id);

    if (isExist)
      setChecked(true)
    else
      setChecked(false)
  }


  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        // Background Linear Gradient
        colors={['#85A1BA', '#194591']}
        style={styles.background}
      />

      <View style={{
        position: 'absolute',
        alignItems: 'center',
        top: 60,
        left: 100,
        backgroundColor: 'transparent',
        borderRadius: 8,
        width: 343,
        height: 100,
      }}>
        <Image source={require('./assets/logo2.png')}
          style={{
            resizeMode: 'contain',
            height: '100%',
            width: '100%',
          }} />
      </View>

      {/* all todo list container */}
      <View
        style={{
          position: 'absolute',
          top: 130,
          left: 25,
          backgroundColor: '#fff',
          borderRadius: 8,
          width: 343,
          height: 650,
        }}>
        <View style={styles.todoListHeaderContainer}>
          <Text style={styles.todoListText}>To Do List</Text>
          <View style={styles.todoListHeaderBottomLine} />
        </View>

        {/* pinned and normal todo list items body */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            marginTop: 30,
            marginLeft: 20,
          }}>


          {/* pin list */}
          {pinnedList.length > 0 && (
            <>
              {/* pin field container */}
              <View style={styles.pinnedFieldContainer}>
                <AntDesign name="pushpino" size={24} color="#FF7964" />
                <Text style={styles.pinnedFieldText}>Pin on the top</Text>
              </View>

              {pinnedList.map((item) => {
                const pinnedItem = JSON.parse(item);
                return (
                  <View key={pinnedItem.id}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>

                    {/* checkbox container */}
                    <View style={{
                      flexDirection: "row",
                      marginVertical: 20,
                    }}>
                      <CheckBox
                        boxType="square"
                        color='#21A7F9'
                        value={pinnedItem.isChecked}
                        onValueChange={() => checkboxHandleChange(pinnedItem.id)}
                      />
                      <Text style={styles.pinnedItemText}>{pinnedItem.name}</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        setBottomSheetData(JSON.stringify(pinnedItem))
                        handleOpenBottomSheet(0, { type: bottomSheetTypes.threeDots.type })
                      }}
                    >
                      <Text style={styles.pinnedItemThreeDots}>
                        ...
                      </Text>
                    </TouchableOpacity>
                  </View>
                )
              })}

              {/* pin bottom border */}
              <View style={styles.pinnedItemBottomBorderLine} />
            </>
          )}

          {/* todo list without pinned */}
          {todoList.length > 0 && todoList.map((item) => {

            const todoItem = JSON.parse(item);
            return (
              <View key={todoItem.id} style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>

                {/* checkbox container */}
                <View style={{
                  flexDirection: "row",
                  marginVertical: 20,
                }}>
                  <CheckBox
                    boxType="square"
                    color='#21A7F9'
                    value={agree}
                    onChange={() => setAgree(!agree)}
                  />
                  <Text style={styles.pinnedItemText}>{todoItem.name}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setBottomSheetData(JSON.stringify(todoItem))
                    handleOpenBottomSheet(1, { type: bottomSheetTypes.threeDots.type }, true)
                  }}
                >
                  <Text style={styles.pinnedItemThreeDots}>
                    ...
                  </Text>
                </TouchableOpacity>
              </View>
            )
          })}

        </ScrollView>

        {/* add task button */}
        <TouchableOpacity
          onPress={async () =>
            handleOpenBottomSheet(3, { type: bottomSheetTypes.addTask.type, title: bottomSheetTypes.addTask.title })
          }
          style={{
            margin: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#21A7F9',
            padding: 20,
            width: '90%',
            height: 60,
            borderRadius: 4
          }}>
          {/* text and icon */}
          <View style={{
            flexDirection: 'row',
            height: '100%'
          }}>
            <Image source={require('./assets/stroke-vector.png')} style={{
              height: 18,
              width: 18,
              marginRight: 10,
              tintColor: '#FFFFFF'
            }} />

            <Text style={{
              color: "#FFFFFF",
              fontSize: 18,
              fontWeight: '400',
              lineHeight: 22,
              letterSpacing: 0.5,
              textAlign: 'center',
              // font-family: 'Inter';                
            }}>
              Add a task
            </Text>
          </View>

          {/* row icon */}
          <AntDesign name="arrowright" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose={true}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.00,

          elevation: 24,
        }}
        backgroundStyle={{
          backgroundColor: '#FFFFFF'
        }}
      >

        {/* add a task or update a task bottom sheet */}
        {
          ((bottomSheetFeatures.type === bottomSheetTypes.addTask.type ||
            bottomSheetFeatures.type === bottomSheetTypes.updateTask.type)) && (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

              {/* bottom sheet header container */}
              {/* bottom sheet title */}
              <View style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
              }}>

                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '35%',
                }}>
                  <Image source={require('./assets/stroke-vector.png')} style={{
                    height: 15,
                    width: 15,
                    marginRight: 10,
                    tintColor: '#FF7964'
                  }} />
                  <Text style={{
                    color: "#FF7964",
                    fontStyle: 'normal',
                    fontWeight: '600',
                    fontSize: 18,
                    lineHeight: 22,
                    textAlign: 'center',
                    letterSpacing: 0.5,
                    //   font- family: 'Inter';
                  }}>
                    {bottomSheetFeatures.title}
                  </Text>
                </View>

                <TouchableWithoutFeedback
                  onPress={() => handleCloseBottomSheet()}
                >
                  <AntDesign
                    style={{
                      marginLeft: 90,
                    }} name="close" size={20} color="#010A1B" />
                </TouchableWithoutFeedback>
              </View>

              {/* bottom sheet header bottom border */}
              <View style={{ ...styles.pinnedItemBottomBorderLine, width: '100%' }} />

              {/* bottom sheet body */}
              <View
                style={{
                  padding: 40,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                <TextInput
                  style={styles.textInputStyle}
                  onChangeText={onChangeText}
                  value={text}
                  placeholder="Task Description"
                />

                {/* pin field container */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 30,
                  paddingHorizontal: 20,
                  width: '100%',
                }}>
                  <View style={styles.pinnedFieldContainer}>
                    <AntDesign name="pushpino" size={24} color="#FF7964" />
                    <Text style={{ ...styles.pinnedFieldText, color: '#010A1B' }}>Pin on the top</Text>
                  </View>

                  <RadioButton
                    value={checked}
                    status={checked === true ? 'checked' : 'unchecked'}
                    onPress={() => {
                      console.log('checked nedir ', checked)
                      setChecked(!checked)
                    }}
                  />
                </View>

                {/* bottom sheet save button */}
                <TouchableOpacity
                  onPress={() => {
                    if (bottomSheetFeatures.type === bottomSheetTypes.addTask.type) {
                      if (checked)
                        addPinned(text)
                      else
                        addTODO(text)
                    } else if (bottomSheetFeatures.type === bottomSheetTypes.updateTask.type) {
                      updateItem(text)
                    }
                  }}
                  style={{
                    position: 'absolute',
                    bottom: -150,
                    alignItems: 'center',
                    backgroundColor: '#21A7F9',
                    padding: 20,
                    width: '90%',
                    height: 60,
                    borderRadius: 4
                  }}>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 18,
                      fontWeight: '400',
                      lineHeight: 22,
                      letterSpacing: 0.5,
                      textAlign: 'center',
                      // font-family: 'Inter';               
                    }}>Save</Text>
                </TouchableOpacity>

                {/* bottom sheet cancel button */}
                <TouchableOpacity
                  onPress={() => handleCloseBottomSheet()}
                  style={{
                    position: 'absolute',
                    bottom: -200,
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  <Text
                    style={{
                      color: "#21A7F9",
                      fontSize: 18,
                      fontWeight: '400',
                      lineHeight: 22,
                      letterSpacing: 0.5,
                      textAlign: 'center',
                      // font-family: 'Inter';               
                    }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          )
        }

        {/* threeDots bottom sheet */}
        {
          bottomSheetFeatures.type === bottomSheetTypes.threeDots.type && (
            <>
              <TouchableWithoutFeedback
                style={{
                  width: '100%',
                }}
                onPress={() => handleCloseBottomSheet()}
              >
                <AntDesign
                  style={{
                    marginLeft: '90%'
                  }} name="close" size={20} color="#010A1B" />
              </TouchableWithoutFeedback>

              <View style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>

                {/* pin on the top button */}
                {isPinned && (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        pinOnTheTop()
                        handleCloseBottomSheet()
                      }}
                      style={{
                        flexDirection: 'row',
                        marginVertical: 20,
                      }}>
                      <AntDesign name="pushpino" size={24} color="#010A1B" />
                      <Text style={{ ...styles.pinnedFieldText, color: '#010A1B' }}>Pin on the top</Text>
                    </TouchableOpacity>

                    {/* border line */}
                    <View style={{ ...styles.pinnedItemBottomBorderLine, width: '100%' }} />
                  </>
                )}

                {/* update button */}
                <TouchableOpacity
                  onPress={() => {
                    handleCloseBottomSheet()
                    onChangeText(JSON.parse(bottomSheetData).name)

                    //if item exist in pinned list, then checked true
                    isItemExistInPinnedList()

                    console.log('isPinned in update button : ', isPinned)

                    const pinned = isPinned ? false : true

                    handleOpenBottomSheet(3, { type: bottomSheetTypes.updateTask.type, title: bottomSheetTypes.updateTask.title }, pinned)
                  }}
                  style={{
                    flexDirection: 'row',
                    marginVertical: 20,
                  }}>
                  <MaterialIcons name="published-with-changes" size={24} color="#010A1B" />
                  <Text style={{ ...styles.pinnedFieldText, color: '#010A1B' }}>Update</Text>
                </TouchableOpacity>

                {/* border line */}
                <View style={{ ...styles.pinnedItemBottomBorderLine, width: '100%' }} />

                {/* delete button */}
                <TouchableOpacity
                  onPress={() => {
                    deleteItem()
                    handleCloseBottomSheet()
                  }}
                  style={{
                    flexDirection: 'row',
                    marginVertical: 20,
                  }}>
                  <AntDesign name="delete" size={24} color="#010A1B" />
                  <Text style={{ ...styles.pinnedFieldText, color: '#010A1B' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
      </BottomSheet>
    </View >
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#194591',
  },
  textInputStyle: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#999C9F',
    padding: 10,
    borderRadius: 4,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
  },
  todoListHeaderContainer: {
    width: '100%',
    height: 38,
    top: 16,
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 2,
  },
  todoListText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#194591',
    fontWeight: '600',
  },
  todoListHeaderBottomLine: {
    position: 'absolute',
    width: 150,
    height: 4,
    left: 90,
    bottom: -1,
    backgroundColor: '#FF7964'
  },

  pinnedFieldContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    width: '100%',
  },
  pinnedFieldText: {
    //fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#FF7964',
    marginLeft: 10,
  },
  pinnedItemText: {
    color: '#010A1B',
    fontSize: 16,
    textAlign: 'left',
    letterSpacing: 0,
    lineHeight: 20,
    fontWeight: '400',
    marginLeft: 10,
  },
  pinnedItemThreeDots: {
    color: '#999C9F',
    fontSize: 30,
    textAlign: 'center',
    marginRight: 20,
  },
  pinnedItemBottomBorderLine: {
    width: '90%',
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1.5
  }
});

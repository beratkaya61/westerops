import React, { useState, useCallback, useMemo, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import CheckBox from "expo-checkbox";
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

import BottomSheet from '@gorhom/bottom-sheet';
import { RadioButton } from 'react-native-paper';



const pinnedItemList = [
  {
    id: 1,
    name: 'Getting an invite for Figma 1',
  }, {
    id: 2,
    name: 'Getting an invite for Figma 2',
  }, {
    id: 3,
    name: 'Getting an invite for Figma 3',
  }, {
    id: 4,
    name: 'Getting an invite for Figma 4',
  }, {
    id: 5,
    name: 'Getting an invite for Figma 5',
  }, {
    id: 6,
    name: 'Getting an invite for Figma 6',
  }
]

const todoItemList = [
  {
    id: 1,
    name: '8 am meeting'
  }, {
    id: 2,
    name: 'Finish visual Design'
  }, {
    id: 3,
    name: 'Do research'
  },
  {
    id: 4,
    name: 'Reading About WesterOps'
  }, {
    id: 5,
    name: 'Do yoga'
  }, {
    id: 6,
    name: 'Do football'
  }
]

export default function App() {

  const bottomSheetTypes = {
    addTask: {
      title: 'Add a Task',
      type: 1
    },
    threeDots: {
      type: 2
    }
  }

  const [agree, setAgree] = useState(false);
  const [text, onChangeText] = useState('');
  const [checked, setChecked] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState(bottomSheetTypes.addTask.type);

  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['30%', '50%', '78%'], []);

  const handleOpenBottomSheet = useCallback((index, type) => {
    setBottomSheetType(type);
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

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
        <Image source={require('./assets/logo.png')}
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
          {/* pin field container */}
          <View style={styles.pinnedFieldContainer}>
            <AntDesign name="pushpino" size={24} color="#FF7964" />
            <Text style={styles.pinnedFieldText}>Pin on the top</Text>
          </View>

          {/* pin list */}
          <>
            {pinnedItemList.map((item, key) => {
              return (

                <View key={key} style={{
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
                    <Text style={styles.pinnedItemText}>{item.name}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleOpenBottomSheet(0, bottomSheetTypes.threeDots.type)}
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

          {/* todo list without pinned */}
          {todoItemList.map((item, key) => {
            return (
              <View key={key} style={{
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
                  <Text style={styles.pinnedItemText}>{item.name}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleOpenBottomSheet(0, bottomSheetTypes.threeDots.type)}
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
          onPress={() => handleOpenBottomSheet(2, bottomSheetTypes.addTask.type)}
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

        {/* add a task bottom sheet */}
        {
          bottomSheetType === bottomSheetTypes.addTask.type && (
            <>
              {/* bottom sheet header container */}
              <>
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
                      Add a task
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={{
                      marginHorizontal: 90,
                    }} onPress={() => handleCloseBottomSheet()}>
                    <AntDesign name="close" size={20} color="#010A1B" />
                  </TouchableOpacity>
                </View>

                {/* bottom sheet header bottom border */}
                <View style={{ ...styles.pinnedItemBottomBorderLine, width: '100%' }} />
              </>

              {/* bottom sheet body */}
              <View style={{
                padding: 40,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <TextInput
                  style={styles.textInputStyle}
                  onChangeText={onChangeText}
                  value={text}
                  placeholder="Task Description"
                //keyboardType="numeric"
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
                      setChecked(!checked)
                      console.log('checked nedir ', checked)
                    }}
                  />
                </View>

                {/* bottom sheet save button */}
                <TouchableOpacity
                  onPress={() => handleCloseBottomSheet()}
                  style={{
                    position: 'absolute',
                    bottom: -250,
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
                    bottom: -350,
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
            </>
          )
        }

        {/* threeDots bottom sheet */}

        {
          bottomSheetType === bottomSheetTypes.threeDots.type && (
            <View style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>

              {/* pin on the top button */}
              <TouchableOpacity
                onPress={() => handleCloseBottomSheet()}
                style={{
                  flexDirection: 'row',
                  marginVertical: 20,
                }}>
                <AntDesign name="pushpino" size={24} color="#010A1B" />
                <Text style={{ ...styles.pinnedFieldText, color: '#010A1B' }}>Pin on the top</Text>
              </TouchableOpacity>

              {/* border line */}
              <View style={{ ...styles.pinnedItemBottomBorderLine, width: '100%' }} />

              {/* update button */}
              <TouchableOpacity
                onPress={() => handleCloseBottomSheet()}
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
                onPress={() => handleCloseBottomSheet()}
                style={{
                  flexDirection: 'row',
                  marginVertical: 20,
                }}>
                <AntDesign name="delete" size={24} color="#010A1B" />
                <Text style={{ ...styles.pinnedFieldText, color: '#010A1B' }}>Delete</Text>
              </TouchableOpacity>

            </View>
          )
        }

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

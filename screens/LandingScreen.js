import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Text,
  FlatList,
  Image,
} from "react-native";
import MyHeader from "../components/MyHeader";
import { Header, Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import { DrawerActions } from "react-navigation";
export default class LandingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      he:''
    }
    }
  render() {
    return (
        <View style={{ flex: 1 }}>
          <MyHeader title="Welcome" navigation={this.props.navigation} />
         {/* <Header
          leftComponent={
            <Icon
              name="bars"
              type="font-awesome"
              color="#696969"
              onPress={() => {
                this.props.navigation.toggleDrawer();
              }}
            />
          }
          centerComponent={{
            text: "Tutorial",
            style: { color: "#90A5A9", fontSize: 20, fontWeight: "bold" },
          }}
          backgroundColor="#EaF8fE"
        /> */}

        <View style={{ flex: 1, alignItems: "center" }}>
          <Image
            source={require("../assets/CommunitySanta.png")}
            style={{
              //   flex:0.7,
              marginTop: RFValue(10),
              width: RFValue(200),
              height: RFValue(200),
            }}
          />
          <Text
            style={{
              padding: RFValue(10),
              marginTop: RFValue(20),
              fontSize: RFValue(20),
            }}
          >
            What would you like to do?
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.navigation.navigate("HelpScreen");
            }}
          >
            <Text style={styles.buttontxt}>Help People!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.navigation.navigate("RequestScreen");
            }}
          >
            <Text style={styles.buttontxt}>Receive Help!</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    keyBoardStyle: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    formTextInput: {
      width: "75%",
      height: RFValue(35),
      borderWidth: RFValue(1),
      padding: RFValue(10),
    },
    formTextInput2: {
      width: "75%",
      height: RFValue(155),
      borderWidth: RFValue(1),
      padding: RFValue(10),
    },
    ImageView: {
      flex: 0.3,
      justifyContent: "center",
      alignItems: "center",
      marginTop: RFValue(20),
    },
    feedbackTextInput: {
      width: "75%",
      height: RFValue(145),
      borderWidth: RFValue(1),
      padding: RFValue(10),
    },
    askedRequestName: {
      fontSize: RFValue(30),
      fontWeight: "500",
      padding: RFValue(10),
      alignItems: "center",
      marginLeft: RFValue(135),
      marginTop: RFValue(-40),
    },
    status: {
      fontSize: RFValue(20),
      marginTop: RFValue(30),
    },
    requestStatus: {
      fontSize: RFValue(30),
      fontWeight: "bold",
      marginTop: RFValue(20),
    },
    requestStatus: {
      fontWeight: "500",
      fontSize: RFValue(30),
      marginLeft: RFValue(70),
      marginTop: RFValue(-30),
    },
    buttonView: {
      flex: 0.2,
      justifyContent: "center",
      alignItems: "center",
    },
    requestText: {
      fontSize: RFValue(25),
    },
    requestText1: {
      paddingTop: RFValue(20),
      fontSize: RFValue(10),
    },
    buttontxt: {
      fontSize: RFValue(18),
      fontWeight: "bold",
      color: "#fff",
    },
    touchableopacity: {
      alignItems: "center",
      backgroundColor: "#DDDDDD",
      padding: RFValue(10),
      width: "90%",
    },
    requestbuttontxt: {
      fontSize: RFValue(20),
      fontWeight: "bold",
      color: "#fff",
    },
    button: {
      width: "75%",
      height: RFValue(60),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: RFValue(50),
      backgroundColor: "#32867d",
      shadowColor: "#000",
      shadowOffset: {
        width: RFValue(0),
        height: RFValue(8),
      },
      shadowOpacity: RFValue(0.44),
      shadowRadius: RFValue(10.32),
      elevation: RFValue(16),
      marginTop: RFValue(40),
    },
    dropdown: {
      alignSelf: "flex-end",
      marginTop: RFValue(-49),
      right: RFValue(8),
      // borderRadius: RFValue(3),
      width: "97%",
      borderColor: "black",
      borderWidth: RFValue(0.5),
      height: RFValue(35),
    },
    dropdown_text: {
      marginVertical: RFValue(10),
      marginHorizontal: RFValue(6),
      fontSize: RFValue(10),
      textAlign: "center",
      textAlignVertical: "center",
    },
    dropdown_dropdown: {
      width: "97%",
      height: RFValue(70),
      borderWidth: RFValue(2),
      borderRadius: RFValue(3),
    },
    dropdown_text_style: {
      fontSize: RFValue(10),
      alignSelf: "center",
    },
    dropdown2: {
      alignSelf: "flex-end",
      width: RFValue(200),
      marginTop: RFValue(-49),
      right: RFValue(8),
      // borderRadius: RFValue(3),
      width: "97%",
      borderColor: "black",
      borderWidth: RFValue(0.5),
      height: RFValue(35),
    },
    dropdown_text2: {
      marginVertical: RFValue(10),
      marginHorizontal: RFValue(6),
      fontSize: RFValue(10),
      textAlign: "center",
      textAlignVertical: "center",
    },
    dropdown_dropdown2: {
      width: "97%",
      height: RFValue(100),
      borderWidth: RFValue(2),
      borderRadius: RFValue(3),
    },
    dropdown_text_style2: {
      fontSize: RFValue(10),
      alignSelf: "center",
    },
  });
  
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { ListItem } from "react-native-elements";
import firebase from "firebase";
import { Input, Icon, Header } from "react-native-elements";
import db from "../config";
import { RFValue } from "react-native-responsive-fontsize";
import * as ScreenOrientation from "expo-screen-orientation";
import MyHeader from "../components/MyHeader";
export default class HelpScreen extends Component {
  constructor() {
    super();
    this.state = {
      requestsList: [],
      user: firebase.auth().currentUser.email,
      isHelpActive: false,
      isHelping: "",
      askedRequestName: "",
      description: "",
      requestDateAndTime: "",
      requestStatus: "",
      requestLocation: 0,
      requestBetween: "",
      tree1: true,
      tree2: false,
      tree3: false,
      tree4: false,
      tree5: false,
      tree_rating: 1,
      name: "",
      zipCode: 0,
      requestId: "",
    };
    // this.requestRef = null;
  }

  getRequestsList = () => {
    db.collection("users")
      .where("email", "==", this.state.user)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          this.setState({
            zipCode: doc.data().address,
          });
          this.requestRef = db
            .collection("requests")
            .where("request_status", "==", "Requested")
            .where("request_location", "==", doc.data().address)
            .onSnapshot((snapshot) => {
              var requestsList = snapshot.docs.map((doc) => doc.data());
              this.setState({
                requestsList: requestsList,
              });
            });
        });
      });
  };
  sendFeedback = () => {
    db.collection("feedback").add({
      user_id: this.state.userId,
      feedback: this.state.feedback,
      tree_rating: this.state.tree_rating,
      sentTo: this.state.isHelping,
    });
  };

  getIsHelpActive = async () => {
    await db
      .collection("users")
      .where("email", "==", this.state.user)
      .onSnapshot((snapshot)=>{
        snapshot.forEach((doc)=>{
          this.setState({
            isHelpActive: doc.data().isHelpActive,
            isHelping: doc.data().isHelping,
          });

        });
  })
}

  getRequestDetails = async () => {
    console.log(this.state.isHelping);
    // var userName = this.state.isHelping;
    await db
      .collection("users")
      .where("email", "==", this.state.user)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var help = doc.data().isHelping;
          db.collection("users")
            .where("email", "==", help)
            .onSnapshot((snapshot) => {
              snapshot.docs.map((doc) => {
                this.setState({
                  name: doc.data().name + " " + doc.data().last_name,
                });
              });
            });
          db.collection("requests")
            .where("user_id", "==", help)
            .onSnapshot((snapshot) => {
              snapshot.docs.map((doc) => {
                console.log(doc.data());
                this.setState({
                  askedRequestName: doc.data().request_name,
                  description: doc.data().description,
                  requestDateAndTime: doc.data().request_time_and_date,
                  requestStatus: doc.data().request_status,
                  requestLocation: doc.data().request_location,
                  requestBetween: doc.data().request_between,
                });
              });
            });
        });
      });
  };

  componentDidMount() {
    this.getIsHelpActive();
    this.getRequestsList();
    this.getRequestDetails();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem>
        <ListItem.Content>
          <ListItem.Title>{item.request_name}</ListItem.Title>
          <View style={styles.subtitleView}>
            <ListItem.Subtitle style={{ flex: 0.8 }}>
              {item.description}
            </ListItem.Subtitle>
            <TouchableOpacity
              style={styles.button2}
              onPress={() => {
                this.props.navigation.navigate("ReceiverDetails", {
                  details: item,
                });
                console.log("Pressed Button");
              }}
            >
              <Text
                style={{
                  color: "white",
                  alignSelf: "center",
                  fontSize: RFValue(10),
                }}
              >
                View Request
              </Text>
            </TouchableOpacity>
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };

  render() {
    if (this.state.isHelpActive === true) {
      return (
        <View
          style={{
            flex: 1,
            borderWidth: RFValue(20),
            borderColor: "#32867d",
          }}
        >
          <Header
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
              text: "Help",
              style: { color: "#90A5A9", fontSize: 20, fontWeight: "bold" },
            }}
            backgroundColor="#EaF8fE"
          />
          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <Text style={styles.isHelpingText}>
              You are helping {this.state.name}.
            </Text>
            <Text style={styles.isHelpingText}>
              Please click the bell icon bellow to see their contact.
            </Text>
            <Icon
              name="bell"
              type="font-awesome"
              color="#696969"
              size={RFValue(20)}
              style={{ padding: RFValue(20) }}
              onPress={() => {
                this.props.navigation.navigate("NotificationScreen");
              }}
            />
          </View>
        </View>
      );
    }
    
    return (
      <View style={styles.view}>
        <MyHeader title="Be a Santa" navigation={this.props.navigation} />
        <Text style={styles.zipCodeText}>
          Request(s) made in your zip code: {this.state.zipCode}
        </Text>
        <View style={{ flex: 1 }}>
          {this.state.requestsList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List Of All Requests</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.requestsList}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
  },
  button2: {
    flex: 0.2,
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  isHelpingText: {
    alignSelf: "center",
    justifyContent: "center",
    fontSize: RFValue(15),
  },
  subtitleView: {
    flex: 1,
    flexDirection: "row",
    padding: 2,
  },
  view: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // keyBoardStyle: {
  //   flex: 1,
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  formTextInput: {
    width: "75%",
    height: RFValue(35),
    borderWidth: 1,
    padding: 10,
  },
  // ImageView: {
  //   flex: 0.3,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginTop: 20,
  // },
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
  // requestStatus: {
  //   fontWeight: "500",
  //   fontSize: RFValue(30),
  //   marginLeft: RFValue(70),
  //   marginTop: RFValue(-30),
  // },
  buttonView: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
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
  zipCodeText: {
    fontSize: RFValue(12),
    alignSelf: "center",
    alignItems: "center",
    color: "#90A5A9",
    fontWeight: "bold",
    backgroundColor: "#EaF8fE",
  },
});

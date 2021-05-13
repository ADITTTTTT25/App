import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  FlatList,
  TouchableHighlight,
} from "react-native";
import { Input, Icon } from "react-native-elements";
import { Table, Row, Rows } from "react-native-table-component";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import MyHeader from "../components/MyHeader";
import db from "../config";
import * as ScreenOrientation from "expo-screen-orientation";
import firebase from "firebase";
import moment from "moment";
import ModalDropdown from "react-native-modal-dropdown";
import { fonts } from "react-native-elements/dist/config";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
export default class RequestScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      requestDateAndTime: "",
      requestLocation: 0,
      requestName: "",
      requestBetween: "",
      description: "",
      isRequestActive: false,
      userDocId: "",
      zipCode: 0,
      requestStatus: "",
      askedRequestName: "",
      docId: "",
      userDocId: "",
      requestId: "",
      feedback: "",
      tree_rating: 1,
      tree1: true,
      tree2: false,
      tree3: false,
      tree4: false,
      tree5: false,
      isPressed: false,
      sentTo: "",
      day1: "",
      day2: "",
      day3: "",
      day4: "",
      day5: "",
      subCurrentDate: "",
      name: "",
      name1: "",
      userLocation: 0,
      feedbackDataForTable: [],
    };
  }
  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addRequest = async (
    requestName,
    description,
    requestDateAndTime,
    userLocation,
    requestBetween
  ) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();

    await db.collection("requests").add({
      user_id: userId,
      request_name: requestName,
      description: description,
      request_id: randomRequestId,
      request_status: "Requested",
      request_time_and_date: requestDateAndTime,
      request_location: this.state.userLocation,
      request_between: requestBetween,
    });
    this.setState({
      requestStatus: "Requested",
      askedRequestName: this.state.requestName,
    });
    this.getRequest();
    db.collection("users")
      .where("email", "==", userId)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            name: doc.data().name + " " + doc.data().last_name,
            userLocation: doc.data().address,
          });
          db.collection("users").doc(doc.id).update({
            isRequestActive: true,
          });
        });
      });

    return Alert.alert("Request Successful");
  };
  _dropdown_1_onSelect(idx, value) {
    this.setState({
      requestBetween: value,
    });
  }
  _dropdown_2_onSelect(idx, value) {
    this.setState({
      requestBetween: value,
    });
  }
  _dropdown_3_onSelect(idx, value) {
    this.setState({
      requestBetween: value,
    });
  }
  _dropdown_1_1_onSelect(idx, value) {
    this.setState({
      requestDateAndTime: value,
    });
  }
  _dropdown_2_2_onSelect(idx, value) {
    this.setState({
      requestDateAndTime: value,
    });
  }
  _dropdown_3_3_onSelect(idx, value) {
    this.setState({
      requestDateAndTime: value,
    });
  }
  _dropdown_4_4_onSelect(idx, value) {
    this.setState({
      requestDateAndTime: value,
    });
  }
  _dropdown_5_5_onSelect(idx, value) {
    this.setState({
      requestDateAndTime: value,
    });
  }
  sendFeedback = () => {
    db.collection("users")
      .where("email", "==", this.state.userId)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            name: doc.data().name + " " + doc.data().last_name,
          });
        });
      });
    db.collection("feedback").add({
      sent_by: this.state.userId,
      feedback: this.state.feedback,
      tree_rating: this.state.tree_rating,
      sent_to: this.state.sentTo,
      feedbackName: this.state.name,
    });
  };
  getisRequestActive = async () => {
    await db
      .collection("requests")
      .where("user_id", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            requestStatus: doc.data().request_status,
            userLocation: doc.data().address,
            askedRequestName: doc.data().request_name,
          });
        });
      });

    db.collection("users")
      .where("email", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            isRequestActive: doc.data().isRequestActive,
            userDocId: doc.id,
          });
        });
      });
  };
  getRequest = () => {
    db.collection("requests")
      .where("user_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            requestStatus: doc.data().request_status,
            docId: doc.id,
            requestId: doc.data().request_id,
          });
          db.collection("users")
            .where("isHelping", "==", doc.data().user_id)
            .onSnapshot((snapshot) => {
              snapshot.docs.map((doc) => {
                this.setState({
                  sentTo: doc.data().email,
                  name1: doc.data().name + " " + doc.data().last_name,
                });
              });
            });
        });
      });
  };
  getDay = () => {
    var day1 = moment();
    var day2 = moment();
    var day3 = moment();
    var day4 = moment();
    var day5 = moment();
    var currentDate = moment();
    var subCurrentDate = currentDate.subtract(2, "days");
    day1.add(1, "day");
    day2.add(2, "days");
    day3.add(3, "days");
    day4.add(4, "days");
    day5.add(5, "days");
    this.setState({
      day1: day1.format("DD/MM/YY"),
      day2: day2.format("DD/MM/YY"),
      day3: day3.format("DD/MM/YY"),
      day4: day4.format("DD/MM/YY"),
      day5: day5.format("DD/MM/YY"),
      subCurrentDate: subCurrentDate.format("DD/MM/YY"),
    });
    console.log(subCurrentDate);
    db.collection("requests")
      .where("user_id", "==", this.state.userId)
      .where("request_status", "==", "Requested")
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          if (this.state.subCurrentDate >= doc.data().request_time_and_date) {
            db.collection("users").doc(this.state.userDocId).update({
              isRequestActive: false,
            });
            db.collection("requests").doc(doc.id).update({
              request_status: "Expired",
            });
          }
        });
      });
  };
  getPincode = () => {
    db.collection("users")
      .where("email", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          this.setState({
            userLocation: doc.data().address,
          });
          console.log(this.state.userLocation);
        });
      });
  };
  // getRequestStatus = async () => {

  // };
  componentDidMount = async () => {
    await this.getisRequestActive();
    // await this.getRequestStatus();
    await this.getRequest();
    await this.getPincode();
    await this.getDay();
  };

  sendNotification = () => {
    db.collection("users")
      .where("email", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().name;
          var lastname = doc.data().last_name;
          db.collection("all_notification")
            .where("request_id", "==", this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().donor_id;
                db.collection("all_notification").add({
                  target_user_id: donorId,
                  message:
                    "Thank you for helping me" + " by " + name + " " + lastname,
                  notification_status: "unread",
                  requestName: requestName,
                });
              });
            });
        });
      });
  };
  updateRequestStatus = () => {
    db.collection("users")
      .where("isHelping", "==", this.state.userId)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users")
            .doc(doc.id)
            .update({
              isHelpActive: false,
              isHelping: "",
              feedbackSum: doc.data().feedbackSum + this.state.tree_rating,
            });
        });
      });

    db.collection("requests").doc(this.state.docId).update({
      request_status: "received",
    });

    db.collection("users").doc(this.state.userDocId).update({
      isRequestActive: false,
    });
    this.setState({
      isRequestActive: false,
      request_status: "",
    });
  };

  receiveRequests = (requestName) => {
    var userId = this.state.userId;
    var requestId = this.state.requestId;
    db.collection("received_requests").add({
      user_id: userId,
      request_name: requestName,
      request_id: requestId,
      requestStatus: "received",
    });
  };

  render() {
    const isRequestActive = this.state.isRequestActive;
    const requestStatus = this.state.requestStatus;
    const requestName = this.state.askedRequestName;

    if (
      this.state.isRequestActive === true &&
      this.state.requestStatus === "Requested"
    ) {
      return (
        <View style={{ flex: 1 }}>
          <View>
            <MyHeader
              title="Request Status"
              navigation={this.props.navigation}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: RFValue(20),
              borderColor: "#32867d",
            }}
          >
            <Text style={styles.requestText}>
              Request Name: {this.state.askedRequestName}
            </Text>
            <Text style={styles.requestText}>
              Status: {this.state.requestStatus}{" "}
            </Text>
          </View>
        </View>
      );
    }
    if (
      this.state.requestStatus === "Accepted" &&
      this.state.isPressed === false
    ) {
      return (
        <View style={{ flex: 1 }}>
          <View>
            <MyHeader
              title="Request Status"
              navigation={this.props.navigation}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: RFValue(20),
              borderColor: "#32867d",
            }}
          >
            <Text style={styles.requestText}>
              Request Name: {this.state.askedRequestName}
            </Text>
            <Text style={styles.requestText}>
              Status: {this.state.requestStatus} by {this.state.name1}
            </Text>
            <Text style={styles.requestText1}>
              Click on bell icon below, to see additional information
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
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.setState({
                  isPressed: true,
                });
                console.log("CLICKED " + this.state.isPressed);
              }}
            >
              <Text style={styles.buttontxt}>Complete Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    if (this.state.isPressed === true) {
      return (
        <View style={{ flex: 1 }}>
          <View>
            <MyHeader title="Feedback" navigation={this.props.navigation} />
          </View>

          <View
            style={{
              flex: 0.1,
              // justifyContent: "center",
              alignItems: "center",
              borderWidth: RFValue(20),
              borderColor: "#32867d",
              borderBottomWidth: RFValue(0),
            }}
          >
            <Text style={{ fontSize: RFValue(20), paddingBottom: RFValue(10) }}>
              Rate your Santa!
            </Text>
          </View>
          <View
            style={{
              flex: 0.1,
              borderWidth: RFValue(20),
              flexDirection: "row",
              justifyContent: "space-evenly",
              borderColor: "#32867d",
              borderTopWidth: RFValue(0),
              borderBottomWidth: RFValue(0),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  tree5: false,
                  tree4: false,
                  tree3: false,
                  tree2: false,
                  tree1: true,
                  tree_rating: 1,
                });
              }}
              style={{
                height: RFValue(40),
                width: RFValue(20),
              }}
            >
              {this.state.tree1 ? (
                <Image
                  source={require("../assets/Christmas_tree.png")}
                  style={{ width: RFValue(20), height: RFValue(40) }}
                />
              ) : (
                <Image
                  source={require("../assets/Christmas_tree_grey.png")}
                  style={{ width: RFValue(20), height: RFValue(40) }}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  tree5: false,
                  tree4: false,
                  tree3: false,
                  tree2: true,
                  tree1: true,
                  tree_rating: 2,
                });
              }}
              style={{
                height: RFValue(40),
                width: RFValue(20),
              }}
            >
              {this.state.tree2 ? (
                <Image
                  source={require("../assets/Christmas_tree.png")}
                  style={{ width: RFValue(20), height: RFValue(40) }}
                />
              ) : (
                <Image
                  source={require("../assets/Christmas_tree_grey.png")}
                  style={{ width: RFValue(20), height: RFValue(40) }}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  tree5: false,
                  tree4: false,
                  tree3: true,
                  tree2: true,
                  tree1: true,
                  tree_rating: 3,
                });
              }}
              style={{
                height: RFValue(40),
                width: RFValue(20),
              }}
            >
              {this.state.tree3 ? (
                <Image
                  source={require("../assets/Christmas_tree.png")}
                  style={{ width: RFValue(20), height: RFValue(40) }}
                />
              ) : (
                <Image
                  source={require("../assets/Christmas_tree_grey.png")}
                  style={{ width: RFValue(20), height: RFValue(40) }}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  tree5: false,
                  tree4: true,
                  tree3: true,
                  tree2: true,
                  tree1: true,
                  tree_rating: 4,
                });
              }}
              style={{
                height: RFValue(40),
                width: RFValue(20),
              }}
            >
              {this.state.tree4 ? (
                <Image
                  source={require("../assets/Christmas_tree.png")}
                  style={{ width: RFValue(20), height: RFValue(40) }}
                />
              ) : (
                <Image
                  source={require("../assets/Christmas_tree_grey.png")}
                  style={{ width: RFValue(20), height: RFValue(40) }}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  tree5: true,
                  tree4: true,
                  tree3: true,
                  tree2: true,
                  tree1: true,
                  tree_rating: 5,
                });
              }}
              style={{
                height: RFValue(40),
                width: RFValue(20),
              }}
            >
              {this.state.tree5 ? (
                <Image
                  source={require("../assets/Christmas_tree.png")}
                  style={{ width: RFValue(20), height: RFValue(40) }}
                />
              ) : (
                <Image
                  source={require("../assets/Christmas_tree_grey.png")}
                  style={{ width: RFValue(20), height: RFValue(40) }}
                />
              )}
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 0.1,
              borderColor: "#32867d",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: RFValue(20),
              borderTopWidth: RFValue(0),
              borderBottomWidth: RFValue(0),
            }}
          >
            <Text style={{ fontSize: RFValue(15), marginTop: RFValue(-40) }}>
              Please Provide Feedback
            </Text>
          </View>
          <View
            style={{
              flex: 0.4,
              borderColor: "#32867d",
              borderWidth: RFValue(20),
              borderTopWidth: RFValue(0),
              borderBottomWidth: RFValue(0),
            }}
          >
            <ScrollView>
              <Input
                style={styles.feedbackTextInput2}
                placeholder={"Provide feedback for your experience!"}
                containerStyle={{ marginTop: RFValue(60) }}
                multiline
                numberOfLines={5}
                textAlignVertical={"top"}
                onChangeText={(text) =>
                  this.setState({
                    feedback: text,
                  })
                }
                value={this.state.feedback}
              />
            </ScrollView>
          </View>
          <View
            style={{
              flex: 0.3,
              borderColor: "#32867d",
              borderWidth: RFValue(20),
              alignItems: "center",
              borderTopWidth: RFValue(0),
            }}
          >
            <TouchableOpacity
              style={styles.button2}
              onPress={() => {
                this.sendNotification();
                this.updateRequestStatus();
                this.setState({
                  requestName: "",
                  description: "",
                  requestDateAndTime: "",
                  requestLocation: 0,
                  requestBetween: "",
                  isPressed: false,
                });
                this.receiveRequests(this.state.askedRequestName);
                this.sendFeedback();
                this.props.navigation.navigate("LandingScreen");
              }}
            >
              <Text style={styles.buttontxt2}>Submit Feedback</Text>
            </TouchableOpacity>
          </View>
          {/* <View style={{flex:1}}>
          {/* <Input
              style={styles.feedbackTextInput}
              placeholder={"Provide feedback for your experience!"}
              containerStyle={{ marginTop: RFValue(60) }}
              onChangeText={(text) =>
                this.setState({
                  feedback: text,
                })
              }
              value={this.state.feedback}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.sendNotification();
                this.updateRequestStatus();
                this.setState({
                  requestName: "",
                  description: "",
                  requestDateAndTime: "",
                  requestLocation: 0,
                  requestBetween: "",
                  isPressed: false,
                });
                this.receiveRequests(this.state.askedRequestName);
                this.sendFeedback();
              }}
            >
              <Text style={styles.buttontxt}>Complete request and</Text>
              <Text style={styles.buttontxt}> submit feedback</Text>
            </TouchableOpacity> */}
        </View>
      );
    }
    if (this.state.requestStatus === "Expired") {
      return Alert.alert(
        "It seems your request has expired... No worries you can always add another request!"
      );
    }
    if (this.state.isRequestActive === false) {
      return (
        <View style={{ flex: 1 }}>
          <View>
            <MyHeader title="Request" navigation={this.props.navigation} />
          </View>
          <ScrollView>
            <View>
              <Input
                style={styles.formTextInput}
                label={"Request Name"}
                placeholder={"Request name"}
                containerStyle={{ marginTop: RFValue(30) }}
                onChangeText={(text) =>
                  this.setState({
                    requestName: text,
                  })
                }
                value={this.state.requestName}
              />
            </View>

            <View style={{ alignItems: "center" }}>
              <Input
                style={styles.formTextInput2}
                containerStyle={{ marginTop: RFValue(2) }}
                multiline
                numberOfLines={8}
                label={"Description"}
                placeholder={
                  "Please elaborate your request here and also mention if you need help in person or virtually"
                }
                onChangeText={(text) => {
                  this.setState({
                    description: text,
                  });
                }}
                value={this.state.description}
              />
              <Input
                style={styles.formTextInput}
                containerStyle={{ marginTop: RFValue(2) }}
                multiline
                editable={false}
                // keyboardType={"numeric"}
                label={"Date"}
                onChangeText={(text) => {}}
              />
              <ModalDropdown
                style={styles.dropdown}
                textStyle={styles.dropdown_text}
                dropdownStyle={styles.dropdown_dropdown}
                dropdownTextStyle={styles.dropdown_text_style}
                options={[
                  this.state.day1,
                  this.state.day2,
                  this.state.day3,
                  this.state.day4,
                  this.state.day5,
                ]}
                onSelect={(idx, value) =>
                  this._dropdown_1_1_onSelect(idx, value)
                }
                onSelect={(idx, value) =>
                  this._dropdown_2_2_onSelect(idx, value)
                }
                onSelect={(idx, value) =>
                  this._dropdown_3_3_onSelect(idx, value)
                }
                onSelect={(idx, value) =>
                  this._dropdown_4_4_onSelect(idx, value)
                }
                onSelect={(idx, value) =>
                  this._dropdown_5_5_onSelect(idx, value)
                }
              ></ModalDropdown>
              <Input
                style={styles.formTextInput}
                containerStyle={{ marginTop: RFValue(10) }}
                multiline
                // keyboardType={"numeric"}
                editable={false}
                label={"What Time Do You Need Assistance?"}
                onChangeText={(text) => {}}
                value={this.state.requestBetween}
              />
              <ModalDropdown
                style={styles.dropdown}
                textStyle={styles.dropdown_text}
                dropdownStyle={styles.dropdown_dropdown}
                dropdownTextStyle={styles.dropdown_text_style}
                options={["Morning", "Afternoon", "Evening"]}
                onSelect={(idx, value) => this._dropdown_1_onSelect(idx, value)}
                onSelect={(idx, value) => this._dropdown_2_onSelect(idx, value)}
                onSelect={(idx, value) => this._dropdown_3_onSelect(idx, value)}
              ></ModalDropdown>

              {/* <Input
              style={styles.formTextInput}
              containerStyle={{ marginTop: RFValue(30) }}
              label={"Pin Code"}
              placeholder={"Pin Code"}
              maxLength={6}
              onChangeText={(text) => {
                this.setState({
                  requestLocation: text,
                });
              }}
              value={this.state.requestLocation}
            /> */}
              <Text style={{ fontSize: RFValue(10), padding: RFValue(10) }}>
                Please note that your help request will go from your registered
                pin code.
              </Text>

              <TouchableOpacity
                style={[styles.button, { marginTop: RFValue(30) }]}
                onPress={() => {
                  this.addRequest(
                    this.state.requestName,
                    this.state.description,
                    this.state.requestDateAndTime,
                    this.state.userLocation,
                    this.state.requestBetween
                  );
                  this.props.navigation.navigate("HelpScreen");
                }}
              >
                <Text style={styles.requestbuttontxt}>Submit Request</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
    }
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
  feedbackTextInput2: {
    width: "75%",
    justifyContent: "space-evenly",
    height: RFValue(125),
    borderWidth: RFValue(1),
    padding: RFValue(10),
    flexWrap: "wrap",
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
    fontSize: RFValue(15),
    alignSelf: "flex-start",
  },
  requestText1: {
    paddingTop: RFValue(20),
    fontSize: RFValue(11),
  },
  buttontxt: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "#fff",
  },
  buttontxt2: {
    fontSize: RFValue(15),
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
  button2: {
    width: "50%",
    height: RFValue(60),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(10),
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: RFValue(0),
      height: RFValue(8),
    },
    shadowOpacity: RFValue(0.44),
    shadowRadius: RFValue(10.32),
    elevation: RFValue(16),
    marginTop: RFValue(-30),
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
    marginLeft: RFValue(150),
    alignItems: "center",
    marginTop: RFValue(-5),
    fontSize: RFValue(10),
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
});

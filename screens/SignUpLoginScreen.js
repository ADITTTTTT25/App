import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  TouchableHighlight,
  Image,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import { Icon, Input } from "react-native-elements";
import Pincode from "../PinCode";
import * as ScreenOrientation from "expo-screen-orientation";
import ModalDropdown from "react-native-modal-dropdown";
export default class SignUpLoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "abc@gmail.com",
      password: "qwerty",
      firstName: "",
      lastName: "",
      contact: 0,
      pinCodeValid: false,
      address: 0,
      confirmPassword: "",
      isModalVisible: false,
      pincode: [400072, 400076],
    };
  }
  _dropdown_onSelect(idx, value) {
    this.setState({
      address: value,
    });
  }
  ComponentDidMount = () => {};
  showModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.isModalVisible}
      >
        <ScrollView style={styles.scrollview}>
          <View style={styles.signupView}>
            <Text style={styles.signupText}> SIGN UP </Text>
          </View>
          <View style={{ flex: 0.95 }}>
            <Text style={styles.label}>First Name </Text>
            <TextInput
              style={styles.formInput}
              placeholder={"First Name"}
              maxLength={12}
              onChangeText={(text) => {
                this.setState({ firstName: text });
              }}
            />
            <Text style={styles.label}>Last Name </Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Last Name"}
              maxLength={12}
              onChangeText={(text) => {
                this.setState({ lastName: text });
              }}
            />

            <Text style={styles.label}>Mobile Phone </Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Mobile Phone"}
              textContentType={"telephoneNumber"}
              maxLength={10}
              keyboardType={"phone-pad"}
              onChangeText={(text) => {
                this.setState({ contact: text });
              }}
            />
            <View style={{ paddingBottom: RFValue(10) }}>
              <Text style={styles.label}>Community Pin Code </Text>
              {/* <TextInput
              style={styles.formInput}
              placeholder={"Currently only open for Mumbai City"}
              keyboardType={"phone-pad"}
              maxLength={6}
              onChangeText={(text) => {
                this.setState({ address: text });
              }}
            /> */}
              <ModalDropdown
                style={styles.dropdown}
                textStyle={styles.dropdown_text}
                dropdownStyle={styles.dropdown_dropdown}
                dropdownTextStyle={styles.dropdown_text_style}
                options={[this.state.pincode[0], this.state.pincode[1]]}
                onSelect={(idx, value) => this._dropdown_onSelect(idx, value)}
              ></ModalDropdown>
            </View>

            <Text style={styles.label}>Email </Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Email"}
              keyboardType={"email-address"}
              onChangeText={(text) => {
                this.setState({ email: text });
              }}
            />
            <Text style={styles.label}> Password </Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Password"}
              secureTextEntry={true}
              onChangeText={(text) => {
                this.setState({ password: text });
              }}
            />
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Confirm Password"}
              secureTextEntry={true}
              onChangeText={(text) => {
                this.setState({ confirmPassword: text });
              }}
            />
          </View>
          <View style={{ flex: 0.2, alignItems: "center" }}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() =>{
                // {let recaptcha = new firebase.auth.RecaptchaVerifier('recaptcha');
                // let number = '+91' + this.state.contact;
                // firebase.auth().signInWithPhoneNumber(number,recaptcha).then(function(e){
                //   let code = prompt('Enter the OTP','');
                //   if(code === null) return;
                //   e.confirm(code).then(function(result){
                //     console.log(result.user,'user')
                //   })
                // }).catch((error)=>{
                //   console.log(error);
                // })
                this.setState({ isModalVisible: false });
                this.userSignUp(
                  this.state.email,
                  this.state.password,
                  this.state.confirmPassword,
                  this.state.firstName,
                  this.state.lastName,
                  this.state.contact,
                  this.state.address
                )
                }
              }
              // }
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
            <Text
              style={styles.cancelButtonText}
              onPress={() => {
                this.setState({ isModalVisible: false });
              }}
            >
              Cancel
            </Text>
          </View>
        </ScrollView>
      </Modal>
    );
  };
  userLogin = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        var user = firebase.auth().currentUser;
        if (!user.emailVerified) {
          Alert.alert("Please verify before logging in, kindly check email");
        } else {
          this.props.navigation.navigate("LandingScreen");
        }

        console.log("Navigated");
      })
      .catch((error) => {
        console.log(error.message);
        return Alert.alert(error.message);
      });
  };
  userSignUp = async (
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    address,
    contact
  ) => {
    var pincode = parseInt(this.state.address);
    this.setState({
      address: pincode,
    });
    if (password != confirmPassword) {
      return Alert.alert("Passwords Do Not Match /n Check Password");
    } else if (
      this.state.contact.length === 10 &&
      this.state.firstName !== "" &&
      this.state.lastName !== ""
    ) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
          if (
            this.state.contact.length === 10 &&
            this.state.firstName !== "" &&
            this.state.lastName !== "" &&
            response
          ) {
            var a = parseInt(this.state.contact);
            var b = parseInt(this.state.address);
            this.setState({
              contact: a,
              address: b,
              // pinCodeValid: true,
            });
            db.collection("users").add({
              name: this.state.firstName,
              last_name: this.state.lastName,
              contact: this.state.contact,
              email: this.state.email,
              address: this.state.address,
              isRequestActive: false,
              isHelpActive: false,
              isHelping: "",
              feedbackSum: 0,
            });

            var user = firebase.auth().currentUser;

            user
              .sendEmailVerification()
              .then(function () {
                return Alert.alert(
                  "Verification email sent, please verify before logging in!",
                  "",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        this.setState({ isModalVisible: false });
                      },
                    },
                  ]
                );
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          return Alert.alert(error.message);
        });
    } else {
      if (this.state.lastName === "") {
        Alert.alert("Please enter a valid last name");
      }
      if (this.state.firstName === "") {
        Alert.alert("Please enter a valid name");
      }
      if (this.state.contact.length !== 10) {
        Alert.alert("Please enter a valid 10 digit mobile number");
      }
    }
  };
  render() {
    return (
      <View style={styles.container}>
        {this.showModal()}
        <ScrollView>
        <View style={{ flex: 0.25 }}>
          
          <View
            style={{
              alignContent: "center",
              alignSelf: "center",
              padding: RFValue(50),
            }}
          >
            <Image
              source={require("../assets/CommunitySanta.png")}
              style={{ width: RFValue(200), height: RFValue(200) }}
            />
          </View>
          <View style={{ flex: 0.15 }} />
          <View style={{ marginTop: RFValue(-110) }}>
            <Text style={styles.communitySantaText}>Community Santa</Text>
          </View>
        </View>
        <View style={{ flex: 0.45, marginTop: RFValue(75) }}>
          <View style={styles.TextInput}>
            <TextInput
              style={styles.loginBox}
              placeholder="abc@example.com"
              placeholderTextColor="gray"
              keyboardType="email-address"
              onChangeText={(text) => {
                this.setState({ email: text });
              }}
            />
            <TextInput
              style={[styles.loginBox, { marginTop: RFValue(15) }]}
              secureTextEntry={true}
              placeholder="Enter Password"
              placeholderTextColor="gray"
              onChangeText={(text) => {
                this.setState({ password: text });
              }}
            />
          </View>
          <View
            style={{
              flex: 0.5,
              alignItems: "center",
              padding: RFValue(10),
              marginTop: RFValue(10),
            }}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.userLogin(this.state.email, this.state.password);
              }}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.setState({ isModalVisible: true })}
            >
              <Text style={styles.buttonText}>SignUp</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#6fc0b8" },
  loginBox: {
    width: "80%",
    height: RFValue(50),
    borderWidth: RFValue(1.5),
    borderColor: "#ffffff",
    fontSize: RFValue(20),
    paddingLeft: RFValue(10),
  },
  button: {
    width: "80%",
    height: RFValue(50),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(25),
    backgroundColor: "#ffff",
    shadowColor: "#000",
    marginBottom: RFValue(10),
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: RFValue(0.3),
    shadowRadius: RFValue(10.32),
    elevation: RFValue(16),
  },
  buttonText: { color: "#32867d", fontWeight: "200", fontSize: RFValue(20) },
  label: {
    fontSize: RFValue(13),
    color: "#717D7E",
    fontWeight: "bold",
    paddingLeft: RFValue(10),
    marginLeft: RFValue(20),
  },
  formInput: {
    width: "90%",
    height: RFValue(35),
    padding: RFValue(10),
    borderWidth: RFValue(1),
    borderRadius: RFValue(2),
    borderColor: "grey",
    paddingBottom: RFValue(10),
    marginLeft: RFValue(20),
    marginBottom: RFValue(14),
  },
  registerButton: {
    width: "75%",
    height: RFValue(50),
    marginTop: RFValue(20),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(3),
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: { width: RFValue(0), height: RFValue(8) },
    shadowOpacity: RFValue(0.44),
    shadowRadius: RFValue(10.32),
    elevation: RFValue(16),
    marginTop: RFValue(10),
  },
  registerButtonText: {
    fontSize: RFValue(23),
    fontWeight: "bold",
    color: "#fff",
  },
  cancelButtonText: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#32867d",
    marginTop: RFValue(10),
  },
  communitySantaText: {
    justifyContent: "center",
    color: "brown",
    alignSelf: "center",
    marginTop: RFValue(70),
    fontSize: RFValue(20),
    fontWeight: "bold",
  },
  scrollview: { flex: 1, backgroundColor: "#fff" },
  signupView: { flex: 0.05, justifyContent: "center", alignItems: "center" },
  signupText: { fontSize: RFValue(20), fontWeight: "bold", color: "#32867d" },
  TextInput: { flex: 0.5, alignItems: "center", justifyContent: "center" },
  dropdown: {
    alignSelf: "center",
    marginTop: RFValue(3),
    // borderRadius: RFValue(3),
    width: "90.5%",
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
});

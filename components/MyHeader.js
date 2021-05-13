import React from "react";
import { View } from "react-native";
import { Header, Icon, Badge } from "react-native-elements";
import db from "../config";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
export default class MyHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      userId: firebase.auth().currentUser.email,
    };
  }
  getNumberOfUnreadNotifications = () => {
    db.collection("all_notification")
      .where("notification_status", "==", "unread")
      .where("targeted_user_id", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        var unreadNotification = snapshot.docs.map((doc) => {
          doc.data();
        });
        this.setState({
          value: unreadNotification.length,
        });
      });
  };

  componentDidMount() {
    // this.getNumberOfUnreadNotifications();
  }

  BellIconWithBadge = () => {
    return (
      <View>
        <Icon
          name="bell"
          type="font-awesome"
          color="#696969"
          onPress={() => {
            this.props.navigation.navigate("NotificationScreen");
          }}
        />
        <Badge
          value={this.state.value}
          containerStyle={{ position: "absolute", top: RFValue(-4), right: RFValue(-4) }}
        />
      </View>
    );
  };

  render() {
    return (
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
        rightComponent={<this.BellIconWithBadge {...this.props} />}
        centerComponent={{
          text: this.props.title,
          style: {color: "#90A5A9", fontSize: RFValue(15), fontWeight: "bold",alignSelf:"center",alignContent:"center" },
        }}
        backgroundColor="#EaF8fE"
      />
    );
  }
}



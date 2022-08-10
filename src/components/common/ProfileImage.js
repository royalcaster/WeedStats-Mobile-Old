//React
import React from "react";
import { View, Image} from "react-native";

const ProfileImage = ({ x, url, type }) => {
  return (
    <View
      style={{
        height: x,
        width: x,
        borderRadius: type == 1 ? 100 : 0,
        overflow: "hidden",
      }}
    >
      <Image style={{ height: "100%" }} source={{ uri: url }} />
    </View>
  );
};

export default ProfileImage;

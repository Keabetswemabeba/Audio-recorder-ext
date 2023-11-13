
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import * as React from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { auth, db } from "../config/firebase";
import { Audio } from "expo-av";

function Recordings({ navigation }) {
  const [savedRecording, setSavedRecordings] = React.useState(null);
  const [updatedData, setUpdatedData] = React.useState([]);

  const [sound, setSound] = React.useState(null);
  const [heading, setHeading] = React.useState("");

  React.useEffect(() => {
    getAudios();
  }, []);

  const getAudios = async () => {
    const colRef = collection(db, "recordInfo");
    const q = query(colRef, where("userData", "==", auth.currentUser.email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No matching documents");
    } else {
      let data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      console.log(data);
      setSavedRecordings(data);
    }
  };

  const [isPlaying, setIsPlaying] = React.useState(false);

  const playSound = async (recordingUrl) => {
    try {
      if (isPlaying) {
        await sound.stopAsync();
      } else {
        const { sound } = await Audio.Sound.createAsync({ uri: recordingUrl });
        setSound(sound);
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.log("Error playing sound", error);
    }
  };

  console.log(savedRecording);

  function deleteRecording(id) {
    const docRef = doc(db, "recordInfo", id);
    deleteDoc(docRef)
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }

  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const toggleModal = (data) => {
    setIsModalVisible(!isModalVisible);
    setUpdatedData(data);
  };

  const updateFunction = async () => {
    const docId = updatedData.id;

    const data = {
      date: updatedData.date,
      recordingUrl: updatedData.recordingUrl,
      fileName: updatedData.fileName,
      recName: heading,
      duration: updatedData.duration,
    };

    const docRef = doc(db, "recordInfo", docId);
    await updateDoc(docRef, data)
      .then(() => {
        console.log("Data successfully Updated");
        setIsModalVisible(false);
      })
      .catch((error) => {
        console.log("Error updating data:", error);
      });
  };

  function logout() {
    auth.signOut();
    console.log("Successfully signed out");
    navigation.navigate("Login");
  }

  function handleChange(text) {
    setHeading(text);
  }

  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.heading}>Recordings</Text>
      <ScrollView style={styles.scroll}>
        <View style={styles.scrollCon}>
          {savedRecording ? (
            savedRecording.map((data, index) => (
              <View style={[styles.card, styles.elevation]} key={index}>
                <View style={styles.cardHeader}>
                  <Text style={styles.textColor}>{data.recName}</Text>
                  <Text style={styles.textColor}>{data.date}</Text>
                </View>
                <View style={styles.cardBottom}>
                  <View>
                    <Text style={styles.talkingText}>Duration</Text>
                    <Text>{data.duration}</Text>
                  </View>
                  <View style={styles.buttons}>
                    <Pressable
                      onPress={() => playSound(data.recordingUrl)}
                      style={styles.play}
                    >
                      <Text style={styles.textColor}>
                        {isPlaying ? "Pause" : "Play"}
                      </Text>
                    </Pressable>
                    <View style={styles.crudBtn}>
                      <Pressable
                        style={styles.crudButton}
                        onPress={() => deleteRecording(data.id)}
                      >
                        <Text style={styles.crudText}>Delete</Text>
                      </Pressable>
                      <Pressable
                        style={styles.crudButton}
                        onPress={() => toggleModal(data)}
                      >
                        <Text style={styles.crudText}>Update</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text>No recordings found.</Text>
          )}
        </View>
        <Modal visible={isModalVisible}>
          <View style={styles.modal}>
            <TextInput
              placeholder="Enter Title..."
              onChangeText={(text) => handleChange(text)}
              style={styles.recordingHeading}
            />
            <Pressable onPress={updateFunction} style={styles.updatebtn}>
              <Text style={styles.textColor1}>Save Changes</Text>
            </Pressable>
          </View>
        </Modal>
      </ScrollView>
      <View style={styles.bottomNav}>
        <Pressable onPress={() => navigation.navigate("Recordings")}>
          <Image source={require("../assets/files.png")} style={styles.img} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Image
            source={require("../assets/microphone.png")}
            style={styles.img}
          />
        </Pressable>
        <Pressable onPress={logout}>
          <Image source={require("../assets/logout.png")} style={styles.img} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  scroll: {
    width: "100%",
    flex: 1,
  },
  heading: {
    marginTop: 50,
    padding: 20,
    fontSize: 30,
    fontWeight: "700",
  },

  card: {
    width: "80%",
    height: 250,
    marginTop: "auto",
    marginBottom: 20,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    borderRadius: 10,
  },

  cardHeader: {
    backgroundColor: "pink",
    height: 60,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },

  cardBottom: {
    marginBottom: "auto",
    height: 100,
    padding: 10,
    borderWidth: 2,
    borderColor: "pink",
  },

  textColor: {
    color: "black",
    fontWeight: "bold",
  },
  textColor1: {
    color: "white",
    fontWeight: "bold",
  },

  bottomNav: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    padding: 20,
  },

  img: {
    width: 30,
    height: 30,
  },

  crudBtn: {
    display: "flex",
    flexDirection: "row",
    width: 130,
    justifyContent: "space-between",
  },

  buttons: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  play: {
    marginTop: "auto",
    backgroundColor: "pink",
    width: 100,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },

  updatebtn: {
    marginTop: 50,
    backgroundColor: "pink",
    padding: 10,
    borderRadius: 5,
  },

  crudButton: {
    borderWidth: 1,
    borderColor: "pink",
    padding: 5,
    borderRadius: 3,
  },

  scrollCon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  talkingText: {
    fontWeight: "500",
  },

  recordingHeading: {
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "80%",
    borderWidth: 1,
    borderColor: "pink",
    borderRadius: 15,
    width: 250,
    height: 50,
    textAlign: "center",
    fontWeight: "bold",
  },
  crudText: {
    color: "black",
  },

  modal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Recordings;

import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAA7YtAovsqLR4gPru7UB6XZZZf-tYbjHI",
  authDomain: "chat-app-c8ea7.firebaseapp.com",
  projectId: "chat-app-c8ea7",
  storageBucket: "chat-app-c8ea7.firebasestorage.app",
  messagingSenderId: "879751802678",
  appId: "1:879751802678:web:4aa08f244d0c2537c58d97"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const ChatApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        setMessages(snapshot.docs.map(doc => doc.data()));
      });
    return unsubscribe;
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      firebase.firestore().collection('messages').add({
        text: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setMessage('');
    }
  };

  return (
    <View style={{ padding: 10 }}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text>{item.text}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message"
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          marginBottom: 10,
          padding: 10,
          borderRadius: 5,
        }}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

export default ChatApp;

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';

type Message = {
    id: string;
    sender: 'user' | 'bot';
    content: string;
    timestamp: string;
};

const baseUrl = 'http://localhost:3000';

const ChatScreen: React.FC = () => {
const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState('');
const [loading, setLoading] = useState(false);
const flatListRef = useRef<FlatList>(null);

useEffect(() => {
fetchMessages();
}, []);

const fetchMessages = async () => {
    setLoading(true);
    try {
        const response = await axios.get(`${baseUrl}/chat/messages`);
        if (Array.isArray(response.data)) {
        setMessages(response.data);
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    } finally {
        setLoading(false);
    }
};

    const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        content: input,
        timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    try {
        const response = await axios.post(`${baseUrl}/chat/send`, {
            message: input,
        });

        const botReply: Message = {
            id: Date.now().toString() + '_bot',
            sender: 'bot',
            content: response.data.reply || 'No response.',
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, botReply]);
        } catch (error) {
        console.error('Error sending message:', error);
        }
    };

    const renderItem = ({ item }: { item: Message }) => (
        <View
        style={[
            styles.messageContainer,
            item.sender === 'user' ? styles.userMessage : styles.botMessage,
        ]}
        >
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
        >
        <Text style={styles.header}>Chat with {'Bot'}</Text>

        {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
        ) : (
            <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
        )}

        <View style={styles.inputContainer}>
            <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#888"
            value={input}
            onChangeText={setInput}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 16,
        color: '#4CAF50',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    messageContainer: {
        margin: 8,
        padding: 12,
        borderRadius: 10,
        maxWidth: '80%',
    },
    userMessage: {
        backgroundColor: '#1E1E1E',
        alignSelf: 'flex-end',
        borderColor: '#4CAF50',
        borderWidth: 1,
    },
    botMessage: {
        backgroundColor: '#2C2C2C',
        alignSelf: 'flex-start',
        borderColor: '#555',
        borderWidth: 1,
    },
    messageText: {
        color: '#fff',
        fontSize: 16,
    },
    timestamp: {
        fontSize: 10,
        color: '#aaa',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        padding: 8,
        backgroundColor: '#1E1E1E',
        borderTopWidth: 1,
        borderTopColor: '#333',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#2C2C2C',
        color: '#fff',
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    sendButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
    },
    sendText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ChatScreen;

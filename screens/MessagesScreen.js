import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { supabase } from '../lib/supabase';

export default function MessagesScreen() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setRefreshing(true);
    
    // For demo purposes, we'll use sample data
    // In a real app, you would fetch from conversation_metadata table
    const sampleConversations = [
      {
        id: '1',
        participant_name: 'Ethan',
        last_message: 'Hey, how\'s it going?',
        last_message_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
        unread_count: 2
      },
      {
        id: '2',
        participant_name: 'Olivia',
        last_message: 'Did you see the new designs?',
        last_message_at: new Date(Date.now() - 3 * 60 * 60 * 1000),
        unread_count: 1
      },
      {
        id: '3',
        participant_name: 'Liam',
        last_message: 'Let\'s catch up later this week.',
        last_message_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
        unread_count: 1
      },
      {
        id: '4',
        participant_name: 'Sophia',
        last_message: 'Thanks for sending that over!',
        last_message_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
        unread_count: 1
      },
      {
        id: '5',
        participant_name: 'Noah',
        last_message: 'Perfect!',
        last_message_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        unread_count: 0
      }
    ];
    
    setConversations(sampleConversations);
    setLoading(false);
    setRefreshing(false);
  };

  const markAsRead = async (conversationId) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unread_count: 0 }
          : conv
      )
    );
    Alert.alert('Marked as read', 'Conversation marked as read');
  };

  const startNewConversation = () => {
    Alert.alert('New Conversation', 'This feature will be available soon!');
  };

  const renderConversation = ({ item }) => (
    <TouchableOpacity 
      style={styles.conversation}
      onPress={() => markAsRead(item.id)}
      onLongPress={() => Alert.alert(
        'Conversation Options',
        `Options for ${item.participant_name}`,
        [
          { text: 'Mark as read', onPress: () => markAsRead(item.id) },
          { text: 'Delete', style: 'destructive' },
          { text: 'Cancel', style: 'cancel' }
        ]
      )}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.participant_name.charAt(0).toUpperCase()}
        </Text>
      </View>
      
      <View style={styles.conversationInfo}>
        <Text style={styles.userName}>{item.participant_name}</Text>
        <Text style={styles.lastMessage}>{item.last_message}</Text>
      </View>
      
      <View style={styles.conversationMeta}>
        <Text style={styles.time}>{formatTime(item.last_message_at)}</Text>
        {item.unread_count > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.unread_count}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const formatTime = (date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffHours = (now - messageDate) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return messageDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }).toUpperCase().replace(' ', '');
    } else if (diffHours < 48) {
      return 'Yesterday';
    } else {
      return `${Math.floor(diffHours / 24)}d ago`;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
          <TouchableOpacity onPress={startNewConversation}>
            <Text style={styles.newButton}>New</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.loadingText}>Loading conversations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity onPress={startNewConversation}>
          <Text style={styles.newButton}>New</Text>
        </TouchableOpacity>
      </View>
      
      {conversations.length > 0 ? (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchConversations} />
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No conversations yet</Text>
          <Text style={styles.emptySubtext}>Start a conversation with someone!</Text>
          <TouchableOpacity style={styles.startConversationButton} onPress={startNewConversation}>
            <Text style={styles.startConversationText}>Start New Conversation</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  newButton: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  conversation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  conversationInfo: {
    flex: 1,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  conversationMeta: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  unreadBadge: {
    backgroundColor: '#000',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  startConversationButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startConversationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

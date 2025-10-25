import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { supabase } from '../lib/supabase';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist or error, use sample data
        createSampleAlerts();
      } else if (data && data.length === 0) {
        createSampleAlerts();
      } else {
        setAlerts(data);
      }
      setLoading(false);
      setRefreshing(false);
    }
  };

  const createSampleAlerts = () => {
    const sampleAlerts = [
      {
        id: '1',
        message: 'Jane Doe commented on your post.',
        additional_text: 'That\'s a great point!',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        message: 'John Smith liked your post.',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        message: 'New post from Weland.',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        message: 'Your digital identity verification is complete.',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: '5',
        message: 'Welcome to Weland!',
        additional_text: 'Explore your new digital nation.',
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      }
    ];
    setAlerts(sampleAlerts);
  };

  const clearAlerts = async () => {
    Alert.alert(
      'Clear Alerts',
      'Are you sure you want to clear all alerts?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            setAlerts([]);
            Alert.alert('Success', 'Alerts cleared successfully');
          }
        }
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAlerts();
  };

  const renderAlert = ({ item }) => (
    <View style={styles.alert}>
      <Text style={styles.alertText}>{item.message}</Text>
      <Text style={styles.alertTime}>{getTimeAgo(item.created_at)}</Text>
      {item.additional_text && (
        <Text style={styles.additionalText}>{item.additional_text}</Text>
      )}
    </View>
  );

  const getTimeAgo = (date) => {
    const hours = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return 'Yesterday';
    return `${Math.floor(hours / 24)} days ago`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Alerts</Text>
          <TouchableOpacity onPress={clearAlerts}>
            <Text style={styles.clearButton}>Clear</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.loadingText}>Loading alerts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alerts</Text>
        {alerts.length > 0 && (
          <TouchableOpacity onPress={clearAlerts}>
            <Text style={styles.clearButton}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {alerts.length > 0 ? (
        <FlatList
          data={alerts}
          renderItem={renderAlert}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>All caught up!</Text>
          <Text style={styles.emptyText}>You have no new alerts.</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
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
  clearButton: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  alert: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  alertText: {
    fontSize: 16,
    marginBottom: 4,
    lineHeight: 22,
  },
  alertTime: {
    fontSize: 14,
    color: '#666',
  },
  additionalText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  refreshButtonText: {
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

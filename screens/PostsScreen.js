import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

export default function PostsScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPosts();
    getUserProfile();
    
    const subscription = supabase
      .channel('posts')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          setPosts(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  const fetchPosts = async () => {
    setRefreshing(true);
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      Alert.alert('Error', 'Failed to load posts');
    } else if (data) {
      setPosts(data);
    }
    setRefreshing(false);
  };

  const getUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();
      setUser(profile);
    }
  };

  const likePost = async (postId) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      const newLikesCount = (post.likes_count || 0) + 1;
      
      const { error } = await supabase
        .from('posts')
        .update({ likes_count: newLikesCount })
        .eq('id', postId);

      if (!error) {
        setPosts(prev => 
          prev.map(p => 
            p.id === postId 
              ? { ...p, likes_count: newLikesCount }
              : p
          )
        );
      }
    }
  };

  const renderPost = ({ item }) => (
    <View style={styles.post}>
      <Text style={styles.userName}>{item.profiles?.name || 'User'}</Text>
      <Text style={styles.timeAgo}>{getTimeAgo(item.created_at)}</Text>
      <Text style={styles.content}>{item.content}</Text>
      
      <View style={styles.engagement}>
        <TouchableOpacity onPress={() => likePost(item.id)}>
          <Text style={styles.engagementText}>{(item.likes_count || 0)} 👍</Text>
        </TouchableOpacity>
        <Text style={styles.engagementText}>{(item.comments_count || 0)} 💬</Text>
      </View>
      
      <View style={styles.divider} />
    </View>
  );

  const getTimeAgo = (date) => {
    const hours = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60));
    if (hours === 0) return 'Just now';
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Posts</Text>
      
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={fetchPosts}
      />
      
      <TouchableOpacity 
        style={styles.createPostButton}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Text style={styles.createPostText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 20,
  },
  post: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timeAgo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  engagement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
  },
  engagementText: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginTop: 15,
  },
  createPostButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  createPostText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

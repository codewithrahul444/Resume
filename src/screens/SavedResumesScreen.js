import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, Button, FAB, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as MailComposer from 'expo-mail-composer';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import ApiService from '../services/api';
import DatabaseService from '../services/database';

export default function SavedResumesScreen() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      
      // Load from local database first
      const localResumes = await DatabaseService.getResumes();
      setResumes(localResumes);
      
      // Then fetch from server
      const serverResumes = await ApiService.getResumes();
      if (serverResumes.success) {
        setResumes(serverResumes.resumes);
        
        // Update local database
        serverResumes.resumes.forEach(resume => {
          DatabaseService.saveResume(resume);
        });
      }
    } catch (error) {
      console.error('Error loading resumes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDownload = async (resume) => {
    try {
      const response = await ApiService.downloadResume(resume.id);
      if (response.success && response.pdfUrl) {
        await Sharing.shareAsync(response.pdfUrl, {
          mimeType: 'application/pdf',
          dialogTitle: `${resume.title}.pdf`,
        });
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
      Alert.alert(t('error'), 'Failed to download resume');
    }
  };

  const handleShare = async (resume) => {
    try {
      const response = await ApiService.downloadResume(resume.id);
      if (response.success && response.pdfUrl) {
        const isAvailable = await MailComposer.isAvailableAsync();
        
        if (isAvailable) {
          await MailComposer.composeAsync({
            subject: `My Resume - ${resume.title}`,
            body: 'Please find my resume attached.',
            attachments: [response.pdfUrl],
          });
        } else {
          await Sharing.shareAsync(response.pdfUrl);
        }
      }
    } catch (error) {
      console.error('Error sharing resume:', error);
      Alert.alert(t('error'), 'Failed to share resume');
    }
  };

  const handleDelete = (resume) => {
    Alert.alert(
      t('delete'),
      `Are you sure you want to delete "${resume.title}"?`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await ApiService.deleteResume(resume.id);
              await DatabaseService.deleteResume(resume.id);
              setResumes(prev => prev.filter(r => r.id !== resume.id));
            } catch (error) {
              console.error('Error deleting resume:', error);
              Alert.alert(t('error'), 'Failed to delete resume');
            }
          },
        },
      ]
    );
  };

  const renderResumeItem = ({ item }) => (
    <Card style={styles.resumeCard}>
      <Card.Content>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
          {item.title}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="outlined"
          onPress={() => handleDownload(item)}
          icon="download"
          compact
        >
          {t('download')}
        </Button>
        <Button
          mode="outlined"
          onPress={() => handleShare(item)}
          icon="share"
          compact
        >
          {t('share')}
        </Button>
        <Button
          mode="text"
          onPress={() => handleDelete(item)}
          icon="delete"
          compact
          textColor={theme.colors.error}
        >
          {t('delete')}
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.onBackground, marginTop: 16 }}>
          {t('loading')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {resumes.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="document-text-outline" size={64} color={theme.colors.onSurfaceVariant} />
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginTop: 16 }}>
            {t('noResumes')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={resumes}
          renderItem={renderResumeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadResumes();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    padding: 16,
  },
  resumeCard: {
    marginBottom: 12,
  },
});

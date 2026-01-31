import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../src/utils/api';
import { colors, getPriorityColor, getStatusColor } from '../../src/utils/colors';
import { Project, Task } from '../../src/types';

export default function ProjectDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const [projectData, tasksData] = await Promise.all([
        api.get<Project>(`/projects/${id}`),
        api.get<Task[]>(`/tasks?project_id=${id}`),
      ]);
      setProject(projectData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Project not found</Text>
      </View>
    );
  }

  const tasksByStatus = {
    'To Do': tasks.filter((t) => t.status === 'To Do'),
    'In Progress': tasks.filter((t) => t.status === 'In Progress'),
    'Review': tasks.filter((t) => t.status === 'Review'),
    'Done': tasks.filter((t) => t.status === 'Done'),
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>{project.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.addTaskButton}
          onPress={() => router.push('/task/create')}
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Project Info */}
        <View style={styles.projectInfo}>
          {project.description ? (
            <Text style={styles.description}>{project.description}</Text>
          ) : null}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{tasks.length}</Text>
              <Text style={styles.statLabel}>Total Tasks</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{tasksByStatus['Done'].length}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{tasksByStatus['In Progress'].length}</Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
          </View>
        </View>

        {/* Tasks by Status */}
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <View key={status} style={styles.statusSection}>
            <View style={styles.statusHeader}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
              <Text style={styles.statusTitle}>{status}</Text>
              <View style={styles.statusCount}>
                <Text style={styles.statusCountText}>{statusTasks.length}</Text>
              </View>
            </View>

            {statusTasks.length === 0 ? (
              <View style={styles.emptyStatus}>
                <Text style={styles.emptyText}>No tasks</Text>
              </View>
            ) : (
              statusTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={styles.taskCard}
                  onPress={() => router.push(`/task/${task.id}`)}
                >
                  <View style={styles.taskHeader}>
                    <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
                      <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                        {task.priority}
                      </Text>
                    </View>
                  </View>
                  {task.due_date && (
                    <View style={styles.taskMeta}>
                      <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
                      <Text style={styles.metaText}>
                        {new Date(task.due_date).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  addTaskButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  projectInfo: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statusSection: {
    marginBottom: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statusCount: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCountText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  emptyStatus: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  taskCard: {
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});

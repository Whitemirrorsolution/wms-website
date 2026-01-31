import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../src/utils/api';
import { colors, getPriorityColor, getStatusColor } from '../../src/utils/colors';
import { Task } from '../../src/types';

type ViewMode = 'list' | 'kanban';
type FilterType = 'all' | 'status' | 'priority';

const STATUSES = ['To Do', 'In Progress', 'Review', 'Done'];
const PRIORITIES = ['low', 'medium', 'high', 'critical'];

export default function TasksScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterModal, setFilterModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      const query = params.toString() ? `?${params.toString()}` : '';
      const data = await api.get<Task[]>(`/tasks${query}`);
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTasks();
  };

  const clearFilters = () => {
    setStatusFilter(null);
    setPriorityFilter(null);
    setFilterModal(false);
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((t) => t.status === status);
  };

  const renderTaskCard = (task: Task) => (
    <TouchableOpacity
      key={task.id}
      style={styles.taskCard}
      onPress={() => router.push(`/task/${task.id}`)}
    >
      <View style={styles.taskHeader}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(task.status) }]} />
        <Text style={styles.taskTitle} numberOfLines={2}>{task.title}</Text>
      </View>
      {task.description ? (
        <Text style={styles.taskDescription} numberOfLines={2}>{task.description}</Text>
      ) : null}
      <View style={styles.taskMeta}>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
          <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
            {task.priority}
          </Text>
        </View>
        {task.due_date && (
          <View style={styles.dueDateBadge}>
            <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
            <Text style={styles.dueDateText}>
              {new Date(task.due_date).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
      {task.subtasks && task.subtasks.length > 0 && (
        <View style={styles.subtaskInfo}>
          <Ionicons name="checkbox-outline" size={14} color={colors.textMuted} />
          <Text style={styles.subtaskText}>
            {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderListView = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="checkbox-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No tasks found</Text>
          <Text style={styles.emptySubtitle}>Create your first task to get started</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/task/create')}
          >
            <Ionicons name="add" size={20} color={colors.white} />
            <Text style={styles.createButtonText}>Create Task</Text>
          </TouchableOpacity>
        </View>
      ) : (
        tasks.map(renderTaskCard)
      )}
    </ScrollView>
  );

  const renderKanbanView = () => (
    <ScrollView
      horizontal
      style={styles.kanbanContainer}
      contentContainerStyle={styles.kanbanContent}
      showsHorizontalScrollIndicator={false}
    >
      {STATUSES.map((status) => (
        <View key={status} style={styles.kanbanColumn}>
          <View style={styles.kanbanHeader}>
            <View style={[styles.kanbanDot, { backgroundColor: getStatusColor(status) }]} />
            <Text style={styles.kanbanTitle}>{status}</Text>
            <View style={styles.kanbanCount}>
              <Text style={styles.kanbanCountText}>{getTasksByStatus(status).length}</Text>
            </View>
          </View>
          <ScrollView
            style={styles.kanbanScroll}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
          >
            {getTasksByStatus(status).map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.kanbanCard}
                onPress={() => router.push(`/task/${task.id}`)}
              >
                <Text style={styles.kanbanCardTitle} numberOfLines={2}>{task.title}</Text>
                <View style={styles.kanbanCardMeta}>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
                    <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                      {task.priority}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Tasks</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeActive]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name="list" size={20} color={viewMode === 'list' ? colors.primary : colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'kanban' && styles.viewModeActive]}
            onPress={() => setViewMode('kanban')}
          >
            <Ionicons name="grid" size={20} color={viewMode === 'kanban' ? colors.primary : colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModal(true)}
          >
            <Ionicons name="filter" size={20} color={statusFilter || priorityFilter ? colors.primary : colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Filters */}
      {(statusFilter || priorityFilter) && (
        <View style={styles.activeFilters}>
          {statusFilter && (
            <TouchableOpacity
              style={styles.filterChip}
              onPress={() => setStatusFilter(null)}
            >
              <Text style={styles.filterChipText}>{statusFilter}</Text>
              <Ionicons name="close" size={14} color={colors.primary} />
            </TouchableOpacity>
          )}
          {priorityFilter && (
            <TouchableOpacity
              style={styles.filterChip}
              onPress={() => setPriorityFilter(null)}
            >
              <Text style={styles.filterChipText}>{priorityFilter}</Text>
              <Ionicons name="close" size={14} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Content */}
      {viewMode === 'list' ? renderListView() : renderKanbanView()}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/task/create')}
      >
        <Ionicons name="add" size={28} color={colors.white} />
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal
        visible={filterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setFilterModal(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Tasks</Text>
              <TouchableOpacity onPress={clearFilters}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.filterLabel}>Status</Text>
            <View style={styles.filterOptions}>
              {STATUSES.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterOption,
                    statusFilter === status && styles.filterOptionActive,
                  ]}
                  onPress={() => setStatusFilter(statusFilter === status ? null : status)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      statusFilter === status && styles.filterOptionTextActive,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterLabel}>Priority</Text>
            <View style={styles.filterOptions}>
              {PRIORITIES.map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.filterOption,
                    priorityFilter === priority && styles.filterOptionActive,
                  ]}
                  onPress={() => setPriorityFilter(priorityFilter === priority ? null : priority)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      priorityFilter === priority && styles.filterOptionTextActive,
                    ]}
                  >
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setFilterModal(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewModeButton: {
    padding: 8,
    borderRadius: 8,
  },
  viewModeActive: {
    backgroundColor: colors.primary + '20',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
  },
  activeFilters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  filterChipText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  taskCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
    marginTop: 6,
  },
  taskTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  taskDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    marginLeft: 18,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 18,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dueDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  subtaskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    marginLeft: 18,
  },
  subtaskText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  // Kanban styles
  kanbanContainer: {
    flex: 1,
  },
  kanbanContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  kanbanColumn: {
    width: 280,
    marginRight: 12,
  },
  kanbanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  kanbanDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  kanbanTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  kanbanCount: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  kanbanCountText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  kanbanScroll: {
    flex: 1,
  },
  kanbanCard: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  kanbanCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  kanbanCardMeta: {
    flexDirection: 'row',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  clearText: {
    fontSize: 14,
    color: colors.primary,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
    marginTop: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
  },
  filterOptionActive: {
    backgroundColor: colors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  filterOptionTextActive: {
    color: colors.white,
  },
  applyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  applyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../src/utils/api';
import { colors, getPriorityColor, getStatusColor } from '../../src/utils/colors';
import { Task, Comment, Activity, SubTask } from '../../src/types';
import { formatDistanceToNow } from 'date-fns';

const PRIORITIES = ['low', 'medium', 'high', 'critical'];
const STATUSES = ['To Do', 'In Progress', 'Review', 'Done'];

export default function TaskDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'activity'>('details');
  const [newSubtask, setNewSubtask] = useState('');

  const loadTask = useCallback(async () => {
    if (!id) return;
    try {
      const [taskData, commentsData, activitiesData] = await Promise.all([
        api.get<Task>(`/tasks/${id}`),
        api.get<Comment[]>(`/comments/${id}`),
        api.get<Activity[]>(`/activities/${id}`),
      ]);
      setTask(taskData);
      setEditedTitle(taskData.title);
      setEditedDescription(taskData.description);
      setComments(commentsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading task:', error);
      Alert.alert('Error', 'Failed to load task');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const handleUpdateTask = async (updates: Partial<Task>) => {
    if (!id) return;
    setIsSaving(true);
    try {
      const updatedTask = await api.put<Task>(`/tasks/${id}`, updates);
      setTask(updatedTask);
      setIsEditing(false);
      // Reload activities
      const activitiesData = await api.get<Activity[]>(`/activities/${id}`);
      setActivities(activitiesData);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update task');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    handleUpdateTask({ status: newStatus });
    setShowStatusPicker(false);
  };

  const handlePriorityChange = (newPriority: string) => {
    handleUpdateTask({ priority: newPriority as Task['priority'] });
    setShowPriorityPicker(false);
  };

  const handleSaveEdit = () => {
    handleUpdateTask({ title: editedTitle, description: editedDescription });
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !id) return;
    try {
      const comment = await api.post<Comment>('/comments', {
        content: newComment.trim(),
        task_id: id,
      });
      setComments([...comments, comment]);
      setNewComment('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add comment');
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtask.trim() || !task) return;
    const newSubtaskItem: SubTask = {
      id: Date.now().toString(),
      title: newSubtask.trim(),
      completed: false,
    };
    await handleUpdateTask({ subtasks: [...(task.subtasks || []), newSubtaskItem] });
    setNewSubtask('');
  };

  const handleToggleSubtask = async (subtaskId: string) => {
    if (!task) return;
    const updatedSubtasks = task.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    await handleUpdateTask({ subtasks: updatedSubtasks });
  };

  const handleDeleteTask = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/tasks/${id}`);
              router.back();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Task not found</Text>
      </View>
    );
  }

  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            {isEditing ? (
              <>
                <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.headerButton}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveEdit}
                  style={[styles.saveButton, isSaving && styles.buttonDisabled]}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color={colors.white} size="small" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.headerButton}>
                  <Ionicons name="create-outline" size={22} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteTask} style={styles.headerButton}>
                  <Ionicons name="trash-outline" size={22} color={colors.error} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Status & Priority Row */}
          <View style={styles.statusRow}>
            <TouchableOpacity
              style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) + '20' }]}
              onPress={() => setShowStatusPicker(true)}
            >
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(task.status) }]} />
              <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
                {task.status}
              </Text>
              <Ionicons name="chevron-down" size={14} color={getStatusColor(task.status)} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}
              onPress={() => setShowPriorityPicker(true)}
            >
              <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                {task.priority}
              </Text>
              <Ionicons name="chevron-down" size={14} color={getPriorityColor(task.priority)} />
            </TouchableOpacity>
          </View>

          {/* Title */}
          {isEditing ? (
            <TextInput
              style={styles.titleInput}
              value={editedTitle}
              onChangeText={setEditedTitle}
              multiline
            />
          ) : (
            <Text style={styles.taskTitle}>{task.title}</Text>
          )}

          {/* Meta Info */}
          <View style={styles.metaInfo}>
            {task.project_name && (
              <View style={styles.metaItem}>
                <Ionicons name="folder-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.metaText}>{task.project_name}</Text>
              </View>
            )}
            {task.due_date && (
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.metaText}>
                  Due {new Date(task.due_date).toLocaleDateString()}
                </Text>
              </View>
            )}
            {task.assignee_name && (
              <View style={styles.metaItem}>
                <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.metaText}>{task.assignee_name}</Text>
              </View>
            )}
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'details' && styles.tabActive]}
              onPress={() => setActiveTab('details')}
            >
              <Text style={[styles.tabText, activeTab === 'details' && styles.tabTextActive]}>
                Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'comments' && styles.tabActive]}
              onPress={() => setActiveTab('comments')}
            >
              <Text style={[styles.tabText, activeTab === 'comments' && styles.tabTextActive]}>
                Comments ({comments.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'activity' && styles.tabActive]}
              onPress={() => setActiveTab('activity')}
            >
              <Text style={[styles.tabText, activeTab === 'activity' && styles.tabTextActive]}>
                Activity
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === 'details' && (
            <View style={styles.tabContent}>
              {/* Description */}
              <Text style={styles.sectionLabel}>Description</Text>
              {isEditing ? (
                <TextInput
                  style={styles.descriptionInput}
                  value={editedDescription}
                  onChangeText={setEditedDescription}
                  multiline
                  numberOfLines={4}
                  placeholder="Add description..."
                  placeholderTextColor={colors.textMuted}
                />
              ) : (
                <Text style={styles.description}>
                  {task.description || 'No description'}
                </Text>
              )}

              {/* Subtasks */}
              <Text style={styles.sectionLabel}>
                Subtasks {totalSubtasks > 0 && `(${completedSubtasks}/${totalSubtasks})`}
              </Text>
              <View style={styles.subtaskInputContainer}>
                <TextInput
                  style={styles.subtaskInput}
                  placeholder="Add subtask"
                  placeholderTextColor={colors.textMuted}
                  value={newSubtask}
                  onChangeText={setNewSubtask}
                  onSubmitEditing={handleAddSubtask}
                />
                <TouchableOpacity onPress={handleAddSubtask}>
                  <Ionicons name="add-circle" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
              {task.subtasks?.map((subtask) => (
                <TouchableOpacity
                  key={subtask.id}
                  style={styles.subtaskItem}
                  onPress={() => handleToggleSubtask(subtask.id)}
                >
                  <Ionicons
                    name={subtask.completed ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={subtask.completed ? colors.success : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.subtaskText,
                      subtask.completed && styles.subtaskCompleted,
                    ]}
                  >
                    {subtask.title}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <>
                  <Text style={styles.sectionLabel}>Tags</Text>
                  <View style={styles.tagsContainer}>
                    {task.tags.map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </View>
          )}

          {activeTab === 'comments' && (
            <View style={styles.tabContent}>
              {comments.length === 0 ? (
                <Text style={styles.noContent}>No comments yet</Text>
              ) : (
                comments.map((comment) => (
                  <View key={comment.id} style={styles.commentItem}>
                    <View style={styles.commentAvatar}>
                      <Text style={styles.commentAvatarText}>
                        {comment.user_name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.commentContent}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentAuthor}>{comment.user_name}</Text>
                        <Text style={styles.commentTime}>
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </Text>
                      </View>
                      <Text style={styles.commentText}>{comment.content}</Text>
                    </View>
                  </View>
                ))
              )}

              {/* Add Comment */}
              <View style={styles.addCommentContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Write a comment..."
                  placeholderTextColor={colors.textMuted}
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  <Ionicons
                    name="send"
                    size={20}
                    color={newComment.trim() ? colors.primary : colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {activeTab === 'activity' && (
            <View style={styles.tabContent}>
              {activities.length === 0 ? (
                <Text style={styles.noContent}>No activity yet</Text>
              ) : (
                activities.map((activity) => (
                  <View key={activity.id} style={styles.activityItem}>
                    <View style={styles.activityDot} />
                    <View style={styles.activityContent}>
                      <Text style={styles.activityText}>
                        <Text style={styles.activityUser}>{activity.user_name}</Text>
                        {' '}{activity.action}
                      </Text>
                      {activity.details && (
                        <Text style={styles.activityDetails}>{activity.details}</Text>
                      )}
                      <Text style={styles.activityTime}>
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        </ScrollView>

        {/* Status Picker Modal */}
        <Modal
          visible={showStatusPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowStatusPicker(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShowStatusPicker(false)}>
            <View style={styles.pickerContent}>
              <Text style={styles.pickerTitle}>Change Status</Text>
              {STATUSES.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.pickerItem,
                    task.status === status && styles.pickerItemActive,
                  ]}
                  onPress={() => handleStatusChange(status)}
                >
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
                  <Text
                    style={[
                      styles.pickerItemText,
                      task.status === status && { color: colors.primary },
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>

        {/* Priority Picker Modal */}
        <Modal
          visible={showPriorityPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPriorityPicker(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShowPriorityPicker(false)}>
            <View style={styles.pickerContent}>
              <Text style={styles.pickerTitle}>Change Priority</Text>
              {PRIORITIES.map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.pickerItem,
                    task.priority === priority && styles.pickerItemActive,
                  ]}
                  onPress={() => handlePriorityChange(priority)}
                >
                  <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(priority) }]} />
                  <Text
                    style={[
                      styles.pickerItemText,
                      { textTransform: 'capitalize' },
                      task.priority === priority && { color: colors.primary },
                    ]}
                  >
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  descriptionInput: {
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  subtaskInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  subtaskInput: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: colors.text,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  subtaskText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  subtaskCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 13,
    color: colors.primary,
  },
  noContent: {
    textAlign: 'center',
    color: colors.textMuted,
    padding: 20,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  commentContent: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  commentTime: {
    fontSize: 12,
    color: colors.textMuted,
  },
  commentText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  commentInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    padding: 8,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 12,
    marginTop: 6,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: colors.text,
  },
  activityUser: {
    fontWeight: '600',
  },
  activityDetails: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    gap: 12,
  },
  pickerItemActive: {
    backgroundColor: colors.primary + '20',
  },
  pickerItemText: {
    fontSize: 16,
    color: colors.text,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../src/utils/api';
import { colors, getPriorityColor } from '../../src/utils/colors';
import { Project } from '../../src/types';
import DateTimePicker from '@react-native-community/datetimepicker';

const PRIORITIES = ['low', 'medium', 'high', 'critical'];
const STATUSES = ['To Do', 'In Progress', 'Review', 'Done'];

export default function CreateTaskScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('To Do');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showProjectPicker, setShowProjectPicker] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.get<Project[]>('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleCreateTask = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/tasks', {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        due_date: dueDate?.toISOString(),
        project_id: selectedProject,
        tags,
      });
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedProjectName = projects.find((p) => p.id === selectedProject)?.name;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Task</Text>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.buttonDisabled]}
            onPress={handleCreateTask}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Create</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Title */}
          <TextInput
            style={styles.titleInput}
            placeholder="Task title"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            multiline
          />

          {/* Description */}
          <TextInput
            style={styles.descriptionInput}
            placeholder="Add description..."
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          {/* Priority */}
          <Text style={styles.sectionLabel}>Priority</Text>
          <View style={styles.optionsRow}>
            {PRIORITIES.map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.optionButton,
                  priority === p && { backgroundColor: getPriorityColor(p) + '20', borderColor: getPriorityColor(p) },
                ]}
                onPress={() => setPriority(p)}
              >
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(p) }]} />
                <Text
                  style={[
                    styles.optionText,
                    priority === p && { color: getPriorityColor(p) },
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Status */}
          <Text style={styles.sectionLabel}>Status</Text>
          <View style={styles.optionsRow}>
            {STATUSES.map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.optionButton,
                  status === s && styles.optionButtonActive,
                ]}
                onPress={() => setStatus(s)}
              >
                <Text
                  style={[
                    styles.optionText,
                    status === s && styles.optionTextActive,
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Due Date */}
          <Text style={styles.sectionLabel}>Due Date</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.selectButtonText}>
              {dueDate ? dueDate.toLocaleDateString() : 'Select date'}
            </Text>
            {dueDate && (
              <TouchableOpacity onPress={() => setDueDate(null)}>
                <Ionicons name="close-circle" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          {/* Project */}
          <Text style={styles.sectionLabel}>Project</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowProjectPicker(true)}
          >
            <Ionicons name="folder-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.selectButtonText}>
              {selectedProjectName || 'Select project'}
            </Text>
            {selectedProject && (
              <TouchableOpacity onPress={() => setSelectedProject(null)}>
                <Ionicons name="close-circle" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          {/* Tags */}
          <Text style={styles.sectionLabel}>Tags</Text>
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="Add tag"
              placeholderTextColor={colors.textMuted}
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={handleAddTag}
            />
            <TouchableOpacity style={styles.addTagButton} onPress={handleAddTag}>
              <Ionicons name="add" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                    <Ionicons name="close" size={14} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <Modal transparent animationType="fade">
            <Pressable style={styles.modalOverlay} onPress={() => setShowDatePicker(false)}>
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={dueDate || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={(event, date) => {
                    if (date) setDueDate(date);
                  }}
                  textColor={colors.text}
                />
                <TouchableOpacity
                  style={styles.datePickerDone}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.datePickerDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>
        )}

        {/* Project Picker Modal */}
        <Modal
          visible={showProjectPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowProjectPicker(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShowProjectPicker(false)}>
            <View style={styles.pickerContent}>
              <Text style={styles.pickerTitle}>Select Project</Text>
              <ScrollView style={styles.pickerList}>
                {projects.length === 0 ? (
                  <Text style={styles.noProjectsText}>No projects available</Text>
                ) : (
                  projects.map((project) => (
                    <TouchableOpacity
                      key={project.id}
                      style={[
                        styles.pickerItem,
                        selectedProject === project.id && styles.pickerItemActive,
                      ]}
                      onPress={() => {
                        setSelectedProject(project.id);
                        setShowProjectPicker(false);
                      }}
                    >
                      <Ionicons
                        name="folder"
                        size={20}
                        color={selectedProject === project.id ? colors.primary : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedProject === project.id && styles.pickerItemTextActive,
                        ]}
                      >
                        {project.name}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
              <TouchableOpacity
                style={styles.pickerDoneButton}
                onPress={() => setShowProjectPicker(false)}
              >
                <Text style={styles.pickerDoneText}>Done</Text>
              </TouchableOpacity>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
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
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    minHeight: 40,
  },
  descriptionInput: {
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  optionButtonActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  optionTextActive: {
    color: colors.primary,
    fontWeight: '500',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    gap: 10,
  },
  selectButtonText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.text,
  },
  addTagButton: {
    padding: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  datePickerDone: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.primary,
    borderRadius: 12,
    marginTop: 16,
  },
  datePickerDoneText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  pickerList: {
    maxHeight: 300,
  },
  noProjectsText: {
    textAlign: 'center',
    color: colors.textSecondary,
    padding: 20,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    gap: 12,
    marginBottom: 4,
  },
  pickerItemActive: {
    backgroundColor: colors.primary + '20',
  },
  pickerItemText: {
    fontSize: 16,
    color: colors.text,
  },
  pickerItemTextActive: {
    color: colors.primary,
    fontWeight: '500',
  },
  pickerDoneButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.primary,
    borderRadius: 12,
    marginTop: 16,
  },
  pickerDoneText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for TaskFlow Application
Tests all endpoints with proper authentication and data validation
"""

import requests
import json
import sys
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

# API Configuration
BASE_URL = "https://taskflow-3179.preview.emergentagent.com/api"
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "password123"
TEST_NAME = "Test User"

class TaskFlowAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.auth_token = None
        self.user_id = None
        self.test_data = {}
        self.failed_tests = []
        self.passed_tests = []
        
    def log_result(self, test_name: str, success: bool, message: str = ""):
        """Log test results"""
        if success:
            self.passed_tests.append(test_name)
            print(f"✅ {test_name}: PASSED {message}")
        else:
            self.failed_tests.append(test_name)
            print(f"❌ {test_name}: FAILED {message}")
    
    def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None) -> requests.Response:
        """Make HTTP request with proper error handling"""
        url = f"{self.base_url}{endpoint}"
        
        # Add auth header if token exists
        if self.auth_token and headers is None:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
        elif self.auth_token and headers:
            headers["Authorization"] = f"Bearer {self.auth_token}"
        
        try:
            if method.upper() == "GET":
                response = self.session.get(url, headers=headers, timeout=30)
            elif method.upper() == "POST":
                response = self.session.post(url, json=data, headers=headers, timeout=30)
            elif method.upper() == "PUT":
                response = self.session.put(url, json=data, headers=headers, timeout=30)
            elif method.upper() == "DELETE":
                response = self.session.delete(url, headers=headers, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None

    def test_auth_signup(self):
        """Test user signup"""
        print("\n=== Testing Authentication - Signup ===")
        
        # First, try to signup with new user
        signup_data = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
            "name": TEST_NAME
        }
        
        response = self.make_request("POST", "/auth/signup", signup_data)
        
        if response is None:
            self.log_result("Auth Signup", False, "Request failed")
            return False
            
        if response.status_code == 400:
            # User might already exist, try login instead
            print("User already exists, will test login")
            self.log_result("Auth Signup", True, "User already exists (expected)")
            return False  # Return False so login will be attempted
        elif response.status_code == 200 or response.status_code == 201:
            try:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.auth_token = data["access_token"]
                    self.user_id = data["user"]["id"]
                    self.log_result("Auth Signup", True, f"User created with ID: {self.user_id}")
                    return True
                else:
                    self.log_result("Auth Signup", False, "Missing token or user in response")
                    return False
            except json.JSONDecodeError:
                self.log_result("Auth Signup", False, "Invalid JSON response")
                return False
        else:
            self.log_result("Auth Signup", False, f"Status: {response.status_code}, Response: {response.text}")
            return False

    def test_auth_login(self):
        """Test user login"""
        print("\n=== Testing Authentication - Login ===")
        
        login_data = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        }
        
        response = self.make_request("POST", "/auth/login", login_data)
        
        if response is None:
            self.log_result("Auth Login", False, "Request failed")
            return False
            
        if response.status_code == 200:
            try:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.auth_token = data["access_token"]
                    self.user_id = data["user"]["id"]
                    self.log_result("Auth Login", True, f"Login successful, token received")
                    return True
                else:
                    self.log_result("Auth Login", False, "Missing token or user in response")
                    return False
            except json.JSONDecodeError:
                self.log_result("Auth Login", False, "Invalid JSON response")
                return False
        else:
            self.log_result("Auth Login", False, f"Status: {response.status_code}, Response: {response.text}")
            return False

    def test_auth_me(self):
        """Test get current user"""
        print("\n=== Testing Authentication - Get Me ===")
        
        if not self.auth_token:
            self.log_result("Auth Me", False, "No auth token available")
            return False
            
        response = self.make_request("GET", "/auth/me")
        
        if response is None:
            self.log_result("Auth Me", False, "Request failed")
            return False
            
        if response.status_code == 200:
            try:
                data = response.json()
                if "id" in data and "email" in data:
                    self.log_result("Auth Me", True, f"User info retrieved: {data['email']}")
                    return True
                else:
                    self.log_result("Auth Me", False, "Missing user fields in response")
                    return False
            except json.JSONDecodeError:
                self.log_result("Auth Me", False, "Invalid JSON response")
                return False
        else:
            self.log_result("Auth Me", False, f"Status: {response.status_code}, Response: {response.text}")
            return False

    def test_projects_crud(self):
        """Test Projects CRUD operations"""
        print("\n=== Testing Projects CRUD ===")
        
        if not self.auth_token:
            self.log_result("Projects CRUD", False, "No auth token available")
            return False
        
        # Create Project
        project_data = {
            "name": "Test Project API",
            "description": "A test project for API testing"
        }
        
        response = self.make_request("POST", "/projects", project_data)
        
        if response is None or response.status_code != 200:
            self.log_result("Projects Create", False, f"Create failed: {response.status_code if response else 'No response'}")
            return False
        
        try:
            project = response.json()
            project_id = project["id"]
            self.test_data["project_id"] = project_id
            self.log_result("Projects Create", True, f"Project created with ID: {project_id}")
        except (json.JSONDecodeError, KeyError):
            self.log_result("Projects Create", False, "Invalid response format")
            return False
        
        # Get All Projects
        response = self.make_request("GET", "/projects")
        if response is None or response.status_code != 200:
            self.log_result("Projects Get All", False, f"Get all failed: {response.status_code if response else 'No response'}")
        else:
            try:
                projects = response.json()
                if isinstance(projects, list) and len(projects) > 0:
                    self.log_result("Projects Get All", True, f"Retrieved {len(projects)} projects")
                else:
                    self.log_result("Projects Get All", False, "No projects returned")
            except json.JSONDecodeError:
                self.log_result("Projects Get All", False, "Invalid JSON response")
        
        # Get Single Project
        response = self.make_request("GET", f"/projects/{project_id}")
        if response is None or response.status_code != 200:
            self.log_result("Projects Get Single", False, f"Get single failed: {response.status_code if response else 'No response'}")
        else:
            try:
                project = response.json()
                if project["id"] == project_id:
                    self.log_result("Projects Get Single", True, "Project retrieved successfully")
                else:
                    self.log_result("Projects Get Single", False, "Wrong project returned")
            except (json.JSONDecodeError, KeyError):
                self.log_result("Projects Get Single", False, "Invalid response format")
        
        # Update Project
        update_data = {
            "name": "Updated Test Project API",
            "description": "Updated description for API testing"
        }
        
        response = self.make_request("PUT", f"/projects/{project_id}", update_data)
        if response is None or response.status_code != 200:
            self.log_result("Projects Update", False, f"Update failed: {response.status_code if response else 'No response'}")
        else:
            try:
                updated_project = response.json()
                if updated_project["name"] == update_data["name"]:
                    self.log_result("Projects Update", True, "Project updated successfully")
                else:
                    self.log_result("Projects Update", False, "Project not updated properly")
            except (json.JSONDecodeError, KeyError):
                self.log_result("Projects Update", False, "Invalid response format")
        
        return True

    def test_tasks_crud(self):
        """Test Tasks CRUD operations"""
        print("\n=== Testing Tasks CRUD ===")
        
        if not self.auth_token:
            self.log_result("Tasks CRUD", False, "No auth token available")
            return False
        
        project_id = self.test_data.get("project_id")
        
        # Create Task
        task_data = {
            "title": "Test Task API",
            "description": "A test task for API testing",
            "priority": "high",
            "status": "To Do",
            "project_id": project_id,
            "tags": ["api", "test"],
            "due_date": (datetime.utcnow() + timedelta(days=7)).isoformat()
        }
        
        response = self.make_request("POST", "/tasks", task_data)
        
        if response is None or response.status_code != 200:
            self.log_result("Tasks Create", False, f"Create failed: {response.status_code if response else 'No response'}")
            return False
        
        try:
            task = response.json()
            task_id = task["id"]
            self.test_data["task_id"] = task_id
            self.log_result("Tasks Create", True, f"Task created with ID: {task_id}")
        except (json.JSONDecodeError, KeyError):
            self.log_result("Tasks Create", False, "Invalid response format")
            return False
        
        # Get All Tasks
        response = self.make_request("GET", "/tasks")
        if response is None or response.status_code != 200:
            self.log_result("Tasks Get All", False, f"Get all failed: {response.status_code if response else 'No response'}")
        else:
            try:
                tasks = response.json()
                if isinstance(tasks, list) and len(tasks) > 0:
                    self.log_result("Tasks Get All", True, f"Retrieved {len(tasks)} tasks")
                else:
                    self.log_result("Tasks Get All", False, "No tasks returned")
            except json.JSONDecodeError:
                self.log_result("Tasks Get All", False, "Invalid JSON response")
        
        # Test Task Filters
        # Filter by status
        response = self.make_request("GET", "/tasks?status=To Do")
        if response is None or response.status_code != 200:
            self.log_result("Tasks Filter Status", False, f"Filter failed: {response.status_code if response else 'No response'}")
        else:
            try:
                tasks = response.json()
                if isinstance(tasks, list):
                    self.log_result("Tasks Filter Status", True, f"Status filter returned {len(tasks)} tasks")
                else:
                    self.log_result("Tasks Filter Status", False, "Invalid response format")
            except json.JSONDecodeError:
                self.log_result("Tasks Filter Status", False, "Invalid JSON response")
        
        # Filter by priority
        response = self.make_request("GET", "/tasks?priority=high")
        if response is None or response.status_code != 200:
            self.log_result("Tasks Filter Priority", False, f"Filter failed: {response.status_code if response else 'No response'}")
        else:
            try:
                tasks = response.json()
                if isinstance(tasks, list):
                    self.log_result("Tasks Filter Priority", True, f"Priority filter returned {len(tasks)} tasks")
                else:
                    self.log_result("Tasks Filter Priority", False, "Invalid response format")
            except json.JSONDecodeError:
                self.log_result("Tasks Filter Priority", False, "Invalid JSON response")
        
        # Filter by project
        if project_id:
            response = self.make_request("GET", f"/tasks?project_id={project_id}")
            if response is None or response.status_code != 200:
                self.log_result("Tasks Filter Project", False, f"Filter failed: {response.status_code if response else 'No response'}")
            else:
                try:
                    tasks = response.json()
                    if isinstance(tasks, list):
                        self.log_result("Tasks Filter Project", True, f"Project filter returned {len(tasks)} tasks")
                    else:
                        self.log_result("Tasks Filter Project", False, "Invalid response format")
                except json.JSONDecodeError:
                    self.log_result("Tasks Filter Project", False, "Invalid JSON response")
        
        # Get Single Task
        response = self.make_request("GET", f"/tasks/{task_id}")
        if response is None or response.status_code != 200:
            self.log_result("Tasks Get Single", False, f"Get single failed: {response.status_code if response else 'No response'}")
        else:
            try:
                task = response.json()
                if task["id"] == task_id:
                    self.log_result("Tasks Get Single", True, "Task retrieved successfully")
                else:
                    self.log_result("Tasks Get Single", False, "Wrong task returned")
            except (json.JSONDecodeError, KeyError):
                self.log_result("Tasks Get Single", False, "Invalid response format")
        
        # Update Task
        update_data = {
            "title": "Updated Test Task API",
            "status": "In Progress",
            "priority": "medium"
        }
        
        response = self.make_request("PUT", f"/tasks/{task_id}", update_data)
        if response is None or response.status_code != 200:
            self.log_result("Tasks Update", False, f"Update failed: {response.status_code if response else 'No response'}")
        else:
            try:
                updated_task = response.json()
                if updated_task["title"] == update_data["title"] and updated_task["status"] == update_data["status"]:
                    self.log_result("Tasks Update", True, "Task updated successfully")
                else:
                    self.log_result("Tasks Update", False, "Task not updated properly")
            except (json.JSONDecodeError, KeyError):
                self.log_result("Tasks Update", False, "Invalid response format")
        
        return True

    def test_comments(self):
        """Test Comments functionality"""
        print("\n=== Testing Comments ===")
        
        if not self.auth_token:
            self.log_result("Comments", False, "No auth token available")
            return False
        
        task_id = self.test_data.get("task_id")
        if not task_id:
            self.log_result("Comments", False, "No task ID available")
            return False
        
        # Create Comment
        comment_data = {
            "content": "This is a test comment for API testing",
            "task_id": task_id
        }
        
        response = self.make_request("POST", "/comments", comment_data)
        
        if response is None or response.status_code != 200:
            self.log_result("Comments Create", False, f"Create failed: {response.status_code if response else 'No response'}")
            return False
        
        try:
            comment = response.json()
            comment_id = comment["id"]
            self.test_data["comment_id"] = comment_id
            self.log_result("Comments Create", True, f"Comment created with ID: {comment_id}")
        except (json.JSONDecodeError, KeyError):
            self.log_result("Comments Create", False, "Invalid response format")
            return False
        
        # Get Comments for Task
        response = self.make_request("GET", f"/comments/{task_id}")
        if response is None or response.status_code != 200:
            self.log_result("Comments Get", False, f"Get failed: {response.status_code if response else 'No response'}")
        else:
            try:
                comments = response.json()
                if isinstance(comments, list) and len(comments) > 0:
                    self.log_result("Comments Get", True, f"Retrieved {len(comments)} comments")
                else:
                    self.log_result("Comments Get", False, "No comments returned")
            except json.JSONDecodeError:
                self.log_result("Comments Get", False, "Invalid JSON response")
        
        return True

    def test_activities(self):
        """Test Activities functionality"""
        print("\n=== Testing Activities ===")
        
        if not self.auth_token:
            self.log_result("Activities", False, "No auth token available")
            return False
        
        task_id = self.test_data.get("task_id")
        if not task_id:
            self.log_result("Activities", False, "No task ID available")
            return False
        
        # Get Activities for Task
        response = self.make_request("GET", f"/activities/{task_id}")
        if response is None or response.status_code != 200:
            self.log_result("Activities Get", False, f"Get failed: {response.status_code if response else 'No response'}")
        else:
            try:
                activities = response.json()
                if isinstance(activities, list):
                    self.log_result("Activities Get", True, f"Retrieved {len(activities)} activities")
                else:
                    self.log_result("Activities Get", False, "Invalid response format")
            except json.JSONDecodeError:
                self.log_result("Activities Get", False, "Invalid JSON response")
        
        return True

    def test_notifications(self):
        """Test Notifications functionality"""
        print("\n=== Testing Notifications ===")
        
        if not self.auth_token:
            self.log_result("Notifications", False, "No auth token available")
            return False
        
        # Get Notifications
        response = self.make_request("GET", "/notifications")
        if response is None or response.status_code != 200:
            self.log_result("Notifications Get", False, f"Get failed: {response.status_code if response else 'No response'}")
        else:
            try:
                notifications = response.json()
                if isinstance(notifications, list):
                    self.log_result("Notifications Get", True, f"Retrieved {len(notifications)} notifications")
                    
                    # Test mark as read if notifications exist
                    if len(notifications) > 0:
                        notification_id = notifications[0]["id"]
                        response = self.make_request("PUT", f"/notifications/{notification_id}/read")
                        if response is None or response.status_code != 200:
                            self.log_result("Notifications Mark Read", False, f"Mark read failed: {response.status_code if response else 'No response'}")
                        else:
                            self.log_result("Notifications Mark Read", True, "Notification marked as read")
                else:
                    self.log_result("Notifications Get", False, "Invalid response format")
            except json.JSONDecodeError:
                self.log_result("Notifications Get", False, "Invalid JSON response")
        
        # Test mark all as read
        response = self.make_request("PUT", "/notifications/read-all")
        if response is None or response.status_code != 200:
            self.log_result("Notifications Mark All Read", False, f"Mark all read failed: {response.status_code if response else 'No response'}")
        else:
            self.log_result("Notifications Mark All Read", True, "All notifications marked as read")
        
        return True

    def test_dashboard_stats(self):
        """Test Dashboard Stats"""
        print("\n=== Testing Dashboard Stats ===")
        
        if not self.auth_token:
            self.log_result("Dashboard Stats", False, "No auth token available")
            return False
        
        response = self.make_request("GET", "/dashboard/stats")
        if response is None or response.status_code != 200:
            self.log_result("Dashboard Stats", False, f"Get failed: {response.status_code if response else 'No response'}")
        else:
            try:
                stats = response.json()
                required_fields = ["total_tasks", "completed_tasks", "overdue_tasks", "in_progress_tasks", "tasks_by_status", "tasks_by_priority"]
                
                if all(field in stats for field in required_fields):
                    self.log_result("Dashboard Stats", True, f"Stats retrieved: {stats['total_tasks']} total tasks")
                else:
                    missing_fields = [field for field in required_fields if field not in stats]
                    self.log_result("Dashboard Stats", False, f"Missing fields: {missing_fields}")
            except json.JSONDecodeError:
                self.log_result("Dashboard Stats", False, "Invalid JSON response")
        
        return True

    def cleanup_test_data(self):
        """Clean up test data"""
        print("\n=== Cleaning Up Test Data ===")
        
        # Delete test task
        if "task_id" in self.test_data:
            response = self.make_request("DELETE", f"/tasks/{self.test_data['task_id']}")
            if response and response.status_code == 200:
                print("✅ Test task deleted")
            else:
                print("❌ Failed to delete test task")
        
        # Delete test project
        if "project_id" in self.test_data:
            response = self.make_request("DELETE", f"/projects/{self.test_data['project_id']}")
            if response and response.status_code == 200:
                print("✅ Test project deleted")
                self.log_result("Projects Delete", True, "Project deleted successfully")
            else:
                print("❌ Failed to delete test project")
                self.log_result("Projects Delete", False, f"Delete failed: {response.status_code if response else 'No response'}")

    def run_all_tests(self):
        """Run all API tests"""
        print(f"🚀 Starting TaskFlow API Tests")
        print(f"📍 Base URL: {self.base_url}")
        print(f"👤 Test User: {TEST_EMAIL}")
        
        # Authentication Tests
        auth_success = False
        signup_result = self.test_auth_signup()
        if signup_result:
            auth_success = True
        
        if not auth_success:
            auth_success = self.test_auth_login()
        
        if not auth_success:
            print("❌ Authentication failed, cannot continue with other tests")
            return False
        
        self.test_auth_me()
        
        # Core functionality tests
        self.test_projects_crud()
        self.test_tasks_crud()
        self.test_comments()
        self.test_activities()
        self.test_notifications()
        self.test_dashboard_stats()
        
        # Cleanup
        self.cleanup_test_data()
        
        # Summary
        print(f"\n{'='*60}")
        print(f"📊 TEST SUMMARY")
        print(f"{'='*60}")
        print(f"✅ Passed: {len(self.passed_tests)}")
        print(f"❌ Failed: {len(self.failed_tests)}")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"   - {test}")
        
        if self.passed_tests:
            print(f"\n✅ Passed Tests:")
            for test in self.passed_tests:
                print(f"   - {test}")
        
        success_rate = len(self.passed_tests) / (len(self.passed_tests) + len(self.failed_tests)) * 100
        print(f"\n📈 Success Rate: {success_rate:.1f}%")
        
        return len(self.failed_tests) == 0

if __name__ == "__main__":
    tester = TaskFlowAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)
from django.urls import path
from .views import (
    register_view, login_view, me_view,
    student_profile_view, resume_upload_and_analyze, student_recommendations,
    student_applications, skill_gap_view, student_performance_view,
    company_profile_view, company_internships, ai_applicant_ranking_view,
    update_application_status, mock_tests_view, mock_test_detail_or_submit,
    admin_dashboard_view, admin_users_list, admin_verify_company, user_notifications
)

urlpatterns = [
    # Auth
    path('auth/register', register_view, name='register'),
    path('auth/login', login_view, name='login'),
    path('auth/me', me_view, name='me'),

    # Student
    path('students/profile', student_profile_view, name='student_profile'),
    path('students/resume', resume_upload_and_analyze, name='student_resume'),
    path('students/recommendations', student_recommendations, name='student_recommendations'),
    path('students/applications', student_applications, name='student_applications'),
    path('students/skill-gap', skill_gap_view, name='skill_gap'),
    path('students/performance', student_performance_view, name='student_performance'),

    # Company
    path('company/profile', company_profile_view, name='company_profile'),
    path('company/internships', company_internships, name='company_internships'),
    path('company/applicant-ranking', ai_applicant_ranking_view, name='applicant_ranking'),
    path('company/applications/<int:app_id>/update-status', update_application_status, name='update_application_status'),

    # Mock Tests & Exams
    path('mock-tests', mock_tests_view, name='mock_tests'),
    path('mock-tests/<int:test_id>', mock_test_detail_or_submit, name='mock_test_detail'),

    # Admin
    path('admin/dashboard', admin_dashboard_view, name='admin_dashboard'),
    path('admin/users', admin_users_list, name='admin_users'),
    path('admin/companies/<int:company_id>/verify', admin_verify_company, name='admin_verify_company'),

    # Notifications
    path('notifications', user_notifications, name='notifications'),
]

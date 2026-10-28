from rest_framework import serializers
from .models import User, StudentProfile, CompanyProfile, Resume, Internship, Application, MockTest, Question, TestAttempt, Notification

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'phone')

class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = StudentProfile
        fields = '__all__'

class CompanyProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = CompanyProfile
        fields = '__all__'

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'

class InternshipSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.company_name', read_only=True)
    company_logo = serializers.CharField(source='company.logo_url', read_only=True)
    company_verified = serializers.CharField(source='company.verification_status', read_only=True)
    
    class Meta:
        model = Internship
        fields = '__all__'

class ApplicationSerializer(serializers.ModelSerializer):
    internship_title = serializers.CharField(source='internship.title', read_only=True)
    company_name = serializers.CharField(source='internship.company.company_name', read_only=True)
    company_logo = serializers.CharField(source='internship.company.logo_url', read_only=True)
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    student_email = serializers.CharField(source='student.user.email', read_only=True)
    student_college = serializers.CharField(source='student.college', read_only=True)
    student_cgpa = serializers.FloatField(source='student.cgpa', read_only=True)
    student_skills = serializers.JSONField(source='student.skills', read_only=True)

    class Meta:
        model = Application
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class MockTestSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = MockTest
        fields = '__all__'

class TestAttemptSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source='test.title', read_only=True)
    student_name = serializers.CharField(source='student.full_name', read_only=True)

    class Meta:
        model = TestAttempt
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

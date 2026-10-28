from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('STUDENT', 'Student'),
        ('COMPANY', 'Company'),
        ('ADMIN', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='STUDENT')
    phone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"


class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    
    # Education
    college = models.CharField(max_length=200, blank=True, null=True)
    degree = models.CharField(max_length=100, blank=True, null=True)
    branch = models.CharField(max_length=100, blank=True, null=True)
    graduation_year = models.IntegerField(blank=True, null=True)
    cgpa = models.FloatField(default=0.0)

    # Skills & Info (JSON stored as text/JSON field)
    skills = models.JSONField(default=list, blank=True)
    soft_skills = models.JSONField(default=list, blank=True)
    programming_languages = models.JSONField(default=list, blank=True)
    tools = models.JSONField(default=list, blank=True)

    # Preferences
    preferred_role = models.CharField(max_length=100, blank=True, null=True)
    preferred_location = models.CharField(max_length=100, blank=True, null=True)
    work_mode = models.CharField(max_length=50, default='Remote')
    internship_duration = models.CharField(max_length=50, default='3 Months')

    profile_completion = models.IntegerField(default=0)

    def calculate_completion(self):
        fields = [self.full_name, self.college, self.degree, self.branch, self.cgpa, self.skills, self.preferred_role]
        filled = sum(1 for f in fields if f)
        self.profile_completion = int((filled / len(fields)) * 100)
        return self.profile_completion

    def __str__(self):
        return f"{self.full_name} - {self.college or 'Student'}"


class CompanyProfile(models.Model):
    VERIFICATION_CHOICES = (
        ('PENDING', 'Pending Verification'),
        ('VERIFIED', 'Verified'),
        ('REJECTED', 'Rejected'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='company_profile')
    company_name = models.CharField(max_length=200)
    logo_url = models.CharField(max_length=500, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)
    company_size = models.CharField(max_length=50, blank=True, null=True)
    location = models.CharField(max_length=150, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_CHOICES, default='VERIFIED')

    def __str__(self):
        return self.company_name


class Resume(models.Model):
    student = models.OneToOneField(StudentProfile, on_delete=models.CASCADE, related_name='resume')
    file_name = models.CharField(max_length=255)
    file_path = models.FileField(upload_to='resumes/', blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    raw_text = models.TextField(blank=True, null=True)
    
    # Analysis outputs
    overall_score = models.IntegerField(default=0)
    detected_skills = models.JSONField(default=list, blank=True)
    extracted_education = models.JSONField(default=dict, blank=True)
    extracted_experience = models.JSONField(default=list, blank=True)
    extracted_projects = models.JSONField(default=list, blank=True)
    extracted_certifications = models.JSONField(default=list, blank=True)
    missing_info = models.JSONField(default=list, blank=True)
    suggestions = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"Resume for {self.student.full_name} ({self.overall_score}/100)"


class Internship(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('PENDING_APPROVAL', 'Pending Approval'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('CLOSED', 'Closed'),
    )
    company = models.ForeignKey(CompanyProfile, on_delete=models.CASCADE, related_name='internships')
    title = models.CharField(max_length=200)
    description = models.TextField()
    responsibilities = models.TextField(blank=True, null=True)
    
    required_skills = models.JSONField(default=list)
    preferred_skills = models.JSONField(default=list, blank=True)
    
    min_cgpa = models.FloatField(default=0.0)
    education_req = models.CharField(max_length=100, default='B.Tech')
    experience_req = models.CharField(max_length=100, default='Fresher / Project Experience')
    
    location = models.CharField(max_length=100, default='Remote')
    work_mode = models.CharField(max_length=50, default='Remote') # Remote, Onsite, Hybrid
    duration = models.CharField(max_length=50, default='3 Months')
    stipend = models.CharField(max_length=100, default='₹15,000 / month')
    openings = models.IntegerField(default=2)
    deadline = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='APPROVED')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company.company_name}"


class Application(models.Model):
    STATUS_CHOICES = (
        ('APPLIED', 'Applied'),
        ('UNDER_REVIEW', 'Under Review'),
        ('SHORTLISTED', 'Shortlisted'),
        ('MOCK_TEST', 'Mock Test Assigned'),
        ('SELECTED', 'Selected'),
        ('REJECTED', 'Rejected'),
    )
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='applications')
    internship = models.ForeignKey(Internship, on_delete=models.CASCADE, related_name='applications')
    applied_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='APPLIED')
    match_score = models.FloatField(default=0.0)
    match_reason = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('student', 'internship')

    def __str__(self):
        return f"{self.student.full_name} -> {self.internship.title} ({self.status})"


class MockTest(models.Model):
    title = models.CharField(max_length=200)
    role_category = models.CharField(max_length=100) # e.g. Python Developer, Aptitude, Frontend
    duration_mins = models.IntegerField(default=15)
    total_marks = models.IntegerField(default=100)
    pass_percentage = models.IntegerField(default=60)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Question(models.Model):
    test = models.ForeignKey(MockTest, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    option_a = models.CharField(max_length=300)
    option_b = models.CharField(max_length=300)
    option_c = models.CharField(max_length=300)
    option_d = models.CharField(max_length=300)
    correct_option = models.CharField(max_length=1, choices=(('A','A'),('B','B'),('C','C'),('D','D')))
    skill_tag = models.CharField(max_length=100, default='General')
    difficulty = models.CharField(max_length=50, default='Medium')

    def __str__(self):
        return f"Q: {self.question_text[:50]}..."


class TestAttempt(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='test_attempts')
    test = models.ForeignKey(MockTest, on_delete=models.CASCADE, related_name='attempts')
    application = models.ForeignKey(Application, on_delete=models.SET_NULL, null=True, blank=True, related_name='test_attempts')
    score = models.IntegerField(default=0)
    percentage = models.FloatField(default=0.0)
    status = models.CharField(max_length=20, default='PASSED') # PASSED / FAILED
    topic_breakdown = models.JSONField(default=dict, blank=True)
    ai_feedback = models.TextField(blank=True, null=True)
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.full_name} - {self.test.title} ({self.percentage}%)"


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notif to {self.user.username}: {self.title}"

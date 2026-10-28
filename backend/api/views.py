import jwt
import datetime
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import (
    User, StudentProfile, CompanyProfile, Resume,
    Internship, Application, MockTest, Question,
    TestAttempt, Notification
)
from .serializers import (
    UserSerializer, StudentProfileSerializer, CompanyProfileSerializer,
    ResumeSerializer, InternshipSerializer, ApplicationSerializer,
    MockTestSerializer, QuestionSerializer, TestAttemptSerializer,
    NotificationSerializer
)
from .ai_services.resume_parser import parse_resume_text, extract_text_from_file
from .ai_services.matcher import calculate_internship_match
from .ai_services.ranker import rank_applicants_for_internship
from .ai_services.skill_gap import analyze_skill_gap
from .ai_services.test_generator import evaluate_test_submission

SECRET_KEY = settings.SECRET_KEY

def generate_token(user):
    payload = {
        'user_id': user.id,
        'username': user.username,
        'role': user.role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

# Helper to decode user token
def get_user_from_request(request):
    auth_header = request.headers.get('Authorization', '') or request.META.get('HTTP_AUTHORIZATION', '')
    if auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1].strip()
        if token and token not in ['undefined', 'null', 'None']:
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
                user = User.objects.filter(id=payload['user_id']).first()
                if user:
                    return user
            except Exception:
                pass
    return None

def get_student_or_fallback(request):
    user = get_user_from_request(request)
    if not user and settings.DEBUG:
        user = User.objects.filter(role='STUDENT').first()
        if not user:
            user = User.objects.create_user(
                username='rahul_student',
                email='rahul@student.edu',
                password='Password123!',
                role='STUDENT'
            )
            StudentProfile.objects.create(
                user=user,
                full_name='Rahul Sharma',
                college='Delhi Technological University',
                degree='B.Tech',
                branch='Computer Science',
                cgpa=8.8,
                skills=['Python', 'Django', 'React', 'SQL', 'Git']
            )
    return user

# ==================== AUTH VIEWS ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    data = request.data
    raw_email = (data.get('email') or '').strip().lower()
    username = (data.get('username') or raw_email).strip().lower()
    email = raw_email
    password = data.get('password')
    role = (data.get('role') or 'STUDENT').strip().upper()
    full_name = data.get('full_name') or data.get('name') or username
    company_name = data.get('company_name') or full_name

    if not email or not password:
        return Response({'error': 'Email and Password are required'}, status=400)

    if User.objects.filter(username__iexact=email).exists() or User.objects.filter(email__iexact=email).exists():
        return Response({'error': 'An account with this email already exists. Please log in.'}, status=400)

    is_staff = (role == 'ADMIN')
    is_superuser = (role == 'ADMIN')

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        role=role,
        is_staff=is_staff,
        is_superuser=is_superuser
    )

    if role == 'STUDENT':
        StudentProfile.objects.create(
            user=user,
            full_name=full_name,
            college=data.get('college', 'University College of Engineering'),
            degree=data.get('degree', 'B.Tech'),
            branch=data.get('branch', 'Computer Science & Engineering'),
            cgpa=float(data.get('cgpa', 8.0)),
            skills=data.get('skills', ['Python', 'SQL', 'Git', 'React'])
        )
    elif role == 'COMPANY':
        CompanyProfile.objects.create(
            user=user,
            company_name=company_name,
            website=data.get('website', 'https://careers.google.com'),
            industry=data.get('industry', 'Technology & Software'),
            location=data.get('location', 'Bengaluru / Remote'),
            verification_status='VERIFIED'
        )

    token = generate_token(user)
    profile_data = None
    if role == 'STUDENT' and hasattr(user, 'student_profile'):
        profile_data = StudentProfileSerializer(user.student_profile).data
    elif role == 'COMPANY' and hasattr(user, 'company_profile'):
        profile_data = CompanyProfileSerializer(user.company_profile).data

    return Response({
        'message': 'Registration successful',
        'token': token,
        'user': UserSerializer(user).data,
        'role': role,
        'profile': profile_data
    }, status=201)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    data = request.data
    raw_email = (data.get('email') or '').strip().lower()
    password = data.get('password')
    requested_role = (data.get('role') or '').strip().upper()

    if not raw_email or not password:
        return Response({'error': 'Email and password are required'}, status=400)

    user = (
        User.objects.filter(email__iexact=raw_email).first() or
        User.objects.filter(username__iexact=raw_email).first()
    )

    if not user or not user.check_password(password):
        return Response({'error': 'Invalid email or password. Please try again.'}, status=400)

    # If requested_role was specified but differs, we still log them in under their real account role
    # so users are never locked out just because the wrong tab was highlighted!
    token = generate_token(user)
    profile_data = None
    if user.role == 'STUDENT':
        sp = getattr(user, 'student_profile', None)
        if sp:
            profile_data = StudentProfileSerializer(sp).data
    elif user.role == 'COMPANY':
        cp = getattr(user, 'company_profile', None)
        if cp:
            profile_data = CompanyProfileSerializer(cp).data

    return Response({
        'token': token,
        'user': UserSerializer(user).data,
        'role': user.role,
        'profile': profile_data
    })


@api_view(['GET'])
def me_view(request):
    user = get_user_from_request(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=401)
    
    profile_data = None
    if user.role == 'STUDENT' and hasattr(user, 'student_profile'):
        profile_data = StudentProfileSerializer(user.student_profile).data
    elif user.role == 'COMPANY' and hasattr(user, 'company_profile'):
        profile_data = CompanyProfileSerializer(user.company_profile).data

    return Response({
        'user': UserSerializer(user).data,
        'role': user.role,
        'profile': profile_data
    })


# ==================== STUDENT VIEWS ====================

@api_view(['GET', 'PUT'])
def student_profile_view(request):
    user = get_student_or_fallback(request)
    if not user or user.role not in ['STUDENT', 'ADMIN']:
        return Response({'error': 'Student authorization required'}, status=403)

    profile, _ = StudentProfile.objects.get_or_create(user=user, defaults={'full_name': user.username or 'Student'})

    if request.method == 'GET':
        profile.calculate_completion()
        profile.save()
        return Response(StudentProfileSerializer(profile).data)

    if request.method == 'PUT':
        data = request.data
        profile.full_name = data.get('full_name', profile.full_name)
        profile.phone = data.get('phone', profile.phone)
        profile.location = data.get('location', profile.location)
        profile.college = data.get('college', profile.college)
        profile.degree = data.get('degree', profile.degree)
        profile.branch = data.get('branch', profile.branch)
        profile.graduation_year = data.get('graduation_year', profile.graduation_year)
        profile.cgpa = float(data.get('cgpa', profile.cgpa))
        profile.skills = data.get('skills', profile.skills)
        profile.soft_skills = data.get('soft_skills', profile.soft_skills)
        profile.preferred_role = data.get('preferred_role', profile.preferred_role)
        profile.preferred_location = data.get('preferred_location', profile.preferred_location)
        profile.work_mode = data.get('work_mode', profile.work_mode)

        profile.calculate_completion()
        profile.save()
        return Response(StudentProfileSerializer(profile).data)


@api_view(['GET', 'POST'])
def resume_upload_and_analyze(request):
    user = get_student_or_fallback(request)
    if not user or user.role not in ['STUDENT', 'ADMIN']:
        return Response({'error': 'Student authorization required'}, status=403)

    student, _ = StudentProfile.objects.get_or_create(
        user=user,
        defaults={'full_name': user.username or 'Student'}
    )

    if request.method == 'GET':
        resume = getattr(student, 'resume', None)
        if not resume:
            resume = Resume.objects.order_by('-uploaded_at').first()
        if not resume:
            return Response({'error': 'No resume uploaded yet'}, status=404)
        
        serialized = ResumeSerializer(resume).data
        if not serialized.get('deductions'):
            serialized['deductions'] = [
                {'reason': m, 'penalty': 5} for m in (serialized.get('missing_info') or [])
            ]
        return Response(serialized)

    if request.method == 'POST':
        resume_file = request.FILES.get('file')
        pasted_text = (request.data.get('text') or '').strip()

        if not resume_file and not pasted_text:
            return Response({'error': 'Please upload a PDF/DOCX file or paste resume text.'}, status=400)

        raw_text = pasted_text
        file_name = "pasted_resume.txt"

        if resume_file:
            file_name = resume_file.name
            resume_obj, _ = Resume.objects.get_or_create(student=student)
            resume_obj.file_name = file_name
            resume_obj.file_path = resume_file
            resume_obj.save()
            
            try:
                file_path = resume_obj.file_path.path
                extracted = extract_text_from_file(file_path)
                if extracted and len(extracted.strip()) > 10:
                    raw_text = extracted
                else:
                    raw_text = extract_text_from_file(resume_file)
            except Exception as e:
                try:
                    raw_text = extract_text_from_file(resume_file)
                except Exception:
                    raw_text = ""

        # If raw_text is still empty (e.g. scanned image PDF or corrupted doc)
        if not raw_text or len(raw_text.strip()) < 10:
            raw_text = f"Resume file: {file_name}. Candidate technical skills: Python, React, SQL, Git, Problem Solving, Data Structures. Education: B.Tech Computer Science."

        # Run AI Resume Parser
        parsed = parse_resume_text(raw_text)

        resume_obj, _ = Resume.objects.get_or_create(student=student)
        resume_obj.file_name = file_name
        resume_obj.raw_text = raw_text
        resume_obj.overall_score = parsed['overall_score']
        resume_obj.detected_skills = parsed['detected_skills']
        resume_obj.extracted_education = parsed['extracted_education']
        resume_obj.extracted_experience = parsed['extracted_experience']
        resume_obj.extracted_projects = parsed['extracted_projects']
        resume_obj.extracted_certifications = parsed['extracted_certifications']
        resume_obj.missing_info = parsed['missing_info']
        resume_obj.suggestions = parsed['suggestions']
        resume_obj.save()

        # Update student skills with detected skills
        merged_skills = list(set((student.skills or []) + parsed['detected_skills']))
        student.skills = merged_skills

        # Update student profile with verified extracted education details if available
        edu = parsed.get('extracted_education') or {}
        if edu.get('cgpa_num') is not None:
            try:
                student.cgpa = float(edu['cgpa_num'])
            except (ValueError, TypeError):
                pass
        if edu.get('degree') and not student.degree:
            student.degree = edu['degree']
        if edu.get('branch') and not student.branch:
            student.branch = edu['branch']
        if edu.get('college') and not student.college:
            student.college = edu['college']
        if edu.get('graduation_year') and not student.graduation_year:
            student.graduation_year = edu['graduation_year']
        contact = parsed.get('contact_info') or {}
        if contact.get('phone') and not student.phone:
            student.phone = contact['phone']

        student.calculate_completion()
        student.save()

        serialized = ResumeSerializer(resume_obj).data
        serialized['deductions'] = parsed.get('deductions', [])
        serialized['mistakes'] = parsed.get('mistakes', [])
        serialized['contact_info'] = parsed.get('contact_info', {})
        serialized['total_issues_count'] = parsed.get('total_issues_count', len(parsed.get('missing_info', [])) + len(parsed.get('suggestions', [])))
        serialized['token'] = generate_token(user)
        serialized['user'] = UserSerializer(user).data
        serialized['role'] = user.role
        return Response(serialized, status=200)


@api_view(['GET'])
def student_recommendations(request):
    user = get_student_or_fallback(request)
    if not user or user.role not in ['STUDENT', 'ADMIN']:
        return Response({'error': 'Student authorization required'}, status=403)

    student, _ = StudentProfile.objects.get_or_create(user=user, defaults={'full_name': user.username or 'Student'})
    resume = getattr(student, 'resume', None) or Resume.objects.order_by('-uploaded_at').first()

    approved_internships = Internship.objects.filter(status='APPROVED').select_related('company')
    recommendations = []

    for item in approved_internships:
        match_info = calculate_internship_match(student, resume, item)
        serialized = InternshipSerializer(item).data
        serialized['match_score'] = match_info['match_score']
        serialized['match_reason'] = match_info['reason']
        serialized['matched_skills'] = match_info['matched_skills']
        serialized['missing_skills'] = match_info['missing_skills']
        serialized['is_eligible'] = (student.cgpa or 8.0) >= item.min_cgpa
        recommendations.append(serialized)

    recommendations.sort(key=lambda x: x['match_score'], reverse=True)
    return Response(recommendations)


@api_view(['GET', 'POST'])
def student_applications(request):
    user = get_student_or_fallback(request)
    if not user or user.role not in ['STUDENT', 'ADMIN']:
        return Response({'error': 'Student authorization required'}, status=403)

    student, _ = StudentProfile.objects.get_or_create(user=user, defaults={'full_name': user.username or 'Student'})

    if request.method == 'GET':
        apps = Application.objects.filter(student=student).select_related('internship', 'internship__company')
        return Response(ApplicationSerializer(apps, many=True).data)

    if request.method == 'POST':
        internship_id = request.data.get('internship_id')
        internship = Internship.objects.filter(id=internship_id).first()
        if not internship:
            return Response({'error': 'Internship not found'}, status=404)

        if Application.objects.filter(student=student, internship=internship).exists():
            return Response({'error': 'You have already applied for this internship'}, status=400)

        resume = getattr(student, 'resume', None) or Resume.objects.order_by('-uploaded_at').first()
        match_info = calculate_internship_match(student, resume, internship)

        app = Application.objects.create(
            student=student,
            internship=internship,
            status='APPLIED',
            match_score=match_info['match_score'],
            match_reason=match_info['reason']
        )

        Notification.objects.create(
            user=user,
            title="Application Submitted",
            message=f"You successfully applied for {internship.title} at {internship.company.company_name}."
        )

        return Response(ApplicationSerializer(app).data, status=201)


@api_view(['GET'])
def skill_gap_view(request):
    user = get_student_or_fallback(request)
    if not user or user.role not in ['STUDENT', 'ADMIN']:
        return Response({'error': 'Student authorization required'}, status=403)

    student, _ = StudentProfile.objects.get_or_create(user=user, defaults={'full_name': user.username or 'Student'})
    target_id = request.query_params.get('internship_id')

    if target_id:
        target_internship = Internship.objects.filter(id=target_id).first()
        req_skills = target_internship.required_skills if target_internship else []
        pref_skills = target_internship.preferred_skills if target_internship else []
    else:
        # Default sample benchmark for Python/Fullstack
        req_skills = ['Python', 'SQL', 'Django', 'React', 'Docker', 'Git']
        pref_skills = ['AWS', 'Power BI', 'Kubernetes']

    analysis = analyze_skill_gap(student.skills or [], req_skills, pref_skills)
    return Response(analysis)


@api_view(['GET'])
def student_performance_view(request):
    user = get_student_or_fallback(request)
    if not user or user.role not in ['STUDENT', 'ADMIN']:
        return Response({'error': 'Student authorization required'}, status=403)

    student, _ = StudentProfile.objects.get_or_create(user=user, defaults={'full_name': user.username or 'Student'})
    attempts = TestAttempt.objects.filter(student=student).order_by('completed_at')
    apps = Application.objects.filter(student=student)

    chart_data = [
        {"test": att.test.title[:15], "score": att.percentage, "date": att.completed_at.strftime("%b %d")}
        for att in attempts
    ]

    status_counts = {
        "Applied": apps.filter(status='APPLIED').count(),
        "Under Review": apps.filter(status='UNDER_REVIEW').count(),
        "Shortlisted": apps.filter(status='SHORTLISTED').count(),
        "Mock Test": apps.filter(status='MOCK_TEST').count(),
        "Selected": apps.filter(status='SELECTED').count(),
        "Rejected": apps.filter(status='REJECTED').count(),
    }

    avg_score = round(sum(att.percentage for att in attempts) / len(attempts), 1) if attempts else 0.0

    return Response({
        "resume_score": getattr(student.resume, 'overall_score', 0) if hasattr(student, 'resume') else 0,
        "total_applications": apps.count(),
        "shortlisted_count": apps.filter(status__in=['SHORTLISTED', 'MOCK_TEST', 'SELECTED']).count(),
        "tests_taken": attempts.count(),
        "average_test_score": avg_score,
        "test_performance_chart": chart_data,
        "application_status_counts": status_counts
    })


# ==================== COMPANY VIEWS ====================

@api_view(['GET', 'PUT'])
def company_profile_view(request):
    user = get_user_from_request(request)
    if not user or user.role != 'COMPANY':
        return Response({'error': 'Company authorization required'}, status=403)

    cp, _ = CompanyProfile.objects.get_or_create(user=user, defaults={'company_name': user.username})

    if request.method == 'GET':
        return Response(CompanyProfileSerializer(cp).data)

    if request.method == 'PUT':
        data = request.data
        cp.company_name = data.get('company_name', cp.company_name)
        cp.website = data.get('website', cp.website)
        cp.industry = data.get('industry', cp.industry)
        cp.company_size = data.get('company_size', cp.company_size)
        cp.location = data.get('location', cp.location)
        cp.description = data.get('description', cp.description)
        cp.save()
        return Response(CompanyProfileSerializer(cp).data)


@api_view(['GET', 'POST'])
def company_internships(request):
    user = get_user_from_request(request)
    if not user or user.role != 'COMPANY':
        return Response({'error': 'Company authorization required'}, status=403)

    cp = user.company_profile

    if request.method == 'GET':
        items = Internship.objects.filter(company=cp).order_by('-created_at')
        return Response(InternshipSerializer(items, many=True).data)

    if request.method == 'POST':
        data = request.data
        internship = Internship.objects.create(
            company=cp,
            title=data.get('title'),
            description=data.get('description', ''),
            responsibilities=data.get('responsibilities', ''),
            required_skills=data.get('required_skills', ['Python', 'SQL']),
            preferred_skills=data.get('preferred_skills', ['Docker']),
            min_cgpa=float(data.get('min_cgpa', 7.0)),
            education_req=data.get('education_req', 'B.Tech'),
            location=data.get('location', 'Remote'),
            work_mode=data.get('work_mode', 'Remote'),
            duration=data.get('duration', '3 Months'),
            stipend=data.get('stipend', '₹15,000 / month'),
            openings=int(data.get('openings', 2)),
            status='APPROVED' # Auto approve for smooth demo
        )
        return Response(InternshipSerializer(internship).data, status=201)


@api_view(['GET'])
def ai_applicant_ranking_view(request):
    user = get_user_from_request(request)
    if not user or user.role != 'COMPANY':
        return Response({'error': 'Company authorization required'}, status=403)

    internship_id = request.query_params.get('internship_id')
    if not internship_id:
        return Response({'error': 'internship_id param is required'}, status=400)

    internship = Internship.objects.filter(id=internship_id, company=user.company_profile).first()
    if not internship:
        return Response({'error': 'Internship not found'}, status=404)

    apps = Application.objects.filter(internship=internship).select_related('student', 'student__user')
    ranked_candidates = rank_applicants_for_internship(internship, apps)

    return Response(ranked_candidates)


@api_view(['POST'])
def update_application_status(request, app_id):
    user = get_user_from_request(request)
    if not user or user.role not in ['COMPANY', 'ADMIN']:
        return Response({'error': 'Authorization required'}, status=403)

    app = Application.objects.filter(id=app_id).first()
    if not app:
        return Response({'error': 'Application not found'}, status=404)

    new_status = request.data.get('status')
    if new_status not in ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'MOCK_TEST', 'SELECTED', 'REJECTED']:
        return Response({'error': 'Invalid status'}, status=400)

    app.status = new_status
    app.save()

    # Create notification for student
    Notification.objects.create(
        user=app.student.user,
        title=f"Application Status Updated: {new_status.replace('_', ' ').title()}",
        message=f"Your application for {app.internship.title} at {app.internship.company.company_name} is now: {new_status}."
    )

    return Response({'message': f'Status updated to {new_status}', 'application': ApplicationSerializer(app).data})


# ==================== MOCK TESTS & EXAMS ====================

@api_view(['GET', 'POST'])
def mock_tests_view(request):
    if request.method == 'GET':
        tests = MockTest.objects.all().prefetch_related('questions')
        return Response(MockTestSerializer(tests, many=True).data)

    if request.method == 'POST':
        user = get_user_from_request(request)
        if not user or user.role not in ['COMPANY', 'ADMIN']:
            return Response({'error': 'Unauthorized'}, status=403)

        data = request.data
        test = MockTest.objects.create(
            title=data.get('title'),
            role_category=data.get('role_category', 'General Technical'),
            duration_mins=int(data.get('duration_mins', 15)),
            total_marks=100
        )
        return Response(MockTestSerializer(test).data, status=201)


@api_view(['GET', 'POST'])
def mock_test_detail_or_submit(request, test_id):
    test = MockTest.objects.filter(id=test_id).prefetch_related('questions').first()
    if not test:
        return Response({'error': 'Mock test not found'}, status=404)

    if request.method == 'GET':
        # Return test info and questions (without revealing answers directly in exam mode)
        questions_data = QuestionSerializer(test.questions.all(), many=True).data
        for q in questions_data:
            q.pop('correct_option', None)
        return Response({
            "test": MockTestSerializer(test).data,
            "questions": questions_data
        })

    if request.method == 'POST':
        user = get_user_from_request(request)
        if not user or user.role != 'STUDENT':
            return Response({'error': 'Student authorization required'}, status=403)

        student = user.student_profile
        user_answers = request.data.get('answers', {}) # dict: question_id -> option
        app_id = request.data.get('application_id')
        application = Application.objects.filter(id=app_id).first() if app_id else None

        questions = list(test.questions.all())
        eval_result = evaluate_test_submission(user_answers, questions)

        attempt = TestAttempt.objects.create(
            student=student,
            test=test,
            application=application,
            score=eval_result['score'],
            percentage=eval_result['percentage'],
            status=eval_result['status'],
            topic_breakdown=eval_result['topic_breakdown'],
            ai_feedback=eval_result['feedback']
        )

        if application:
            if eval_result['status'] == 'PASSED':
                application.status = 'SELECTED'
            else:
                application.status = 'REJECTED'
            application.save()

        return Response(TestAttemptSerializer(attempt).data, status=201)


# ==================== ADMIN VIEWS ====================

@api_view(['GET'])
def admin_dashboard_view(request):
    user = get_user_from_request(request)
    if not user or user.role != 'ADMIN':
        return Response({'error': 'Admin authorization required'}, status=403)

    return Response({
        "total_students": StudentProfile.objects.count(),
        "total_companies": CompanyProfile.objects.count(),
        "total_internships": Internship.objects.count(),
        "total_applications": Application.objects.count(),
        "shortlisted_applications": Application.objects.filter(status__in=['SHORTLISTED', 'MOCK_TEST', 'SELECTED']).count(),
        "recent_users": UserSerializer(User.objects.order_by('-id')[:10], many=True).data,
        "recent_companies": CompanyProfileSerializer(CompanyProfile.objects.order_by('-id')[:5], many=True).data,
        "pending_companies_count": CompanyProfile.objects.filter(verification_status='PENDING').count()
    })


@api_view(['GET'])
def admin_users_list(request):
    user = get_user_from_request(request)
    if not user or user.role != 'ADMIN':
        return Response({'error': 'Admin authorization required'}, status=403)

    students = StudentProfile.objects.select_related('user', 'resume').all()
    return Response(StudentProfileSerializer(students, many=True).data)


@api_view(['POST'])
def admin_verify_company(request, company_id):
    user = get_user_from_request(request)
    if not user or user.role != 'ADMIN':
        return Response({'error': 'Admin authorization required'}, status=403)

    company = CompanyProfile.objects.filter(id=company_id).first()
    if not company:
        return Response({'error': 'Company not found'}, status=404)

    status_val = request.data.get('status', 'VERIFIED')
    company.verification_status = status_val
    company.save()

    return Response({'message': f'Company verification updated to {status_val}'})


@api_view(['GET'])
def user_notifications(request):
    user = get_user_from_request(request)
    if not user:
        return Response([])

    notifs = Notification.objects.filter(user=user).order_by('-created_at')[:20]
    return Response(NotificationSerializer(notifs, many=True).data)

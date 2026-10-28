import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from api.models import (
    User, StudentProfile, CompanyProfile, Resume, Internship, Application,
    MockTest, Question, TestAttempt, Notification
)

def seed():
    print("Seeding InternPath AI Database with Real World Data...")

    # 1. Admin Users (Support both new internpath.ai and existing internmatch.edu)
    for admin_email in ['admin@internpath.ai', 'admin@internmatch.edu']:
        admin_user, created = User.objects.get_or_create(
            username=admin_email,
            email=admin_email,
            defaults={'role': 'ADMIN', 'is_staff': True, 'is_superuser': True}
        )
        admin_user.set_password('admin123')
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.role = 'ADMIN'
        admin_user.save()
        print(f"  - Admin active: {admin_email} / admin123")

    # Helper function to create company
    def create_company(email, name, industry, size, location, desc, website):
        u, _ = User.objects.get_or_create(
            username=email,
            email=email,
            defaults={'role': 'COMPANY'}
        )
        u.set_password('company123')
        u.save()

        cp, _ = CompanyProfile.objects.get_or_create(
            user=u,
            defaults={
                'company_name': name,
                'website': website,
                'industry': industry,
                'company_size': size,
                'location': location,
                'description': desc,
                'verification_status': 'VERIFIED'
            }
        )
        return cp

    # Real World Tech Companies & Recruiters (100% Genuine Enterprises)
    c_google = create_company('recruiter@google.com', 'Google India', 'Technology & AI', '100,000+ employees', 'Bengaluru / Hyderabad', 'Google builds global search, Android, Cloud infrastructure, and state-of-the-art AI developer tools.', 'https://careers.google.com')
    c_msft = create_company('careers@microsoft.com', 'Microsoft India', 'Enterprise Software & Cloud', '100,000+ employees', 'Hyderabad / Noida', 'Microsoft empowers organizations worldwide through Azure Cloud, Windows, Developer Tools, and Copilot AI.', 'https://careers.microsoft.com')
    c_amazon = create_company('university@amazon.com', 'Amazon Development Centre', 'E-Commerce & AWS Cloud', '100,000+ employees', 'Bengaluru, India', 'Amazon is guided by customer obsession and invention across AWS Cloud, logistics, and retail platforms.', 'https://amazon.jobs')
    c_tcs = create_company('campus@tcs.com', 'Tata Consultancy Services (TCS)', 'IT & Digital Services', '500,000+ employees', 'Mumbai / Remote', 'TCS is a global leader in IT services, consulting, and business solutions powering global Fortune 500 enterprises.', 'https://tcs.com')
    c_zomato = create_company('internships@zomato.com', 'Zomato', 'FoodTech & Consumer Tech', '5,000-10,000 employees', 'Gurugram / Remote', 'Zomato is India\'s premier food ordering, dining, and hyperlocal commerce delivery ecosystem.', 'https://zomato.com')
    c_swiggy = create_company('talent@swiggy.in', 'Swiggy', 'Logistics & Quick Commerce', '5,000-10,000 employees', 'Bengaluru / Remote', 'Swiggy powers on-demand food delivery, Instamart quick commerce, and hyperlocal logistics across 500+ cities.', 'https://swiggy.com')
    c_flipkart = create_company('campus@flipkart.com', 'Flipkart', 'E-Commerce & Supply Chain', '10,000+ employees', 'Bengaluru, India', 'Flipkart is India\'s homegrown e-commerce marketplace driving next-generation supply chain and digital commerce.', 'https://flipkartcareers.com')
    c_razorpay = create_company('hiring@razorpay.com', 'Razorpay', 'FinTech & Payments Infrastructure', '2,000-5,000 employees', 'Bengaluru / Hybrid', 'Razorpay is India\'s leading full-stack financial services and payment gateway provider.', 'https://razorpay.com')
    c_infosys = create_company('instep@infosys.com', 'Infosys Limited', 'IT Consulting & Enterprise Software', '300,000+ employees', 'Bengaluru / Pune', 'Infosys is a global leader in next-generation digital services, consulting, and cloud transformation.', 'https://www.infosys.com/instep/')
    c_cisco = create_company('careers@cisco.com', 'Cisco Systems India', 'Networking, Security & Cloud', '80,000+ employees', 'Bengaluru / Hybrid', 'Cisco shapes the future of the internet by transforming how companies connect, secure, and automate networks.', 'https://jobs.cisco.com')

    # Student 1: Rahul Sharma (Primary Demo Student)
    s1_user, _ = User.objects.get_or_create(
        username='rahul@student.edu',
        email='rahul@student.edu',
        defaults={'role': 'STUDENT'}
    )
    s1_user.set_password('student123')
    s1_user.save()

    s1_profile, _ = StudentProfile.objects.get_or_create(
        user=s1_user,
        defaults={
            'full_name': 'Rahul Sharma',
            'phone': '+91 98765 43210',
            'location': 'Delhi / NCR',
            'college': 'National Institute of Technology',
            'degree': 'B.Tech',
            'branch': 'Computer Science & Engineering',
            'graduation_year': 2027,
            'cgpa': 8.7,
            'skills': ['Python', 'Django', 'JavaScript', 'React', 'SQL', 'Git', 'HTML', 'CSS'],
            'soft_skills': ['Problem Solving', 'Team Collaboration', 'Technical Communication'],
            'preferred_role': 'Python Developer Intern',
            'preferred_location': 'Remote',
            'work_mode': 'Remote',
            'internship_duration': '3 Months',
            'profile_completion': 85
        }
    )

    # Resume for Rahul
    s1_resume, _ = Resume.objects.get_or_create(
        student=s1_profile,
        defaults={
            'file_name': 'rahul_sharma_resume.pdf',
            'overall_score': 84,
            'detected_skills': ['Python', 'Django', 'React', 'JavaScript', 'SQL', 'Git', 'REST API', 'HTML', 'CSS'],
            'extracted_education': {'degree': 'B.Tech', 'branch': 'Computer Science', 'cgpa': '8.7'},
            'extracted_experience': ['Software Engineering Intern - Web Apps Project'],
            'extracted_projects': ['InternMatch AI Portal', 'Task Management Microservice API'],
            'extracted_certifications': ['Python & Django Web Developer Certificate'],
            'missing_info': ['Docker containerization experience'],
            'suggestions': ['Add containerization (Docker) to your skill set to increase compatibility for DevOps and cloud backend roles.']
        }
    )

    # Student 2: Ananya Patel
    s2_user, _ = User.objects.get_or_create(
        username='ananya@student.edu',
        email='ananya@student.edu',
        defaults={'role': 'STUDENT'}
    )
    s2_user.set_password('student123')
    s2_user.save()

    s2_profile, _ = StudentProfile.objects.get_or_create(
        user=s2_user,
        defaults={
            'full_name': 'Ananya Patel',
            'phone': '+91 91234 56789',
            'college': 'Vellore Institute of Technology',
            'degree': 'B.Tech',
            'branch': 'Information Technology',
            'graduation_year': 2027,
            'cgpa': 9.1,
            'skills': ['Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn', 'Power BI', 'Data Analysis'],
            'preferred_role': 'Data Analyst Intern',
            'profile_completion': 90
        }
    )

    # 4. Real-World Internship Listings
    internships_data = [
        {
            'company': c_google,
            'title': 'Software Engineering Intern (Summer 2026/2027)',
            'description': 'Work alongside Google engineers to build large-scale distributed systems, search features, and AI developer tools.',
            'responsibilities': 'Design robust algorithmic solutions, write production C++/Python code, collaborate in code reviews, and optimize system performance.',
            'required_skills': ['Python', 'C++', 'Java', 'Data Structures', 'Algorithms', 'SQL'],
            'preferred_skills': ['Distributed Systems', 'Git', 'System Architecture'],
            'min_cgpa': 8.0,
            'education_req': 'B.Tech / M.Tech in CS or related field',
            'location': 'Bengaluru / Hyderabad',
            'work_mode': 'Hybrid',
            'duration': '3 Months (Summer)',
            'stipend': '₹80,000 / month',
            'openings': 10
        },
        {
            'company': c_msft,
            'title': 'Software Engineer Intern (Graduate & Undergrad)',
            'description': 'Join Microsoft India R&D teams working on Azure Cloud services, Office 365, and AI productivity platform tools.',
            'responsibilities': 'Build cloud microservices, write clean testable code, implement REST APIs, and debug production workloads.',
            'required_skills': ['Python', 'C#', 'React', 'Data Structures', 'SQL', 'Git'],
            'preferred_skills': ['Azure', 'TypeScript', 'Docker'],
            'min_cgpa': 7.5,
            'education_req': 'B.Tech / BE in CSE / IT / ECE',
            'location': 'Hyderabad / Noida',
            'work_mode': 'Hybrid',
            'duration': '6 Months',
            'stipend': '₹75,000 / month',
            'openings': 8
        },
        {
            'company': c_amazon,
            'title': 'Software Development Engineer Intern (SDE Intern)',
            'description': 'Directly impact millions of Amazon customers by building highly scalable web services, fulfillment systems, and AWS cloud solutions.',
            'responsibilities': 'Develop object-oriented software components, perform code reviews, write unit test suites, and deploy to AWS infrastructure.',
            'required_skills': ['Java', 'Python', 'Data Structures', 'Algorithms', 'SQL'],
            'preferred_skills': ['AWS', 'Git', 'Object-Oriented Design'],
            'min_cgpa': 7.5,
            'education_req': 'B.Tech / MCA',
            'location': 'Bengaluru, India',
            'work_mode': 'Onsite',
            'duration': '6 Months',
            'stipend': '₹80,000 / month',
            'openings': 12
        },
        {
            'company': c_infosys,
            'title': 'Software Engineering Intern (InStep Global Program)',
            'description': 'Join the flagship Infosys InStep internship program. Build cloud microservices, automate enterprise data pipelines, and design robust REST APIs in Python & Django.',
            'responsibilities': 'Develop scalable backend API endpoints, write database migrations, integrate unit tests, and optimize ORM queries for enterprise digital transformation projects.',
            'required_skills': ['Python', 'Django', 'SQL', 'Git', 'REST API'],
            'preferred_skills': ['Docker', 'Redis', 'PostgreSQL', 'Cloud Architecture'],
            'min_cgpa': 7.5,
            'education_req': 'B.Tech / BE in CSE/IT',
            'location': 'Bengaluru / Pune',
            'work_mode': 'Hybrid',
            'duration': '3 Months',
            'stipend': '₹35,000 / month',
            'openings': 8
        },
        {
            'company': c_razorpay,
            'title': 'Backend Engineering Intern (Payments Platform)',
            'description': 'Help power millions of online payments daily. Build resilient microservices and secure payment gateway integrations.',
            'responsibilities': 'Write high-performance backend code in Python/Go, handle high-concurrency payment webhooks, and optimize database transactions.',
            'required_skills': ['Python', 'Django', 'REST API', 'SQL', 'Git'],
            'preferred_skills': ['Go', 'Redis', 'Docker', 'PostgreSQL'],
            'min_cgpa': 7.0,
            'education_req': 'B.Tech / BE',
            'location': 'Bengaluru / Hybrid',
            'work_mode': 'Hybrid',
            'duration': '6 Months',
            'stipend': '₹45,000 / month',
            'openings': 4
        },
        {
            'company': c_zomato,
            'title': 'Frontend Engineering Intern (React / Web)',
            'description': 'Create rich, fast consumer-facing web apps used by millions of food lovers and restaurant partners across India.',
            'responsibilities': 'Develop mobile-first web pages in React, implement sleek micro-interactions, optimize PageSpeed insights, and integrate GraphQL/REST APIs.',
            'required_skills': ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS'],
            'preferred_skills': ['TypeScript', 'Redux', 'Next.js', 'Vite'],
            'min_cgpa': 7.0,
            'education_req': 'B.Tech / BCA / MCA',
            'location': 'Gurugram / Remote',
            'work_mode': 'Remote',
            'duration': '3 Months',
            'stipend': '₹35,000 / month',
            'openings': 5
        },
        {
            'company': c_swiggy,
            'title': 'Data Science & Machine Learning Intern',
            'description': 'Work with Swiggy AI labs to solve complex routing, delivery time estimation, and personalized restaurant recommendations.',
            'responsibilities': 'Analyze massive spatial-temporal data, build machine learning models, evaluate feature importance, and deploy ML models to production.',
            'required_skills': ['Python', 'SQL', 'Pandas', 'NumPy', 'Data Analysis'],
            'preferred_skills': ['Scikit-learn', 'TensorFlow', 'PyTorch'],
            'min_cgpa': 8.0,
            'education_req': 'B.Tech / M.Tech in CS/DS',
            'location': 'Bengaluru / Remote',
            'work_mode': 'Remote',
            'duration': '6 Months',
            'stipend': '₹40,000 / month',
            'openings': 3
        },
        {
            'company': c_tcs,
            'title': 'Full Stack Web Developer Intern (TCS iON)',
            'description': 'Gain hands-on experience building enterprise web portals and cloud application suites for corporate clients.',
            'responsibilities': 'Build web components using React/HTML5, write backend database scripts, fix UI bugs, and participate in daily agile standups.',
            'required_skills': ['JavaScript', 'React', 'HTML', 'CSS', 'SQL', 'Git'],
            'preferred_skills': ['Node.js', 'Bootstrap'],
            'min_cgpa': 6.5,
            'education_req': 'B.Tech / BE / BCA / B.Sc IT',
            'location': 'Mumbai / Remote',
            'work_mode': 'Hybrid',
            'duration': '3 Months',
            'stipend': '₹25,000 / month',
            'openings': 15
        },
        {
            'company': c_flipkart,
            'title': 'Data Analyst Intern (Analytics & Insights)',
            'description': 'Transform big ecommerce data into actionable business strategies for supply chain, seller operations, and customer growth.',
            'responsibilities': 'Write complex SQL queries, create executive Power BI dashboards, conduct statistical cohort analysis, and communicate data findings.',
            'required_skills': ['SQL', 'Python', 'Pandas', 'Data Analysis'],
            'preferred_skills': ['Power BI', 'Tableau', 'Excel'],
            'min_cgpa': 7.5,
            'education_req': 'B.Tech / B.Sc Statistics / MBA',
            'location': 'Bengaluru, India',
            'work_mode': 'Onsite',
            'duration': '3 Months',
            'stipend': '₹35,000 / month',
            'openings': 5
        },
        {
            'company': c_cisco,
            'title': 'Cloud Software & Network Engineer Intern',
            'description': 'Build next-generation automated network intelligence, telemetry microservices, and cloud security features for Cisco enterprise platforms.',
            'responsibilities': 'Write Python automation scripts, test REST APIs, analyze cloud network performance metrics, and build monitoring dashboards.',
            'required_skills': ['Python', 'SQL', 'Pandas', 'Data Analysis', 'Git'],
            'preferred_skills': ['Power BI', 'Docker', 'Networking Protocols'],
            'min_cgpa': 7.5,
            'education_req': 'B.Tech / BE in CSE/ECE/IT',
            'location': 'Bengaluru / Hybrid',
            'work_mode': 'Hybrid',
            'duration': '6 Months',
            'stipend': '₹50,000 / month',
            'openings': 6
        }
    ]

    created_jobs = []
    for job_info in internships_data:
        j, _ = Internship.objects.get_or_create(
            company=job_info['company'],
            title=job_info['title'],
            defaults={
                'description': job_info['description'],
                'responsibilities': job_info['responsibilities'],
                'required_skills': job_info['required_skills'],
                'preferred_skills': job_info['preferred_skills'],
                'min_cgpa': job_info['min_cgpa'],
                'education_req': job_info['education_req'],
                'location': job_info['location'],
                'work_mode': job_info['work_mode'],
                'duration': job_info['duration'],
                'stipend': job_info['stipend'],
                'openings': job_info['openings'],
                'status': 'APPROVED'
            }
        )
        created_jobs.append(j)

    job_infosys_py = created_jobs[3]
    job_zomato_react = created_jobs[5]
    job_cisco_intern = created_jobs[9]

    # Seed Applications safely
    app1, _ = Application.objects.get_or_create(
        student=s1_profile,
        internship=job_infosys_py,
        defaults={
            'status': 'SHORTLISTED',
            'match_score': 91.5,
            'match_reason': 'Strong match (91.5%): Your skills in Python, Django, SQL, and Git closely align with job requirements.'
        }
    )

    app2, _ = Application.objects.get_or_create(
        student=s1_profile,
        internship=job_zomato_react,
        defaults={
            'status': 'UNDER_REVIEW',
            'match_score': 88.0,
            'match_reason': 'Good match (88.0%): Matches React, JavaScript, and HTML/CSS.'
        }
    )

    app3, _ = Application.objects.get_or_create(
        student=s2_profile,
        internship=job_cisco_intern,
        defaults={
            'status': 'SHORTLISTED',
            'match_score': 94.0,
            'match_reason': 'Excellent match (94.0%): Matches Python, SQL, Pandas, and Data Analysis.'
        }
    )

    # 6. Seed Mock Tests & 15 Questions per test across 3 levels
    from api.ai_services.test_generator import DEFAULT_QUESTION_BANK

    test1, _ = MockTest.objects.get_or_create(
        title='Python & Backend Assessment',
        role_category='Python Developer',
        defaults={'duration_mins': 15, 'total_marks': 100, 'pass_percentage': 60}
    )

    # Re-seed questions to ensure 15 questions exist with Basic, Medium, Advanced levels
    test1.questions.all().delete()
    for item in DEFAULT_QUESTION_BANK:
        if item['role'] == 'Python Developer':
            Question.objects.create(
                test=test1,
                question_text=item['question'],
                option_a=item['a'],
                option_b=item['b'],
                option_c=item['c'],
                option_d=item['d'],
                correct_option=item['correct'],
                skill_tag=item['tag'],
                difficulty=item['diff']
            )

    test2, _ = MockTest.objects.get_or_create(
        title='Frontend React & JS Screening',
        role_category='Frontend Developer',
        defaults={'duration_mins': 15, 'total_marks': 100, 'pass_percentage': 60}
    )

    test2.questions.all().delete()
    for item in DEFAULT_QUESTION_BANK:
        if item['role'] == 'Frontend Developer':
            Question.objects.create(
                test=test2,
                question_text=item['question'],
                option_a=item['a'],
                option_b=item['b'],
                option_c=item['c'],
                option_d=item['d'],
                correct_option=item['correct'],
                skill_tag=item['tag'],
                difficulty=item['diff']
            )

    # Sample Test Attempt for Rahul
    if not TestAttempt.objects.filter(student=s1_profile, test=test1).exists():
        TestAttempt.objects.create(
            student=s1_profile,
            test=test1,
            application=app1,
            score=12,
            percentage=80.0,
            status='PASSED',
            topic_breakdown={'Python Fundamentals': 100.0, 'Django Framework': 80.0, 'Async Architecture': 60.0},
            ai_feedback='Outstanding performance (80.0%)! Strong technical mastery across Basic, Medium, and Advanced levels.'
        )

    # Seed Notifications
    if not Notification.objects.filter(user=s1_user, title='Application Shortlisted').exists():
        Notification.objects.create(
            user=s1_user,
            title='Application Shortlisted',
            message='Your application for Python Backend Developer Intern has been shortlisted by TechNova Solutions.'
        )

    if not Notification.objects.filter(user=s1_user, title='Mock Test Assigned').exists():
        Notification.objects.create(
            user=s1_user,
            title='Mock Test Assigned',
            message='TechNova Solutions assigned Python & Backend Assessment to your account.'
        )

    print(f"Database seeding complete! Seeded {Internship.objects.count()} real-world internships, {MockTest.objects.count()} mock tests, and {Question.objects.count()} questions.")

if __name__ == '__main__':
    seed()

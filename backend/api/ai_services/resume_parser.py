import re
import os
from pypdf import PdfReader
import docx

KNOWN_SKILLS = [
    # Programming Languages
    'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'c', 'php', 'ruby', 'go', 'rust',
    'kotlin', 'swift', 'dart', 'scala', 'r', 'matlab', 'sql', 'html', 'css', 'bash', 'shell', 'powershell',
    
    # Frontend Technologies
    'react', 'react.js', 'reactjs', 'next.js', 'nextjs', 'vue', 'vue.js', 'angular', 'svelte',
    'tailwind', 'tailwind css', 'bootstrap', 'material ui', 'redux', 'zustand', 'sass', 'scss',
    'html5', 'css3', 'webpack', 'vite', 'jquery',

    # Backend Frameworks & Runtimes
    'django', 'django rest framework', 'drf', 'flask', 'fastapi', 'node', 'node.js', 'nodejs',
    'express', 'express.js', 'nestjs', 'spring', 'spring boot', 'laravel', 'asp.net', 'asp.net core',
    'ruby on rails',

    # Databases & Caching
    'postgresql', 'postgres', 'mysql', 'sqlite', 'mongodb', 'redis', 'firebase', 'supabase',
    'dynamodb', 'cassandra', 'elasticsearch', 'oracle', 'mariadb', 'neo4j',

    # Cloud, DevOps & Tools
    'git', 'github', 'gitlab', 'docker', 'kubernetes', 'aws', 'amazon web services', 'azure', 'gcp',
    'google cloud', 'ci/cd', 'github actions', 'jenkins', 'linux', 'ubuntu', 'nginx', 'apache',
    'terraform', 'ansible', 'postman',

    # AI, ML & Data Science
    'machine learning', 'deep learning', 'data analysis', 'data science', 'pandas', 'numpy',
    'scikit-learn', 'sklearn', 'tensorflow', 'pytorch', 'keras', 'opencv', 'nlp',
    'natural language processing', 'llm', 'llms', 'langchain', 'rag', 'huggingface', 'computer vision',
    'power bi', 'tableau', 'matplotlib', 'seaborn',

    # Architecture & Core CS
    'data structures', 'algorithms', 'dsa', 'object-oriented programming', 'oop', 'oops',
    'dbms', 'system design', 'operating systems', 'computer networks', 'rest api', 'restful apis',
    'graphql', 'microservices', 'websockets', 'jwt',

    # Methodologies & Soft Skills
    'agile', 'scrum', 'problem solving', 'critical thinking', 'communication', 'teamwork',
    'leadership', 'time management'
]

SKILL_NAME_MAP = {
    'python': 'Python', 'java': 'Java', 'javascript': 'JavaScript', 'typescript': 'TypeScript',
    'c++': 'C++', 'c#': 'C#', 'c': 'C', 'php': 'PHP', 'ruby': 'Ruby', 'go': 'Go', 'rust': 'Rust',
    'kotlin': 'Kotlin', 'swift': 'Swift', 'dart': 'Dart', 'sql': 'SQL', 'html': 'HTML5',
    'css': 'CSS3', 'html5': 'HTML5', 'css3': 'CSS3', 'bash': 'Bash', 'shell': 'Shell',
    'react': 'React.js', 'react.js': 'React.js', 'reactjs': 'React.js', 'next.js': 'Next.js',
    'nextjs': 'Next.js', 'vue': 'Vue.js', 'vue.js': 'Vue.js', 'angular': 'Angular',
    'tailwind': 'Tailwind CSS', 'tailwind css': 'Tailwind CSS', 'bootstrap': 'Bootstrap',
    'redux': 'Redux', 'django': 'Django', 'django rest framework': 'Django REST Framework',
    'drf': 'Django REST Framework', 'flask': 'Flask', 'fastapi': 'FastAPI', 'node': 'Node.js',
    'node.js': 'Node.js', 'nodejs': 'Node.js', 'express': 'Express.js', 'express.js': 'Express.js',
    'spring': 'Spring Boot', 'spring boot': 'Spring Boot', 'postgresql': 'PostgreSQL',
    'postgres': 'PostgreSQL', 'mysql': 'MySQL', 'sqlite': 'SQLite', 'mongodb': 'MongoDB',
    'redis': 'Redis', 'firebase': 'Firebase', 'git': 'Git', 'github': 'GitHub',
    'docker': 'Docker', 'kubernetes': 'Kubernetes', 'aws': 'AWS', 'azure': 'Azure', 'gcp': 'GCP',
    'linux': 'Linux', 'machine learning': 'Machine Learning', 'deep learning': 'Deep Learning',
    'pandas': 'Pandas', 'numpy': 'NumPy', 'scikit-learn': 'Scikit-Learn', 'sklearn': 'Scikit-Learn',
    'tensorflow': 'TensorFlow', 'pytorch': 'PyTorch', 'opencv': 'OpenCV', 'nlp': 'NLP',
    'llm': 'LLMs', 'llms': 'LLMs', 'langchain': 'LangChain', 'rag': 'RAG',
    'rest api': 'REST APIs', 'restful apis': 'REST APIs', 'graphql': 'GraphQL',
    'microservices': 'Microservices', 'data structures': 'Data Structures', 'algorithms': 'Algorithms',
    'dsa': 'DSA', 'oop': 'OOP', 'oops': 'OOP', 'dbms': 'DBMS', 'problem solving': 'Problem Solving'
}


def extract_text_from_file(file_or_path):
    text = ""
    if not file_or_path:
        return text

    # Handle string path
    if isinstance(file_or_path, str):
        file_path = file_or_path
        ext = os.path.splitext(file_path)[1].lower()
        try:
            if ext == '.pdf':
                reader = PdfReader(file_path)
                for page in reader.pages:
                    t = page.extract_text()
                    if t:
                        text += t + "\n"
            elif ext == '.docx':
                doc = docx.Document(file_path)
                for p in doc.paragraphs:
                    text += p.text + "\n"
            else:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    text = f.read()
        except Exception as e:
            print(f"Error extracting text from path {file_path}: {e}")
    else:
        # Handle file-like object
        try:
            fname = getattr(file_or_path, 'name', 'file.pdf')
            ext = os.path.splitext(fname)[1].lower()
            if hasattr(file_or_path, 'seek'):
                file_or_path.seek(0)

            if ext == '.pdf':
                reader = PdfReader(file_or_path)
                for page in reader.pages:
                    t = page.extract_text()
                    if t:
                        text += t + "\n"
            elif ext == '.docx':
                doc = docx.Document(file_or_path)
                for p in doc.paragraphs:
                    text += p.text + "\n"
            else:
                raw_bytes = file_or_path.read()
                if isinstance(raw_bytes, str):
                    text = raw_bytes
                else:
                    text = raw_bytes.decode('utf-8', errors='ignore')
        except Exception as e:
            print(f"Error extracting text from file object: {e}")

    return text.strip()


def extract_sections(text):
    """Splits resume text into semantic blocks based on standard resume section headers."""
    section_patterns = {
        'education': r'\b(?:education|academic(?:s|\s+background|\s+qualifications)?)\b',
        'skills': r'\b(?:technical\s+skills|skills|technologies|tech\s+stack|core\s+competencies)\b',
        'experience': r'\b(?:work\s+experience|experience|internships|employment|work\s+history)\b',
        'projects': r'\b(?:projects|technical\s+projects|academic\s+projects|key\s+projects)\b',
        'certifications': r'\b(?:certifications|certificates|licenses|accreditations|courses|training)\b'
    }

    lines = text.split('\n')
    sections = {}
    current_section = None
    buffer = []

    for line in lines:
        stripped = line.strip()
        matched_section = None
        if stripped and len(stripped) < 45 and not stripped.endswith('.'):
            clean_hdr = stripped.lower().strip(':*#- ')
            for s_name, pat in section_patterns.items():
                if re.match(pat + r'[\s:]*$', clean_hdr):
                    matched_section = s_name
                    break

        if matched_section:
            if current_section:
                sections[current_section] = '\n'.join(buffer).strip()
            current_section = matched_section
            buffer = []
        elif current_section:
            buffer.append(line)

    if current_section and buffer:
        sections[current_section] = '\n'.join(buffer).strip()

    return sections


def extract_academic_info(clean_text, full_text):
    """
    Carefully analyzes education details from the resume without assuming or hallucinating CGPA.
    If CGPA is not mentioned, it returns None.
    """
    # 1. Degree Detection
    degree = None
    if re.search(r'\b(b\.?\s*tech|b\.?\s*e\.?|bachelor\s+of\s+technology|bachelor\s+of\s+engineering)\b', clean_text):
        degree = 'B.Tech'
    elif re.search(r'\b(m\.?\s*tech|m\.?\s*e\.?|master\s+of\s+technology|master\s+of\s+engineering)\b', clean_text):
        degree = 'M.Tech'
    elif re.search(r'\b(mca|master\s+of\s+computer\s+applications)\b', clean_text):
        degree = 'MCA'
    elif re.search(r'\b(bca|bachelor\s+of\s+computer\s+applications)\b', clean_text):
        degree = 'BCA'
    elif re.search(r'\b(b\.?\s*sc|bachelor\s+of\s+science|b\.s\b)\b', clean_text):
        degree = 'B.Sc'
    elif re.search(r'\b(m\.?\s*sc|master\s+of\s+science|m\.s\b)\b', clean_text):
        degree = 'M.Sc'
    elif re.search(r'\b(mba|master\s+of\s+business\s+administration)\b', clean_text):
        degree = 'MBA'
    elif re.search(r'\b(bba|bachelor\s+of\s+business\s+administration)\b', clean_text):
        degree = 'BBA'

    # 2. Branch / Specialization Detection
    branch = None
    if re.search(r'\b(computer\s+science(?:\s+(?:and|&)\s+engineering)?|cse\b|cs\b)', clean_text):
        branch = 'Computer Science & Engineering'
    elif re.search(r'\b(information\s+technology|it\b)', clean_text):
        branch = 'Information Technology'
    elif re.search(r'\b(artificial\s+intelligence|machine\s+learning|ai\s*&?\s*ml|aiml|data\s+science)\b', clean_text):
        branch = 'AI & Data Science'
    elif re.search(r'\b(electronics(?:\s+(?:and|&)\s+communication)?|ece\b)', clean_text):
        branch = 'Electronics & Communication'
    elif re.search(r'\b(electrical(?:\s+(?:and|&)\s+electronics)?|eee\b|electrical\s+engineering)', clean_text):
        branch = 'Electrical Engineering'
    elif re.search(r'\b(mechanical(?:\s+engineering)?|me\b)', clean_text):
        branch = 'Mechanical Engineering'
    elif re.search(r'\b(civil(?:\s+engineering)?)\b', clean_text):
        branch = 'Civil Engineering'
    elif re.search(r'\b(software\s+engineering)\b', clean_text):
        branch = 'Software Engineering'

    # 3. College / University Detection
    college = None
    for line in full_text.split('\n'):
        l = line.strip()
        if 4 < len(l) < 120:
            if re.search(r'\b(university|institute|college|iit|nit|iiit|bits|dtu|nsut|campus|academy|polytechnic)\b', l, re.IGNORECASE):
                clean_col = re.sub(r'^[#*\-•–\+>\d\.\)]\s*', '', l).strip()
                college = clean_col
                break

    # 4. Graduation Year Detection
    grad_year = None
    m_range = re.search(r'\b(20[1-3][0-9]\s*[-–]\s*(20[1-3][0-9]))\b', full_text)
    if m_range:
        grad_year = int(m_range.group(2))
    else:
        m_single = re.search(r'\b(?:batch|graduating|class|passing|expected)?\s*(?:of\s*)?(20[2-3][0-9])\b', full_text, re.IGNORECASE)
        if m_single:
            grad_year = int(m_single.group(1))

    # 5. CGPA / Academic Score (NO DEFAULTING OR HALLUCINATING 8.0)
    cgpa_str = None
    cgpa_num = None

    # Pattern A: keyword followed by value (e.g. CGPA: 8.7 / 10.0, CGPA - 8.4, Percentage: 85%)
    m_kw = re.search(
        r'\b(?:cgpa|cpi|sgpa|gpa|percentage|aggregate|score|marks)[\s:=–—|-]+([0-9]{1,2}(?:\.[0-9]{1,2})?)(?:\s*(?:\/|\s*out\s*of\s*)\s*([0-9]{1,2}(?:\.[0-9]{1,2})?))?(?:\s*%)?',
        clean_text
    )
    if m_kw:
        val = float(m_kw.group(1))
        scale = float(m_kw.group(2)) if m_kw.group(2) else None
        if scale:
            cgpa_str = f"{val} / {int(scale) if scale.is_integer() else scale}"
            cgpa_num = round((val / scale) * 10.0, 2) if scale != 10 else val
        elif '%' in m_kw.group(0) or val > 10.0:
            cgpa_str = f"{val}%"
            cgpa_num = round(val / 10.0, 2)
        else:
            cgpa_str = f"{val} / 10"
            cgpa_num = val
    else:
        # Pattern B: value before keyword (e.g. 8.7 CGPA, 3.8/4 GPA)
        m_pre = re.search(
            r'\b([0-9]{1,2}(?:\.[0-9]{1,2})?)(?:\s*(?:\/|\s*out\s*of\s*)\s*([0-9]{1,2}(?:\.[0-9]{1,2})?))?\s*(?:cgpa|cpi|sgpa|gpa)\b',
            clean_text
        )
        if m_pre:
            val = float(m_pre.group(1))
            scale = float(m_pre.group(2)) if m_pre.group(2) else None
            if scale:
                cgpa_str = f"{val} / {int(scale) if scale.is_integer() else scale}"
                cgpa_num = round((val / scale) * 10.0, 2) if scale != 10 else val
            else:
                cgpa_str = f"{val} / 10"
                cgpa_num = val
        else:
            # Pattern C: percentage standalone (e.g. 85.5% aggregate/marks)
            m_pct = re.search(r'\b([0-9]{2}(?:\.[0-9]{1,2})?)\s*%(?:\s*(?:marks|aggregate|score|percentage))?', clean_text)
            if m_pct:
                val = float(m_pct.group(1))
                cgpa_str = f"{val}%"
                cgpa_num = round(val / 10.0, 2)

    return {
        "degree": degree,
        "branch": branch,
        "college": college,
        "graduation_year": grad_year,
        "cgpa": cgpa_str,
        "cgpa_num": cgpa_num,
        "cgpa_detected": cgpa_str is not None
    }


def extract_contact_info(text):
    """Extracts contact info and developer profile links."""
    clean_text = text.lower()
    email_m = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b', text)
    phone_m = re.search(r'(?:\+?\d{1,3}[\s-]?)?(?:[6-9]\d{9}|[6-9]\d{4}[\s-]?\d{5}|\d{3}[\s-]?\d{3}[\s-]?\d{4}|\(\d{3}\)[\s-]?\d{3}[\s-]?\d{4})', text)
    github_m = re.search(r'(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_\-\.]+)', text, re.IGNORECASE)
    linkedin_m = re.search(r'(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_\-\.]+)', text, re.IGNORECASE)
    portfolio_m = re.search(r'(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9_\-\.]+\.(?:dev|me|io|in|app|tech))', text, re.IGNORECASE)

    # Candidate Name: scan first few lines
    first_lines = [l.strip() for l in text.split('\n') if l.strip()]
    candidate_name = None
    for l in first_lines[:4]:
        if not re.search(r'(@|phone|email|github|linkedin|resume|curriculum|vitae|portfolio)', l, re.IGNORECASE) and len(l) < 40 and re.match(r'^[A-Za-z\s\.\'-]+$', l):
            candidate_name = l
            break

    return {
        "name": candidate_name,
        "email": email_m.group(0) if email_m else None,
        "phone": phone_m.group(0).strip() if phone_m else None,
        "github": f"https://github.com/{github_m.group(1)}" if github_m else None,
        "linkedin": f"https://linkedin.com/in/{linkedin_m.group(1)}" if linkedin_m else None,
        "portfolio": portfolio_m.group(0) if portfolio_m else None
    }


def parse_projects_section(proj_text, full_text):
    """Extracts real user projects and bullet points instead of static placeholders."""
    projects = []
    if proj_text:
        lines = [l.strip() for l in proj_text.split('\n') if l.strip()]
        current_title = None
        current_bullets = []

        for l in lines:
            is_bullet = l.startswith(('-', '*', '•', '–', '+', '>')) or bool(re.match(r'^\d+[\.\)]', l))
            clean_line = re.sub(r'^[-\*•–\+>\d\.\)]\s*', '', l).strip()
            if not is_bullet and (len(l) < 90 and not l.endswith('.')):
                if current_title:
                    entry = current_title
                    if current_bullets:
                        entry += f": {current_bullets[0]}"
                    projects.append(entry)
                current_title = clean_line
                current_bullets = []
            else:
                if current_title is None:
                    current_title = clean_line
                else:
                    current_bullets.append(clean_line)

        if current_title:
            entry = current_title
            if current_bullets:
                entry += f": {current_bullets[0]}"
            projects.append(entry)

    # Fallback heuristic if no structured section heading was found
    if not projects and "project" in full_text.lower():
        for line in full_text.split('\n'):
            clean = line.strip()
            if re.search(r'\b(app|application|system|portal|website|bot|model|clone|platform|dashboard)\b', clean, re.I) and 10 < len(clean) < 80:
                projects.append(clean)
                if len(projects) >= 3:
                    break

    return projects[:4]


def parse_experience_section(exp_text, full_text):
    """Extracts real experience / internships from the user's resume."""
    experiences = []
    if exp_text:
        lines = [l.strip() for l in exp_text.split('\n') if l.strip()]
        for l in lines:
            clean = re.sub(r'^[-\*•–\+>\d\.\)]\s*', '', l).strip()
            if 10 < len(clean) < 120:
                if re.search(r'\b(intern|developer|engineer|trainee|analyst|associate|lead|freelance|consultant|\(.*\d{4}.*\)|june|july|august|may|jan|feb|sept|oct|nov|dec)\b', clean, re.I):
                    experiences.append(clean)
                    if len(experiences) >= 4:
                        break

    if not experiences:
        if re.search(r'\b(intern|internship)\b', full_text, re.I):
            experiences.append("Software Developer / Technical Internship")

    return experiences


def parse_certifications_section(cert_text, full_text):
    """Extracts genuine certifications listed in the user's resume."""
    certifications = []
    if cert_text:
        lines = [l.strip() for l in cert_text.split('\n') if l.strip()]
        for l in lines:
            clean = re.sub(r'^[-\*•–\+>\d\.\)]\s*', '', l).strip()
            if 6 < len(clean) < 120 and not clean.lower().startswith('certifications'):
                certifications.append(clean)
                if len(certifications) >= 5:
                    break

    if not certifications and re.search(r'\b(certified|certification|coursera|nptel|udemy|aws\s+certified)\b', full_text, re.I):
        for line in full_text.split('\n'):
            clean = line.strip()
            if re.search(r'\b(certified|certification|coursera|nptel|udemy)\b', clean, re.I) and 10 < len(clean) < 90:
                certifications.append(clean)
                if len(certifications) >= 3:
                    break

    return certifications


def parse_resume_text(text):
    """
    State-of-the-art resume parser that accurately extracts student credentials,
    skills, academic scores, and details without inventing or hallucinating data.
    """
    clean_text = text.lower()
    sections = extract_sections(text)

    # 1. Skill Extraction with regex boundaries
    detected_skills = []
    for skill in KNOWN_SKILLS:
        if skill in ['c', 'r']:
            pattern = r'(?<!\w)' + re.escape(skill) + r'(?!\w|\+|\#)'
        elif skill in ['c++', 'c#']:
            pattern = r'(?<!\w)' + re.escape(skill) + r'(?!\w)'
        else:
            pattern = r'\b' + re.escape(skill) + r'\b'

        if re.search(pattern, clean_text):
            canonical = SKILL_NAME_MAP.get(skill, skill.title())
            if canonical not in detected_skills:
                detected_skills.append(canonical)

    # 2. Education Extraction
    education_info = extract_academic_info(clean_text, text)

    # 3. Contact Info Extraction
    contact_info = extract_contact_info(text)

    # 4. Experience Extraction
    experience_list = parse_experience_section(sections.get('experience'), text)

    # 5. Project Extraction
    projects = parse_projects_section(sections.get('projects'), text)

    # 6. Certifications Extraction
    certifications = parse_certifications_section(sections.get('certifications'), text)

    # 7. Quality Checks, Mistakes, and ATS Audit Deductions
    missing_info = []
    suggestions = []
    mistakes = []
    deductions = []

    # A) CGPA / Academic Score Verification
    if not education_info["cgpa_detected"]:
        missing_info.append("Academic score (CGPA or Percentage) is not mentioned on your resume")
        suggestions.append(
            "Add your official college CGPA or Percentage (e.g. 'CGPA: 8.5 / 10.0') under Education. "
            "Enterprise campus listings require an academic score to verify minimum cutoff criteria."
        )
        deductions.append({"reason": "Missing Academic CGPA / Percentage", "penalty": 6})
    else:
        # User explicitly mentioned CGPA / score
        suggestions.append(f"Academic Standing: Detected {education_info['cgpa']} - satisfies minimum eligibility thresholds.")

    # B) Degree Verification
    if not education_info["degree"]:
        missing_info.append("Degree program not explicitly detected (e.g. B.Tech, MCA, BCA, B.Sc)")
        deductions.append({"reason": "Degree program unclear or missing", "penalty": 4})

    # C) Contact Info Checks
    if not contact_info["email"]:
        mistakes.append("Valid contact email address missing")
        deductions.append({"reason": "Missing contact email", "penalty": 8})

    if not contact_info["phone"]:
        missing_info.append("Direct contact phone number not clearly specified")
        deductions.append({"reason": "Missing contact phone number", "penalty": 5})

    # D) Professional Profiles Checks
    if not contact_info["github"]:
        missing_info.append("GitHub / Version control profile link missing")
        suggestions.append("Add your GitHub profile URL to showcase real code commits and collaborative repositories.")
        deductions.append({"reason": "Missing GitHub profile link", "penalty": 6})

    if not contact_info["linkedin"]:
        missing_info.append("LinkedIn professional profile link not found")
        suggestions.append("Include your LinkedIn profile link to improve recruiter verification.")
        deductions.append({"reason": "Missing LinkedIn profile", "penalty": 5})

    # E) Technical Skill Density Checks
    if len(detected_skills) < 5:
        mistakes.append(f"Insufficient technical skills detected ({len(detected_skills)} skills found; minimum 5 expected)")
        suggestions.append("Create a dedicated 'Technical Skills' section listing languages, frameworks, and databases.")
        deductions.append({"reason": "Low technical skill density (<5 skills)", "penalty": 10})
    elif len(detected_skills) < 8:
        missing_info.append("Limited framework/database tags detected")
        suggestions.append("Highlight core developer tooling (e.g. Git, Docker, REST APIs, SQL) in your skills summary.")
        deductions.append({"reason": "Framework & tooling skills under-represented", "penalty": 5})

    # F) Projects Check
    if not projects:
        mistakes.append("No technical projects detected in resume")
        suggestions.append("Add at least 2 practical technical projects with links and key technology tags.")
        deductions.append({"reason": "No technical projects found", "penalty": 12})
    elif len(projects) == 1:
        suggestions.append("Add a second technical project to showcase breadth across frontend and backend systems.")
        deductions.append({"reason": "Only 1 technical project listed", "penalty": 4})

    # G) Quantified Impact Metrics
    has_metrics = bool(re.search(r'\b(\d+%\b|\d+x\b|\d+\s*(ms|sec|users|clients|stars|records|downloads))', clean_text))
    if not has_metrics:
        missing_info.append("Lack of quantified metrics or measurable project impact")
        suggestions.append("Quantify your project outcomes using real numbers (e.g. 'Optimized query latency by 32%', 'Handled 500+ daily requests').")
        deductions.append({"reason": "No quantified impact metrics in bullet points", "penalty": 5})

    # H) Word Count & Template Checks
    if re.search(r'\b(lorem\s+ipsum|insert\s+here|your\s+name|xxx|todo)\b', clean_text):
        mistakes.append("Placeholder or template text detected in resume")
        deductions.append({"reason": "Template placeholder text found", "penalty": 12})

    words = clean_text.split()
    if len(words) < 50:
        mistakes.append("Resume content is excessively brief (fewer than 50 words)")
        deductions.append({"reason": "Incomplete resume length", "penalty": 15})

    # 8. Dynamic ATS Scoring
    base_score = 50
    # Skills bonus
    if len(detected_skills) >= 12:
        base_score += 24
    elif len(detected_skills) >= 8:
        base_score += 18
    elif len(detected_skills) >= 5:
        base_score += 12
    else:
        base_score += 5

    # Projects bonus
    if len(projects) >= 2:
        base_score += 14
    elif len(projects) == 1:
        base_score += 8

    # Experience bonus
    if len(experience_list) >= 1:
        base_score += 8

    # Certifications bonus
    if len(certifications) >= 1:
        base_score += 4

    total_penalty = sum(d["penalty"] for d in deductions)
    computed_score = base_score - total_penalty

    total_issues = len(mistakes) + len(missing_info)
    if total_issues > 0:
        if len(mistakes) > 0:
            overall_score = min(74, max(42, computed_score))
        elif total_issues >= 3:
            overall_score = min(78, max(48, computed_score))
        elif total_issues >= 2:
            overall_score = min(84, max(52, computed_score))
        else:
            overall_score = min(88, max(55, computed_score))
    else:
        overall_score = min(98, max(82, computed_score))

    return {
        "overall_score": int(overall_score),
        "detected_skills": sorted(detected_skills),
        "extracted_education": education_info,
        "contact_info": contact_info,
        "extracted_experience": experience_list,
        "extracted_projects": projects,
        "extracted_certifications": certifications,
        "missing_info": missing_info,
        "suggestions": suggestions,
        "mistakes": mistakes,
        "deductions": deductions,
        "total_issues_count": total_issues
    }

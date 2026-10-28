from .matcher import calculate_internship_match

def rank_applicants_for_internship(internship, applications_queryset):
    """
    Ranks applicants for a given company internship with explicit multi-attribute breakdowns.
    """
    ranked = []

    for app in applications_queryset:
        student = app.student
        resume = getattr(student, 'resume', None)

        match_data = calculate_internship_match(student, resume, internship)
        
        # Breakdown metrics
        skills_score = match_data['skill_score']
        education_score = match_data['cgpa_score']
        
        # Experience score evaluation
        exp_count = len(student.programming_languages or []) + len(student.tools or [])
        experience_score = min(100.0, 60.0 + (exp_count * 8.0))

        overall_score = match_data['match_score']
        
        # Update application match_score in database if needed
        app.match_score = overall_score
        app.match_reason = match_data['reason']
        app.save(update_fields=['match_score', 'match_reason'])

        ranked.append({
            "application_id": app.id,
            "student_id": student.id,
            "student_name": student.full_name,
            "college": student.college or "University Student",
            "degree": student.degree or "B.Tech",
            "branch": student.branch or "CS/IT",
            "cgpa": student.cgpa,
            "skills": student.skills,
            "resume_url": resume.file_path.url if (resume and resume.file_path) else None,
            "resume_score": resume.overall_score if resume else 0,
            "match_score": overall_score,
            "skills_score": skills_score,
            "education_score": education_score,
            "experience_score": round(experience_score, 1),
            "match_reason": match_data['reason'],
            "applied_at": app.applied_at.strftime("%Y-%m-%d %H:%M"),
            "status": app.status
        })

    # Sort descending by match_score
    ranked.sort(key=lambda x: x['match_score'], reverse=True)
    return ranked

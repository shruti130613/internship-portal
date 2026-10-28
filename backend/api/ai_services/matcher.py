def calculate_internship_match(student_profile, resume_obj, internship):
    """
    Calculates explainable AI Match Score (0 - 100%) between a student and an internship posting.
    """
    # 1. Skill Match Calculation
    student_skills = set(s.lower().strip() for s in (student_profile.skills or []))
    if resume_obj and resume_obj.detected_skills:
        for r_skill in resume_obj.detected_skills:
            student_skills.add(r_skill.lower().strip())

    req_skills = set(s.lower().strip() for s in (internship.required_skills or []))
    pref_skills = set(s.lower().strip() for s in (internship.preferred_skills or []))
    all_job_skills = req_skills.union(pref_skills)

    if not all_job_skills:
        skill_score = 75.0
        matched_skills = list(student_skills)
        missing_skills = []
    else:
        matched_required = student_skills.intersection(req_skills)
        matched_preferred = student_skills.intersection(pref_skills)
        
        req_ratio = len(matched_required) / len(req_skills) if req_skills else 1.0
        pref_ratio = len(matched_preferred) / len(pref_skills) if pref_skills else 1.0
        
        skill_score = (req_ratio * 75.0) + (pref_ratio * 25.0)
        matched_skills = [s.title() for s in matched_required.union(matched_preferred)]
        missing_skills = [s.title() for s in req_skills.difference(student_skills)]

    # 2. CGPA Score
    min_cgpa = internship.min_cgpa or 0.0
    student_cgpa = student_profile.cgpa or 0.0
    if student_cgpa >= min_cgpa:
        cgpa_score = 100.0
    else:
        cgpa_score = max(0.0, (student_cgpa / min_cgpa) * 100.0) if min_cgpa > 0 else 100.0

    # 3. Location Score
    work_mode = (internship.work_mode or 'Remote').lower()
    job_loc = (internship.location or 'Remote').lower()
    pref_loc = (student_profile.preferred_location or 'Remote').lower()

    if work_mode == 'remote' or 'remote' in job_loc or pref_loc in job_loc:
        location_score = 100.0
    else:
        location_score = 60.0

    # 4. Role Score
    pref_role = (student_profile.preferred_role or '').lower()
    job_title = (internship.title or '').lower()
    if pref_role and (pref_role in job_title or job_title in pref_role):
        role_score = 100.0
    elif pref_role:
        role_score = 70.0
    else:
        role_score = 80.0

    # Composite Weighted Total
    total_match = (0.50 * skill_score) + (0.20 * cgpa_score) + (0.15 * location_score) + (0.15 * role_score)
    final_score = round(min(100.0, max(20.0, total_match)), 1)

    # Human Readable Rationale Explanation
    matched_str = ", ".join(matched_skills[:4]) if matched_skills else "general profile background"
    if final_score >= 80:
        reason = f"Strong match ({final_score}%): Your skills in {matched_str} closely align with the job requirements. Your CGPA of {student_cgpa} meets the {min_cgpa} threshold."
    elif final_score >= 65:
        reason = f"Good match ({final_score}%): You possess core skills like {matched_str}. Consider acquiring missing skills ({', '.join(missing_skills[:2])}) to boost candidacy."
    else:
        reason = f"Moderate match ({final_score}%): Partial skill match in {matched_str}. Key required skills missing: {', '.join(missing_skills[:3])}."

    return {
        "match_score": final_score,
        "reason": reason,
        "skill_score": round(skill_score, 1),
        "cgpa_score": round(cgpa_score, 1),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    }

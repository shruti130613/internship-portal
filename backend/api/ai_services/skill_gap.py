def analyze_skill_gap(student_skills, target_required_skills, target_preferred_skills=None):
    if not target_preferred_skills:
        target_preferred_skills = []

    s_skills = set(s.lower().strip() for s in student_skills)
    r_skills = set(s.lower().strip() for s in target_required_skills)
    p_skills = set(s.lower().strip() for s in target_preferred_skills)

    strong_skills = [s.title() for s in s_skills.intersection(r_skills.union(p_skills))]
    missing_required = [s.title() for s in r_skills.difference(s_skills)]
    missing_preferred = [s.title() for s in p_skills.difference(s_skills)]

    # Recommendation map for common tech skills
    LEARNING_RESOURCES = {
        "Docker": "Learn Containerization & Dockerizing Django/React apps on Docker Docs / freeCodeCamp.",
        "Kubernetes": "Master Container Orchestration & Pod deployment basics.",
        "AWS": "Study AWS EC2, S3 bucket storage & IAM basics.",
        "React": "Practice React Hooks, Context API, and state management.",
        "Django": "Build Django REST Framework APIs, ORM queries & JWT auth.",
        "SQL": "Practice complex SQL JOINs, GROUP BY, indexes & query optimization.",
        "Power BI": "Build interactive data dashboards & DAX formulas.",
        "Tableau": "Learn data visualization charts & calculated fields.",
        "Machine Learning": "Practice Scikit-learn regression, classification & model evaluation.",
        "Git": "Master Git branch management, pull requests & conflict resolution.",
        "TypeScript": "Learn strong typing, interfaces & generics in React/Node."
    }

    recommended_plan = []
    for skill in missing_required + missing_preferred:
        for key, text in LEARNING_RESOURCES.items():
            if key.lower() in skill.lower():
                recommended_plan.append({"skill": skill, "resource": text})
                break
        else:
            recommended_plan.append({
                "skill": skill,
                "resource": f"Complete hands-on tutorials and documentation for {skill} to fulfill core position requirements."
            })

    return {
        "strong_skills": strong_skills,
        "missing_required_skills": missing_required,
        "missing_preferred_skills": missing_preferred,
        "total_missing_count": len(missing_required) + len(missing_preferred),
        "recommended_plan": recommended_plan
    }

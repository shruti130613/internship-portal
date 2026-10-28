DEFAULT_QUESTION_BANK = [
    # ==================== PYTHON DEVELOPER (15 Questions: 5 Basic, 5 Medium, 5 Advanced) ====================
    # --- LEVEL 1: BASIC FUNDAMENTALS (Q1-5) ---
    {
        "role": "Python Developer",
        "question": "Which of the following data structures in Python is immutable?",
        "a": "List", "b": "Dictionary", "c": "Tuple", "d": "Set",
        "correct": "C", "tag": "Python Fundamentals", "diff": "BASIC"
    },
    {
        "role": "Python Developer",
        "question": "What will bool([]) evaluate to in Python?",
        "a": "True", "b": "False", "c": "None", "d": "TypeError",
        "correct": "B", "tag": "Python Fundamentals", "diff": "BASIC"
    },
    {
        "role": "Python Developer",
        "question": "Which built-in Python function is used to check the length of a list or string?",
        "a": "count()", "b": "length()", "c": "len()", "d": "size()",
        "correct": "C", "tag": "Python Fundamentals", "diff": "BASIC"
    },
    {
        "role": "Python Developer",
        "question": "What is the correct keyword used to define a function in Python?",
        "a": "def", "b": "function", "c": "func", "d": "define",
        "correct": "A", "tag": "Python Fundamentals", "diff": "BASIC"
    },
    {
        "role": "Python Developer",
        "question": "Which operator is used for integer floor division in Python?",
        "a": "/", "b": "//", "c": "%", "d": "^",
        "correct": "B", "tag": "Python Fundamentals", "diff": "BASIC"
    },

    # --- LEVEL 2: LOGICAL & INTERMEDIATE (Q6-10) ---
    {
        "role": "Python Developer",
        "question": "What is the primary function of Django's select_related() method?",
        "a": "Executes raw SQL directly",
        "b": "Performs a SQL JOIN to fetch foreign key objects in a single query",
        "c": "Creates a new database table",
        "d": "Deletes duplicate rows",
        "correct": "B", "tag": "Django Framework", "diff": "MEDIUM"
    },
    {
        "role": "Python Developer",
        "question": "In Python REST APIs, what HTTP method is idempotent and used to replace an entire resource?",
        "a": "POST", "b": "PUT", "c": "PATCH", "d": "DELETE",
        "correct": "B", "tag": "REST API Architecture", "diff": "MEDIUM"
    },
    {
        "role": "Python Developer",
        "question": "Which decorator in Python is used to convert a method into a read-only property?",
        "a": "@classmethod", "b": "@staticmethod", "c": "@property", "d": "@setter",
        "correct": "C", "tag": "OOP & Decorators", "diff": "MEDIUM"
    },
    {
        "role": "Python Developer",
        "question": "What is the output of the list comprehension: [x*2 for x in range(4) if x % 2 == 0]?",
        "a": "[0, 4]", "b": "[0, 2, 4, 6]", "c": "[2, 6]", "d": "[0, 1, 2, 3]",
        "correct": "A", "tag": "Python Logic", "diff": "MEDIUM"
    },
    {
        "role": "Python Developer",
        "question": "How does Python handle memory management for objects whose reference count drops to zero?",
        "a": "Requires manual free() execution",
        "b": "Reclaims memory automatically via Reference Counting & Garbage Collection",
        "c": "Waits until application shutdown",
        "d": "Moves memory to swap disk space",
        "correct": "B", "tag": "Memory & Runtime", "diff": "MEDIUM"
    },

    # --- LEVEL 3: ADVANCED & INDUSTRY STANDARD (Q11-15) ---
    {
        "role": "Python Developer",
        "question": "In async Python (FastAPI/ASGI), what happens if a blocking CPU-bound sync function is run directly inside an async def endpoint?",
        "a": "FastAPI auto-spawns a CPU core thread",
        "b": "It blocks the main asyncio event loop, stalling concurrent requests",
        "c": "It raises an AsyncExecutionError",
        "d": "It runs in parallel without issue",
        "correct": "B", "tag": "Async Architecture", "diff": "ADVANCED"
    },
    {
        "role": "Python Developer",
        "question": "How does Django's @transaction.atomic decorator ensure database integrity in financial payment transactions?",
        "a": "Encrypts all SQL queries with AES-256",
        "b": "Encloses operations in a database transaction block and performs a rollback on any unhandled exception",
        "c": "Prevents read operations on database tables",
        "d": "Caches transaction responses in Redis",
        "correct": "B", "tag": "Production Systems", "diff": "ADVANCED"
    },
    {
        "role": "Python Developer",
        "question": "When optimizing PostgreSQL query performance for a Django model with millions of rows, which database index is ideal for exact equality and range queries on datetime fields?",
        "a": "B-Tree Index", "b": "GIN Index", "c": "Hash Index", "d": "BRIN Index",
        "correct": "A", "tag": "Database Optimization", "diff": "ADVANCED"
    },
    {
        "role": "Python Developer",
        "question": "What is the key difference between Python's threading and multiprocessing modules under CPython regarding CPU-bound parallel workloads?",
        "a": "Threading uses multi-core CPUs; multiprocessing uses single-core",
        "b": "Threading is constrained by GIL; multiprocessing spawns separate OS processes bypassing GIL",
        "c": "Multiprocessing shares memory space across threads automatically",
        "d": "Threading is deprecated in Python 3",
        "correct": "B", "tag": "Concurrency & GIL", "diff": "ADVANCED"
    },
    {
        "role": "Python Developer",
        "question": "In enterprise backend microservices, what role does a Celery worker paired with Redis/RabbitMQ perform?",
        "a": "Serves static HTML files",
        "b": "Offloads heavy background tasks (e.g. email sending, PDF generation) asynchronously outside HTTP request cycles",
        "c": "Acts as an API Gateway router",
        "d": "Replaces PostgreSQL database storage",
        "correct": "B", "tag": "Distributed Systems", "diff": "ADVANCED"
    },


    # ==================== FRONTEND DEVELOPER (15 Questions: 5 Basic, 5 Medium, 5 Advanced) ====================
    # --- LEVEL 1: BASIC FUNDAMENTALS (Q1-5) ---
    {
        "role": "Frontend Developer",
        "question": "Which React hook is used to manage local component state?",
        "a": "useEffect", "b": "useState", "c": "useContext", "d": "useReducer",
        "correct": "B", "tag": "React Basics", "diff": "BASIC"
    },
    {
        "role": "Frontend Developer",
        "question": "Which CSS flexbox property aligns flex items along the main axis?",
        "a": "align-items", "b": "justify-content", "c": "align-content", "d": "flex-direction",
        "correct": "B", "tag": "CSS & Layout", "diff": "BASIC"
    },
    {
        "role": "Frontend Developer",
        "question": "What HTML tag is used to embed an external JavaScript file into a web page?",
        "a": "<script src=\"...\">", "b": "<js href=\"...\">", "c": "<link src=\"...\">", "d": "<code path=\"...\">",
        "correct": "A", "tag": "HTML & Web", "diff": "BASIC"
    },
    {
        "role": "Frontend Developer",
        "question": "What is the default value of the position CSS property for HTML elements?",
        "a": "relative", "b": "absolute", "c": "static", "d": "fixed",
        "correct": "C", "tag": "CSS & Layout", "diff": "BASIC"
    },
    {
        "role": "Frontend Developer",
        "question": "Which JavaScript array method creates a new array containing all elements that pass a test function?",
        "a": "map()", "b": "filter()", "c": "forEach()", "d": "reduce()",
        "correct": "B", "tag": "JavaScript Core", "diff": "BASIC"
    },

    # --- LEVEL 2: LOGICAL & INTERMEDIATE (Q6-10) ---
    {
        "role": "Frontend Developer",
        "question": "Which React hook is used to handle side effects such as data fetching or DOM subscriptions?",
        "a": "useState", "b": "useEffect", "c": "useContext", "d": "useRef",
        "correct": "B", "tag": "React Hooks", "diff": "MEDIUM"
    },
    {
        "role": "Frontend Developer",
        "question": "What is the primary purpose of the 'key' prop when rendering dynamic lists in React?",
        "a": "To style list items with unique CSS classes",
        "b": "To give React a way to identify which items have changed, added, or removed for DOM diffing",
        "c": "To encrypt state variables",
        "d": "To trigger automatic page reloads",
        "correct": "B", "tag": "React Reconciliation", "diff": "MEDIUM"
    },
    {
        "role": "Frontend Developer",
        "question": "What is the return value of typeof NaN in JavaScript?",
        "a": "'number'", "b": "'nan'", "c": "'undefined'", "d": "'object'",
        "correct": "A", "tag": "JavaScript Types", "diff": "MEDIUM"
    },
    {
        "role": "Frontend Developer",
        "question": "How does Event Delegation work in modern JavaScript DOM manipulation?",
        "a": "Attaches separate listeners to every DOM element on the page",
        "b": "Attaches a single listener to a parent element to handle events on child descendants via event bubbling",
        "c": "Cancels all browser click events",
        "d": "Executes JavaScript in a Web Worker",
        "correct": "B", "tag": "DOM & Events", "diff": "MEDIUM"
    },
    {
        "role": "Frontend Developer",
        "question": "What is the key difference between == and === in JavaScript?",
        "a": "== checks type only; === checks value only",
        "b": "=== checks both value and strict type without type coercion, while == performs loose type coercion",
        "c": "There is no difference in ES6",
        "d": "=== works only on numbers",
        "correct": "B", "tag": "JavaScript Core", "diff": "MEDIUM"
    },

    # --- LEVEL 3: ADVANCED & INDUSTRY STANDARD (Q11-15) ---
    {
        "role": "Frontend Developer",
        "question": "In React 19 / Modern React Architecture, what is the core architectural benefit of React Server Components (RSCs)?",
        "a": "Replaces all client-side JavaScript with WebAssembly",
        "b": "Executes exclusively on the server, sending zero client JS bundle overhead for rendered static subtrees",
        "c": "Forces all state to be saved in LocalStorage",
        "d": "Disables CSS styling on the client",
        "correct": "B", "tag": "React Architecture", "diff": "ADVANCED"
    },
    {
        "role": "Frontend Developer",
        "question": "How do you prevent unnecessary re-renders of expensive child components in React when passing function props?",
        "a": "Use standard inline arrow functions in JSX",
        "b": "Wrap callback functions in useCallback hook and memoize child components using React.memo",
        "c": "Store callbacks inside global window object",
        "d": "Set state directly inside render method",
        "correct": "B", "tag": "Performance Optimization", "diff": "ADVANCED"
    },
    {
        "role": "Frontend Developer",
        "question": "How does the Web Vitals metric 'Cumulative Layout Shift' (CLS) impact user experience and SEO rankings?",
        "a": "Measures total network request size in KB",
        "b": "Measures visual layout instability caused by unexpected layout shifts during page loading",
        "c": "Measures server response latency in ms",
        "d": "Measures time taken for JavaScript execution",
        "correct": "B", "tag": "Web Vitals & Performance", "diff": "ADVANCED"
    },
    {
        "role": "Frontend Developer",
        "question": "In modern Progressive Web Apps (PWA), how does a Service Worker enable offline access and caching?",
        "a": "Modifies server database directly",
        "b": "Acts as a programmable background network proxy in the browser that intercepts fetch requests and serves cached assets",
        "c": "Overwrites local cookie data",
        "d": "Runs inside Node.js server instance",
        "correct": "B", "tag": "PWA & Browser APIs", "diff": "ADVANCED"
    },
    {
        "role": "Frontend Developer",
        "question": "When securing web applications against Cross-Site Scripting (XSS) attacks, what is the most effective browser-enforced security header?",
        "a": "Access-Control-Allow-Origin",
        "b": "Content-Security-Policy (CSP)",
        "c": "X-Frame-Options",
        "d": "Strict-Transport-Security",
        "correct": "B", "tag": "Web Security", "diff": "ADVANCED"
    }
]

def evaluate_test_submission(user_answers, questions):
    """
    Evaluates user test answers maps (question_id -> selected_option 'A'/'B'/'C'/'D').
    Returns score, percentage, topic breakdown, difficulty performance, and explainable AI feedback.
    """
    total = len(questions)
    if total == 0:
        return {"score": 0, "percentage": 0.0, "status": "FAILED", "topic_breakdown": {}, "feedback": "No questions answered."}

    correct_count = 0
    topic_stats = {}
    diff_stats = {"BASIC": {"total": 0, "correct": 0}, "MEDIUM": {"total": 0, "correct": 0}, "ADVANCED": {"total": 0, "correct": 0}}

    for q in questions:
        q_id = str(q.id)
        selected = user_answers.get(q_id, '').upper()
        tag = q.skill_tag or 'General'
        diff = getattr(q, 'difficulty', 'MEDIUM').upper()

        if diff not in diff_stats:
            diff_stats[diff] = {"total": 0, "correct": 0}

        if tag not in topic_stats:
            topic_stats[tag] = {"total": 0, "correct": 0}

        topic_stats[tag]["total"] += 1
        diff_stats[diff]["total"] += 1

        if selected == q.correct_option.upper():
            correct_count += 1
            topic_stats[tag]["correct"] += 1
            diff_stats[diff]["correct"] += 1

    percentage = round((correct_count / total) * 100.0, 1)
    status = "PASSED" if percentage >= 60.0 else "FAILED"

    # Compute topic percentage accuracy
    topic_breakdown = {}
    for tag, stats in topic_stats.items():
        acc = round((stats["correct"] / stats["total"]) * 100.0, 1)
        topic_breakdown[tag] = acc

    # Generate AI Feedback Report
    strong_topics = [t for t, acc in topic_breakdown.items() if acc >= 75.0]
    weak_topics = [t for t, acc in topic_breakdown.items() if acc < 60.0]

    feedback_lines = []
    if percentage >= 80.0:
        feedback_lines.append(f"Outstanding performance ({percentage}%)! You demonstrated strong technical mastery across Basic, Medium, and Advanced levels.")
    elif percentage >= 60.0:
        feedback_lines.append(f"Good performance ({percentage}%). You passed the assessment threshold.")
    else:
        feedback_lines.append(f"Test result ({percentage}%) fell below passing threshold (60%). Focused revision recommended.")

    if strong_topics:
        feedback_lines.append(f"Strong topic areas: {', '.join(strong_topics)}.")
    if weak_topics:
        feedback_lines.append(f"Recommended practice areas: {', '.join(weak_topics)}.")

    return {
        "score": correct_count,
        "total_questions": total,
        "percentage": percentage,
        "status": status,
        "topic_breakdown": topic_breakdown,
        "feedback": " ".join(feedback_lines)
    }

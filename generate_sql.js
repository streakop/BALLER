const fs = require('fs');

const data = {
  "course_categories": [
    {
      "category": "Programme Core",
      "courses": [
        { "code": "CSE2001", "title": "Object Oriented Programming With C++" },
        { "code": "CSE2002", "title": "Data Structures and Algorithms" },
        { "code": "CSE2003", "title": "Computer Architecture and Organization" },
        { "code": "CSE2004", "title": "Theory Of Computation And Compiler Design" },
        { "code": "CSE3001", "title": "Database Management Systems" },
        { "code": "CSE3003", "title": "Operating System" },
        { "code": "CSE3004", "title": "Design Analysis Of Algorithm" },
        { "code": "CSE3005", "title": "Software Engineering" },
        { "code": "CSE3006", "title": "Computer Networks" },
        { "code": "CSE3009", "title": "Parallel and Distributed Computing" },
        { "code": "CSE3011", "title": "Python Programming" },
        { "code": "CSE4001", "title": "Internet and Web Programming" },
        { "code": "ECE2002", "title": "Digital Logic Design" },
        { "code": "ECE3004", "title": "Microprocessors And Microcontrollers" }
      ]
    },
    {
      "category": "Programme Elective",
      "courses": [
        { "code": "CCA3011", "title": "Internet of Things" },
        { "code": "CHI2007", "title": "Healthcare Information Systems" },
        { "code": "CSA3004", "title": "Data Visualization" },
        { "code": "CSA3005", "title": "Cloud Computing" },
        { "code": "CSA3017", "title": "Knowledge Engineering" },
        { "code": "CSA4003", "title": "Data Mining And Data Warehousing" },
        { "code": "CSA4011", "title": "Information Retrieval and Web Search" },
        { "code": "CSD4002", "title": "Ethical Hacking" },
        { "code": "CSD4008", "title": "Cyber Security Framework" },
        { "code": "CSD5002", "title": "Virtualization Essentials" },
        { "code": "CSD5008", "title": "Forensic Science" },
        { "code": "CSE3008", "title": "Soft Computing" },
        { "code": "CSE3010", "title": "Computer Vision" },
        { "code": "CSE3012", "title": "Mobile Application Development" },
        { "code": "CSE3013", "title": "Agile Software Development" },
        { "code": "CSE3014", "title": "Medical Imaging" },
        { "code": "CSE3015", "title": "AWS Cloud Practitioner" },
        { "code": "CSE3016", "title": "AWS Solution Architect" },
        { "code": "CSE3017", "title": "Salesforce" },
        { "code": "CSE4003", "title": "Bigdata Analytics" },
        { "code": "CSE4005", "title": "Machine Learning" },
        { "code": "CSE4012", "title": "Software Defined Network" },
        { "code": "CSE4016", "title": "Software Project Management" },
        { "code": "CSE4017", "title": "Software Testing" },
        { "code": "CSE4019", "title": "Advanced Java Programming" },
        { "code": "CSG2001", "title": "Augmented Reality and Virtual Reality" },
        { "code": "ECE4007", "title": "Wireless Sensor Networks" },
        { "code": "ECE4010", "title": "Embedded Systems" },
        { "code": "ECE6012", "title": "PATTERN RECOGNITION AND IMAGE ANALYSIS" },
        { "code": "MAT2009", "title": "Applied Cryptography" },
        { "code": "MAT5004", "title": "Mathematical Foundations for Cybersecurity" }
      ]
    },
    {
      "category": "University Core - Natural Science Core",
      "courses": [
        { "code": "CHY1001", "title": "ENGINEERING CHEMISTRY" },
        { "code": "MAT1001", "title": "Calculus and Laplace Transforms" },
        { "code": "MAT2002", "title": "Discrete Mathematics And Graph Theory" },
        { "code": "MAT3002", "title": "Applied Linear Algebra" },
        { "code": "MAT3003", "title": "Probability, Statistics And Reliability" },
        { "code": "PHY1001", "title": "ENGINEERING PHYSICS" }
      ]
    },
    {
      "category": "University Core - Basic Engineering Sciences Core",
      "courses": [
        { "code": "CSA2001", "title": "Fundamentals in Al & ML" },
        { "code": "EEE1001", "title": "Electric Circuits and Systems" },
        { "code": "MEE2014", "title": "Engineering Design and Modelling" }
      ]
    },
    {
      "category": "University Core - Skill Development Courses",
      "courses": [
        { "code": "CSE1021", "title": "Introduction to Problem Solving and Programming" },
        { "code": "CSE2006", "title": "Programming in Java" },
        { "code": "PLA1004", "title": "Competitive Coding Practices" },
        { "code": "PLA1006", "title": "Lateral Thinking" },
        { "code": "SST1003", "title": "Professional Communication Skills for Engineers" },
        { "code": "SST2003", "title": "Dynamics of workplace communication Skills" }
      ]
    },
    {
      "category": "University Core - Humanities Social Science and Management Core",
      "courses": [
        { "code": "CHY1006", "title": "Environmental Sustainability" },
        { "code": "ENG1004", "title": "EFFECTIVE TECHNICAL COMMUNICATION" },
        { "code": "ENG2005", "title": "Advanced Technical Communication" }
      ]
    },
    {
      "category": "University Core - Project and Internships",
      "courses": [
        { "code": "DSN2092", "title": "SUMMER INDUSTRIAL INTERNSHIP" },
        { "code": "DSN2093", "title": "SEMESTER INTERNSHIP" },
        { "code": "DSN2098", "title": "Project Exhibition - I" },
        { "code": "DSN2099", "title": "Project Exhibition - II" },
        { "code": "DSN3099", "title": "Engineering Project in Community Service" },
        { "code": "DSN4091", "title": "Capstone Project - Phase 1" },
        { "code": "DSN4092", "title": "Capstone Project - Phase 2" }
      ]
    },
    {
      "category": "University Elective - Open Electives",
      "courses": [
        { "code": "CEC2001", "title": "Introduction To E-Commerce" },
        { "code": "CHY1005", "title": "Introduction to Computational chemistry" },
        { "code": "CHY1007", "title": "Forensic Chernistry and Applications" },
        { "code": "CSA3020", "title": "Generative Al" },
        { "code": "CSD1001", "title": "Principles Of Digital Forensics" },
        { "code": "MAT1031", "title": "Introduction to calculus" },
        { "code": "MEE1002", "title": "Engineering Mechanics" },
        { "code": "MEE1006", "title": "Basic workshop" },
        { "code": "ONL1022", "title": "Industrial IoT Markets and Security" },
        { "code": "ONL1028", "title": "The Bits and Bytes of Computer Networking" },
        { "code": "ONL1032", "title": "IBM AI Engineering Professional Certificate" },
        { "code": "PHY1003", "title": "Introduction to Computational Physics" }
      ]
    },
    {
      "category": "Non-Graded Mandatory Courses",
      "courses": [
        { "code": "CSE0001", "title": "Digital Literacy" },
        { "code": "CSE0002", "title": "OPEN SOURCE SOFTWARE (LINUX ADMINISTRATION)" },
        { "code": "EXC0001", "title": "EXTRA CURRICULAR ACTIVITIES" },
        { "code": "HUM0002", "title": "Swachh Bharat" },
        { "code": "HUM0003", "title": "INDIAN CONSTITUTION" },
        { "code": "HUM0004", "title": "INDIAN HERITAGE" },
        { "code": "UHV0001", "title": "Universal Human Values - 1" },
        { "code": "UHV0002", "title": "Universal Human Values - II" }
      ]
    }
  ]
};

let sql = "INSERT INTO subjects (code, name, semester) VALUES\n";
const values = [];

data.course_categories.forEach(cat => {
  cat.courses.forEach(course => {
    // Escape single quotes in names
    const safeName = course.title.replace(/'/g, "''");
    
    // Guess semester based on course code digit (1st digit if available)
    const match = course.code.match(/\d/);
    let semester = 1;
    if (match) {
      const year = parseInt(match[0]);
      semester = Math.max(1, year * 2 - 1);
    }

    values.push(`('${course.code}', '${safeName}', ${semester})`);
  });
});

sql += values.join(",\n") + ";\n";

fs.writeFileSync('C:/Users/SATYAM/PYQ/seed_subjects.sql', sql);
console.log("SQL generated at seed_subjects.sql");

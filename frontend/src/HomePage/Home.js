import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faMoon,
  faSun,
  faLaptopCode,
  faDatabase,
  faRobot,
  faBrain,
  faBroadcastTower,
  faBolt,
  faCogs,
  faHardHat,
  faDraftingCompass,
  faGraduationCap,
  faBook,
  faBookOpen,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import { createClient } from "@supabase/supabase-js"; // For Supabase client initialization (even if not for auth)

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [section, setSection] = useState("home");
  const [selectedDep, setSelectedDep] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [pdfStorage, setPdfStorage] = useState({});
  const [noteTitle, setNoteTitle] = useState(""); // New state for note title
  const [userNotes, setUserNotes] = useState([]); // New state for user-specific notes
  const isPopState = useRef(false);

  // Subjects and Units organized by department -> semester -> subjects -> units
  const departmentData = {
    "Computer Science": {
      "1 Semester": {
        "Mathematics I": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Physics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Programming in C": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Basic Electrical": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Engineering Graphics": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
      },
      "2 Semester": {
        "Mathematics II": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Chemistry: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Data Structures": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Electronics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Mechanics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
      },
      "3 Semester": {
        "Mathematics III": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Physics II": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        OOP: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Electrical Machines": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
        "Engineering Drawing": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
      },
      "4 Semester": {},
      "5 Semester": {},
      "6 Semester": {},
      "7 Semester": {},
      "8 Semester": {},
    },
    "Information Science": {
      "1 Semester": {
        "Mathematics I": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Physics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Programming Basics": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
        "Digital Logic": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Engineering Graphics": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
      },
      "2 Semester": {},
    },
    AIML: {
      "1 Semester": {
        "Mathematics I": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Physics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Programming in C": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Basic Electrical": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Engineering Graphics": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
      },
      "2 Semester": {
        "Mathematics II": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Chemistry: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Data Structures": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Electronics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Mechanics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
      },
      "3 Semester": {
        "Mathematics III": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Physics II": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        OOP: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Electrical Machines": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
        "Engineering Drawing": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
      },
      "4 Semester": {},
      "5 Semester": {},
      "6 Semester": {},
      "7 Semester": {},
      "8 Semester": {},
    },
    AIDS: {
      "1 Semester": {
        "Mathematics I": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Physics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Programming in C": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Basic Electrical": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Engineering Graphics": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
      },
      "2 Semester": {
        "Mathematics II": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Chemistry: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Data Structures": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Electronics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Mechanics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
      },
      "3 Semester": {
        "Mathematics III": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Physics II": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        OOP: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Electrical Machines": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
        "Engineering Drawing": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
      },
      "4 Semester": {},
      "5 Semester": {},
      "6 Semester": {},
      "7 Semester": {},
      "8 Semester": {},
    },
    ECE: {
      "1 Semester": {
        "Mathematics I": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Physics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Programming in C": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Basic Electrical": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Engineering Graphics": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
      },
      "2 Semester": {
        "Mathematics II": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Chemistry: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Data Structures": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Electronics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Mechanics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
      },
      "3 Semester": {
        "Mathematics III": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Physics II": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        OOP: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Electrical Machines": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
        "Engineering Drawing": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
      },
      "4 Semester": {},
      "5 Semester": {},
      "6 Semester": {},
      "7 Semester": {},
      "8 Semester": {},
    },
    EEE: {
      "1 Semester": {
        "Mathematics I": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Physics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Programming in C": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Basic Electrical": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Engineering Graphics": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
      },
      "2 Semester": {
        "Mathematics II": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Chemistry: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Data Structures": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Electronics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Mechanics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
      },
      "3 Semester": {
        "Mathematics III": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Physics II": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        OOP: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Electrical Machines": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
        "Engineering Drawing": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
      },
      "4 Semester": {},
      "5 Semester": {},
      "6 Semester": {},
      "7 Semester": {},
      "8 Semester": {},
    },
    Mechanical: {
      "1 Semester": {
        "Mathematics I": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Physics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Programming in C": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Basic Electrical": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Engineering Graphics": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
      },
      "2 Semester": {
        "Mathematics II": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Chemistry: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Data Structures": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Electronics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Mechanics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
      },
      "3 Semester": {
        "Mathematics III": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Physics II": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        OOP: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Electrical Machines": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
        "Engineering Drawing": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
      },
      "4 Semester": {},
      "5 Semester": {},
      "6 Semester": {},
      "7 Semester": {},
      "8 Semester": {},
    },
    Civil: {
      "1 Semester": {
        "Mathematics I": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Physics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Programming in C": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Basic Electrical": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Engineering Graphics": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
      },
      "2 Semester": {
        "Mathematics II": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Chemistry: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Data Structures": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Electronics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        Mechanics: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
      },
      "3 Semester": {
        "Mathematics III": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Physics II": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        OOP: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
        "Electrical Machines": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
        "Engineering Drawing": [
          "Unit 1",
          "Unit 2",
          "Unit 3",
          "Unit 4",
          "Unit 5",
        ],
      },
      "4 Semester": {},
      "5 Semester": {},
      "6 Semester": {},
      "7 Semester": {},
      "8 Semester": {},
    },
    Architecture: {
      "1 Semester": {},
      "2 Semester": {},
      "3 Semester": {},
      "4 Semester": {},
      "5 Semester": {},
      "6 Semester": {},
      "7 Semester": {},
      "8 Semester": {},
      "9 Semester": {},
      "10 Semester": {},
    },
  };

  // Fetch user-specific notes from Supabase storage
  useEffect(() => {
    const fetchUserNotes = async () => {
      const userId = localStorage.getItem("loggedInUserId");
      if (!userId) {
        setUserNotes([]);
        return;
      }

      try {
        const { data, error } = await supabase.storage
          .from("notes-pdfs")
          .list(""); // Fetch all files

        if (error) {
          console.error("Error fetching user notes from Supabase:", error);
          return;
        }

        const notes = data.map((item) => {
          const filename = item.name;
          // No longer expect user_id prefix in filename, directly use the filename as display title
          const displayTitle = filename
            .substring(0, filename.lastIndexOf("."))
            .replace(/_/g, " "); // Extract and sanitize title

          const publicUrl = supabase.storage
            .from("notes-pdfs")
            .getPublicUrl(filename).data.publicUrl;
          return { name: displayTitle, url: publicUrl };
        });

        // Filter notes by user ID in the frontend (no longer needed as per latest instruction for displaying all notes)
        // const filteredNotes = notes.filter(note => note.url.includes(`/${userId}_`));
        setUserNotes(notes); // Display all notes
      } catch (error) {
        console.error("Unexpected error fetching user notes:", error);
      }
    };

    fetchUserNotes();
  }, [
    selectedDep,
    selectedYear,
    selectedSubject,
    selectedUnit,
    localStorage.getItem("loggedInUserId"),
  ]); // Added localStorage.getItem('loggedInUserId') as a dependency

  // Push and popstate handlers
  useEffect(() => {
    if (!isPopState.current && section !== "home") {
      window.history.pushState(
        { section, selectedDep, selectedYear, selectedSubject, selectedUnit },
        ""
      );
    }
    isPopState.current = false;
  }, [section, selectedDep, selectedYear, selectedSubject, selectedUnit]);

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        isPopState.current = true;
        setSection(event.state.section || "home");
        setSelectedDep(event.state.selectedDep || "");
        setSelectedYear(event.state.selectedYear || "");
        setSelectedSubject(event.state.selectedSubject || "");
        setSelectedUnit(event.state.selectedUnit || "");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const selectDepartment = (dep) => {
    setSelectedDep(dep);
    setSection("department");
  };
  const selectYear = (year) => {
    setSelectedYear(year);
    setSection("subjects");
  };
  const selectSubject = (sub) => {
    setSelectedSubject(sub);
    setSection("units");
  };
  const selectUnit = (unit) => {
    setSelectedUnit(unit);
    setSection("pdfs");
  };

  const handlePDFUpload = async (e) => {
    e.preventDefault();

    const file = e.target.elements["pdf-file"].files[0];
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    if (!noteTitle.trim()) {
      alert("Please enter a title for your note.");
      return;
    }

const userId = localStorage.getItem("loggedInUserId");
    const userName = localStorage.getItem("loggedInUserName");

    if (!userId || !userName) {
      alert("You must be logged in to upload notes.");
      return;
    }

    // Clean user ID before sending
    if (!userId) {
      alert("Invalid user ID.");
      return;
    }

    if (!selectedDep || !selectedYear || !selectedSubject || !selectedUnit) {
      alert("Please select department, semester, subject, and unit.");
      return;
    }

    const formData = new FormData();
    formData.append("note", file);
    formData.append("user_id", userId);
    formData.append("user_name", userName);
    formData.append("department", selectedDep);
    formData.append("semester", selectedYear);
    formData.append("subject", selectedSubject);
    formData.append("unit", selectedUnit);
    formData.append("title", noteTitle.trim());

    try {
      const response = await fetch("http://localhost:5001/notes/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        const key = `${selectedDep}-${selectedYear}-${selectedSubject}-${selectedUnit}`;
        setPdfStorage((prev) => ({
          ...prev,
          [key]: [...(prev[key] || []), file.name],
        }));
        e.target.reset();
      } else {
        alert(
          `Upload failed: ${data.error || data.message || "Unknown error"}`
        );
      }
    } catch (error) {
      alert(`An error occurred during upload: ${error.message}`);
    }
  };

  const getSubjects = () => departmentData[selectedDep]?.[selectedYear] || {};
  const getUnits = () => getSubjects()[selectedSubject] || [];

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      {/* Header */}
      <header>
        <div className="logo-and-title">
          <img className="logo" src="image/Logo.jpg" alt="Logo" />
          <h1>Univ Notes</h1>
        </div>
        <nav>
          <button
            onClick={() => {
              setSection("home");
              setSelectedDep("");
              setSelectedYear("");
              setSelectedSubject("");
              setSelectedUnit("");
            }}
          >
            Home
          </button>
          <button onClick={() => setSection("about")}>About Us</button>
          <button onClick={() => setSection("contact")}>Contact Us</button>
          <button className="profile-btn">
            <FontAwesomeIcon icon={faUserCircle} /> Profile
          </button>
          <button className="toggle-dark" onClick={toggleDarkMode}>
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
        </nav>
      </header>

      {/* Sections rendering */}
      {section === "home" && (
        <section id="home">
          <h2>Select Your Department</h2>
          <div className="grid">
            {Object.keys(departmentData).map((dep) => (
              <div
                key={dep}
                className="card"
                onClick={() => selectDepartment(dep)}
              >
                <FontAwesomeIcon
                  icon={
                    dep === "Computer Science"
                      ? faLaptopCode
                      : dep === "ECE"
                      ? faBroadcastTower
                      : dep === "AIML"
                      ? faRobot
                      : dep === "AIDS"
                      ? faBrain
                      : dep === "EEE"
                      ? faBolt
                      : dep === "Mechanical"
                      ? faCogs
                      : dep === "Civil"
                      ? faHardHat
                      : dep === "Architecture"
                      ? faDraftingCompass
                      : faDatabase
                  }
                />
                <h3>{dep}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {section === "department" && (
        <section>
          <button className="back-btn" onClick={() => setSection("home")}>
            Back to Home
          </button>
          <h2>{selectedDep}</h2>
          <div className="year-list">
            {Object.keys(departmentData[selectedDep]).map((year) => (
              <div
                key={year}
                className="year-item"
                onClick={() => selectYear(year)}
              >
                <FontAwesomeIcon icon={faGraduationCap} />
                <p>{year}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {section === "subjects" && (
        <section>
          <button className="back-btn" onClick={() => setSection("department")}>
            Back to Semesters
          </button>
          <h2>{selectedYear} - Subjects</h2>
          <div className="subject-list">
            {Object.keys(getSubjects()).map((sub) => (
              <div
                key={sub}
                className="year-item"
                onClick={() => selectSubject(sub)}
              >
                <FontAwesomeIcon icon={faBook} />
                <p>{sub}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {section === "units" && (
        <section>
          <button className="back-btn" onClick={() => setSection("subjects")}>
            Back to Subjects
          </button>
          <h2>{selectedSubject} - Units</h2>
          <div className="unit-list">
            {getUnits().map((unit) => (
              <div
                key={unit}
                className="year-item"
                onClick={() => selectUnit(unit)}
              >
                <FontAwesomeIcon icon={faBookOpen} />
                <p>{unit}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {section === "pdfs" && (
        <section>
          <button className="back-btn" onClick={() => setSection("units")}>
            Back to Units
          </button>
          <h2>{selectedUnit} - PDFs</h2>
          <form onSubmit={handlePDFUpload} className="upload-form">
            <input
              type="text"
              placeholder="Enter Note Title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              required
              className="note-title-input"
            />
            <input type="file" id="pdf-file" accept=".pdf" required />
            <button type="submit">Upload</button>
          </form>
          <div className="pdf-list">
            <h3>Your Uploaded Notes:</h3>
            {userNotes.length > 0 ? (
              userNotes.map((note, index) => (
                <div key={index} className="pdf-item">
                  <FontAwesomeIcon icon={faFilePdf} />
                  <span>{note.name}</span>
                  <a
                    href={note.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={note.name + ".pdf"}
                  >
                    <button className="download-btn">Download</button>
                  </a>
                </div>
              ))
            ) : (
              <p>No notes uploaded yet for this user.</p>
            )}
          </div>
        </section>
      )}

      {section === "about" && (
        <section>
          <h2>About Us</h2>
          <p>Welcome to UniNotes! Share notes across departments and years.</p>
        </section>
      )}
      {section === "contact" && (
        <section>
          <h2>Contact Us</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Message sent!");
            }}
          >
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea rows="5" placeholder="Your Message" required />
            <button type="submit">Send</button>
          </form>
        </section>
      )}
    </div>
  );
};

export default Home;

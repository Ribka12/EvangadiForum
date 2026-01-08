
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Context from "../../context";
import forumApi from "../../Utility/forumApi";
import styles from "./Home.module.css";

function Home() {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    // If we have user context, no need to fetch
    if (!user?.username) {
      fetchUserData();
    }
  }, [navigate, user]);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      // Fetch user data if needed
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    async function fetchQuestions() {
      try {
        setLoading(true);
        const { data } = await forumApi.get("/question", {
          headers: { Authorization: "Bearer " + token },
        });
        const list = data.questions || data || [];
        setQuestions(list);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions([]);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [navigate]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return questions;
    return questions.filter((item) => {
      const title = (item.title || "").toLowerCase();
      const description = (item.description || item.content || "").toLowerCase();
      const userName = (item.username || item.user_name || "").toLowerCase();
      return (
        title.includes(q) ||
        description.includes(q) ||
        userName.includes(q)
      );
    });
  }, [questions, query]);

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleAskQuestion = () => {
    navigate("/question");
  };

  const handleQuestionClick = (questionId) => {
    navigate(`/answer/${questionId}`);
  };

  // Get username from context or localStorage
  const getUsername = () => {
    if (user?.username) {
      return user.username;
    }
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        return userData.username;
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.username || payload.email || "User";
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    
    return "User";
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Home Page Content - No Header here, it's in Layout */}
      <div className={styles.content}>
        {/* Ask Question and Welcome section */}
        <div className={styles.topSection}>
          <button onClick={handleAskQuestion} className={styles.askBtn}>
            Ask Question
          </button>
          <div className={styles.welcome}>
            Welcome: <span className={styles.name}>{getUsername()}</span>
          </div>
        </div>

        {/* Search Input */}
        <input
          className={styles.search}
          placeholder="search question"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Questions List */}
        <div className={styles.questionsList}>
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const questionId = item.question_id || item.id;
              return (
                <div 
                  key={questionId} 
                  className={styles.questionCard}
                  onClick={() => handleQuestionClick(questionId)}
                >
                  <div className={styles.avatar}>
                    {(item.username || item.user_name || "?")
                      .toString()
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>
                  <div className={styles.questionContent}>
                    <h3 className={styles.questionTitle}>
                      {item.title || item.content}
                    </h3>
                    <div className={styles.questionMeta}>
                      <span className={styles.questionUser}>
                        {item.username || item.user_name}
                      </span>
                      <span className={styles.questionTime}>
                        • {formatDate(item.created_at)}
                      </span>
                    </div>
                    <div className={styles.questionDescription}>
                      {item.description || ""}
                    </div>
                  </div>
                  <div 
                    className={styles.arrow}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuestionClick(questionId);
                    }}
                  >
                    ›
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noQuestions}>
              <p>No questions found. Be the first to ask a question!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
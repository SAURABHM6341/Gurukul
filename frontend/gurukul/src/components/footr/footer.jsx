import React from 'react';
import './footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col brand-col">
          <h2 className="brand-name">GuruKul</h2>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li>About</li>
              <li>Careers</li>
              <li>Affiliates</li>
            </ul>
            <div className="social-icons">
              <i className="fa-brands fa-facebook-f"></i>
              <i className="fa-brands fa-google"></i>
              <i className="fa-brands fa-twitter"></i>
              <i className="fa-brands fa-youtube"></i>
            </div>
          </div>
        </div>

        <div className="footer-col">
          <h4>Resources</h4>
          <ul>
            <li>Articles</li>
            <li>Blog</li>
            <li>Chart Sheet</li>
            <li>Code challenges</li>
            <li>Docs</li>
            <li>Projects</li>
            <li>Videos</li>
            <li>Workspaces</li>
          </ul>
          <h4>Support</h4>
          <ul><li>Help Center</li></ul>
        </div>

        <div className="footer-col">
          <h4>Plans</h4>
          <ul>
            <li>Paid memberships</li>
            <li>For students</li>
            <li>Business solutions</li>
          </ul>
          <h4>Community</h4>
          <ul>
            <li>Forums</li>
            <li>Chapters</li>
            <li>Events</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Subjects</h4>
          <ul>
            <li>AI</li>
            <li>Cloud Computing</li>
            <li>Code Foundations</li>
            <li>Computer Science</li>
            <li>Cybersecurity</li>
            <li>Data Analytics</li>
            <li>Data Science</li>
            <li>Data Visualization</li>
            <li>Developer Tools</li>
            <li>DevOps</li>
            <li>Game Development</li>
            <li>IT</li>
            <li>Machine Learning</li>
            <li>Math</li>
            <li>Mobile Development</li>
            <li>Web Design</li>
            <li>Web Development</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Languages</h4>
          <ul>
            <li>Bash</li>
            <li>C</li>
            <li>C++</li>
            <li>C#</li>
            <li>Go</li>
            <li>HTML & CSS</li>
            <li>Java</li>
            <li>JavaScript</li>
            <li>Kotlin</li>
            <li>PHP</li>
            <li>Python</li>
            <li>R</li>
            <li>Ruby</li>
            <li>SQL</li>
            <li>Swift</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Career building</h4>
          <ul>
            <li>Career paths</li>
            <li>Career services</li>
            <li>Interview prep</li>
            <li>Professional certification</li>
            <li>-</li>
            <li>Full Catalog</li>
            <li>Beta Content</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-links">
          <span>Privacy Policy</span> | <span>Cookie Policy</span> | <span>Terms</span>
        </div>
        <div className="footer-made">
          Made with <span className="heart">❤️</span> Saurabh Mishra © 2023 GuruKul
        </div>
      </div>
    </footer>
  );
}

export default Footer;

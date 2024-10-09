import { BrowserRouter, Routes, Route } from 'react-router-dom';

import React, { useEffect, useState, createContext } from 'react';

import { NavermapsProvider } from 'react-naver-maps';
import Header from './component/Header';
import Footer from './component/Footer';

import Enterprises from './pages/Enterprises/Enterprises';
import Home from './pages/Home/Home';
import Notfound from './pages/Notfound';
import JobNotice from './pages/Jobs/JobNotice';
import IegalAdvice from './pages/LegalChat/IegalAdvice';
import Support from './pages/Map/Support';
import Search from './pages/Search';
import EnterpriseParticular from './pages/Enterprises/EnterpriseParticular';
import JobNoticeDetails from './pages/Jobs/JobNoticeDetails';
import SingIn from './pages/Login/SingIn';
import EnterpriseApply from './pages/Apply/EnterpriseApply';
import JobNoticeApply from './pages/Apply/JobNoticeApply';
export const JobContext = createContext();
export const CompanyContext = createContext();
export const LoginContext = createContext();
export const ReviewContext = createContext();
export const IsEnrollContext = createContext();

function App() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loginState, setLoginState] = useState({
    userLogin: false,
    userEnterprise: false,
  });
  const [isEnroll, setIsEnroll] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}:8080/api/enterprises`)
      .then((response) => response.json())
      .then((data) => {
        setCompanies(data);
      })
      .catch((error) => console.error('Error fetching companies:', error));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}:8080/api/jobs`)
      .then((response) => response.json())
      .then((data) => {
        setJobs(data);
        setIsEnroll(false);
      })
      .catch((error) => console.error('Error fetching jobs:', error));
  }, [isEnroll]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}:8080/api/reviews/all`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error('Error fetching reviews:', error));
  }, []);

  useEffect(() => {
    const savedUsername = sessionStorage.getItem('username');
    const userType = sessionStorage.getItem('userType');
    if (savedUsername) {
      if (userType === 'enterprise') {
        setLoginState({ userEnterprise: true, userLogin: false });
      } else {
        setLoginState({ userLogin: true, userEnterprise: false });
      }
    }
  }, []);

  return (
    <>
      <NavermapsProvider ncpClientId="du60d8o1se">
        <LoginContext.Provider value={{ loginState, setLoginState }}>
          <JobContext.Provider value={jobs}>
            <IsEnrollContext.Provider value={{ isEnroll, setIsEnroll }}>
              <CompanyContext.Provider value={companies}>
                <ReviewContext.Provider value={reviews}>
                  <BrowserRouter>
                    <Header />
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/Enterprises" element={<Enterprises />} />
                      <Route path="/JobNotice" element={<JobNotice />} />
                      <Route path="/IegalAdvice" element={<IegalAdvice />} />
                      <Route path="/Support" element={<Support />} />
                      <Route path="/SingIn" element={<SingIn />} />

                      <Route path="/Search/:keyword" element={<Search />} />
                      <Route path="/AiSearch/:keyword" element={<Search />} />
                      <Route
                        path="/Search/:keyword/:enterprise_id"
                        element={<EnterpriseParticular />}
                      />
                      <Route
                        path="/Company/:enterprise_id"
                        element={<EnterpriseParticular />}
                      />
                      <Route
                        path="/Search/:keyword/jobNotice/:job_id"
                        element={<JobNoticeDetails />}
                      />
                      <Route
                        path="/JobNotice/:job_id"
                        element={<JobNoticeDetails />}
                      />

                      <Route
                        path="/EnterpriseApply"
                        element={<EnterpriseApply />}
                      />
                      <Route
                        path="/JobNoticeApply"
                        element={<JobNoticeApply />}
                      />
                      <Route path="*" element={<Notfound />} />
                    </Routes>
                    <Footer />
                  </BrowserRouter>
                </ReviewContext.Provider>
              </CompanyContext.Provider>
            </IsEnrollContext.Provider>
          </JobContext.Provider>
        </LoginContext.Provider>
      </NavermapsProvider>
    </>
  );
}

export default App;

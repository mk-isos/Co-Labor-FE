import React from 'react';
import { useNavigate } from 'react-router-dom';

import './css/Header.css';
import CompanyInfo from './Dropdown/CompanyInfo';
import JobNotice from './Dropdown/JobNotice';
import { useState } from 'react';
import searchIcon from '../assets/search_icon.png';
const Header = () => {
  const nav = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');

  const changeInput = (e) => {
    setSearchKeyword(e.target.value);
  };
  const searchHandler = () => {
    nav(`/search/${searchKeyword}`);
    setSearchKeyword('');
  };
  const keyHandler = (e) => {
    if (e.keyCode === 13) {
      searchHandler();
    }
  };
  return (
    <div className="Header">
      <div className="logo" onClick={() => nav('/')}></div>
      <div onClick={() => nav('/CompanyInfo')}>기업 정보</div>
      <div onClick={() => nav('/JobNotice')}>채용 공고</div>
      <div onClick={() => nav('/IegalAdvice')}>법률 상담</div>
      <div onClick={() => nav('/Support')}>노동자 지원센터</div>
      <div className="searchBox">
        <input
          type="text"
          className="searchBoxInner"
          placeholder="무엇이든 검색해보세요!"
          onChange={changeInput}
          onKeyDown={keyHandler}
        />
        <img
          className="searchBoxIcon"
          src={searchIcon}
          onClick={searchHandler}
        />
      </div>
      <div className="right-child">
        <div>로그인</div>
      </div>
      <div>회원가입</div>
    </div>
  );
};

export default Header;

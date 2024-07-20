import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { CompanyContext, JobContext, ReviewContext } from "../App";
import "./css/CompanyDetailsCenter.css";
import StarRate from "./StarRate";
import BarGraph from "./BarGraph";
import RadarChart from "./RadarChart";

const CompanyDetailsCenter = () => {
  const params = useParams();
  const companyContext = useContext(CompanyContext);
  const reviewContext = useContext(ReviewContext);
  const jobContext = useContext(JobContext);
  const nav = useNavigate();

  const companyData = companyContext.find(
    (company) => String(company.enterprise_id) === String(params.enterprise_id)
  );

  const reviewData = reviewContext.filter(
    (review) =>
      String(review.enterprise.enterprise_id) === String(params.enterprise_id)
  );

  const jobData = jobContext.filter(
    (job) =>
      String(job.enterprise.enterprise_id) === String(params.enterprise_id)
  );

  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    setTotalReviews(reviewData.length);
  }, [reviewData]);

  if (!companyData) {
    return <div>Loading</div>;
  }

  const defaultCompanyPhoto =
    "https://cdn-icons-png.flaticon.com/512/4091/4091968.png";
  const displayCompanyPhoto = companyData.photo || defaultCompanyPhoto;

  const defaultCompanyType = "기업 분류를 작성해주세요!";
  const displayCompanyType = companyData.type || defaultCompanyType;

  const defaultCompanyDescription = "기업 설명을 작성해주세요!";
  const displayCompanyDescription =
    companyData.description || defaultCompanyDescription;

  const defaultJobPhoto =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8Gn8yBWZsQEVzdXIx-qFWrYYlphEWWnG4Og&s";
  const displayJobPhoto = (job) => job.photo || defaultJobPhoto;

  // 리뷰 각 평점의 평균을 계산하는 함수
  const calculateAverageRatings = (reviews) => {
    const totalRatings = reviews.length;
    if (totalRatings === 0) return {};

    const sumRatings = reviews.reduce(
      (acc, review) => {
        acc.total += review.rating;
        acc.promotion += review.promotion_rating;
        acc.salary += review.salary_rating;
        acc.balance += review.balance_rating;
        acc.culture += review.culture_rating;
        acc.management += review.management_rating;
        return acc;
      },
      {
        total: 0,
        promotion: 0,
        salary: 0,
        balance: 0,
        culture: 0,
        management: 0,
      }
    );

    return {
      averageTotal: (sumRatings.total / totalRatings).toFixed(1),
      averagePromotion: (sumRatings.promotion / totalRatings).toFixed(1),
      averageSalary: (sumRatings.salary / totalRatings).toFixed(1),
      averageBalance: (sumRatings.balance / totalRatings).toFixed(1),
      averageCulture: (sumRatings.culture / totalRatings).toFixed(1),
      averageManagement: (sumRatings.management / totalRatings).toFixed(1),
    };
  };

  const averageRatings = calculateAverageRatings(reviewData);

  const clickHandler = (jobId) => {
    nav(`/JobNotice/${jobId}`);
  };

  return (
    <div className="CompanyDetail">
      <br />
      <br />
      <div className="CompanyDetailsCenterCompany">
        <h1 className="title">{companyData.name} 기본 정보</h1>
        <div className="gap"></div>
        <div className="CompanyDetailsCenterCompanyBasicInfo">
          <img
            className="CompanyDetailsCenterCompanyImg"
            src={displayCompanyPhoto}
            alt={companyData.name}
          />
          <div className="CompanyDetailsCenterCompanyText">
            <div className="CompanyDetailsCenterCompanyAddress">
              주소: {companyData.address1} {companyData.address2}{" "}
              {companyData.address3}
            </div>
            <div className="CompanyDetailsCenterCompanyPh">
              전화번호: {companyData.phone_number}
            </div>
            <div className="CompanyDetailsCenterCompanyType">
              기업 분류: {displayCompanyType}
            </div>
            <div className="CompanyDetailsCenterCompanyDes">
              기업 설명: {displayCompanyDescription}
            </div>
          </div>
        </div>
      </div>

      <div className="gap"></div>
      <div className="gap2"></div>

      <div className="CompanyDetailsCenterJob">
        <h1 className="title">{companyData.name} 채용 공고</h1>
        <div className="gap2"></div>
        <div className="CompanyDetailsCenterJobList">
          {jobData.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={-110}
              slidesPerView={3}
              navigation
              pagination={{ clickable: true }}
            >
              {jobData.map((job) => (
                <SwiperSlide key={job.job_id}>
                  <div
                    className="CompanyDetailsCenterJobItem"
                    onClick={() => clickHandler(job.job_id)}
                  >
                    <div className="CompanyDetailsCenteritemWrapper">
                      <div className="CompanyDetailsCenterjobNoticeInfo">
                        <div className="CompanyDetailsCenterjobNotice_infoTitle">
                          {job.title}
                        </div>
                        <img
                          className="CompanyDetailsCenterjobNoticeImg"
                          src={displayJobPhoto(job)}
                          width="100px"
                          alt={job.title}
                        />
                        <div className="CompanyDetailsCenterjobNotice_infoCondi">
                          {job.requirement}
                        </div>
                        <div className="CompanyDetailsCenterjobNotice_infoDescription">
                          {job.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="CompanyDetailsCenterjobNotice_infoTitle">
              등록된 채용 공고가 없습니다.
            </div>
          )}
        </div>
      </div>
      <div className="gap" />

      <h1 className="title">{companyData.name} 전체 리뷰 통계</h1>
      <div className="gap" />

      <div className="CompanyDetailsCenterAllReview">
        <div className="CompanyDetailsCenterAllReviewitemWrapper">
          <div style={{ marginTop: "10px" }}>
            <span>{totalReviews}개의 리뷰</span>
            <StarRate rating={averageRatings.averageTotal} />
            <br />
            <br />
          </div>
          <div>
            <span>승진 기회 및 개인 성장 가능성: </span>
            <BarGraph rating={averageRatings.averagePromotion} />
            <br />
          </div>
          <div>
            <span>복지 및 급여: </span>
            <BarGraph rating={averageRatings.averageSalary} />
            <br />
          </div>
          <div>
            <span>업무와 삶의 균형: </span>
            <BarGraph rating={averageRatings.averageBalance} />
            <br />
          </div>
          <div>
            <span>사내 문화 평가 점수: </span>
            <BarGraph rating={averageRatings.averageCulture} />
            <br />
          </div>
          <div>
            <span>경영진 관련 평가 점수: </span>
            <BarGraph rating={averageRatings.averageManagement} />
            <br />
          </div>
        </div>
        <div className="CompanyDetailsCenterAllReviewitemWrapper">
          <RadarChart data={averageRatings} />
        </div>
      </div>

      <div className="CompanyDetailsCenterReview">
        <h1 className="title">{companyData.name} 리뷰</h1>
        <div className="gap" />
        <div className="CompanyDetailsCenterReviewList">
          {reviewData.length > 0 ? (
            reviewData.map((review) => (
              <div key={review.review_id}>
                <div className="CompanyDetailsCenterReviewitemWrapper">
                  <h5>{review.title}</h5>
                  <div className="CompanyDetailsCenterReviewInfo">
                    <div>
                      {review.created_at} 작성자 : {review.laborUser.name}
                    </div>
                    <StarRate rating={review.rating} />
                    <div>승진 기회 및 개인 성장 가능성</div>
                    <BarGraph rating={review.promotion_rating} />
                    <div>복지 및 급여</div>
                    <BarGraph rating={review.salary_rating} />
                    <div>업무와 삶의 균형</div>
                    <BarGraph rating={review.balance_rating} />
                    <div>사내 문화 평가 점수</div>
                    <BarGraph rating={review.culture_rating} />
                    <div>경영진 관련 평가 점수</div>
                    <BarGraph rating={review.management_rating} />
                    <div>장점</div>
                    <div>{review.pros}</div>
                    <div>단점</div>
                    <div>{review.cons}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="CompanyDetailsCenterjobNotice_infoTitle">
              등록된 리뷰가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsCenter;

import React, { useState } from "react";
import "./UserDetail.css";
import ViewSelfImage from "../ViewSelfImage/ViewSelfImage";

const TabBar = ({ tabs, selectedTab, onTabClick }) => {
  
  return (
    <div className="profile-stats">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`profile-stat ${selectedTab === tab ? "selected" : ""}`}
          onClick={() => onTabClick(tab)}
        >
          {getIconForTab(tab)}
          <p>{tab}</p>
        </button>
      ))}
    </div>
  );
};

function getIconForTab(tab) {
  switch (tab) {
    case "Photos":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="stat-icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
          />
        </svg>
      );
    case "Likes":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="stat-icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      );
    case "Downloads":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="stat-icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
          />
        </svg>
      );
    default:
      return null;
  }
}

function UserDetail({graphData, profilePic}) {
  const tabs = ["Photos", "Likes", "Downloads"];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="profile">
      <header className="profile-header">
        <img
          src={profilePic}
          className="profile-logo"
        />
        <div className="profile-info">
          <div className="display-name">{graphData.displayName}</div>
          <div className="mail-address"><span className="info-name-hidden">Job Title: </span> {graphData.jobTitle}</div>
          <a className="mail-address" href="mailto:anht@cbh.com.au">
            <span className="info-name-hidden">Mail: </span> {graphData.mail}
          </a>
        </div>
      </header>
      <body className="profile-body">
        <TabBar
          className="tabBar-button"
          tabs={tabs}
          selectedTab={selectedTab}
          onTabClick={handleTabClick}
        />

        {selectedTab === "Photos" && (
          <div className="profile-content">
            <ViewSelfImage graphData={graphData}/>
          </div>
        )}
        {selectedTab === "Likes" && (
          <div className="profile-content">
            <p>Photos you like here</p>
          </div>
        )}
        {selectedTab === "Downloads" && (
          <div className="profile-content">
            <p>Photos you downloaded here</p>
          </div>
        )}

      </body>
    </div>
  );
}

export default UserDetail;

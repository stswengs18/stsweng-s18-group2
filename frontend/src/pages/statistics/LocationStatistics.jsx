import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "./components/StatCard";
import SectionCard from "./components/SectionCard";
import DoughnutChart from "./components/DoughnutChart";
import KeyDemographicCard from "./components/KeyDemographicCard";
import { Info, LoaderCircle } from "lucide-react";
import {
  ActiveCasesIcon, CasesClosedIcon, NewCasesAddedIcon, NewInterventionsIcon,
  AvgCaseDurationIcon, AvgInterventionsReportsIcon
} from "./components/CustomIcons";
import { useStatisticsData } from "./useStatisticsData";
import SimpleModal from "../../Components/SimpleModal";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";

export default function LocationStatistics() {
  const navigate = useNavigate();
  const { data, loading, error } = useStatisticsData();
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);

  useEffect(() => {
    document.title = "Organization Statistics";
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Header bar (copied from spu-page)
  const isMobile = windowWidth <= 700;
  const isVerySmall = windowWidth <= 400;

  // Loading and error modal
  const [modalData, setModalData] = useState({
    isOpen: false,
    title: "",
    bodyText: "",
    imageCenter: null,
    confirm: false,
    onConfirm: null,
  });

  useEffect(() => {
    if (error) {
      setModalData({
        isOpen: true,
        title: "Failed to load data",
        bodyText: error,
        imageCenter: <div className="warning-icon mx-auto" />,
        confirm: false,
        onConfirm: () => { },
      });
    }
  }, [error]);

  // Stat icons
  const statCardIcons = [ActiveCasesIcon, CasesClosedIcon, NewCasesAddedIcon, NewInterventionsIcon, AvgCaseDurationIcon, AvgInterventionsReportsIcon];
  const spuStatisticsCards = data?.spuStatisticsCards?.map((card, index) => ({
    ...card,
    iconComponent: statCardIcons[index]
  })) || [];

  // Loading spinner
  if (loading) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-60 w-full max-w-[1280px] mx-auto flex justify-between items-center py-5 px-8 bg-white">
          <div className="flex items-center gap-4">
            <a href="/" className="main-logo main-logo-text-nav">
              <div className="main-logo-setup folder-logo"></div>
              <div className="flex flex-col">
                {isVerySmall ? (
                  <>
                    <p className="main-logo-text-nav-sub mb-[-1rem]">Unbound Manila</p>
                    <p className="main-logo-text-nav">CMS</p>
                  </>
                ) : (
                  <>
                    <p className="main-logo-text-nav-sub mb-[-1rem]">Unbound Manila Foundation Inc.</p>
                    <p className="main-logo-text-nav">Case Management System</p>
                  </>
                )}
              </div>
            </a>
          </div>
        </div>
        <main className="min-h-[calc(100vh-4rem)] w-full flex mt-[9rem]">
          <div className="flex w-full items-center justify-center">
            <div className="flex flex-col items-center space-y-2 text-gray-500">
              <LoaderCircle className="animate-spin h-8 w-8" />
              <span>Loading Statistics...</span>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SimpleModal
        isOpen={modalData.isOpen}
        onClose={() => setModalData((prev) => ({ ...prev, isOpen: false }))}
        title={modalData.title}
        bodyText={modalData.bodyText}
        imageCenter={modalData.imageCenter}
        confirm={modalData.confirm}
        onConfirm={() => {
          modalData.onConfirm?.();
          setModalData((prev) => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => setModalData((prev) => ({ ...prev, isOpen: false }))}
      />

      <div className="w-full fixed top-0 left-0 right-0 z-60 max-w-[1280px] mx-auto 
                flex justify-between items-center py-5 px-8 bg-white">
        {/* Left side */}
        <a href="/" className="main-logo main-logo-text-nav flex items-center gap-4">
          <div className="main-logo-setup folder-logo"></div>
          <div className="flex flex-col">
            {isVerySmall ? (
              <>
                <p className="main-logo-text-nav-sub mb-[-1rem]">Unbound Manila</p>
                <p className="main-logo-text-nav">CMS</p>
              </>
            ) : (
              <>
                <p className="main-logo-text-nav-sub mb-[-1rem]">Unbound Manila Foundation Inc.</p>
                <p className="main-logo-text-nav">Case Management System</p>
              </>
            )}
          </div>
        </a>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <select
              id="select-spu"
              name="select-spu"
              className="text-input font-label !w-[20rem]"
            >
              <option>Select SPU:</option>
              <option>SPU North</option>
              <option>SPU South</option>
              <option>SPU East</option>
              <option>SPU West</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <select
              id="time-period"
              name="time-period"
              className="text-input font-label !w-[20rem]"
            >
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
              <option>Last year</option>
            </select>
          </div>
        </div>
      </div>

      <main className="min-h-[calc(100vh-4rem)] w-full flex mt-[9rem]">
        <div className="flex flex-col w-full max-w-[1280px] mx-auto gap-10 px-8 pb-20">
          <div>
            <h2 className="header-sm mb-4">SPU Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {spuStatisticsCards.map((card, index) => (
                <StatCard
                  key={index}
                  title={card.title}
                  value={card.value}
                  subtext={card.subtext}
                  iconComponent={card.iconComponent}
                />
              ))}
            </div>
          </div>

          <SectionCard
            title={data.interventionsByTypeData.title}
            headerAction={
              <button className="text-gray-400 hover:" aria-label="More info">
                <Info size={18} />
              </button>
            }
          >
            <div>
              <div className="space-y-4 pt-2">
                {(() => {
                  // Find the longest type name
                  const typeNames = data.interventionsByTypeData.types.map(type => type.name);
                  const longestTypeName = typeNames.reduce((a, b) => a.length > b.length ? a : b, "");
                  const labelWidth = `${longestTypeName.length + 2}ch`;
                  return data.interventionsByTypeData.types.map((type, index) => {
                    const maxValue = Math.max(...data.interventionsByTypeData.types.map((t) => t.value));
                    const percentage = maxValue > 0 ? (type.value / maxValue) * 100 : 0;
                    return (
                      <div key={index} className="flex items-center space-x-4">
                        <span
                          className="font-label shrink-0"
                          style={{ minWidth: labelWidth, maxWidth: labelWidth, display: "inline-block" }}
                        >
                          {type.name}
                        </span>
                        <div className="flex-grow bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${type.color}`} style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="font-label font-semibold text-gray-800 w-8 text-right shrink-0">{type.value}</span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <div>
              <h2 className="header-sm mb-4">{data.caseDistributionData.title}</h2>
              <p className="font-label mb-4">{data.caseDistributionData.subtitle}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative h-64 w-64 mx-auto">
                  <DoughnutChart data={data.caseDistributionData.chartData} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="header-sm bold">{data.caseDistributionData.totalCases}</span>
                    <span className="font-label">Total Cases</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {data.caseDistributionData.legendData.map((item) => (
                    <div key={item.label} className="flex items-center">
                      <span className={`h-3 w-3 rounded-full mr-3 ${item.color}`}></span>
                      <div className="flex flex-col">
                        <span className="font-label ">{item.label}</span>
                        <span className="font-label font-semibold text-gray-800">
                          {item.value.toLocaleString()} ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Gender Distribution">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="relative h-68 w-68 mx-auto">
                  <DoughnutChart data={data.genderDistributionData.chartData} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="header-sm">{data.genderDistributionData.totalCases}</span>
                    <span className="font-label">Total Members</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {data.genderDistributionData.legendData.map((item) => (
                    <div key={item.label} className="flex items-center">
                      <span className={`h-2.5 w-2.5 rounded-full mr-2.5 ${item.color}`}></span>
                      <span className="font-label">{item.label}</span>
                      <span className="ml-auto font-bold-label">
                        {item.value} ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Key Demographics"
            headerAction={
              <button className="text-gray-400 hover:" aria-label="More info">
                <Info size={18} />
              </button>
            }
          >
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {data.keyDemographicsData.map((item, index) => (
                  <KeyDemographicCard
                    key={index}
                    title={<span className="font-label">{item.title}</span>}
                    subtitle={<span className="font-label">{item.subtitle}</span>}
                    value={<span className="font-label font-semibold text-gray-800">{item.value}</span>}
                  />
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Worker Metrics"
            headerAction={
              <button className="text-gray-400 hover:" aria-label="More info">
                <Info size={18} />
              </button>
            }
          >
            <div className="flex justify-center py-8 w-[100%]">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-15 px-4">
                <div className="relative rounded-2xl bg-white p-6 shadow-[0_2px_6px_rgba(0,0,0,0.5),0_5px_2px_#78A18199] ring-1 ring-gray-200">
                  <p className="font-bold-label">Worker to Case Ratio</p>
                  <p className="main-logo-text-nav text-center">1 : 26</p>
                  <p className="font-label text-center">Each worker handles 26 cases</p>
                </div>
                <div className="relative rounded-2xl bg-white p-6 shadow-[0_2px_6px_rgba(0,0,0,0.5),0_5px_2px_#78A18199] ring-1 ring-gray-200">
                  <p className="font-bold-label">Worker to Supervisor Ratio</p>
                  <p className="main-logo-text-nav text-center">4 : 1</p>
                  <p className="font-label text-center">4 workers per supervisor</p>
                </div>
                <div className="relative md:col-span-2 rounded-2xl bg-white p-6 shadow-[0_2px_6px_rgba(0,0,0,0.5),0_5px_2px_#78A18199] ring-1 ring-gray-200">
                  <div className="flex items-center justify-around">
                    <p className="font-bold-label">New Employees Added:</p>
                    <div className="text-right">
                      <p className="main-logo-text-nav text-center">4</p>
                      <p className="font-label text-center">This period</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="font-bold-label mb-5">Employee Distribution by Roles</p>
            <div className="space-y-4 pt-2">
              {(() => {
                // Find the longest label
                const labels = data.workerDistributionData.chartData.map(role => role.label);
                const longestLabel = labels.reduce((a, b) => a.length > b.length ? a : b, "");
                // Estimate width in 'ch' units (character width)
                const labelWidth = `${longestLabel.length + 2}ch`;
                return data.workerDistributionData.chartData.map((role, index) => {
                  const total = data.workerDistributionData.totalEmployees;
                  const percentage = total > 0 ? (role.value / total) * 100 : 0;
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <span
                        className="font-label"
                        style={{ minWidth: labelWidth, maxWidth: labelWidth, display: "inline-block" }}
                      >
                        {role.label}
                      </span>
                      <div className="flex-grow bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${role.color}`} style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="font-bold-label">{role.value}</span>
                    </div>
                  );
                });
              })()}
            </div>
          </SectionCard>

          <SectionCard
            title="Cases Over Time"
            headerAction={
              <button className="text-gray-400 hover:text-gray-600" aria-label="More info">
                <Info size={18} />
              </button>
            }
          >
            <h3 className="font-label">Past 7 Days</h3>
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <LineChart
                data={data.caseOverTime}
                color="#06B6D4"
                height={60}
              />
            </div>
          </SectionCard>


          <SectionCard
            title="Workers Over Time"
            headerAction={
              <button className="text-gray-400 hover:text-gray-600" aria-label="More info">
                <Info size={18} />
              </button>
            }
          >
            <h3 className="font-label">Past 7 Days</h3>

            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <LineChart
                data={data.workerOverTime}
                color="#78A181"
                height={60}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Intervention Types Distribution"
            headerAction={
              <button className="text-gray-400 hover:text-gray-600" aria-label="More info">
                <Info size={18} />
              </button>
            }
          >
                      <h3 className="font-label">Past 7 Days</h3>

            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <BarChart
                data={data.interventionDistribution}
                height={60}
              />
            </div>
          </SectionCard>

        </div>
      </main>
    </>
  );
}